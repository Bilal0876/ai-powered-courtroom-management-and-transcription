import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/header";

import "../assets/styles/style.css";
import { API_BASE_URL } from "../config";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";
import Footer from "../components/footer";

export default function OrdersheetCreationAI() {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedCase } = location.state || {};

    const [transcript, setTranscript] = useState("");
    const [ordersheet, setOrdersheet] = useState("");
    const [aiGeneratedText, setAiGeneratedText] = useState(""); // ← NEW STATE
    const [isGenerating, setIsGenerating] = useState(false);
    const ordersheetRef = useRef(null);
    const orderBodyRef = useRef(null);

    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const [user, setUser] = useState(storedUser);

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
            apiGet(`/transcriptForOrdersheet/${selectedCase.caseNumber}`)
                .then(data => setTranscript(data.transcript || ""))
                .catch(err => console.error(err));
        }

    }, []);

    const initializeTemplate = () => {
        if (!selectedCase) return;

        setOrdersheet("initialized"); // Mark as initialized
        setAiGeneratedText(""); // Clear AI text
    }

    const generateOrdersheet = async () => {
        if (!selectedCase) return;

        setIsGenerating(true);
        try {
            const response = await apiPost("/api/ordersheet/generate", { transcript, caseInfo: selectedCase });

            const data = await response.json();
            if (data.ordersheet) {
                // ✅ Store AI text in state instead of directly manipulating DOM
                const formattedText = data.ordersheet
                    .split("\n")
                    .map(line => line.trim())
                    .filter(line => line.length > 0)
                    .join("<br/>");

                setAiGeneratedText(formattedText);
                setOrdersheet("initialized"); // Ensure template is shown
            } else {
                console.error("Failed to generate ordersheet:", data);
                alert("Failed to generate ordersheet: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const saveOrdersheet = () => {
        // Get the edited content from the contentEditable div
        const orderBodyElement = orderBodyRef.current;
        const editedContent = orderBodyElement ? orderBodyElement.innerHTML : aiGeneratedText;

        // Build the complete ordersheet HTML
        const completeOrdersheet = `
<div class="ordersheet-template">
  <div class="os-header">
    <div class="os-form">Form No: HCJD/C-121</div>
    <div class="os-title"><b><u>ORDER SHEET</u></b></div>
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
        <td>${editedContent}</td>
      </tr>
    </tbody>
  </table>
</div>`;

        fetch(`${API_BASE_URL}/save-ordersheet`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                caseNumber: selectedCase.caseNumber,
                content: completeOrdersheet,
                submittedBy: user.name
            }),
        })
            .then((res) => res.json())
            .then(() => {
                alert("Ordersheet saved successfully!");
                navigate("/stenographer-dashboard");
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to save ordersheet");
            });
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
                                {/* Loading Indicator */}
                                {isGenerating && (
                                    <div className="loading-banner">
                                        <span className="spinner"></span>
                                        <span>Generating ordersheet with AI...</span>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="action-buttons-row">
                                    <button
                                        className="btn-generate"
                                        onClick={generateOrdersheet}
                                        disabled={isGenerating}
                                    >
                                        AI Generate Ordersheet
                                    </button>
                                    <button
                                        className="btn-voice"
                                        onClick={initializeTemplate}>
                                        Reset Template
                                    </button>
                                    {/* <button onClick={exportToPDF} className="btn-generate">
                                        Export PDF
                                    </button> */}
                                </div>

                                {/* ✅ Static Template with Editable AI Content */}
                                <div className="ordersheet-template">
                                    <div className="os-header">
                                        <div className="os-form">Form No: HCJD/C-121</div>
                                        <div className="os-title"><b><u>ORDER SHEET</u></b></div>
                                        <div className="os-subtitle"><b>IN THE {user.court}</b></div>
                                        <div className="os-subtitle"><b>JUDICIAL DEPARTMENT</b></div>
                                        <div className="os-case"><b>Writ Petition No. {selectedCase.caseNumber}</b></div>
                                    </div>

                                    <div className="os-parties">
                                        <div>{selectedCase.party1}</div>
                                        <div><b>Versus</b></div>
                                        <div>{selectedCase.party2}</div>
                                    </div>

                                    <table className="os-table">
                                        <thead>
                                            <tr>
                                                <th className="col-serial">S.No. of order / Proceedings</th>
                                                <th className="col-date">Date of order / Proceedings</th>
                                                <th className="col-order">
                                                    Order with signature of Judge and that of<br />
                                                    Parties of counsel, where necessary
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>{selectedCase.hearingDate}</td>
                                                <td>
                                                    {/* ✅ Editable div with AI content */}
                                                    <div
                                                        ref={orderBodyRef}
                                                        className="editable"
                                                        contentEditable="true"
                                                        suppressContentEditableWarning={true}
                                                        dangerouslySetInnerHTML={{ __html: aiGeneratedText }}
                                                        style={{
                                                            minHeight: "200px",
                                                            padding: "10px",
                                                            border: "1px dashed #ccc",
                                                            background: aiGeneratedText ? "#fff" : "#f9f9f9"
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

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
