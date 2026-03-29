import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/header";

import "../assets/styles/style.css";
import { API_BASE_URL } from "../config";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";
import Footer from "../components/footer";

export default function OrdersheetCreation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedCase } = location.state || {};

    const [transcript, setTranscript] = useState("");
    const [ordersheet, setOrdersheet] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const socketRef = useRef(null);
    const ordersheetRef = useRef(null);

    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const [user, setUser] = useState(storedUser);

    // Generate ordersheet template matching official format
    const generateTemplate = () => {
        if (!selectedCase) return "";

        return `
<div class="ordersheet-template">

  <div class="os-header">
    <div class="os-form">Form No: HCJD/C-121</div>
    <div class="os-title"><b>ORDER SHEET</b></div>
    <div class="os-subtitle"><b>IN THE ${user.court}</b></div>
    <div class="os-subtitle"><b>JUDICIAL DEPARTMENT</b></div>
    <div class="os-case"><b>Writ Petition No. ${selectedCase.caseNumber}</b></div>
  </div>

  <div class="os-parties">
    <div>${selectedCase.party1}</div>
    <div><b>Versus</b></div>
    <div>${selectedCase.party2}</div>
  </div>

  <table class="os-table">
    <thead>
    <tr>
      <th class="col-serial">S.No. of order / Proceedings</th>
      <th class="col-date">Date of order / Proceedings</th>
      <th class="col-order">
        Order with signature of Judge and that of<br/>
        Parties of counsel, where necessary
      </th>
    </tr>
  </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>${selectedCase.hearingDate}</td>
        <td>
          <div id="order-body" class="editable" contenteditable="true"></div>
        </td>
      </tr>
    </tbody>
  </table>

</div>
`;
    };

    const initializeTemplate = () => {
        const template = generateTemplate();
        setOrdersheet(template);
    }

    useEffect(() => {
        // Fetch user profile
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

        // Fetch transcript from DB
        if (selectedCase?.caseNumber) {
            apiGet("/transcriptForOrdersheet/${selectedCase.caseNumber}")
                .then(data => setTranscript(data.transcript || ""))
                .catch(err => console.error(err));
        }

        // Connect to speech-to-text WebSocket

        // Connect to speech-to-text WebSocket
        const socket = new WebSocket("ws://localhost:8765");
        socketRef.current = socket;

        socket.onopen = () => console.log("Connected to STT WebSocket");

        let sttBuffer = "";
        let lastSTTTime = Date.now();


        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type !== "transcription") return;

            setOrdersheet(prev => {
                if (!prev) return prev;

                return prev.replace(
                    /(<div id="order-body"[^>]*>)([\s\S]*?)(<\/div>)/,
                    `$1$2 ${data.text}$3`
                );
            });
        };

        return () => socket.close();
    }, []);

    useEffect(() => {
        window.__ORDER_EDIT__ = (html) => {
            setOrdersheet(prev =>
                prev.replace(
                    /(<div id="order-body"[^>]*>)([\s\S]*?)(<\/div>)/,
                    `$1${html}$3`
                )
            );
        };

        return () => delete window.__ORDER_EDIT__;
    }, []);

    const startRecording = () => {
        socketRef.current.send(JSON.stringify({ type: "start" }));
        setIsRecording(true);
        setIsPaused(false);
    };

    const pauseRecording = () => {
        socketRef.current.send(JSON.stringify({ type: "pause" }));
        setIsPaused(true);
    };

    const resumeRecording = () => {
        socketRef.current.send(JSON.stringify({ type: "resume" }));
        setIsPaused(false);
    };

    const stopRecording = () => {
        socketRef.current.send(JSON.stringify({ type: "stop" }));
        setIsRecording(false);
        setIsPaused(false);
    };

    const toggleRecording = () => {
        if (!isRecording) {
            socketRef.current.send(JSON.stringify({ type: "start" }));
            setIsRecording(true);
        } else {
            socketRef.current.send(JSON.stringify({ type: "stop" }));
            setIsRecording(false);
        }
    };

    const handleManualChange = (e) => setOrdersheet(e.target.value);

    const saveOrdersheet = () => {
        const html =
            document.querySelector(".ordersheet-template")?.outerHTML;

        if (!html) {
            alert("Ordersheet not initialized");
            return;
        }

        fetch(`${API_BASE_URL}/save-ordersheet`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                caseNumber: selectedCase.caseNumber,
                content: ordersheet,
                submittedBy: user.name
            }),
        })
            .then(res => res.json())
            .then(() => alert("Ordersheet saved successfully"))
            .catch(console.error);
    };


    const exportToPDF = () => {
        const win = window.open("", "", "width=900,height=700");
        win.document.write(`
      <html>
        <head>
          <title>Ordersheet</title>
          <style>
            body { font-family: 'Courier New'; padding: 1in; }
          </style>
        </head>
        <body>${ordersheet}</body>
      </html>
    `);
        win.document.close();
        win.print();
    };

    return (
        <div className="login-container">
            {/* Header */}
            <Header user={user} />

            {/* Main Content */}
            <div className="container">
                <div className="breadcrumb">
                    <a href="#" onClick={() => navigate("/stenographer-dashboard")}>
                        Dashboard
                    </a>{" "}
                    &gt; <a href="#" onClick={() => navigate("/stenographer-dashboard/case-for-ordersheet-ai")}>
                        Select Case
                    </a>{" "}
                    &gt; <strong>Create Ordersheet</strong>
                </div>

                <div className="ordersheet-page">
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

                    {/* Main Grid - Transcript & Ordersheet */}
                    <div className="ordersheet-grid">
                        {/* Transcript Box */}
                        <div className="transcript-card">
                            <div className="card-header-enhanced">
                                <h4>Hearing Transcript</h4>
                            </div>
                            <div className="transcript-body">
                                {transcript ? (
                                    <pre className="transcript-text">{transcript}</pre>
                                ) : (
                                    <div className="empty-state">
                                        <div className="empty-icon">📭</div>
                                        <p>No transcript available yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Ordersheet Editor */}
                        <div className="ordersheet-card">
                            <div className="card-header-enhanced">
                                <h4>Ordersheet Editor</h4>
                            </div>
                            <div className="ordersheet-body">

                                {/* Action Buttons */}
                                {/* <div className="action-buttons-row">
                                    <button
                                        className={`btn-voice ${isRecording ? 'recording' : ''}`}
                                        onClick={toggleRecording}
                                    >
                                        {isRecording ? (
                                            <>
                                                <span className="recording-dot">⏺</span>
                                                Stop Recording
                                            </>
                                        ) : (
                                            <>Voice Input</>
                                        )}
                                    </button>
                                    <button
                                        className="btn-voice"
                                        onClick={initializeTemplate}>
                                        Initialize Template
                                    </button>
                                    <button onClick={exportToPDF} className="btn-generate">
                                        📄 Export PDF
                                    </button>
                                </div> */}

                                <div className="action-buttons-row">
                                    <button
                                        className={`btn-voice ${isRecording ? 'recording' : ''}`}
                                        onClick={toggleRecording}
                                    >
                                        {isRecording ? (
                                            <>
                                                <span className="recording-dot">⏺</span>
                                                Stop Recording
                                            </>
                                        ) : (
                                            <>Voice Input</>
                                        )}
                                    </button>
                                    {isRecording && !isPaused && <button onClick={pauseRecording}>⏸ Pause</button>}
                                    {isPaused && <button onClick={resumeRecording}>▶ Resume</button>}

                                    <button
                                        className="btn-voice"
                                        onClick={initializeTemplate}>
                                        Initialize Template
                                    </button>
                                    <button onClick={exportToPDF} className="btn-generate">
                                        Export PDF
                                    </button>
                                </div>
                                {/* Textarea */}
                                <div
                                    className="ordersheet-body"
                                    dangerouslySetInnerHTML={{ __html: ordersheet }}
                                />



                                {/* Save Button */}
                                <button onClick={saveOrdersheet} className="btn-save">
                                    Submit Ordersheet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
