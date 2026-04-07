import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from "../components/header";
import "../assets/styles/style.css";
import '../assets/styles/transcription.css';
import { API_BASE_URL } from '../config';
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";
import Footer from '../components/footer';


export default function TranscriptionApp() {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedCase } = location.state || {};

    const [speakers, setSpeakers] = useState([]);
    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(null);
    const [selectedSpeaker, setSelectedSpeaker] = useState(null);
    const [lastAudioData, setLastAudioData] = useState(null);
    const [lastPdfData, setLastPdfData] = useState(null);
    const [lastAudioFilename, setLastAudioFilename] = useState(null);
    const [lastPdfFilename, setLastPdfFilename] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);

    const [transcriptions, setTranscriptions] = useState([]);
    const [totalWords, setTotalWords] = useState(0);
    const [segmentCount, setSegmentCount] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isStopped, setIsStopped] = useState(false);
    const [sessionCompleted, setSessionCompleted] = useState(false);

    const [status, setStatus] = useState({ text: 'Connecting...', className: 'connecting' });
    const [showProcessingOverlay, setShowProcessingOverlay] = useState(false);
    const [showSpeakerModal, setShowSpeakerModal] = useState(false);
    const [duration, setDuration] = useState('0:00');
    const [speakerInput, setSpeakerInput] = useState('');

    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const [user, setUser] = useState(storedUser);

    const [submittedForApproval, setSubmittedForApproval] = useState(false);
    const [editedSegments, setEditedSegments] = useState(new Set());
    const [speakerMap, setSpeakerMap] = useState({});

    const wsRef = useRef(null);
    const MAX_SPEAKERS = 10;

    // Fetch user profile on mount
    useEffect(() => {
        if (storedUser.email) {
            fetch(`${API_BASE_URL}/profile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: storedUser.email, role: storedUser.role }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) setUser(data.user);
                })
                .catch((err) => console.error(err));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("speakerMap", JSON.stringify(speakerMap));
    }, [speakerMap]);

    useEffect(() => {
        const storedMap = JSON.parse(localStorage.getItem("speakerMap") || "{}");
        setSpeakerMap(storedMap);
    }, []);

    const speakerMapRef = useRef({});
    useEffect(() => {
        speakerMapRef.current = speakerMap; // sync state -> ref
    }, [speakerMap]);


    // Connect to WebSocket on mount
    useEffect(() => {
        connectWebSocket();

        const reconnectInterval = setInterval(() => {
            if (wsRef.current?.readyState === WebSocket.CLOSED && !isRecording) {
                console.log('Attempting to reconnect...');
                connectWebSocket();
            }
        }, 5000);

        return () => {
            clearInterval(reconnectInterval);
            wsRef.current?.close();
        };
    }, []);

    // Update duration timer
    useEffect(() => {
        if (!startTime || !isRecording) return;

        const interval = setInterval(() => {
            const now = new Date();
            const diff = Math.floor((now - startTime) / 1000);
            const minutes = Math.floor(diff / 60);
            const seconds = diff % 60;
            setDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime, isRecording]);

    function connectWebSocket() {
        setStatus({ text: 'Connecting...', className: 'connecting' });

        const ws = new WebSocket('ws://localhost:8765');
        wsRef.current = ws;

        ws.onopen = () => {
            setStatus({ text: 'Ready - Add speakers and click Start', className: 'ready' });
        };

        ws.onmessage = (event) => {
            console.log("WS message received:", event.data);
            const data = JSON.parse(event.data);

            if (data.type === 'transcription') {
                addTranscription(data);
            } else if (data.type === 'speaker_update') {
                updateSpeakerInData(data.segment_index, data.speaker);
            } else if (data.type === 'status_update') {
                handleStatusUpdate(data.status, data.audio_file);
            } else if (data.type === 'status') {
                console.log('Server status:', data.message);
            } else if (data.type === 'final_diarization_complete') {
                setShowProcessingOverlay(false);
                setSessionCompleted(true);

                setTranscriptions(prev => {
                    const updated = [...prev];

                    updated.forEach(segment => {
                        const raw = segment.raw_speaker;
                        const mappedSpeaker = speakerMapRef.current[raw] || segment.speaker;

                        if (!segment._saved) {
                            if (mappedSpeaker) {
                                segment.speaker = mappedSpeaker;
                                saveTranscriptionToDB(segment);
                                segment._saved = true;
                            }
                        } else if (segment.speaker !== mappedSpeaker) {
                            segment.speaker = mappedSpeaker;
                            saveEditedSpeakerChange(segment);
                        }
                    });


                    return updated;
                });

                setLastAudioData(data.audio_data);
                setLastPdfData(data.pdf_data);
                setLastAudioFilename(data.audio_file);
                setLastPdfFilename(data.pdf_file);

                // Save audio URL to database if available
                if (data.audio_url && selectedCase?.caseNumber) {
                    setAudioUrl(data.audio_url);
                    saveAudioUrlToDB(data.audio_url);
                }

                if (data.audio_data && data.audio_file) {
                    downloadFile(data.audio_data, data.audio_file, 'audio/wav');
                    console.log(`✅ Audio auto-saved to code folder: ${data.audio_file}`);
                }

                if (data.pdf_data && data.pdf_file) {
                    downloadFile(data.pdf_data, data.pdf_file, 'application/pdf');
                    console.log(`✅ PDF auto-saved to code folder: ${data.pdf_file}`);
                }

                setStatus({
                    text: '✅ Processing complete! Files saved successfully',
                    className: 'ready'
                });
            }
        };

        ws.onclose = () => {
            setStatus({ text: 'Disconnected', className: 'disconnected' });
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setStatus({ text: 'Connection Error', className: 'disconnected' });
        };
    }

    function getEditedSegments() {
        return transcriptions.filter(t => t.isEdited && t.id);
    }

    function addSpeaker() {
        const speakerName = speakerInput.trim();

        if (!speakerName) {
            alert('⚠️ Please enter a speaker name');
            return;
        }

        if (speakers.length >= MAX_SPEAKERS) {
            alert(`⚠️ Maximum ${MAX_SPEAKERS} speakers allowed`);
            return;
        }

        if (speakers.includes(speakerName)) {
            alert('⚠️ This speaker already exists');
            return;
        }

        setSpeakers([...speakers, speakerName]);
        setSpeakerInput('');
    }

    function removeSpeaker(speakerName) {
        if (isRecording) {
            alert('⚠️ Cannot remove speakers during recording');
            return;
        }

        if (window.confirm(`Remove "${speakerName}" from speakers list?`)) {
            setSpeakers(speakers.filter(s => s !== speakerName));
        }
    }

    function openSpeakerModal(segmentIndex, currentSpeaker) {
        if (submittedForApproval) {
            alert("❌ Transcript is submitted for approval and cannot be modified.");
            return;
        }
        if (speakers.length === 0) {
            alert('⚠️ No speakers available. Please add speakers first.');
            return;
        }

        setCurrentSegmentIndex(segmentIndex);
        setSelectedSpeaker(currentSpeaker);
        setShowSpeakerModal(true);
    }

    function closeSpeakerModal() {
        setShowSpeakerModal(false);
        setCurrentSegmentIndex(null);
        setSelectedSpeaker(null);
    }

    function selectSpeaker(speaker) {
        setSelectedSpeaker(speaker);
    }

    function confirmSpeakerChange() {
        if (submittedForApproval) return;
        if (!selectedSpeaker || currentSegmentIndex === null) return;

        const raw = transcriptions[currentSegmentIndex - 1].raw_speaker;

        // Update mapping in both state and ref
        setSpeakerMap(prevMap => {
            const next = { ...prevMap, [raw]: selectedSpeaker };
            speakerMapRef.current = next; // <-- keep ref updated
            localStorage.setItem("speakerMap", JSON.stringify(next));
            return next;
        });

        // Apply mapping to all segments
        setTranscriptions(prev => {
            const updated = [...prev];
            const raw = updated[currentSegmentIndex - 1].raw_speaker;

            updated.forEach(segment => {
                if (segment.raw_speaker === raw) {
                    if (!segment._saved) {
                        // First-time assignment → save to original
                        segment.speaker = selectedSpeaker;
                        saveTranscriptionToDB(segment);
                        segment._saved = true;
                    } else if (segment.speaker !== selectedSpeaker) {
                        // Already saved → save as edited
                        segment.speaker = selectedSpeaker;
                        saveEditedSpeakerChange(segment);
                    }
                }
            });

            return updated;
        });


        closeSpeakerModal();
    }

    function updateSpeakerInData(segmentIndex, newSpeaker) {
        setTranscriptions(prev => {
            const updated = [...prev];
            const segment = updated[segmentIndex - 1];
            if (!segment) return updated;

            segment.raw_speaker = newSpeaker;
            segment.speaker = speakerMapRef.current[newSpeaker] || newSpeaker; // <-- always use ref

            return updated;
        });
    }

    async function saveEditedSpeakerChange(segment) {
        if (!segment.id) return; // must have original transcript ID

        try {
            const res = await fetch(`${API_BASE_URL}/save-edited-speaker`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    original_transcript_id: segment.id,
                    new_speaker: segment.speaker,
                    case_id: selectedCase.caseNumber,
                    edited_by: user.name,
                    role: user.role,
                }),
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'Failed to save edited speaker');

            console.log(`✅ Speaker edit saved to edited_transcript for segment ID ${segment.id}`);
        } catch (err) {
            console.error('Error saving edited speaker:', err);
        }
    }


    function toggleStartStop() {
        if (submittedForApproval) {
            alert("❌ Cannot start or stop recording after submission.");
            return;
        }
        if (!isRecording) {
            if (speakers.length === 0) {
                alert('⚠️ Please add at least one speaker before starting');
                return;
            }

            console.log('🔄 Starting new courtroom session - resetting everything');

            setTranscriptions([]);
            setTotalWords(0);
            setSegmentCount(0);
            setSessionCompleted(false);
            setSubmittedForApproval(false);
            setEditedSegments(new Set());

            setLastAudioData(null);
            setLastPdfData(null);
            setLastAudioFilename(null);
            setLastPdfFilename(null);
            setAudioUrl(null);

            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                    type: "start",
                    speakers: speakers
                }));
                setIsRecording(true);
                setIsStopped(false);
                setStatus({ text: 'Recording', className: 'connected' });
                setStartTime(new Date());

                console.log(`✅ New session started with ${speakers.length} speakers: ${speakers.join(', ')}`);
            }
        } else {
            if (window.confirm('Stop recording? This will finalize speaker identification and save files.')) {
                setShowProcessingOverlay(true);

                if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.send(JSON.stringify({ type: "stop" }));
                }

                setIsRecording(false);
                setIsStopped(true);
                setStatus({ text: '⏹ Processing...', className: 'connecting' });
            }
        }
    }

    async function sendForApproval() {
        if (!window.confirm("Send transcript for judge approval?")) return;

        try {
            const res = await apiPost("/submit-for-approval", {
                case_id: selectedCase.caseNumber,
                submitted_by: user.name
            });

            const data = await res.json();

            if (data.success) {
                setSubmittedForApproval(true);
                alert("✅ Sent for judge approval");
            } else {
                alert("❌ Submission failed");
            }
        } catch (err) {
            console.error(err);
            alert("❌ Server error");
        }
    }


    async function saveAudioUrlToDB(url) {
        if (!selectedCase?.caseNumber || !url) {
            console.warn("⛔ Missing case number or audio URL");
            return;
        }

        try {
            const result = await fetch(`${API_BASE_URL}/save-audio-url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    case_id: selectedCase.caseNumber,
                    audio_url: url
                }),
            });

            const data = await result.json();
            if (data.success) {
                console.log('✅ Audio URL saved to database:', url);
            } else {
                console.error('❌ Failed to save audio URL:', data.message);
            }
        } catch (err) {
            console.error('❌ Error saving audio URL:', err);
        }
    }

    async function saveTranscriptionToDB(segment) {
        // if (!segment.speaker || segment.speaker === 'Pending...') return;
        if (!segment.speaker || segment.speaker.startsWith("Speaker") || segment.speaker === 'Pending...') {
            console.warn("⛔ Speaker not mapped yet, skipping save");
            return;
        }

        const originalLanguage = segment.detected_language || 'en';

        const englishText =
            originalLanguage === 'ur'
                ? segment.translation
                : segment.text;

        if (!englishText) return;

        try {
            const result = await fetch(`${API_BASE_URL}/save-transcript`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    case_id: selectedCase?.caseNumber,
                    speaker: segment.speaker,
                    start_time: Number(segment.start),
                    end_time: Number(segment.end),
                    message: englishText,
                    original_language: segment.text
                }),
            });

            const data = await result.json();
            if (data.success) {
                segment.id = data.transcript.id;
                console.log('✅ Saved transcript with ID:', segment.id);
            }
        } catch (err) {
            console.error('Error saving transcription:', err);
        }
    }

    async function saveEditToDB(index) {
        const segment = transcriptions[index];

        if (!segment?.id) {
            alert('❌ Original transcript not saved yet');
            return;
        }

        if (!segment.isEdited) {
            alert('⚠️ No changes to save');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/save-edited-transcript`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    original_transcript_id: segment.id,
                    case_id: selectedCase.caseNumber,
                    speaker: segment.speaker,
                    edited_text: segment.edited_text,
                    start_time: Number(segment.start),
                    end_time: Number(segment.end),
                    edited_by: user.name,
                    role: user.role
                })
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message || 'Save failed');
            }

            // ✅ UI state update
            setEditedSegments(prev => {
                const next = new Set(prev);
                next.delete(index);
                return next;
            });

            setTranscriptions(prev => {
                const updated = [...prev];
                updated[index]._editSaved = true;
                return updated;
            });

            console.log('✅ Edit saved to DB');
        } catch (err) {
            console.error(err);
            alert('❌ Failed to save edited transcript');
        }
    }

    function addTranscription(data) {
        setTranscriptions(prev => {
            const mappedSpeaker = speakerMapRef.current[data.speaker] || data.speaker;

            return [
                ...prev,
                {
                    ...data,
                    raw_speaker: data.speaker,
                    speaker: mappedSpeaker,
                    original_text: data.text,
                    edited_text: null,
                    isEdited: false,
                    _saved: false
                }
            ];
        });

        setTotalWords(prev => prev + data.text.split(/\s+/).length);
        setSegmentCount(prev => prev + 1);
    }

    function handleStatusUpdate(statusType, audioFile) {
        console.log('Status update:', statusType);

        if (statusType === 'paused') {
            setStatus({ text: '⏸ Paused', className: 'connecting' });
            setIsPaused(true);
        } else if (statusType === 'recording') {
            setStatus({ text: 'Recording', className: 'connected' });
            setIsPaused(false);
        } else if (statusType === 'stopped') {
            setStatus({ text: '✅ Session Complete - Files Downloaded', className: 'ready' });
            setIsStopped(true);
        }
    }

    function togglePause() {
        if (isStopped || !isRecording) return;

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            if (isPaused) {
                wsRef.current.send(JSON.stringify({ type: "resume" }));
            } else {
                wsRef.current.send(JSON.stringify({ type: "pause" }));
            }
        }
    }

    function clearTranscriptions() {
        if (isRecording) {
            alert('⚠️ Please stop recording before clearing transcriptions');
            return;
        }

        if (!sessionCompleted && transcriptions.length > 0) {
            alert('⚠️ Session not completed yet. Please wait or stop the recording first.');
            return;
        }

        if (transcriptions.length > 0 && !window.confirm('Clear current session? This will not delete saved files.')) {
            return;
        }

        setTranscriptions([]);
        setTotalWords(0);
        setSegmentCount(0);
        setSessionCompleted(false);
        setEditedSegments(new Set());
        setLastAudioData(null);
        setLastPdfData(null);
        setLastAudioFilename(null);
        setLastPdfFilename(null);
        setAudioUrl(null);
        setDuration('0:00');

        console.log(' Session cleared - ready for new recording');
    }

    function exportToPDF() {
        if (!sessionCompleted || !lastPdfData || !lastPdfFilename) {
            alert(" No PDF available. Please complete a recording session first.");
            return;
        }

        downloadFile(lastPdfData, lastPdfFilename, 'application/pdf');
        console.log('PDF downloaded to user-selected location');
    }

    function downloadAudio() {
        if (!sessionCompleted || !lastAudioData || !lastAudioFilename) {
            alert('No audio available. Please complete a recording session first.');
            return;
        }

        downloadFile(lastAudioData, lastAudioFilename, 'audio/wav');
        console.log(' Audio downloaded to user-selected location');
    }

    function downloadFile(base64Data, filename, mimeType) {
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    function getSpeakerCount() {
        if (speakers.length === 0) {
            return 'No speakers added yet';
        } else if (speakers.length === 1) {
            return '1 speaker added';
        } else {
            return `${speakers.length} speakers added (max ${MAX_SPEAKERS})`;
        }
    }

    return (
        <div className="login-container">
            {/* Processing Overlay */}
            {showProcessingOverlay && (
                <div className="processing-overlay active">
                    <div className="processing-content">
                        <div className="spinner"></div>
                        <h2>Processing Complete Session</h2>
                        <p>Finalizing speaker identification and generating files...</p>
                    </div>
                </div>
            )}

            {/* Speaker Modal */}
            {showSpeakerModal && (
                <div className="speaker-modal active">
                    <div className="speaker-modal-content">
                        <h3>Change Speaker</h3>
                        <div className="speaker-options">
                            {speakers.map(speaker => (
                                <div
                                    key={speaker}
                                    className={`speaker-option ${speaker === selectedSpeaker ? 'selected' : ''}`}
                                    onClick={() => selectSpeaker(speaker)}
                                >
                                    {speaker}
                                </div>
                            ))}
                        </div>
                        <div className="modal-actions">
                            <button className="modal-btn modal-btn-cancel" onClick={closeSpeakerModal}>
                                Cancel
                            </button>
                            <button className="modal-btn modal-btn-confirm" onClick={confirmSpeakerChange}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <Header user={user} />

            {/* Main Container */}
            <div className="container">
                <div className="breadcrumb">
                    <a href="#" onClick={() => navigate("/stenographer-dashboard")}>
                        Dashboard
                    </a>{" "}
                    &gt; <strong>Live Transcription</strong>
                </div>

                {/* Case Details Card */}
                {selectedCase && (
                    <div className="case-details-card">
                        <div className="card-header-enhanced">
                            <h3>Case Details</h3>
                        </div>
                        <div className="case-details-grid">
                            <div className="detail-item">
                                <span className="detail-label">Case Number</span>
                                <span className="detail-value">{selectedCase.caseNumber}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Judge</span>
                                <span className="detail-value">Justice {selectedCase.judge}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Case Type</span>
                                <span className="detail-value">{selectedCase.caseType}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Case Title</span>
                                <span className="detail-value">{selectedCase.caseTitle}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Parties</span>
                                <span className="detail-value">{selectedCase.party1} vs {selectedCase.party2}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Date & Time</span>
                                <span className="detail-value">{selectedCase.hearingDate} - {selectedCase.hearingTime}</span>
                            </div>
                        </div>
                    </div>
                )}

                {submittedForApproval && (
                    <div className="approval-banner">
                        Transcript submitted for judge approval. Editing is locked.
                    </div>
                )}

                {/* Speaker Management */}
                <div className="speaker-management">
                    <div className="speaker-input-group">
                        <input
                            type="text"
                            className="speaker-input"
                            placeholder="Enter speaker name (Judge, Lawyer, Witness, etc.) - Max 10 speakers"
                            maxLength="50"
                            value={speakerInput}
                            onChange={(e) => setSpeakerInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addSpeaker()}
                        />
                        <button className="btn-add-speaker" onClick={addSpeaker}>
                            + Add Speaker
                        </button>
                    </div>
                    <div className="speakers-list">
                        {speakers.map(speaker => (
                            <div key={speaker} className="speaker-chip">
                                <span>{speaker}</span>
                                <span
                                    className="remove-speaker"
                                    onClick={() => removeSpeaker(speaker)}
                                >
                                    ×
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="speaker-count">{getSpeakerCount()}</div>
                </div>

                {/* Transcription Container */}
                <div className="transcription-container">
                    <div className="transcription-header">
                        <h2>Live Transcription</h2>
                        {sessionCompleted && audioUrl && (
                            <div className="audio-url-display" style={{ marginBottom: '10px', padding: '10px' }}>
                                <strong>Audio Recording: </strong>
                                <a
                                    href={audioUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#0066cc', textDecoration: 'underline' }}
                                >
                                    Click to access
                                </a>
                            </div>
                        )}
                        <div className="controls">
                            <button
                                className={`btn ${isRecording ? 'btn-stop' : 'btn-start'}`}
                                onClick={toggleStartStop}
                            >
                                {isRecording ? '⏹ Stop Recording' : '▶ Start Recording'}
                            </button>
                            <button
                                className="btn btn-pause"
                                onClick={togglePause}
                                disabled={!isRecording || isStopped}
                            >
                                {isPaused ? '▶ Resume' : '⏸ Pause'}
                            </button>
                            <button className="btn btn-clear" onClick={clearTranscriptions}>
                                Clear
                            </button>
                            {/* <button className="btn btn-export" onClick={exportToPDF}>
                                Export PDF
                            </button> */}
                            {/* <button
                                className="btn btn-audio"
                                onClick={downloadAudio}
                                disabled={!sessionCompleted}
                            >
                                Download Audio
                            </button> */}
                            {sessionCompleted && transcriptions.length > 0 && (
                                <button
                                    className="btn btn-approve"
                                    onClick={sendForApproval}
                                    disabled={submittedForApproval}
                                >
                                    Send for Approval
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="transcriptions">
                        {transcriptions.length === 0 ? (
                            <div className="empty-state">
                                <div className="icon">🎤</div>
                                <div>
                                    {isRecording
                                        ? 'Recording started... Listening for speech...'
                                        : 'Add speakers above, then click "Start Recording"'}
                                </div>
                            </div>
                        ) : (
                            transcriptions.map((item, index) => {
                                const detectedLang = item.detected_language || 'ur';
                                const langClass = `lang-${detectedLang}`;
                                const langEmoji = detectedLang === 'ur' ? '🇵🇰' : '🇺🇸';
                                const langName = detectedLang === 'ur' ? 'Urdu' : 'English';
                                const hasUnsavedEdit = item.isEdited && editedSegments.has(index);

                                return (
                                    <div
                                        key={index}
                                        className={`transcription-item ${langClass} ${item.isEdited ? 'edited-segment' : ''}`}
                                    >
                                        <div className="transcription-meta">
                                            <span>{item.timestamp}</span>
                                            <span
                                                className="speaker-badge"
                                                onClick={() => openSpeakerModal(index + 1, item.speaker)}
                                                title="Click to change speaker"
                                            >
                                                {item.speaker}
                                            </span>
                                            <span className={`language-badge ${langClass}`}>
                                                {langEmoji} {langName}
                                            </span>
                                            <span>Segment {index + 1}</span>
                                        </div>

                                        {/* Original Language (Read-only) */}
                                        <div className="transcription-label">
                                            Original Text ({langName}):
                                        </div>
                                        <div className={`transcription-text ${langClass} readonly`}>
                                            {item.original_text}
                                        </div>

                                        {/* Translation/English (Editable) */}
                                        {item.translation &&
                                            !item.translation.includes('[') &&
                                            !item.translation.includes('unavailable') && (
                                                <>
                                                    <div className="translation-label">
                                                        {detectedLang === 'ur' ? '🇺🇸 English Translation (Editable):' : '🇵🇰 Urdu Translation (Editable):'}
                                                    </div>
                                                    <div className="edit-container">
                                                        <textarea
                                                            disabled={submittedForApproval}
                                                            className={`steno-textarea ${detectedLang === 'ur' ? 'lang-en' : 'lang-ur'} ${item.isEdited ? 'edited' : ''}`}
                                                            value={item.edited_text ?? item.translation}
                                                            onChange={(e) => {
                                                                const value = e.target.value;

                                                                setTranscriptions(prev => {
                                                                    const updated = [...prev];
                                                                    const current = updated[index];

                                                                    const wasEdited = value.trim() !== current.translation.trim();

                                                                    updated[index] = {
                                                                        ...current,
                                                                        edited_text: value,
                                                                        isEdited: wasEdited
                                                                    };

                                                                    return updated;
                                                                });

                                                                if (value.trim() !== item.translation.trim()) {
                                                                    setEditedSegments(prev => new Set(prev).add(index));
                                                                } else {
                                                                    setEditedSegments(prev => {
                                                                        const newSet = new Set(prev);
                                                                        newSet.delete(index);
                                                                        return newSet;
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                        {hasUnsavedEdit && (
                                                            <button
                                                                className="btn-save-edit"
                                                                onClick={() => saveEditToDB(index)}
                                                            >
                                                                Save Edit
                                                            </button>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="stats">
                    <div className="stat">
                        <div className="stat-value">{totalWords}</div>
                        <div className="stat-label">Total Words</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value">{segmentCount}</div>
                        <div className="stat-label">Segments</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value">{duration}</div>
                        <div className="stat-label">Duration</div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
