import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/header";
import html2pdf from "html2pdf.js";
import { API_BASE_URL } from "../config";
import { apiGet } from "../utils/api";
import Footer from "../components/footer";

export default function JudgeReviewTranscript() {
     const navigate = useNavigate();
     const location = useLocation();
     const { selectedCase: rawCase } = location.state || {};
     
     const [approvalStatus, setApprovalStatus] = useState("draft");
     const [segments, setSegments] = useState([]);
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);
     const isApproved = approvalStatus === "approved";

     const selectedCase = rawCase
          ? {
               case_id: rawCase.case_id,
               caseNumber: rawCase.caseNumber || rawCase.case_id,
               caseCode: rawCase.case_code || rawCase.case_id,
               caseTitle: rawCase.case_title,
               party1: rawCase.party1 || rawCase.party_1 || "",
               party2: rawCase.party2 || rawCase.party_2 || "",
               hearingDate: rawCase.hearingDate || rawCase.submitted_at || "",
          }
          : null;

     useEffect(() => {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (!storedUser) {
               navigate("/");
               return;
          }
          setUser(storedUser);

          if (!selectedCase?.case_id) {
               setLoading(false);
               return;
          }

          apiGet(`/api/transcripts/review/${selectedCase.case_id}`)
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
                                   edited_text: s.current_text,
                                   last_saved_text: s.current_text,
                                   isSaving: false,
                                   edited_by: s.edited_by,
                                   role: s.role,
                              }))
                         );
                    }
                    setLoading(false);
               })
               .catch((err) => {
                    console.error("Error fetching transcript:", err);
                    setLoading(false);
               });
     }, [selectedCase?.case_id, navigate]);

     const handleEditChange = (index, value) => {
          setSegments((prev) => {
               const updated = [...prev];
               updated[index] = { ...updated[index], edited_text: value };
               return updated;
          });
     };

     const approveTranscript = async () => {
          try {
               const pdfBlob = await exportTranscriptPDF();
               const formData = new FormData();
               formData.append("pdf", pdfBlob, `Transcript_${selectedCase.caseNumber}.pdf`);
               formData.append("case_id", selectedCase.caseNumber);
               formData.append("judge_name", user.name);
               formData.append("judge_notes", "");

               const token = localStorage.getItem('access_token');
               const res = await fetch(`${API_BASE_URL}/api/transcripts/approve`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
               });

               const data = await res.json();
               if (data.success) {
                    setApprovalStatus("approved");
                    alert("✅ Transcript formally approved and archived.");
                    navigate("/judge-dashboard");
               }
          } catch (err) {
               console.error("Error exporting/uploading PDF:", err);
               alert("❌ Approval failed. Please check your connection.");
          }
     };

     const saveSegment = async (seg, index) => {
          setSegments((prev) => {
               const copy = [...prev];
               copy[index].isSaving = true;
               return copy;
          });

          try {
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
                         judge_name: user.name,
                    }),
               });

               setSegments((prev) => {
                    const copy = [...prev];
                    copy[index].last_saved_text = seg.edited_text;
                    copy[index].isSaving = false;
                    return copy;
               });
          } catch (err) {
               console.error("Failed to save segment:", err);
               setSegments((prev) => {
                    const copy = [...prev];
                    copy[index].isSaving = false;
                    return copy;
               });
          }
     };

     const exportTranscriptPDF = async () => {
          const container = document.createElement("div");
          container.style.width = "210mm";
          container.style.padding = "20mm";
          container.style.fontFamily = "Times New Roman";
          container.style.background = "white";

          container.innerHTML = `
               <h1 style="text-align:center; font-size: 24pt; margin-bottom: 30pt;">IN THE HIGH COURT OF JUSTICE</h1>
               <h2 style="text-align:center; margin-bottom: 40pt;">Official Hearing Transcript</h2>
               <div style="margin-bottom: 20pt; border: 1px solid #000; padding: 10pt;">
                    <p><strong>REFERENCE NO:</strong> ${selectedCase.caseCode}</p>
                    <p><strong>LITIGANTS:</strong> ${selectedCase.party1} vs ${selectedCase.party2}</p>
                    <p><strong>JURISDICTION:</strong> CIVIL DIVISION</p>
                    <p><strong>PROCEEDING DATE:</strong> ${selectedCase.hearingDate}</p>
                    <p><strong>PRESIDING JUSTICE:</strong> HON. JUSTICE ${user.name.toUpperCase()}</p>
               </div>
               <br />
               <hr style="border: 0.5pt solid #000;" />
               <br />
               ${segments.map(seg => {
                    const finalText = seg.last_saved_text !== seg.original_text
                         ? seg.edited_text
                         : seg.original_text;
                    return `
                         <div style="margin-bottom:20pt; page-break-inside: avoid;">
                              <p style="margin-bottom: 5pt;"><strong>[${seg.start_time}s - ${seg.end_time}s] ${seg.speaker.toUpperCase()}</strong></p>
                              <p style="text-align: justify; line-height: 1.6;">${finalText}</p>
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

          const pdfBlob = await html2pdf().set(opt).from(container).outputPdf("blob");
          document.body.removeChild(container);
          return pdfBlob;
     };

     if (loading) return (
          <div className="!min-h-screen !flex !items-center !justify-center !bg-gray-50">
               <div className="!animate-spin !rounded-full !h-12 !w-12 !border-b-2 !border-[#2c3e50]"></div>
          </div>
     );

     return (
          <div className="!w-full !min-h-screen !flex !flex-col ![background-color:#f8fafc] ![font-family:Inter,sans-serif]">
               <Header user={user} />

               <div className="!flex-1 !p-[20px] lg:!p-[40px] !mb-[100px]">
                    {/* Breadcrumb */}
                    <div className="!max-w-[1400px] !mx-auto !flex !items-center !gap-2 !mb-8 !text-[13px]">
                         <a href="#" onClick={(e) => { e.preventDefault(); navigate("/judge-dashboard"); }} className="!text-blue-600 hover:!underline">Dashboard</a>
                         <span className="!text-gray-400">/</span>
                         <a href="#" onClick={(e) => { e.preventDefault(); navigate(-1); }} className="!text-blue-600 hover:!underline">Pending Review</a>
                         <span className="!text-gray-400">/</span>
                         <span className="!text-gray-600 !font-semibold">Transcript Audit</span>
                    </div>

                    <div className="!max-w-[1400px] !mx-auto">
                         {/* Header Section */}
                         <div className="!flex !flex-col md:!flex-row !justify-between !items-start md:!items-center !gap-6 !mb-10">
                              <div>
                                   <div className="!flex !items-center !gap-4 !mb-2">
                                        <h1 className="!text-[1.8rem] !font-black !text-[#2c3e50] !m-0">Verbatim Audit</h1>
                                        {isApproved ? (
                                             <span className="!px-3 !py-1 !bg-emerald-100 !text-emerald-700 !rounded-full !text-[11px] !font-bold !uppercase !tracking-wider">Official & Sealed</span>
                                        ) : (
                                             <span className="!px-3 !py-1 !bg-amber-100 !text-amber-700 !rounded-full !text-[11px] !font-bold !uppercase !tracking-wider">DRAFT REVIEW</span>
                                        )}
                                   </div>
                                   <p className="!text-gray-500 !flex !items-center !gap-2">
                                        <span>Case: <span className="!font-bold !text-[#2c3e50]">{selectedCase?.caseCode}</span></span>
                                        <span className="!text-gray-300">|</span>
                                        <span>{selectedCase?.caseTitle}</span>
                                   </p>
                              </div>
                         </div>

                         {/* Case Quick Info Card */}
                         <div className="!bg-white !rounded-[20px] !shadow-sm !border !border-gray-100 !p-6 !mb-10 !grid !grid-cols-1 md:!grid-cols-4 !gap-6">
                              <div>
                                   <div className="!text-[10px] !font-bold !text-gray-400 !uppercase !tracking-widest !mb-1">Reference</div>
                                   <div className="!text-[#2c3e50] !font-bold !text-[14px]">{selectedCase?.caseCode}</div>
                              </div>
                              <div className="md:!col-span-2">
                                   <div className="!text-[10px] !font-bold !text-gray-400 !uppercase !tracking-widest !mb-1">Litigant Parties</div>
                                   <div className="!text-[#2c3e50] !font-bold !text-[14px]">{selectedCase?.party1} <span className="!text-gray-300 !mx-2">vs</span> {selectedCase?.party2}</div>
                              </div>
                              <div>
                                   <div className="!text-[10px] !font-bold !text-gray-400 !uppercase !tracking-widest !mb-1">Hearing Date</div>
                                   <div className="!text-[#2c3e50] !font-bold !text-[14px]">{selectedCase?.hearingDate ? new Date(selectedCase.hearingDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}</div>
                              </div>
                         </div>

                         {/* Transcript Comparison Grid */}
                         <div className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-10">
                              {/* Left Column: Original */}
                              <div className="!flex !flex-col">
                                   <div className="!bg-[#2c3e50] !text-white !px-6 !py-4 !rounded-t-[20px] !flex !justify-between !items-center">
                                        <span className="!text-[12px] !font-bold !uppercase !tracking-widest">A.I. Transcription (Raw)</span>
                                        <span className="!text-[10px] !bg-white/10 !px-2 !py-1 !rounded">READ ONLY</span>
                                   </div>
                                   <div className="!bg-white !border !border-gray-100 !border-t-0 !rounded-b-[20px] !p-8 !space-y-6 !max-h-[800px] !overflow-y-auto !shadow-sm">
                                        {segments.length === 0 ? (
                                             <div className="!p-20 !text-center !text-gray-400 !italic">No transcription data available for this hearing.</div>
                                        ) : (
                                             segments.map((seg) => (
                                                  <div key={seg.original_id} className="!p-6 !bg-gray-50/50 !rounded-[16px] !border !border-gray-50">
                                                       <div className="!flex !justify-between !items-start !mb-4">
                                                            <div className="!flex !items-center !gap-2">
                                                                 <div className="!w-2 !h-2 !bg-gray-400 !rounded-full"></div>
                                                                 <strong className="!text-[#2c3e50] !uppercase !text-[11px] !tracking-wider">{seg.speaker}</strong>
                                                            </div>
                                                            <span className="!text-[10px] !font-mono !text-gray-400">{seg.start_time}s – {seg.end_time}s</span>
                                                       </div>
                                                       <p className="!text-[14px] !leading-[1.8] !text-gray-600 !m-0">{seg.original_text}</p>
                                                  </div>
                                             ))
                                        )}
                                   </div>
                              </div>

                              {/* Right Column: Editable */}
                              <div className="!flex !flex-col">
                                   <div className="!bg-[#28a745] !text-white !px-6 !py-4 !rounded-t-[20px] !flex !justify-between !items-center">
                                        <span className="!text-[12px] !font-bold !uppercase !tracking-widest">Judicial Corrections</span>
                                        {isApproved && <span className="!text-[10px] !bg-black/10 !px-2 !py-1 !rounded">FINALIZED</span>}
                                   </div>
                                   <div className="!bg-white !border !border-gray-100 !border-t-0 !rounded-b-[20px] !p-8 !space-y-6 !max-h-[800px] !overflow-y-auto !shadow-sm">
                                        {segments.map((seg, idx) => {
                                             const isDirty = seg.edited_text !== seg.last_saved_text;
                                             const isModified = seg.last_saved_text !== seg.original_text;

                                             return (
                                                  <div
                                                       key={seg.original_id}
                                                       className={`!p-6 !border !rounded-[16px] !transition-all ${
                                                            isDirty ? "!border-amber-300 !bg-amber-50/20 !shadow-md" : (isModified ? "!border-emerald-200 !bg-emerald-50/10" : "!border-gray-50 !bg-white")
                                                       }`}
                                                  >
                                                       <div className="!flex !justify-between !items-center !mb-4">
                                                            <div className="!flex !items-center !gap-3">
                                                                 <strong className="!text-[#2c3e50] !text-[11px] !uppercase !tracking-wider">{seg.speaker}</strong>
                                                                 {isModified && !isDirty && <span className="!text-[9px] !bg-emerald-100 !text-emerald-700 !px-2 !py-0.5 !rounded !font-bold">VERIFIED</span>}
                                                                 {isDirty && <span className="!text-[9px] !bg-amber-100 !text-amber-700 !px-2 !py-0.5 !rounded !font-bold">PENDING SAVE</span>}
                                                            </div>
                                                            <div className="!flex !items-center !gap-3">
                                                                 {isDirty && !isApproved && (
                                                                      <button
                                                                           className="!px-3 !py-1 !bg-emerald-500 !text-white !text-[10px] !font-bold !rounded-full hover:!bg-emerald-600 disabled:!bg-gray-300 !transition-all !shadow-sm active:!scale-95"
                                                                           disabled={seg.isSaving}
                                                                           onClick={() => saveSegment(seg, idx)}
                                                                      >
                                                                           {seg.isSaving ? "Saving..." : "Commit Change"}
                                                                      </button>
                                                                 )}
                                                                 <span className="!text-[10px] !font-mono !text-gray-400">{seg.start_time}s – {seg.end_time}s</span>
                                                            </div>
                                                       </div>
                                                       <textarea
                                                            className="!w-full !p-0 !text-[14px] !border-none !outline-none !bg-transparent !resize-none !font-sans !leading-[1.8] !text-gray-800 focus:!ring-0 disabled:!text-gray-500"
                                                            value={seg.edited_text}
                                                            disabled={isApproved}
                                                            rows={2}
                                                            onChange={(e) => {
                                                                 handleEditChange(idx, e.target.value);
                                                                 e.target.style.height = "auto";
                                                                 e.target.style.height = `${e.target.scrollHeight}px`;
                                                            }}
                                                            onFocus={(e) => {
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
               </div>

               {/* Bottom Sticky Action Bar */}
               {!isApproved && segments.length > 0 && (
                    <div className="!fixed !bottom-8 !left-1/2 !-translate-x-1/2 !w-[90%] !max-w-[700px] !bg-[#2c3e50]/95 !backdrop-blur-md !p-4 !rounded-[24px] !shadow-2xl !z-[1000] !border !border-white/10">
                         <div className="!flex !justify-between !items-center !px-4">
                              <div className="!hidden sm:!block">
                                   <p className="!text-white/60 !text-[9px] !uppercase !tracking-[0.2em] !font-bold">Audit Completion</p>
                                   <p className="!text-white !text-[13px] !font-medium">Seal transcript for official record</p>
                              </div>
                              <div className="!flex !gap-3 !w-full sm:!w-auto">
                                   <button
                                        onClick={approveTranscript}
                                        className="!flex-1 sm:!flex-none !px-10 !py-4 !bg-emerald-500 !text-white !rounded-[18px] !font-bold hover:!bg-emerald-600 !transition-all !shadow-lg active:!scale-95 !flex !items-center !justify-center !gap-3"
                                   >
                                        <span>🖋️</span> Finalize & Seal Transcript
                                   </button>
                                   <button
                                        onClick={() => navigate(-1)}
                                        className="!px-6 !py-4 !text-white/70 !rounded-[18px] !font-bold hover:!bg-white/10 !transition-all"
                                   >
                                        Later
                                   </button>
                              </div>
                         </div>
                    </div>
               )}

               <Footer />
          </div>
     );
}
