import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { apiGet } from "../utils/api";
import Footer from "../components/footer";

export default function JudgePendingTranscripts() {
     const [transcripts, setTranscripts] = useState([]);
     const [search, setSearch] = useState("");
     const [caseType, setCaseType] = useState("");
     const [caseTypes, setCaseTypes] = useState([]);
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);
     const navigate = useNavigate();

     useEffect(() => {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (!storedUser) {
               navigate("/");
               return;
          }
          setUser(storedUser);

          apiGet("/api/transcripts/pending")
               .then((data) => {
                    if (data.success) setTranscripts(data.data || []);
                    setLoading(false);
               })
               .catch((err) => {
                    console.error("❌ Error loading transcripts:", err);
                    setLoading(false);
               });

          apiGet("/api/courts/types")
               .then((data) => setCaseTypes(data))
               .catch((err) => console.error("Error fetching case types:", err));
     }, [navigate]);

     const filteredTranscripts = transcripts.filter((t) => {
          const caseCode = (t.case_code || "").toString().toLowerCase();
          const title = (t.case_title || "").toLowerCase();
          const caseTypeVal = (t.case_type || "").toLowerCase();

          return (
               (search === "" ||
                    caseCode.includes(search.toLowerCase()) ||
                    title.includes(search.toLowerCase())) &&
               (caseType === "" || caseTypeVal === caseType.toLowerCase())
          );
     });

     if (loading) return (
          <div className="!min-h-screen !flex !items-center !justify-center !bg-gray-50">
               <div className="!animate-spin !rounded-full !h-12 !w-12 !border-b-2 !border-[#2c3e50]"></div>
          </div>
     );

     return (
          <div className="!w-full !min-h-screen !flex !flex-col ![background-color:#f8fafc] ![font-family:Inter,sans-serif]">
               <Header user={user} />

               <div className="!flex-1 !p-[20px] lg:!p-[40px]">
                    {/* Breadcrumb */}
                    <div className="!max-w-[1300px] !mx-auto !flex !items-center !gap-2 !mb-8 !text-[13px]">
                         <a href="#" onClick={(e) => { e.preventDefault(); navigate("/judge-dashboard"); }} className="!text-blue-600 hover:!underline">Dashboard</a>
                         <span className="!text-gray-400">/</span>
                         <span className="!text-gray-600 !font-semibold">Pending Transcripts</span>
                    </div>

                    <div className="!max-w-[1300px] !mx-auto">
                         <div className="!mb-8">
                              <h1 className="!text-[1.8rem] !font-bold !text-[#2c3e50] !m-0">Transcript Audit Queue</h1>
                              <p className="!text-gray-500 !mt-1">Review and formally approve case verbatim records for the judicial record</p>
                         </div>

                         <div className="!bg-white !rounded-[16px] !shadow-xl !overflow-hidden !border !border-gray-100">
                              {/* Filter Bar */}
                              <div className="!bg-[#fcfdfd] !p-[25px] !border-b !border-gray-100">
                                   <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-4">
                                        <div className="!relative">
                                             <span className="!absolute !left-3 !top-1/2 !-translate-y-1/2 !text-gray-400">🔍</span>
                                             <input
                                                  type="text"
                                                  className="!w-full !pl-10 !pr-4 !py-[12px] !border !rounded-[10px] !bg-white focus:!border-[#2c3e50] !outline-none !text-[14px]"
                                                  placeholder="Find by Case # or Title..."
                                                  value={search}
                                                  onChange={(e) => setSearch(e.target.value)}
                                             />
                                        </div>
                                        <select
                                             className="!w-full !p-[12px] !border !rounded-[10px] !bg-white focus:!border-[#2c3e50] !outline-none !text-[14px]"
                                             value={caseType}
                                             onChange={(e) => setCaseType(e.target.value)}
                                        >
                                             <option value="">All Case Types</option>
                                             {caseTypes.map((ct) => (
                                                  <option key={ct.type_id || ct.id} value={ct.type_name || ct.name}>
                                                       {ct.type_name || ct.name}
                                                  </option>
                                             ))}
                                        </select>
                                        <button
                                             className="!py-[12px] !bg-gray-100 !text-gray-600 !rounded-[10px] !font-bold hover:!bg-gray-200 !transition-all !text-[13px]"
                                             onClick={() => {
                                                  setSearch("");
                                                  setCaseType("");
                                             }}
                                        >
                                             Clear All Filters
                                        </button>
                                   </div>
                              </div>

                              {/* Desktop Table View */}
                              <div className="!hidden lg:!block">
                                   <table className="!w-full !text-left">
                                        <thead>
                                             <tr className="!bg-gray-50/50 !text-gray-400 !text-[11px] !font-bold !uppercase !tracking-wider">
                                                  <th className="!p-[18px]">Case Reference</th>
                                                  <th className="!p-[18px]">Litigants</th>
                                                  <th className="!p-[18px]">Submission Source</th>
                                                  <th className="!p-[18px]">Submission Date</th>
                                                  <th className="!p-[18px] !text-right !pr-[30px]">Verification</th>
                                             </tr>
                                        </thead>
                                        <tbody className="!divide-y !divide-gray-50">
                                             {filteredTranscripts.length === 0 ? (
                                                  <tr>
                                                       <td colSpan="5" className="!p-20 !text-center !text-gray-400 !italic">✅ No pending transcripts found for verification</td>
                                                  </tr>
                                             ) : (
                                                  filteredTranscripts.map((t) => (
                                                       <tr key={t.case_id} className="hover:!bg-[#f8fafc] !transition-colors">
                                                            <td className="!p-[18px]">
                                                                 <div className="!font-bold !text-[#2c3e50] !text-[14px]">{t.case_code}</div>
                                                                 <div className="!text-[12px] !text-gray-400 !mt-0.5">{t.case_title}</div>
                                                                 <div className="!inline-block !px-2 !py-0.5 !bg-blue-50 !text-blue-600 !rounded !text-[9px] !font-bold !uppercase !mt-1">{t.case_type}</div>
                                                            </td>
                                                            <td className="!p-[18px]">
                                                                 <div className="!font-bold !text-gray-700 !text-[13px]">{t.party1}</div>
                                                                 <div className="!text-[10px] !text-gray-400 !my-0.5">VS</div>
                                                                 <div className="!font-bold !text-gray-700 !text-[13px]">{t.party2}</div>
                                                            </td>
                                                            <td className="!p-[18px]">
                                                                 <div className="!text-[13px] !font-medium !text-gray-600">{t.submitted_by}</div>
                                                                 <div className="!text-[11px] !text-gray-400">Official Stenographer</div>
                                                            </td>
                                                            <td className="!p-[18px]">
                                                                 <div className="!text-[13px] !font-bold !text-gray-700">{new Date(t.submitted_at).toLocaleDateString()}</div>
                                                                 <div className="!text-[11px] !text-gray-400">{new Date(t.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                            </td>
                                                            <td className="!p-[18px] !text-right !pr-[30px]">
                                                                 <button
                                                                      className="!px-6 !py-3 !bg-[#28a745] !text-white !rounded-xl !font-bold !text-[12px] hover:!bg-[#1e7e34] !transition-all !shadow-md active:!scale-95"
                                                                      onClick={() => navigate("/judge-dashboard/review-transcripts", { state: { selectedCase: t } })}
                                                                 >
                                                                      Review Verbatim
                                                                 </button>
                                                            </td>
                                                       </tr>
                                                  ))
                                             )}
                                        </tbody>
                                   </table>
                              </div>

                              {/* Mobile List View */}
                              <div className="lg:!hidden !p-4 !space-y-4">
                                   {filteredTranscripts.map((t) => (
                                        <div key={t.case_id} className="!bg-[#fcfcfc] !border !border-gray-100 !rounded-[20px] !p-6 !shadow-sm">
                                             <div className="!flex !justify-between !items-start !mb-4">
                                                  <div>
                                                       <div className="!text-[11px] !font-bold !text-blue-600 !uppercase !tracking-widest">{t.case_code}</div>
                                                       <div className="!text-[16px] !font-black !text-[#2c3e50] !mt-1">{t.case_title}</div>
                                                  </div>
                                                  <div className="!px-2 !py-1 !bg-emerald-50 !text-emerald-700 !rounded !text-[10px] !font-bold !uppercase">Pending</div>
                                             </div>
                                             <div className="!space-y-4 !mb-6">
                                                  <div className="!flex !items-center !gap-3">
                                                       <div className="!text-[18px]">⚖️</div>
                                                       <div>
                                                            <div className="!text-[10px] !text-gray-400 !uppercase !font-bold">Parties</div>
                                                            <div className="!text-[13px] !font-bold !text-gray-700">{t.party1} vs {t.party2}</div>
                                                       </div>
                                                  </div>
                                                  <div className="!flex !items-center !gap-3">
                                                       <div className="!text-[18px]">👤</div>
                                                       <div>
                                                            <div className="!text-[10px] !text-gray-400 !uppercase !font-bold">Stenographer</div>
                                                            <div className="!text-[13px] !font-bold !text-gray-700">{t.submitted_by}</div>
                                                       </div>
                                                  </div>
                                                  <div className="!flex !items-center !gap-3">
                                                       <div className="!text-[18px]">📅</div>
                                                       <div>
                                                            <div className="!text-[10px] !text-gray-400 !uppercase !font-bold">Submitted</div>
                                                            <div className="!text-[13px] !font-bold !text-gray-700">{new Date(t.submitted_at).toLocaleDateString()} at {new Date(t.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                       </div>
                                                  </div>
                                             </div>
                                             <button
                                                  className="!w-full !py-4 !bg-[#28a745] !text-white !rounded-xl !font-black !text-[14px] hover:!bg-[#1e7e34] !transition-all !shadow-lg active:!scale-[0.98]"
                                                  onClick={() => navigate("/judge-dashboard/review-transcripts", { state: { selectedCase: t } })}
                                             >
                                                  Review & Verify Verbatim
                                             </button>
                                        </div>
                                   ))}
                              </div>
                         </div>
                    </div>
               </div>

               <Footer />
          </div>
     );
}
