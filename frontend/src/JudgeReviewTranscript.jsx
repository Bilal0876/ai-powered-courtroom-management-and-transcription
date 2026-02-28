import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Components/header";
import html2pdf from "html2pdf.js";
import "./style.css";
import { API_BASE_URL } from "./config";
import { apiGet, apiPost, apiPut, apiDelete } from "./utils/api";
import Footer from "./Components/footer";


export default function JudgeReviewTranscript() {
     const navigate = useNavigate();
     const location = useLocation();
     const [approvalStatus, setApprovalStatus] = useState("draft");
     const isApproved = approvalStatus === "approved";
     const { selectedCase: rawCase } = location.state || {}
     const selectedCase = rawCase
          ? {
               case_id: rawCase.case_id,
               caseNumber: rawCase.caseNumber || rawCase.case_id,
               caseCode: rawCase.case_code,
               caseTitle: rawCase.case_title,
               party1: rawCase.party1 || rawCase.party_1 || "",
               party2: rawCase.party2 || rawCase.party_2 || "",
               hearingDate: rawCase.hearingDate || rawCase.submitted_at || "",
          }
          : null;

     const [segments, setSegments] = useState([]);
     const storedUser = JSON.parse(localStorage.getItem("user")) || {};

     useEffect(() => {
          if (!selectedCase?.case_id) return;

          // Fetch once per case_id
          apiGet("/review-transcript/${selectedCase.case_id}")
               .then((data) => {
                    if (data.success) {
                         setApprovalStatus(data.status);
                         setSegments(
                              data.segments.map((s) => ({
                                   original_id: s.original_id,
                                   speaker: s.speaker,
                                   start_time: s.start_time,
                                   end_time: s.end_time,

                                   original_text: s.original_text,
                                   original_language: s.original_language,

                                   // THIS is what judge edits
                                   edited_text: s.current_text,
                                   last_saved_text: s.current_text, // 👈 important
                                   isSaving: false,

                                   edited_by: s.edited_by,
                                   role: s.role,
                              }))
                         );
                    }
               })
               .catch((err) => console.error("Error fetching transcript:", err));
     }, [selectedCase?.case_id]); // ONLY depends on case_id

     const handleEditChange = (index, value) => {
          setSegments((prev) => {
               const updated = [...prev];
               updated[index] = { ...updated[index], edited_text: value };
               return updated;
          });
     };

     const approveTranscript = async () => {
          try {
               // Generate and download PDF
               const pdfBlob = await exportTranscriptPDF();

               // Upload to backend
               const formData = new FormData();
               formData.append("pdf", pdfBlob, `Transcript_${selectedCase.caseNumber}.pdf`);
               formData.append("case_id", selectedCase.caseNumber);
               formData.append("judge_name", storedUser.name);
               formData.append("judge_notes", "");

               const res = await fetch(`${API_BASE_URL}/approve-transcript`, {
                    method: "POST",
                    body: formData
               });

               const data = await res.json();
               if (data.success) setApprovalStatus("approved");
          } catch (err) {
               console.error("Error exporting/uploading PDF:", err);
          }
     };

     const saveSegment = async (seg, index) => {
          setSegments((prev) => {
               const copy = [...prev];
               copy[index].isSaving = true;
               return copy;
          });

          await fetch(`${API_BASE_URL}/save-edit`, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                    original_transcript_id: seg.original_id,
                    case_id: selectedCase.caseNumber,
                    speaker: seg.speaker,
                    start_time: seg.start_time,
                    end_time: seg.end_time,
                    edited_text: seg.edited_text,
                    judge_name: storedUser.name,
               }),
          });

          setSegments((prev) => {
               const copy = [...prev];
               copy[index].last_saved_text = seg.edited_text;
               copy[index].isSaving = false;
               return copy;
          });
     };

     const exportTranscriptPDF = async () => {
          // 1️⃣ Create a temporary container
          const container = document.createElement("div");
          container.style.width = "210mm";
          container.style.padding = "20mm";
          container.style.fontFamily = "Times New Roman";
          container.style.background = "white";

          container.innerHTML = `
        <h2 style="text-align:center">Hearing Transcript</h2>
        <p><strong>Case Number:</strong> ${selectedCase.caseCode}</p>
        <p><strong>Case Title:</strong> ${selectedCase.caseTitle}</p>
        <p><strong>Parties:</strong> ${selectedCase.party1} vs ${selectedCase.party2}</p>
        <p><strong>Hearing Date:</strong> ${selectedCase.hearingDate}</p>
        <p><strong>Judge:</strong> Justice ${storedUser.name}</p>
        <br />
        <hr />
        ${segments.map(seg => {
               const finalText = seg.last_saved_text !== seg.original_text
                    ? seg.edited_text
                    : seg.original_text;
               return `
                <div style="margin-bottom:12px">
                    <p><strong>${seg.speaker}</strong></p>
                    <p><em>${seg.original_language}</em></p>
                    <p>${finalText}</p>
                    <small>${seg.start_time}s – ${seg.end_time}s</small>
                    <hr />
                </div>
            `;
          }).join("")}
    `;

          document.body.appendChild(container);

          const opt = {
               margin: 10,
               filename: `Transcript_${selectedCase.caseNumber}.pdf`,
               image: { type: "jpeg", quality: 0.98 },
               html2canvas: { scale: 2 },
               jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
          };

          // 2️⃣ Generate PDF blob
          const pdfBlob = await html2pdf()
               .set(opt)
               .from(container)
               .outputPdf("blob");

          // 3️⃣ Download locally
          await html2pdf().set(opt).from(container).save();

          // 4️⃣ Cleanup
          document.body.removeChild(container);

          return pdfBlob;
     };



     return (
          <div className="login-container" key={selectedCase?.case_id}>
               <Header user={user} />

               <div className="container">
                    <div className="breadcrumb">
                         <a href="#" onClick={() => navigate("/judge-dash")}>
                              Dashboard
                         </a>{" > "}
                         &gt; <strong>Review Transcript</strong>
                    </div>

                    {selectedCase && (
                         <div className="case-details-card">
                              <div className="card-header-enhanced">
                                   <h3>Case Details</h3>
                              </div>
                              <div className="case-details-grid">
                                   <div className="detail-item">
                                        <span className="detail-label">Case Number</span>
                                        <span className="detail-value">{selectedCase.caseCode}</span>
                                   </div>
                                   <div className="detail-item">
                                        <span className="detail-label">Case Title</span>
                                        <span className="detail-value">{selectedCase.caseTitle}</span>
                                   </div>
                                   <div className="detail-item">
                                        <span className="detail-label">Parties</span>
                                        <span className="detail-value">
                                             {selectedCase.party1} vs {selectedCase.party2}
                                        </span>
                                   </div>
                                   <div className="detail-item">
                                        <span className="detail-label">Date</span>
                                        <span className="detail-value">{selectedCase.hearingDate}</span>
                                   </div>
                              </div>
                         </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
                         {!isApproved ? (
                              <button className="btn-approve" onClick={approveTranscript}>
                                   Approve Transcript
                              </button>
                         ) : (
                              <span className="approved-badge">✔ Transcript Approved</span>
                         )}
                    </div>


                    <div className="ordersheet-grid">
                         {/* Original transcripts */}
                         <div className="transcript-card">
                              <div className="card-header-enhanced">
                                   <h4>Original Transcript (Read Only)</h4>
                              </div>
                              <div className="transcript-body">
                                   {segments.map((seg) => (
                                        <div key={seg.original_id} className="segment-box readonly">
                                             <strong>{seg.speaker}</strong>
                                             <p>{seg.original_language}</p>
                                             <p>{seg.original_text}</p>
                                             <small>
                                                  {seg.start_time}s – {seg.end_time}s
                                             </small>
                                        </div>
                                   ))}
                              </div>
                         </div>

                         {/* Editable transcripts */}
                         <div className="ordersheet-card">
                              <div className="card-header-enhanced">
                                   <h4>Edit Transcript</h4>
                              </div>
                              <div className="ordersheet-body">
                                   {segments.map((seg, idx) => {
                                        const isDirty = seg.edited_text !== seg.last_saved_text;
                                        const isEditedFromOriginal = seg.last_saved_text !== seg.original_text;


                                        return (
                                             <div
                                                  key={seg.original_id}
                                                  className={`segment-box editable ${isDirty || isEditedFromOriginal ? "edited-highlight" : ""
                                                       }`}
                                             >

                                                  <div className="segment-header">
                                                       <strong>{seg.speaker} </strong>
                                                       <small>
                                                            {seg.start_time}s – {seg.end_time}s
                                                       </small>
                                                       {isDirty && !isApproved && (
                                                            <button
                                                                 className="btn-save-judge"
                                                                 disabled={seg.isSaving}
                                                                 onClick={() => saveSegment(seg, idx)}
                                                            >
                                                                 {seg.isSaving ? "Saving..." : "Save Changes"}
                                                            </button>
                                                       )}

                                                       {!isDirty && seg.last_saved_text !== seg.original_text && (
                                                            <small className="judge-modified">✔ Modified by Judge</small>
                                                       )}
                                                  </div>

                                                  <textarea
                                                       className="judge-textarea"
                                                       value={seg.edited_text}
                                                       disabled={isApproved}
                                                       onChange={(e) => {
                                                            handleEditChange(idx, e.target.value);
                                                            e.target.style.height = "auto";
                                                            e.target.style.height = `${e.target.scrollHeight}px`;
                                                       }}
                                                       onInput={(e) => {
                                                            e.target.style.height = "auto";
                                                            e.target.style.height = `${e.target.scrollHeight}px`;
                                                       }}
                                                  />
                                             </div>
                                        );
                                   })}

                              </div>
                         </div>

                    </div>
               </div>
               <div
                    id="pdf-content"
                    style={{
                         width: "210mm",
                         padding: "20mm",
                         background: "white",
                         position: "absolute",
                         left: "-9999px",
                         top: "0",
                         fontFamily: "Times New Roman"
                    }}
               >

                    <h2 style={{ textAlign: "center" }}>Ordersheet / Transcript</h2>

                    <p><strong>Case Number:</strong> {selectedCase.caseNumber}</p>
                    <p><strong>Parties:</strong> {selectedCase.party1} vs {selectedCase.party2}</p>
                    <p><strong>Hearing Date:</strong> {selectedCase.hearingDate}</p>
                    <p><strong>Judge:</strong> {storedUser.name}</p>

                    <hr />

                    {segments.map((seg, i) => {
                         const finalText =
                              seg.last_saved_text !== seg.original_text
                                   ? seg.edited_text
                                   : seg.original_text;

                         return (
                              <div key={i} style={{ marginBottom: "12px" }}>
                                   <p><strong>{seg.speaker}</strong></p>
                                   <p><em>{seg.original_language}</em></p>
                                   <p>{finalText}</p>
                                   <small>
                                        {seg.start_time}s – {seg.end_time}s
                                   </small>
                                   <hr />
                              </div>
                         );
                    })}
               </div>
               <Footer />
          </div>
     );
}
