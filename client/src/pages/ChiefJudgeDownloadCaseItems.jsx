import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { apiGet } from "../utils/api";
import Footer from "../components/footer";

export default function ChiefJudgeDownloadCaseItems() {
     const [ordersheets, setOrdersheets] = useState([]);
     const [search, setSearch] = useState("");
     const [caseTypes, setCaseTypes] = useState([]);
     const [selectedType, setSelectedType] = useState("");
     const [user, setUser] = useState(null);
     const navigate = useNavigate();

     useEffect(() => {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (!storedUser) {
               navigate("/");
               return;
          }
          setUser(storedUser);

          apiGet("/api/cases/completed-all")
               .then((data) => {
                    if (data.success) setOrdersheets(data.data);
               })
               .catch((err) => console.error("❌ Error loading Ordersheets:", err));

          apiGet("/api/courts/types").then(setCaseTypes).catch(console.error);
     }, [navigate]);

     const filteredOrdersheets = ordersheets.filter((t) => {
          const caseNumber = (t.case_id || "").toString().toLowerCase();
          const title = (t.case_title || "").toLowerCase();
          const typeMatch = !selectedType || (t.case_type || "").toLowerCase() === selectedType.toLowerCase();
          const searchMatch = !search || caseNumber.includes(search.toLowerCase()) || title.includes(search.toLowerCase());
          return typeMatch && searchMatch;
     });

     const downloadFile = (url, filename) => {
          if (!url) {
               alert("❌ File not available for this record");
               return;
          }
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
     };

     if (!user) return null;

     return (
          <div className="!w-full !min-h-screen !flex !flex-col ![background-color:#f5f7f9] ![font-family:Inter,sans-serif]">
               <Header user={user} />

               <div className="!flex-1 !p-[20px] lg:!p-[40px]">
                    {/* Breadcrumb */}
                    <div className="!max-w-[1200px] !mx-auto !flex !items-center !gap-2 !mb-8 !text-[13px]">
                         <a href="#" onClick={(e) => { e.preventDefault(); navigate("/chiefJudge-dashboard"); }} className="!text-blue-600 hover:!underline">Dashboard</a>
                         <span className="!text-gray-400">/</span>
                         <span className="!text-gray-600 !font-semibold">Archive Downloads</span>
                    </div>

                    <div className="!max-w-[1200px] !mx-auto">
                         <div className="!mb-8">
                              <h1 className="!text-[1.8rem] !font-bold !text-[#2c3e50] !m-0">Legal Archive Repository</h1>
                              <p className="!text-gray-500 !mt-1">Retrieve transcripts, ordersheets, and recordings for concluded proceedings</p>
                         </div>

                         {/* Search & Filter Bar */}
                         <div className="!bg-white !p-4 !rounded-[12px] !shadow-sm !border !border-gray-100 !mb-8 !flex !flex-col md:!flex-row !gap-4 !items-center">
                              <div className="!relative !flex-1 !w-full">
                                   <span className="!absolute !left-3 !top-1/2 !-translate-y-1/2 !text-gray-400">🔍</span>
                                   <input
                                        type="text"
                                        className="!w-full !pl-10 !pr-4 !py-[12px] !border !rounded-[10px] !bg-gray-50 focus:!bg-white focus:!border-[#2c3e50] !outline-none !text-[14px]"
                                        placeholder="Search by case code or description..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                   />
                              </div>
                              <select 
                                   className="!w-full md:!w-[200px] !p-[12px] !border !rounded-[10px] !bg-gray-50 focus:!bg-white !outline-none !text-[14px]"
                                   value={selectedType}
                                   onChange={(e) => setSelectedType(e.target.value)}
                              >
                                   <option value="">All Jurisdictions</option>
                                   {caseTypes.map(t => (
                                        <option key={t.type_id || t.id} value={t.type_name || t.name}>{t.type_name || t.name}</option>
                                    ))}
                              </select>
                         </div>

                         {/* Results Grid/Table */}
                         <div className="!bg-white !rounded-[16px] !shadow-xl !overflow-hidden !border !border-gray-100">
                              <div className="!hidden md:!block">
                                   <table className="!w-full !text-left">
                                        <thead>
                                             <tr className="!bg-[#2c3e50] !text-white">
                                                  <th className="!p-[18px] !text-[12px] !uppercase !tracking-wider">Case Reference</th>
                                                  <th className="!p-[18px] !text-[12px] !uppercase !tracking-wider">Nature of Case</th>
                                                  <th className="!p-[18px] !text-[12px] !uppercase !tracking-wider">Parties Involved</th>
                                                  <th className="!p-[18px] !text-right !text-[12px] !uppercase !tracking-wider !pr-[30px]">Archive Artifacts</th>
                                             </tr>
                                        </thead>
                                        <tbody className="!divide-y !divide-gray-100">
                                             {filteredOrdersheets.length === 0 ? (
                                                  <tr>
                                                       <td colSpan="4" className="!p-20 !text-center !text-gray-400 !italic">No archived records found matching your criteria</td>
                                                  </tr>
                                             ) : (
                                                  filteredOrdersheets.map((t) => (
                                                       <tr key={t.case_id} className="hover:!bg-[#f8fafc] !transition-colors">
                                                            <td className="!p-[18px]">
                                                                 <div className="!font-bold !text-[#2c3e50]">{t.case_id}</div>
                                                                 <div className="!text-[11px] !text-gray-400 !font-mono">{new Date().getFullYear()} Archive</div>
                                                            </td>
                                                            <td className="!p-[18px]">
                                                                 <span className="!px-2 !py-1 !rounded !text-[10px] !font-bold !bg-blue-50 !text-blue-600 !uppercase">{t.case_type}</span>
                                                                 <div className="!mt-1 !text-[13px] !font-medium !text-gray-600 !max-w-[200px] !truncate">{t.case_title}</div>
                                                            </td>
                                                            <td className="!p-[18px]">
                                                                 <div className="!flex !flex-col !text-[12px]">
                                                                      <span className="!font-bold !text-gray-700">{t.case_party1}</span>
                                                                      <span className="!text-[10px] !text-gray-300 !font-bold !my-0.5">VS</span>
                                                                      <span className="!font-bold !text-gray-700">{t.case_party2}</span>
                                                                 </div>
                                                            </td>
                                                            <td className="!p-[18px] !text-right !pr-[30px]">
                                                                 <div className="!flex !justify-end !gap-2">
                                                                      <ArchiveButton icon="📄" label="Ordersheet" onClick={() => downloadFile(t.ordersheet_url, `Order_${t.case_id}.pdf`)} disabled={!t.ordersheet_url} />
                                                                      <ArchiveButton icon="✍️" label="Transcript" onClick={() => downloadFile(t.transcript_url, `Transcript_${t.case_id}.pdf`)} disabled={!t.transcript_url} />
                                                                      <ArchiveButton icon="🔉" label="Audio" onClick={() => downloadFile(t.recording_url, `Audio_${t.case_id}.wav`)} disabled={!t.recording_url} color="emerald" />
                                                                 </div>
                                                            </td>
                                                       </tr>
                                                  ))
                                             )}
                                        </tbody>
                                   </table>
                              </div>

                              {/* Mobile View */}
                              <div className="md:!hidden !p-4 !space-y-4">
                                   {filteredOrdersheets.map(t => (
                                        <div key={t.case_id} className="!p-5 !bg-gray-50 !rounded-[12px] !border !border-gray-100">
                                             <div className="!flex !justify-between !items-start !mb-4">
                                                  <div>
                                                       <div className="!font-bold !text-[#2c3e50]">{t.case_id}</div>
                                                       <span className="!text-[10px] !bg-blue-100 !text-blue-600 !px-2 !py-0.5 !rounded !uppercase !font-bold">{t.case_type}</span>
                                                  </div>
                                             </div>
                                             <div className="!text-[13px] !text-gray-600 !mb-4 !line-clamp-2">{t.case_title}</div>
                                             <div className="!flex !flex-wrap !gap-2 !mt-4">
                                                  <ArchiveButton icon="📄" label="Order" onClick={() => downloadFile(t.ordersheet_url, `Order_${t.case_id}.pdf`)} disabled={!t.ordersheet_url} />
                                                  <ArchiveButton icon="✍️" label="Transcript" onClick={() => downloadFile(t.transcript_url, `Transcript_${t.case_id}.pdf`)} disabled={!t.transcript_url} />
                                                  <ArchiveButton icon="🔉" label="Audio" onClick={() => downloadFile(t.recording_url, `Audio_${t.case_id}.wav`)} disabled={!t.recording_url} color="emerald" />
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

function ArchiveButton({ icon, label, onClick, disabled, color = "blue" }) {
     const colorMap = {
          blue: "hover:!bg-blue-500 hover:!text-white !text-blue-600 !border-blue-200 !bg-blue-50",
          emerald: "hover:!bg-[#28a745] hover:!text-white !text-[#28a745] !border-green-200 !bg-green-50"
     };

     return (
          <button 
               onClick={onClick}
               disabled={disabled}
               className={`!flex !items-center !gap-1.5 !px-3 !py-[10px] !rounded-[8px] !text-[11px] !font-bold !border !transition-all active:!scale-[0.95] ${disabled ? '!opacity-30 !cursor-not-allowed !bg-gray-100 !text-gray-400 !border-gray-200' : colorMap[color]}`}
          >
               <span className="!text-[14px]">{icon}</span>
               {label}
          </button>
     );
}
