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
import os
import base64 

# Load model on GPU
model = WhisperModel("medium", device="cuda", compute_type="float16")

# Settings
samplerate = 16000
blocksize = 4000
q = queue.Queue()

# WebSocket clients
connected_clients = set()

# Audio recording variables
recorded_audio = []
session_start_time = None

# 🔹 START / STOP FLAG
recording_active = False

# 🔹 Whisper hallucination garbage endings
GARBAGE_PHRASES = {
    "thank you",
    "thanks",
    "thanks for watching",
    "thank you very much",
    "bye",
    "bye bye"
}
# 🔹 last sentence sent (dedup)
last_sent_text = ""

# Callback
def callback(indata, frames, time, status):
    if status:
        print(status, flush=True)
    q.put(indata.copy())

    if recording_active:
        recorded_audio.append(indata.copy())

# Save WAV
def save_audio_recording():
    if recorded_audio:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"recording_{timestamp}.wav"

        full_audio = np.concatenate(recorded_audio, axis=0)

        with wave.open(filename, 'wb') as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(samplerate)
            audio_int16 = (full_audio * 32767).astype(np.int16)
            wav_file.writeframes(audio_int16.tobytes())

        print(f"💾 Audio saved as: {filename}")
        return filename
    return None

# 🔹 SEND TEXT ONLY
async def broadcast_transcription(text):
    if connected_clients:
        message = json.dumps({
            "type": "transcription",
            "text": text
        })

        dead = []
        for client in connected_clients.copy():
            try:
                await client.send(message)
            except websockets.exceptions.ConnectionClosed:
                dead.append(client)

        for d in dead:
            connected_clients.discard(d)

# WebSocket handler
async def handle_client(websocket):
    global recording_active
    connected_clients.add(websocket)
    print(f"Client connected ({len(connected_clients)})")

    try:
        await websocket.send(json.dumps({
            "type": "status",
            "message": "Connected"
        }))

        async for message in websocket:
            data = json.loads(message)

            if data.get("type") == "start":
                recording_active = True
                recorded_audio.clear()
                print("🎙️ START")

            elif data.get("type") == "stop":
                recording_active = False
                print("🛑 STOP")

            elif data.get("type") == "download_files":
                audio_file = save_audio_recording()
                audio_b64 = None

                if audio_file and os.path.exists(audio_file):
                    with open(audio_file, "rb") as f:
                        audio_b64 = base64.b64encode(f.read()).decode()

                await websocket.send(json.dumps({
                    "type": "files_ready",
                    "audio_file": audio_file,
                    "audio_data": audio_b64
                }))

            elif data.get("type") == "ping":
                await websocket.send(json.dumps({"type": "pong"}))

    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        connected_clients.discard(websocket)
        print(f"Client disconnected ({len(connected_clients)})")

# Transcription thread
def transcription_worker():
    global session_start_time
    print("🎙️ Transcription worker started")
    session_start_time = datetime.now()

    with sd.InputStream(
        samplerate=samplerate,
        channels=1,
        blocksize=blocksize,
        callback=callback
    ):
        audio_buffer = np.zeros(0, dtype=np.float32)

        while True:
            data = q.get().flatten().astype(np.float32)

            if not recording_active:
                continue  # 🔴 ignore audio when stopped

            audio_buffer = np.concatenate((audio_buffer, data))

            if len(audio_buffer) >= samplerate * 5:
                segments, _ = model.transcribe(
                    audio_buffer,
                    beam_size=5,
                    language="en"  # 🔹 force English
                )

                for segment in segments:
                    text = segment.text.strip()
                    if not text:
                         continue

                    clean = text.lower().strip(" .!")

# 🔹 block Whisper hallucinations (prefix-based)
                    for g in GARBAGE_PHRASES:
                         if clean.startswith(g):
                              continue

                    print(text)

                    asyncio.run_coroutine_threadsafe(
                        broadcast_transcription(text),
                        loop
                    )

                audio_buffer = audio_buffer[-samplerate * 2:]

# Main
async def main():
    global loop
    loop = asyncio.get_event_loop()

    threading.Thread(
        target=transcription_worker,
        daemon=True
    ).start()

    print("🌐 ws://localhost:8765")
    server = await websockets.serve(handle_client, "localhost", 8765)

    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())