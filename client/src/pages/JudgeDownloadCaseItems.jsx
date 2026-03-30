import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { apiGet } from "../utils/api";
import Footer from "../components/footer";

export default function JudgeDownloadCaseItems() {
     const [ordersheets, setOrdersheets] = useState([]);
     const [search, setSearch] = useState("");
     const [caseType, setCaseType] = useState("");
     const [caseTypes, setCaseTypes] = useState([]);
     const [user, setUser] = useState(null);
     const navigate = useNavigate();

     useEffect(() => {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (!storedUser) {
               navigate("/");
               return;
          }
          setUser(storedUser);

          apiGet("/api/hearings/judge")
            .then((data) => {
                 const completed = (data || []).filter(c => (c.status || "").toLowerCase() === 'completed');
                 setOrdersheets(completed);
            })
            .catch((err) => console.error("❌ Error loading cases:", err));

          apiGet("/api/courts/types")
            .then(setCaseTypes)
            .catch(console.error);
     }, [navigate]);

     const filteredOrdersheets = ordersheets.filter((t) => {
          const caseCode = (t.caseNumber || t.case_id || "").toString().toLowerCase();
          const title = (t.caseTitle || "").toLowerCase();
          const caseTypeVal = (t.caseType || "").toLowerCase();

          return (
               (search === "" || caseCode.includes(search.toLowerCase()) || title.includes(search.toLowerCase())) &&
               (caseType === "" || caseTypeVal === caseType.toLowerCase())
          );
     });

     const downloadFile = (url, filename) => {
          if (!url) {
               alert("⚠️ This legal artifact is not yet available for download.");
               return;
          }
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
     };

     if (!user) return (
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
                         <span className="!text-gray-600 !font-semibold">Judicial Archives</span>
                    </div>

                    <div className="!max-w-[1300px] !mx-auto">
                         <div className="!mb-8">
                              <h1 className="!text-[1.8rem] !font-bold !text-[#2c3e50] !m-0">Concluded Case Repository</h1>
                              <p className="!text-gray-500 !mt-1">Retrieve transcripts, ordersheets, and recordings for closed proceedings</p>
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
                                                  placeholder="Search by Case # or Title..."
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
                                             Reset Repository Filters
                                        </button>
                                   </div>
                              </div>

                              {/* Desktop Table */}
                              <div className="!hidden lg:!block">
                                   <table className="!w-full !text-left">
                                        <thead>
                                             <tr className="!bg-gray-50/50 !text-gray-400 !text-[11px] !font-bold !uppercase !tracking-wider">
                                                  <th className="!p-[18px]">Judicial Reference</th>
                                                  <th className="!p-[18px]">Litigant Parties</th>
                                                  <th className="!p-[18px] !text-right !pr-[30px]">Archive Artifacts</th>
                                             </tr>
                                        </thead>
                                        <tbody className="!divide-y !divide-gray-50">
                                             {filteredOrdersheets.length === 0 ? (
                                                  <tr>
                                                       <td colSpan="3" className="!p-20 !text-center !text-gray-400 !italic">No archived records found matching your current filters</td>
                                                  </tr>
                                             ) : (
                                                  filteredOrdersheets.map((t) => (
                                                       <tr key={t.id || t.case_id} className="hover:!bg-[#f8fafc] !transition-colors">
                                                            <td className="!p-[18px]">
                                                                 <div className="!font-bold !text-[#2c3e50] !text-[14px]">{t.caseNumber || t.case_code}</div>
                                                                 <div className="!text-[12px] !text-gray-400 !mt-0.5">{t.caseTitle} | <span className="!uppercase !font-bold !text-[10px] !text-blue-500">{t.caseType}</span></div>
                                                            </td>
                                                            <td className="!p-[18px]">
                                                                 <div className="!font-bold !text-gray-700 !text-[13px]">{t.party1}</div>
                                                                 <div className="!text-[11px] !text-gray-400 !font-bold !my-0.5">VS.</div>
                                                                 <div className="!font-bold !text-gray-700 !text-[13px]">{t.party2}</div>
                                                            </td>
                                                            <td className="!p-[18px] !text-right !pr-[30px]">
                                                                 <div className="!flex !justify-end !gap-2">
                                                                      <ArchiveButton icon="📄" label="Ordersheet" onClick={() => downloadFile(t.ordersheet_url, `Order_${t.caseNumber}.pdf`)} disabled={!t.ordersheet_url} />
                                                                      <ArchiveButton icon="✍️" label="Transcript" onClick={() => downloadFile(t.transcript_url, `Transcript_${t.caseNumber}.pdf`)} disabled={!t.transcript_url} />
                                                                      <ArchiveButton icon="🔊" label="Recording" onClick={() => downloadFile(t.recording_url, `Audio_${t.caseNumber}.wav`)} disabled={!t.recording_url} color="emerald" />
                                                                 </div>
                                                            </td>
                                                       </tr>
                                                  ))
                                             )}
                                        </tbody>
                                   </table>
                              </div>

                              {/* Mobile View */}
                              <div className="lg:!hidden !p-4 !space-y-4">
                                   {filteredOrdersheets.map((t) => (
                                        <div key={t.id || t.case_id} className="!bg-[#fcfcfc] !border !border-gray-100 !rounded-[12px] !p-5 !shadow-sm">
                                             <div className="!mb-4">
                                                  <div className="!text-[11px] !font-bold !text-blue-600 !uppercase !tracking-widest">{t.caseNumber || t.case_code}</div>
                                                  <div className="!text-[15px] !font-bold !text-[#2c3e50] !mt-1">{t.caseTitle}</div>
                                                  <div className="!text-[12px] !text-gray-500 !mt-2 !flex !flex-col !gap-1">
                                                       <span><span className="!font-bold">Jurisdiction:</span> {t.caseType}</span>
                                                       <span><span className="!font-bold">Parties:</span> {t.party1} vs {t.party2}</span>
                                                  </div>
                                             </div>
                                             <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-2 !mt-4">
                                                  <ArchiveButton icon="📄" label="Ordersheet (PDF)" onClick={() => downloadFile(t.ordersheet_url, `Order_${t.caseNumber}.pdf`)} disabled={!t.ordersheet_url} fullWidth />
                                                  <ArchiveButton icon="✍️" label="Transcript (PDF)" onClick={() => downloadFile(t.transcript_url, `Transcript_${t.caseNumber}.pdf`)} disabled={!t.transcript_url} fullWidth />
                                                  <ArchiveButton icon="🔊" label="Audio Recording (WAV)" onClick={() => downloadFile(t.recording_url, `Audio_${t.caseNumber}.wav`)} disabled={!t.recording_url} color="emerald" fullWidth />
                                             </div>
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

function ArchiveButton({ icon, label, onClick, disabled, color = "blue", fullWidth = false }) {
     const colorMap = {
          blue: "hover:!bg-blue-500 hover:!text-white !text-blue-600 !border-blue-200 !bg-blue-50",
          emerald: "hover:!bg-[#28a745] hover:!text-white !text-[#28a745] !border-green-200 !bg-green-50"
     };

     return (
          <button 
               onClick={onClick}
               disabled={disabled}
               className={`!flex !items-center !justify-center !gap-2 !px-4 !py-[12px] !rounded-[10px] !text-[11px] !font-bold !border !transition-all active:!scale-[0.95] ${fullWidth ? '!w-full' : ''} ${disabled ? '!opacity-30 !cursor-not-allowed !bg-gray-50 !text-gray-400 !border-gray-200' : colorMap[color]}`}
          >
               <span className="!text-[16px]">{icon}</span>
               {label}
          </button>
     );
}
