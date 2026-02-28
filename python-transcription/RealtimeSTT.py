import queue
import sounddevice as sd
import numpy as np
from faster_whisper import WhisperModel
import asyncio
import websockets
import json
import threading
from datetime import datetime
import wave
from dotenv import load_dotenv
import os
import base64
import tempfile
from pyannote.audio import Pipeline, Audio
import torch
import warnings
import time
from scipy import signal
from arabic_reshaper import reshape
from bidi.algorithm import get_display
from supabase import create_client

warnings.filterwarnings('ignore')
"""
Optimized thresholds for sequential speech (25% overlap, 0.5s proximity)
Transcription segments are aligned with speaker timeline using overlap/midpoint/nearest strategies
"""

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET")
HF_TOKEN = os.getenv("HF_TOKEN")

SUPABASE_ENABLED = False

try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✅ Supabase client initialized")
    SUPABASE_ENABLED = True
except Exception as e:
    print(f"⚠️ Supabase initialization failed: {e}")



CHUNK_DURATION = 5
BEAM_SIZE = 5      
SUPPORTED_LANGUAGES = ['ur', 'en']

print("🔄 Loading Whisper model...")
model = WhisperModel("medium", device="cuda", compute_type="float16")
print("✅ Whisper model loaded")

print("🔄 Loading diarization pipeline...")  
try:
    # Try with 'token' parameter first (newer pyannote versions)
    try:
        diarization_pipeline = Pipeline.from_pretrained(
            "pyannote/speaker-diarization-3.1",
            token=HF_TOKEN
        )
    except TypeError:
        # Fallback to 'use_auth_token' for older pyannote versions
        diarization_pipeline = Pipeline.from_pretrained(
            "pyannote/speaker-diarization-3.1",
            use_auth_token=HF_TOKEN
        )
    
    if torch.cuda.is_available():
        diarization_pipeline.to(torch.device("cuda"))
        print(f"   Using GPU: {torch.cuda.get_device_name(0)}")
    else:
        print("   Using CPU (GPU not available)")
    
    print("✅ Diarization pipeline loaded successfully")
        
except Exception as e:
    print(f"❌ Error loading diarization: {e}")
    diarization_pipeline = None

SPEAKER_LABEL_MAP = {}  
SPEAKER_NAMES = {}
samplerate = 16000
blocksize = 8000
q = queue.Queue()

connected_clients = set()

recorded_audio = []
session_start_time = None
audio_saved = False

transcription_active = False
transcription_paused = False
processing_final = False  # Flag to indicate final processing is in progress

transcription_segments = []
segments_lock = threading.Lock()

realtime_segments = []

last_diarization_time = 0
diarization_interval = 30  # Increased from 30s
diarization_window_size = samplerate * 300  # Increased to 5 minutes


def upload_to_supabase(local_path, remote_path):
    if not SUPABASE_ENABLED:
        return None
    try:
        if remote_path.endswith(".wav"):
            content_type = "audio/wav"
        else:
            content_type = "application/octet-stream"

        with open(local_path, "rb") as f:
            supabase.storage.from_(SUPABASE_BUCKET).upload(
                remote_path,
                f,
                file_options={"content-type": content_type}
            )

        return supabase.storage.from_(SUPABASE_BUCKET).get_public_url(remote_path)

    except Exception as e:
        print(f"❌ Supabase upload failed: {e}")
        return None


def callback(indata, frames, time_info, status):
    if status:
        if status.input_overflow:
            print("⚠️ Input overflow", flush=True)
    
    if not status or not status.input_overflow:
        # Only process audio if transcription is active
        if transcription_active:
            q.put(indata.copy())
            recorded_audio.append(indata.copy())

def preprocess_audio_for_diarization(audio_array, sample_rate=16000):
    """
    Preprocess audio to improve diarization accuracy
    """
    # Remove DC offset
    audio_array = audio_array - np.mean(audio_array)
    
    # Normalize to [-1, 1]
    max_val = np.abs(audio_array).max()
    if max_val > 0:
        audio_array = audio_array / max_val
    
    # High-pass filter to remove low-frequency noise
    sos = signal.butter(4, 80, btype='highpass', fs=sample_rate, output='sos')
    audio_array = signal.sosfilt(sos, audio_array)
    
    # Calculate speech activity
    frame_length = int(0.025 * sample_rate)
    hop_length = int(0.010 * sample_rate)
    
    energy = np.array([
        np.sum(audio_array[i:i+frame_length]**2) 
        for i in range(0, len(audio_array)-frame_length, hop_length)
    ])
    
    threshold = 0.3 * np.max(energy)
    speech_frames = energy > threshold
    speech_percentage = np.sum(speech_frames) / len(speech_frames) * 100
    print(f"   Speech activity: {speech_percentage:.1f}%")
    
    return audio_array

def save_audio_recording():
    global audio_saved
    if recorded_audio and not audio_saved:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"recording_{timestamp}.wav"
        
        # FIX: Properly flatten the audio
        full_audio = np.concatenate(recorded_audio, axis=0).flatten()
        
        with wave.open(filename, 'wb') as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(samplerate)
            audio_int16 = (full_audio * 32767).astype(np.int16)
            wav_file.writeframes(audio_int16.tobytes())
        
        print(f"💾 Audio saved as: {filename}")
        
        # Upload to Supabase and capture URL
        audio_url = upload_to_supabase(filename, f"audio/{filename}")
        if audio_url:
            print(f"✅ Audio uploaded to Supabase: {audio_url}")

        audio_saved = True
        return filename, audio_url
    return None, None



def transcribe_smart_bilingual(audio_buffer):
    try:
        print(f"🔄 Transcribing {len(audio_buffer)/samplerate:.1f}s chunk...")
        
        segments_ur, info_ur = model.transcribe(
            audio_buffer,
            beam_size=BEAM_SIZE,
            language="ur",
            vad_filter=True,
            word_timestamps=False,
            condition_on_previous_text=False
        )
        
        segments_ur_list = list(segments_ur)
        ur_text = " ".join([seg.text.strip() for seg in segments_ur_list if seg.text.strip()])
        
        if not ur_text or len(ur_text) < 3:
            print(f"   ℹ️ Urdu transcription too short, trying English...")
            segments_en, info_en = model.transcribe(
                audio_buffer,
                beam_size=BEAM_SIZE,
                language="en",
                vad_filter=True,
                word_timestamps=False,
                condition_on_previous_text=False
            )
            
            segments_en_list = list(segments_en)
            en_text = " ".join([seg.text.strip() for seg in segments_en_list if seg.text.strip()])
            
            if en_text:
                detected_lang = 'en'
                original_text = en_text
                segments_list = segments_en_list
                print(f"   ✅ Detected: English")
            else:
                detected_lang = 'ur'
                original_text = ur_text
                segments_list = segments_ur_list
                print(f"   ✅ Detected: Urdu (fallback)")
        else:
            detected_lang = 'ur'
            original_text = ur_text
            segments_list = segments_ur_list
            print(f"   ✅ Detected: Urdu")
        
        if not original_text:
            return None
        
        translation = None
        
        if detected_lang == 'ur':
            print(f"   🔄 Translating Urdu → English...")
            trans_segments, _ = model.transcribe(
                audio_buffer,
                task="translate",
                beam_size=BEAM_SIZE,
                language="ur",
                vad_filter=True
            )
            translation = " ".join([seg.text.strip() for seg in trans_segments if seg.text.strip()])
            print(f"   ✅ Translation complete")
        elif detected_lang == 'en':
            print(f"   🔄 Translating English → Urdu...")
        result = {
            'text': original_text,
            'translation': translation,
            'detected_language': detected_lang,
            'segments': segments_list
        }
        
        print(f"   ✅ Processing complete ({detected_lang})")
        return result
        
    except Exception as e:
        print(f"❌ Transcription error: {e}")
        import traceback
        traceback.print_exc()
        return None

def run_diarization_on_buffer(audio_array, start_offset=0, min_speakers=None, max_speakers=None):
    if diarization_pipeline is None:
        return []
    
    try:
        # Ensure 1D float32
        if audio_array.ndim == 2:
            audio_array = audio_array.flatten()
        audio_array = audio_array.astype(np.float32)
        
        audio_duration = len(audio_array) / samplerate
        
        # Check minimum duration (pyannote needs at least a few seconds)
        if audio_duration < 2.0:
            print(f"   ⚠️ Audio too short ({audio_duration:.1f}s), skipping diarization (needs ≥2s)")
            return []
        
        print(f"🔍 Running diarization on {audio_duration:.1f}s of audio...")
        
        # Normalize audio to prevent clipping
        max_val = np.abs(audio_array).max()
        if max_val > 0:
            audio_array = audio_array / max_val * 0.95  # Scale to 95% to avoid clipping
        else:
            print("   ⚠️ Audio is silent, skipping diarization")
            return []
        
        # Workaround: Convert audio directly to tensor format to avoid pyannote's broken AudioDecoder
        # We already have the audio in memory, so no need to write/read from file
        try:
            # Ensure mono (1D array) - already should be, but double-check
            if audio_array.ndim > 1:
                audio_array = np.mean(audio_array, axis=0)
            
            # Convert to torch tensor: [1, samples] format expected by pyannote
            waveform_tensor = torch.from_numpy(audio_array).float().unsqueeze(0)
            
            # Prepare audio dict for pipeline (bypasses file loading entirely)
            audio_input = {
                "waveform": waveform_tensor,
                "sample_rate": samplerate
            }
            
            # Prepare diarization parameters
            diarization_params = {}
            if min_speakers is not None:
                diarization_params['min_speakers'] = min_speakers
            if max_speakers is not None:
                diarization_params['max_speakers'] = max_speakers
            
            if diarization_params:
                print(f"   Using speaker hints: {diarization_params}")
                diarization_result = diarization_pipeline(audio_input, **diarization_params)
            else:
                diarization_result = diarization_pipeline(audio_input)
                
        except Exception as pipeline_error:
            print(f"   ⚠️ Pipeline error: {type(pipeline_error).__name__}: {pipeline_error}")
            raise
        
        # Extract timeline from DiarizeOutput
        # New API: DiarizeOutput has 'speaker_diarization' attribute containing the annotation
        timeline = []
        speaker_set = set()
        
        # Get the actual annotation from DiarizeOutput (speaker_diarization contains the Annotation object)
        if hasattr(diarization_result, 'speaker_diarization'):
            annotation = diarization_result.speaker_diarization
        elif hasattr(diarization_result, 'annotation'):
            annotation = diarization_result.annotation
        elif hasattr(diarization_result, 'itertracks'):
            # Old API: result is directly an Annotation
            annotation = diarization_result
        else:
            available_attrs = [attr for attr in dir(diarization_result) if not attr.startswith('_')]
            raise ValueError(f"Unknown diarization result format. Available attributes: {available_attrs}")
        
        # Iterate over annotation to extract segments
        for segment, track, label in annotation.itertracks(yield_label=True):
            speaker_set.add(label)
            timeline.append((
                segment.start + start_offset,
                segment.end + start_offset,
                label
            ))
        
        timeline.sort(key=lambda x: x[0])
        
        # Detailed diagnostics
        print(f"✅ Diarization Results:")
        print(f"   Found {len(speaker_set)} unique speakers: {sorted(speaker_set)}")
        print(f"   Total speech segments: {len(timeline)}")
        
        # Count segments per speaker
        speaker_counts = {}
        for _, _, spk in timeline:
            speaker_counts[spk] = speaker_counts.get(spk, 0) + 1
        
        print(f"   Speaker distribution:")
        for spk, count in sorted(speaker_counts.items()):
            total_time = sum(end - start for start, end, s in timeline if s == spk)
            print(f"      {spk}: {count} segments, {total_time:.1f}s total")
        
        # Show first 5 segments with more detail
        print(f"   First 5 segments:")
        for i, (start, end, spk) in enumerate(timeline[:5]):
            duration = end - start
            mapped_name = SPEAKER_NAMES.get(spk, spk) if spk in SPEAKER_NAMES else spk
            print(f"      [{i}] {start:.1f}s-{end:.1f}s ({duration:.1f}s): {spk} → {mapped_name}")
        if len(timeline) > 5:
            print(f"      ... and {len(timeline)-5} more segments")
        
        # Warning if only one speaker detected
        if len(speaker_set) == 1 and (min_speakers is None or min_speakers > 1):
            print(f" WARNING:Only 1 speaker detected, but expected {min_speakers if min_speakers else 'multiple'}")        
        return timeline
        
    except Exception as e:
        print(f"⚠️ Diarization error: {e}")
        import traceback
        traceback.print_exc()
        return []

def assign_speakers_to_segments(speaker_timeline, segments):
    """
    Assign GENERIC labels like Speaker A, Speaker B, Speaker C
    Frontend will handle mapping to actual names
    """
    if not speaker_timeline:
        print("No speaker timeline available")
        return 0
    
    if not segments:
        print("No segments to assign")
        return 0
    
    assigned_count = 0
    
    # Get unique pyannote labels and map to generic Speaker A/B/C
    detected_labels = sorted(set(s[2] for s in speaker_timeline))
    print(f"🔤 Detected pyannote labels: {detected_labels}")
    
    # Create mapping: SPEAKER_00 → Speaker A, SPEAKER_01 → Speaker B, etc.
    label_to_generic = {}
    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for i, label in enumerate(detected_labels):
        if i < len(alphabet):
            label_to_generic[label] = f"Speaker {alphabet[i]}"
        else:
            label_to_generic[label] = f"Speaker {i+1}"
    
    print(f"🗺️ Label mapping:")
    for orig, generic in sorted(label_to_generic.items()):
        print(f"      {orig} → {generic}")
    
    for seg in segments:
        # Skip if already assigned and not pending
        if seg.get('speaker') and seg.get('speaker') not in ['Pending...', 'Unknown']:
            if not seg['speaker'].startswith('Speaker '):  # Already has real name
                continue
        
        seg_start = seg['start']
        seg_end = seg['end']
        seg_duration = seg_end - seg_start
        
        if seg_duration <= 0:
            continue
        
        seg_midpoint = (seg_start + seg_end) / 2
        
        # Strategy 1: Maximum overlap
        speaker_overlaps = {}
        for timeline_start, timeline_end, pyannote_label in speaker_timeline:
            overlap_start = max(seg_start, timeline_start)
            overlap_end = min(seg_end, timeline_end)
            overlap_duration = max(0, overlap_end - overlap_start)
            
            if overlap_duration > 0:
                if pyannote_label not in speaker_overlaps:
                    speaker_overlaps[pyannote_label] = 0
                speaker_overlaps[pyannote_label] += overlap_duration
        
        if speaker_overlaps:
            best_speaker_label = max(speaker_overlaps.items(), key=lambda x: x[1])[0]
            overlap_amount = speaker_overlaps[best_speaker_label]
            
            if overlap_amount > seg_duration * 0.25:
                seg['speaker'] = label_to_generic.get(best_speaker_label, 'Speaker A')
                assigned_count += 1
                continue
        
        # Strategy 2: Midpoint
        for timeline_start, timeline_end, pyannote_label in speaker_timeline:
            if timeline_start <= seg_midpoint <= timeline_end:
                seg['speaker'] = label_to_generic.get(pyannote_label, 'Speaker A')
                assigned_count += 1
                break
        
        # Strategy 3: Nearest (0.5s threshold)
        if seg.get('speaker') in ['Pending...', None] or not seg.get('speaker'):
            min_distance = float('inf')
            nearest_speaker_label = None
            
            for timeline_start, timeline_end, pyannote_label in speaker_timeline:
                if seg_end < timeline_start:
                    distance = timeline_start - seg_end
                elif seg_start > timeline_end:
                    distance = seg_start - timeline_end
                else:
                    distance = 0
                
                if distance < min_distance:
                    min_distance = distance
                    nearest_speaker_label = pyannote_label
            
            if nearest_speaker_label and min_distance < 0.5:
                seg['speaker'] = label_to_generic.get(nearest_speaker_label, 'Speaker A')
                assigned_count += 1
    
    print(f"   ✅ Assigned {assigned_count}/{len(segments)} segments with generic labels")
    
    # Show distribution
    label_counts = {}
    for seg in segments:
        if seg.get('speaker'):
            label_counts[seg['speaker']] = label_counts.get(seg['speaker'], 0) + 1
    
    if label_counts:
        print(f"   📊 Speaker distribution:")
        for label, count in sorted(label_counts.items()):
            print(f"      {label}: {count} segments")
    
    return assigned_count

async def broadcast_transcription(text, start_time, end_time, speaker, translation=None, detected_lang='ur'):
    if connected_clients:
        message = json.dumps({
            'type': 'transcription',
            'text': text,
            'translation': translation,
            'detected_language': detected_lang,
            'start': start_time,
            'end': end_time,
            'speaker': speaker,
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
        
        disconnected = []
        for client in connected_clients.copy():
            try:
                await client.send(message)
            except:
                disconnected.append(client)
        
        for client in disconnected:
            connected_clients.discard(client)

async def broadcast_speaker_update(segment_index, new_speaker):
    if connected_clients:
        message = json.dumps({
            'type': 'speaker_update',
            'segment_index': segment_index,
            'speaker': new_speaker
        })
        
        for client in connected_clients.copy():
            try:
                await client.send(message)
            except:
                pass

async def broadcast_status(message):
    if connected_clients:
        status_msg = json.dumps({
            'type': 'status',
            'message': message
        })
        for client in connected_clients.copy():
            try:
                await client.send(status_msg)
            except:
                pass

async def process_final_diarization():
    """Process final diarization on all segments and generate files"""
    global recorded_audio, audio_saved, transcription_segments, processing_final
    
    processing_final = True
    
    try:
        print(f"\n{'='*60}")
        print(f"🔄 Processing final diarization...")
        print(f"{'='*60}")
        
        # Wait a moment for any in-progress transcription to complete
        await asyncio.sleep(1)
        
        # Get all recorded audio
        if not recorded_audio:
            print("⚠️ No audio recorded")
            await send_final_results(None, None, None, None, None)
            return
        
        # Convert recorded audio to numpy array
        full_audio = np.concatenate(recorded_audio, axis=0).flatten()
        audio_duration = len(full_audio) / samplerate
        
        print(f"📊 Final audio duration: {audio_duration:.1f}s")
        print(f"📝 Total segments: {len(transcription_segments)}")
        
        # Run final diarization on entire session
        if diarization_pipeline and len(full_audio) >= samplerate * 2:
            print("🔍 Running final diarization on full session...")
            
            num_speakers = len(SPEAKER_NAMES) if SPEAKER_NAMES else None
            speaker_timeline = run_diarization_on_buffer(
                full_audio,
                start_offset=0,
                min_speakers=max(1, num_speakers - 1) if num_speakers else None,
                max_speakers=num_speakers + 1 if num_speakers else None
            )
            
            if speaker_timeline:
                with segments_lock:
                    # Assign speakers to all pending segments
                    pending = [s for s in transcription_segments if s['speaker'] == 'Pending...']
                    if pending:
                        print(f"   Assigning speakers to {len(pending)} pending segments...")
                        assign_speakers_to_segments(speaker_timeline, pending)
                        
                        # Assign generic labels to any still pending
                        still_pending = [s for s in pending if s['speaker'] == 'Pending...']
                        if still_pending:
                            for seg in still_pending:
                                seg['speaker'] = 'Speaker A'
                        
                        # Broadcast updates for all segments
                        for seg in pending:
                            await broadcast_speaker_update(seg['index'], seg['speaker'])
        
        # Save audio file
        audio_result = save_audio_recording()
        audio_filename = None
        audio_url = None
        if audio_result and audio_result[0]:
            audio_filename, audio_url = audio_result
        
        audio_data_b64 = None
        if audio_filename and os.path.exists(audio_filename):
            with open(audio_filename, 'rb') as f:
                audio_data_b64 = base64.b64encode(f.read()).decode('utf-8')
        
        print("✅ Final processing complete")
        print(f"{'='*60}\n")
        
        # Send final results (PDF not needed)
        await send_final_results(audio_data_b64, audio_filename, audio_url, None, None)
        
    except Exception as e:
        print(f"❌ Error in final processing: {e}")
        import traceback
        traceback.print_exc()
        await send_final_results(None, None, None, None, None)
    finally:
        processing_final = False

async def send_final_results(audio_data_b64, audio_filename, audio_url, pdf_data_b64=None, pdf_filename=None):
    """Send final diarization results to clients"""
    if connected_clients:
        # Send final diarization complete message
        message = json.dumps({
            'type': 'final_diarization_complete',
            'audio_data': audio_data_b64,
            'audio_file': audio_filename,
            'audio_url': audio_url,
            'pdf_data': pdf_data_b64,
            'pdf_file': pdf_filename
        })
        
        for client in connected_clients.copy():
            try:
                await client.send(message)
            except:
                pass
        
        # Also send status update for UI
        status_msg = json.dumps({
            'type': 'status_update',
            'status': 'stopped',
            'audio_file': audio_filename
        })
        
        for client in connected_clients.copy():
            try:
                await client.send(status_msg)
            except:
                pass

def reset_session():
    global recorded_audio, audio_saved, transcription_segments, realtime_segments
    global session_start_time, last_diarization_time, SPEAKER_NAMES
    
    print("🔄 Resetting session state...")
    
    while not q.empty():
        try:
            q.get_nowait()
        except:
            pass
    
    recorded_audio = []
    audio_saved = False
    transcription_segments = []
    realtime_segments = []
    session_start_time = None
    last_diarization_time = 0
    SPEAKER_NAMES = {}
    
    print("✅ Session reset complete")

async def handle_client(websocket):
    global transcription_paused, transcription_active, SPEAKER_NAMES, SPEAKER_LABEL_MAP
    
    connected_clients.add(websocket)
    print(f"✅ Client connected")
    
    try:
         status_message = 'Connected to transcription service'
         if diarization_pipeline:
              status_message += ' with speaker diarization'
         else:
              status_message += ' (transcription only)' 
         try:
              await websocket.send(json.dumps({
                    'type': 'status',
                    'message': status_message
          }))
         except websockets.exceptions.ConnectionClosedOK:
            print("⚠️ WebSocket closed, cannot send data")
         except websockets.exceptions.ConnectionClosedError as e:
            print("❌ WebSocket closed with error:", e)
        
         async for message in websocket:
            try:
                data = json.loads(message)
                
                if data.get('type') == 'start':
                    reset_session()
                    SPEAKER_LABEL_MAP.clear()  # Reset mapping
                    
                    if 'speakers' in data and data['speakers']:
                        speaker_list = data['speakers']
                        # Don't pre-map to SPEAKER_00, just store names
                        SPEAKER_NAMES = {name: name for name in speaker_list}
                        print(f"📝 Loaded {len(speaker_list)} speaker names: {speaker_list}")
                    else:
                        print("⚠️ No speakers provided")
                    
                    transcription_active = True
                    transcription_paused = False
                    # ... rest of start logic ...
                
                # NEW: Handle bulk assignment from frontend
                elif data.get('type') == 'bulk_speaker_assignment':
                    speaker_label = data.get('speaker_label')  # e.g., "Speaker A"
                    assigned_name = data.get('assigned_name')  # e.g., "Bilal"
                    
                    SPEAKER_LABEL_MAP[speaker_label] = assigned_name
                    print(f"🔒 Bulk assignment: {speaker_label} → {assigned_name}")
                    
                    # Update all segments with this label
                    with segments_lock:
                        for seg in transcription_segments:
                            if seg['speaker'] == speaker_label:
                                seg['speaker'] = assigned_name
                
                elif data.get('type') == 'speaker_change':
                    # Individual correction
                    segment_idx = data.get('segment_index')
                    new_speaker = data.get('new_speaker')
                    
                    if segment_idx is not None and new_speaker:
                        with segments_lock:
                            for seg in transcription_segments:
                                if seg['index'] == segment_idx:
                                    seg['speaker'] = new_speaker
                                    print(f"✏️ Individual correction: Segment {segment_idx} → {new_speaker}")
                                    break
                
                elif data.get('type') == 'pause':
                    transcription_paused = True
                    print("⏸ Recording paused")
                    await broadcast_status("Recording paused")
                
                elif data.get('type') == 'resume':
                    transcription_paused = False
                    print("▶ Recording resumed")
                    await broadcast_status("Recording resumed")
                
                elif data.get('type') == 'stop':
                    print("🛑 Stop requested - processing final diarization...")
                    # Immediately stop transcription
                    transcription_active = False
                    transcription_paused = False
                    
                    # Process final diarization and generate files
                    await process_final_diarization()
                
            except Exception as e:
                print(f"Error handling message: {e}")
                import traceback
                traceback.print_exc()
    
    except Exception as e:
        print(f"Client connection error: {e}")
    finally:
        connected_clients.discard(websocket)
def transcription_worker():
    global session_start_time, last_diarization_time, transcription_active
    
    print("🎙️ Transcription worker ready")
    print(f"   • Diarization interval: {diarization_interval}s")
    print(f"   • Diarization window: {diarization_window_size/samplerate:.0f}s")
    
    with sd.InputStream(samplerate=samplerate, channels=1, blocksize=blocksize, callback=callback):
        print("🎙️ Audio input ready. Waiting for start...")
        
        audio_buffer = np.zeros(0, dtype=np.float32)
        full_session_audio = np.zeros(0, dtype=np.float32)
        segment_counter = 0
        last_diarization_time = time.time()

        while True:
            if not transcription_active:
                time.sleep(0.1)
                audio_buffer = np.zeros(0, dtype=np.float32)
                # Only clear audio buffers if not processing final diarization
                if len(full_session_audio) > 0 and not processing_final:
                    full_session_audio = np.zeros(0, dtype=np.float32)
                    segment_counter = 0
                continue
            
            if transcription_paused:
                time.sleep(0.1)
                continue
            
            try:
                data = q.get(timeout=0.1)
            except:
                continue
                
            data = data.flatten().astype(np.float32)
            audio_buffer = np.concatenate((audio_buffer, data))
            full_session_audio = np.concatenate((full_session_audio, data))

            if len(audio_buffer) >= samplerate * CHUNK_DURATION:
                # Check again if transcription is still active before processing
                if not transcription_active:
                    audio_buffer = np.zeros(0, dtype=np.float32)
                    continue
                
                result = transcribe_smart_bilingual(audio_buffer)
                
                # Check again after transcription (in case stop was called during transcription)
                if not transcription_active:
                    audio_buffer = np.zeros(0, dtype=np.float32)
                    continue
                
                if result and result['text']:
                    segment_counter += 1
                    
                    abs_start = len(full_session_audio) / samplerate - len(audio_buffer) / samplerate
                    abs_end = len(full_session_audio) / samplerate
                    
                    seg_data = {
                        'index': segment_counter,
                        'text': result['text'],
                        'translation': result['translation'],
                        'detected_language': result['detected_language'],
                        'start': abs_start,
                        'end': abs_end,
                        'speaker': 'Pending...' if diarization_pipeline else 'Speaker A',
                        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    }
                    
                    with segments_lock:
                        transcription_segments.append(seg_data)
                        realtime_segments.append(seg_data.copy())
                    
                    lang_emoji = "🇵🇰" if result['detected_language'] == 'ur' else "🇺🇸"
                    print(f"\n[{abs_start:.2f}s] {lang_emoji} {seg_data['speaker']}: {result['text'][:80]}...")
                    if result['translation']:
                        print(f"        → {result['translation'][:80]}...")
                    
                    asyncio.run_coroutine_threadsafe(
                        broadcast_transcription(
                            result['text'],
                            abs_start,
                            abs_end,
                            seg_data['speaker'],
                            result['translation'],
                            result['detected_language']
                        ),
                        loop
                    )

                audio_buffer = np.zeros(0, dtype=np.float32)

            # Periodic diarization
            if diarization_pipeline and transcription_active and time.time() - last_diarization_time >= diarization_interval:
                print(f"\n{'='*60}")
                print(f"⏰ Periodic diarization batch")
                print(f"{'='*60}")
                
                asyncio.run_coroutine_threadsafe(
                    broadcast_status("Processing speakers..."),
                    loop
                )
                
                if len(full_session_audio) > diarization_window_size:
                    audio_for_diarization = full_session_audio[-diarization_window_size:]
                    offset = (len(full_session_audio) - len(audio_for_diarization)) / samplerate
                else:
                    audio_for_diarization = full_session_audio
                    offset = 0
                
                num_speakers = len(SPEAKER_NAMES) if SPEAKER_NAMES else None
                speaker_timeline = run_diarization_on_buffer(
                    audio_for_diarization, 
                    offset,
                    min_speakers=max(1, num_speakers - 1) if num_speakers else None,  # Allow flexibility
                    max_speakers=num_speakers + 1 if num_speakers else None
                )
                
                if speaker_timeline:
                    with segments_lock:
                        window_start = offset
                        pending = [s for s in transcription_segments 
                                 if s['speaker'] == 'Pending...' and s['start'] >= window_start]
                        
                        if pending:
                            assign_speakers_to_segments(speaker_timeline, pending)
                            
                            still_pending = [s for s in pending if s['speaker'] == 'Pending...']
                            if still_pending:
                                # Assign generic "Speaker A" to unassigned segments
                                for seg in still_pending:
                                    seg['speaker'] = 'Speaker A'
                            
                            for seg in pending:
                                asyncio.run_coroutine_threadsafe(
                                    broadcast_speaker_update(seg['index'], seg['speaker']),
                                    loop
                                )
                
                last_diarization_time = time.time()
                print(f"{'='*60}\n")

async def main():
    global loop
    loop = asyncio.get_event_loop()
    
    transcription_thread = threading.Thread(target=transcription_worker, daemon=True)
    transcription_thread.start()
    
    print("🌐 Starting WebSocket server on ws://localhost:8765")
    async with websockets.serve(handle_client, "localhost", 8765):
        print("✅ Server ready!")
        await asyncio.Future()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")