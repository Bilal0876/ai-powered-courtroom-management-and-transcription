import React, { useEffect, useRef, useState } from "react";
import Header from "../components/header";
import { useNavigate, useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { API_BASE_URL } from "../config";
import { apiGet } from "../utils/api";
import Footer from "../components/footer";

export default function JudgeReviewOrdersheet() {
     const navigate = useNavigate();
     const location = useLocation();
     const editorRef = useRef(null);

     const [ordersheet, setOrdersheet] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [user, setUser] = useState(null);

     const { selectedCase: rawCase } = location.state || {};
     const selectedCase = rawCase
          ? {
               case_id: rawCase.case_id,
               caseNumber: rawCase.caseNumber || rawCase.case_id,
               caseCode: rawCase.case_code || rawCase.case_id,
               caseTitle: rawCase.case_title,
               caseType: rawCase.case_type,
               party1: rawCase.party1 || rawCase.party_1 || "",
               party2: rawCase.party2 || rawCase.party_2 || "",
               hearingDate: rawCase.hearingDate || rawCase.submitted_at || "",
               hearingTime: rawCase.hearingTime || "",
          }
          : null;

     useEffect(() => {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (!storedUser) {
               navigate("/");
               return;
          }
          setUser(storedUser);

          if (!rawCase?.case_id) {
               setError("No case context provided for matching.");
               setLoading(false);
               return;
          }

          apiGet(`/api/ordersheets/review/${rawCase.case_id}`)
               .then(data => {
                    setOrdersheet(data.ordersheet);
                    setLoading(false);
               })
               .catch(err => {
                    setError(err.message);
                    setLoading(false);
               });
     }, [rawCase?.case_id, navigate]);

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
               formData.append("judgeName", user.name);

               if (pdfBlob) {
                    formData.append(
                         "pdf",
                         pdfBlob,
                         `Ordersheet_${selectedCase.caseNumber}.pdf`
                    );
               }

               const token = localStorage.getItem('access_token');
               const res = await fetch(`${API_BASE_URL}/api/ordersheets/approve`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
               });

               if (!res.ok) throw new Error(`Status Correction Error: ${res.status}`);

               alert(`⚖️ Ordersheet ${status.toUpperCase()} successfully.`);
               navigate("/judge-dashboard");

          } catch (err) {
               console.error("❌ Approval failed:", err);
               alert(err.message);
          }
     };

     const exportOrdersheetToPDF = async () => {
          if (!editorRef.current) return null;
          const element = editorRef.current;

          const opt = {
               margin: 0.5,
               image: { type: "jpeg", quality: 0.98 },
               html2canvas: { scale: 2, scrollY: 0 },
               jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
          };

          const worker = html2pdf().set(opt).from(element);
          // await worker.save(`Ordersheet_${selectedCase.caseNumber}.pdf`); // Optional auto-download
          const pdfBlob = await worker.outputPdf("blob");
          return pdfBlob;
     };

     if (loading) return (
          <div className="!min-h-screen !flex !items-center !justify-center !bg-gray-50">
               <div className="!animate-spin !rounded-full !h-12 !w-12 !border-b-2 !border-[#2c3e50]"></div>
          </div>
     );

     if (error || !ordersheet) return (
          <div className="!min-h-screen !flex !flex-col !items-center !justify-center !bg-[#f8fafc] !p-[20px] !text-center">
               <div className="!text-[4rem] !mb-4">📂</div>
               <h2 className="!text-[#2c3e50] !text-[1.8rem] !font-bold !mb-[10px]">Document Not Found</h2>
               <p className="!text-gray-500 !mb-[30px] !max-w-[400px]">{error || "The requested ordersheet could not be retrieved from the central repository."}</p>
               <button 
                    onClick={() => navigate("/judge-dashboard")}
                    className="!px-8 !py-3 !bg-[#2c3e50] !text-white !rounded-xl hover:!bg-[#1a252f] !transition-all !font-bold"
               >
                    Return to Docket
               </button>
          </div>
     );

     return (
          <div className="!w-full !min-h-screen !flex !flex-col ![background-color:#f1f5f9] ![font-family:Inter,sans-serif]">
               <Header user={user} />

               <div className="!flex-1 !p-[20px] lg:!p-[40px]">
                    {/* Breadcrumb */}
                    <div className="!max-w-[1000px] !mx-auto !flex !items-center !gap-2 !mb-8 !text-[13px]">
                         <a href="#" onClick={(e) => { e.preventDefault(); navigate("/judge-dashboard"); }} className="!text-blue-600 hover:!underline">Dashboard</a>
                         <span className="!text-gray-400">/</span>
                         <a href="#" onClick={(e) => { e.preventDefault(); navigate(-1); }} className="!text-blue-600 hover:!underline">Pending Review</a>
                         <span className="!text-gray-400">/</span>
                         <span className="!text-gray-600 !font-semibold">Ordersheet Audit</span>
                    </div>

                    <div className="!max-w-[1000px] !mx-auto">
                         {/* Case Details Header */}
                         <div className="!bg-white !rounded-[20px] !shadow-sm !p-[30px] !mb-10 !border !border-gray-100 !relative !overflow-hidden">
                              <div className="!absolute !top-0 !right-0 !bg-[#2c3e50] !text-white !px-4 !py-1 !text-[10px] !font-bold !uppercase !tracking-tighter !rounded-bl-xl">Official Review</div>
                              <div className="!flex !flex-col md:!flex-row !justify-between !items-start md:!items-center !gap-4">
                                   <div>
                                        <div className="!flex !items-center !gap-3 !mb-1">
                                             <h2 className="!text-[#2c3e50] !font-black !text-[1.4rem] !m-0">{selectedCase.caseCode}</h2>
                                             <span className="!px-2 !py-0.5 !bg-blue-50 !text-blue-600 !rounded !text-[10px] !font-bold !uppercase">{selectedCase.caseType}</span>
                                        </div>
                                        <p className="!text-gray-500 !text-[14px] !font-medium">{selectedCase.caseTitle || "Untitled Legal Matter"}</p>
                                   </div>
                                   <div className="!text-left md:!text-right">
                                        <div className="!text-[12px] !font-bold !text-gray-400 !uppercase !tracking-widest !mb-1">Active Litigants</div>
                                        <div className="!text-[#2c3e50] !text-[13px] !font-bold">{selectedCase.party1} <span className="!text-gray-300 !mx-1">VS</span> {selectedCase.party2}</div>
                                   </div>
                              </div>
                         </div>

                         {/* Editor / Parchment View */}
                         <div className="!bg-[#ced4da] !p-[20px] md:!p-[60px] !rounded-[24px] !shadow-inner !mb-[120px] !flex !justify-center">
                              <div className="!w-full !max-w-[850px] !bg-white !shadow-[0_20px_50px_rgba(0,0,0,0.15)] !p-[40px] md:!p-[80px] !min-h-[1100px] !rounded-[4px] !border !border-gray-300 !relative">
                                   {/* Legal Seal Placeholder */}
                                   <div className="!absolute !top-10 !right-10 !w-24 !h-24 !opacity-10">
                                        <svg viewBox="0 0 100 100" className="!fill-[#2c3e50]">
                                             <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
                                             <text x="50" y="55" fontSize="12" textAnchor="middle" fontWeight="bold">JUSTITIA</text>
                                        </svg>
                                   </div>

                                   <div
                                        ref={editorRef}
                                        contentEditable
                                        suppressContentEditableWarning
                                        dangerouslySetInnerHTML={{ __html: ordersheet.content_html }}
                                        className="!w-full !min-h-[1000px] !outline-none !font-serif !text-[17px] !leading-[1.9] !text-black prose prose-slate max-w-none"
                                        style={{ fontVariantLigatures: "none", whiteSpace: "pre-wrap" }}
                                   />
                              </div>
                         </div>
                    </div>
               </div>

               {/* Modern Sticky Action Bar */}
               <div className="!fixed !bottom-6 !left-1/2 !-translate-x-1/2 !w-[90%] !max-w-[900px] !bg-[#2c3e50]/95 !backdrop-blur-md !p-4 !rounded-[24px] !shadow-2xl !z-[1000] !border !border-white/10">
                    <div className="!flex !flex-col md:!flex-row !justify-between !items-center !gap-4">
                         <div className="!hidden md:!block !pl-4">
                              <p className="!text-white/60 !text-[9px] !uppercase !tracking-[0.2em] !font-bold">Judicial Attestation</p>
                              <p className="!text-white !text-[13px] !font-medium">Verify content before final seal</p>
                         </div>
                         <div className="!flex !gap-3 !w-full md:!w-auto">
                              <button
                                   onClick={() => submitDecision("approved")}
                                   className="!flex-1 md:!flex-none !px-8 !py-4 !bg-emerald-500 !text-white !rounded-[18px] !font-bold hover:!bg-emerald-600 !transition-all !shadow-lg active:!scale-95 !flex !items-center !justify-center !gap-2"
                              >
                                   <span>⚖️</span> Approve & Seal
                              </button>
                              <button
                                   onClick={() => submitDecision("rejected")}
                                   className="!flex-1 md:!flex-none !px-8 !py-4 !bg-rose-500 !text-white !rounded-[18px] !font-bold hover:!bg-rose-600 !transition-all !shadow-lg active:!scale-95 !flex !items-center !justify-center !gap-2"
                              >
                                   <span>❌</span> Reject
                              </button>
                              <button
                                   onClick={() => navigate(-1)}
                                   className="!px-6 !py-4 !text-white/70 !rounded-[18px] !font-bold hover:!bg-white/10 !transition-all"
                              >
                                   Discard
                              </button>
                         </div>
                    </div>
               </div>

               <Footer />
          </div>
     );
}
