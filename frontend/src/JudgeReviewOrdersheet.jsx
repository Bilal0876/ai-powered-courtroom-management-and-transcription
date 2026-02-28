import React, { useEffect, useRef, useState } from "react";
import Header from "./Components/header";
import { useNavigate, useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";
import "./style.css";
import { API_BASE_URL } from "./config";
import { apiGet, apiPost, apiPut, apiDelete } from "./utils/api";
import Footer from "./Components/footer";

export default function JudgeReviewOrdersheet() {
     const navigate = useNavigate();
     const location = useLocation();

     const editorRef = useRef(null);
     const [ordersheet, setOrdersheet] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     const judge = JSON.parse(localStorage.getItem("user"));

     const { selectedCase: rawCase } = location.state || {};
     const selectedCase = rawCase
          ? {
               case_id: rawCase.case_id,
               caseNumber: rawCase.caseNumber || rawCase.case_id,
               caseCode: rawCase.case_code,
               caseTitle: rawCase.case_title,
               caseType: rawCase.case_type,
               party1: rawCase.party1 || rawCase.party_1 || "",
               party2: rawCase.party2 || rawCase.party_2 || "",
               hearingDate: rawCase.hearingDate || rawCase.submitted_at || "",
          }
          : null;


     // useEffect(() => {
     //      if (!selectedCase) {
     //           console.error("❌ No case data found");
     //           setError("No case data provided");
     //           setLoading(false);
     //           return;
     //      }

     //      console.log("📋 Fetching ordersheet for case:", selectedCase.case_id);
     //      console.log("📦 Full case data:", selectedCase);

     //      setLoading(true);
     //      fetch(`${API_BASE_URL}/review-ordersheet/${selectedCase.case_id}`)
     //           .then(res => {
     //                console.log("📡 Response status:", res.status);
     //                if (!res.ok) {
     //                     throw new Error(`HTTP error! status: ${res.status}`);
     //                }
     //                return res.json();
     //           })
     //           .then(data => {
     //                console.log("✅ Ordersheet data received:", data);
     //                setOrdersheet(data.ordersheet);
     //                setLoading(false);
     //           })
     //           .catch(err => {
     //                console.error("❌ Error fetching ordersheet:", err);
     //                setError(err.message);
     //                setLoading(false);
     //           });
     // }, [selectedCase]);
     useEffect(() => {
          if (!rawCase?.case_id) return;

          setLoading(true);

          fetch(`${API_BASE_URL}/review-ordersheet/${rawCase.case_id}`)
               .then(res => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.json();
               })
               .then(data => {
                    setOrdersheet(data.ordersheet);
                    setLoading(false);
               })
               .catch(err => {
                    setError(err.message);
                    setLoading(false);
               });

     }, [rawCase?.case_id]);


     const submitDecision = async (status) => {
          const updatedHTML = editorRef.current?.innerHTML || "";

          try {
               let pdfBlob = null;

               if (status === "approved") {
                    pdfBlob = await exportOrdersheetToPDF();
               }

               const formData = new FormData();
               formData.append("id", selectedCase.case_id);
               formData.append("content", updatedHTML);
               formData.append("status", status);
               formData.append("judgeName", judge.name);

               if (pdfBlob) {
                    formData.append(
                         "pdf",
                         pdfBlob,
                         `Ordersheet_${selectedCase.case_id}.pdf`
                    );
               }

               const res = await fetch(`${API_BASE_URL}/approve-ordersheet`, {
                    method: "POST",
                    body: formData
               });

               if (!res.ok) throw new Error(`HTTP ${res.status}`);

               alert(`Ordersheet ${status}`);
               navigate("/judge-dash");

          } catch (err) {
               console.error("❌ Approval failed:", err);
               alert(err.message);
          }
     };


     if (loading) return <div className="container"><p>Loading ordersheet...</p></div>;

     if (error) return (
          <div className="container">
               <h2>Error Loading Ordersheet</h2>
               <p style={{ color: "red" }}>❌ {error}</p>
               <button onClick={() => navigate("/judge-dash")}>← Back to Dashboard</button>
          </div>
     );

     if (!ordersheet) return (
          <div className="container">
               <p>No ordersheet data available</p>
               <button onClick={() => navigate("/judge-dash")}>← Back to Dashboard</button>
          </div>
     );

     const exportOrdersheetToPDF = async () => {
          if (!editorRef.current) return null;

          const element = editorRef.current;

          const opt = {
               margin: 0.5,
               image: { type: "jpeg", quality: 0.98 },
               html2canvas: { scale: 2, scrollY: 0 },
               jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
          };

          // ✅ Generate PDF ONCE
          const worker = html2pdf().set(opt).from(element);

          // 1️⃣ Download for judge
          await worker.save(`Ordersheet_${selectedCase.case_id}.pdf`);

          // 2️⃣ Get same PDF as Blob
          const pdfBlob = await worker.outputPdf("blob");

          return pdfBlob;
     };


     return (
          <div className="login-container">
               {/* Header */}
               <Header user={user} />

               {/* Main Content */}
               <div className="container">
                    <div className="breadcrumb">
                         <a href="#" onClick={() => navigate("/judge-dash")}>
                              Dashboard
                         </a>{" "}
                         &gt; <a href="#" onClick={() => navigate("/judge-dash/pending-ordersheets")}>
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
                                             <span className="detail-value">{selectedCase.caseCode}</span>
                                        </div>
                                        <div className="detail-item">
                                             <span className="detail-label">Judge</span>
                                             <span className="detail-value">Justice {judge.name}</span>
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
                         <div className="container">
                              <h2>Review Ordersheet</h2>

                              <div
                                   ref={editorRef}
                                   contentEditable
                                   suppressContentEditableWarning
                                   dangerouslySetInnerHTML={{ __html: ordersheet.content_html }}
                                   style={{
                                        width: "100%",
                                        border: "1px solid #ccc",
                                        padding: "20px",
                                        minHeight: "600px",
                                        background: "#fff",
                                        marginTop: "20px"
                                   }}
                              />

                              <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                                   <button
                                        className="logout-btn"
                                        style={{ background: "linear-gradient(135deg, #22a328ff 0%, #1d7b23ff 100%)" }}
                                        onClick={() => submitDecision("approved")}
                                   >
                                        Approve
                                   </button>
                                   <button
                                        className="logout-btn"
                                        style={{ background: "linear-gradient(135deg, #f71e1eff 0%, #7b241dff 100%)" }}
                                        onClick={() => submitDecision("rejected")}
                                   >
                                        Reject
                                   </button>
                                   <button
                                        className="logout-btn"
                                        style={{ background: "linear-gradient(135deg, #8d8d8dff 0%, #3e3d3dff 100%)" }}
                                        onClick={() => navigate("/judge-dash")}
                                   >
                                        ← Cancel
                                   </button>
                              </div>
                         </div>
                    </div>
               </div>


               {/* Footer */}
               <Footer />
          </div>
     );
}