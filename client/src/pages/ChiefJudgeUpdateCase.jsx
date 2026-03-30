import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { apiGet, apiPost } from "../utils/api";
import Footer from "../components/footer";

export default function ChiefJudgeManageCases() {
     const [cases, setCases] = useState([]);
     const [selectedCase, setSelectedCase] = useState(null);
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
          fetchCases();
     }, [navigate]);

     const fetchCases = () => {
          setLoading(true);
          apiGet("/api/cases/cj-cases")
               .then(data => {
                    setCases(data);
                    setLoading(false);
               })
               .catch(err => {
                    console.error("Error fetching cases:", err);
                    setLoading(false);
               });
     };

     const handleDelete = async (c) => {
          if (!window.confirm(`⚠️ Permanently delete case ${c.case_code}? This action cannot be undone.`)) return;

          try {
               const res = await apiPost("/api/cases/delete", { case_id: c.case_id });
               if (res.success) {
                    alert("✅ Case record deleted");
                    fetchCases();
               } else {
                    alert("❌ Error: " + res.message);
               }
          } catch (err) {
               console.error("Delete error:", err);
               alert("❌ Failed to delete case.");
          }
     };

     const handleUpdate = async (e) => {
          e.preventDefault();
          try {
               const res = await apiPost("/api/cases/update", selectedCase);
               if (res.success) {
                    alert("✅ Case record updated successfully");
                    setSelectedCase(null);
                    fetchCases();
               } else {
                    alert("❌ Error: " + res.message);
               }
          } catch (err) {
               console.error("Update error:", err);
               alert("❌ Failed to update case.");
          }
     };

     if (!user || loading) return (
          <div className="!min-h-screen !flex !items-center !justify-center !bg-gray-50">
               <div className="!animate-spin !rounded-full !h-12 !w-12 !border-b-2 !border-[#2c3e50]"></div>
          </div>
     );

     return (
          <div className="!w-full !min-h-screen !flex !flex-col ![background-color:#f8fafc] ![font-family:Inter,sans-serif]">
               <Header user={user} />

               <div className="!flex-1 !p-[20px] lg:!p-[40px]">
                    {/* Breadcrumb */}
                    <div className="!max-w-[1400px] !mx-auto !flex !items-center !gap-2 !mb-8 !text-[13px]">
                         <a href="#" onClick={(e) => { e.preventDefault(); navigate("/chiefJudge-dashboard"); }} className="!text-blue-600 hover:!underline">Dashboard</a>
                         <span className="!text-gray-400">/</span>
                         <span className="!text-gray-600 !font-semibold">Case Modification</span>
                    </div>

                    <div className="!max-w-[1400px] !mx-auto">
                         <div className="!mb-8">
                              <h1 className="!text-[1.8rem] !font-bold !text-[#2c3e50] !m-0">Judicial Record Management</h1>
                              <p className="!text-gray-500 !mt-1">Correct or update details for active and pending legal matters</p>
                         </div>

                         <div className="!bg-white !rounded-[16px] !shadow-xl !overflow-hidden !border !border-gray-100">
                              <div className="!hidden md:!block">
                                   <table className="!w-full !text-left">
                                        <thead>
                                             <tr className="!bg-[#2c3e50] !text-white">
                                                  <th className="!p-[18px] !text-[11px] !uppercase !tracking-wider">Case Code</th>
                                                  <th className="!p-[18px] !text-[11px] !uppercase !tracking-wider">Details & Status</th>
                                                  <th className="!p-[18px] !text-[11px] !uppercase !tracking-wider">Assignments</th>
                                                  <th className="!p-[18px] !text-right !text-[11px] !uppercase !tracking-wider !pr-[30px]">Operations</th>
                                             </tr>
                                        </thead>
                                        <tbody className="!divide-y !divide-gray-100">
                                             {cases.length === 0 ? (
                                                  <tr>
                                                       <td colSpan="4" className="!p-20 !text-center !text-gray-400 !italic">No judicial records available for modification</td>
                                                  </tr>
                                             ) : (
                                                  cases.map(c => (
                                                       <tr key={c.case_id} className="hover:!bg-[#f8fafc] !transition-colors">
                                                            <td className="!p-[18px]">
                                                                 <div className="!font-bold !text-[#2c3e50]">{c.case_code}</div>
                                                                 <div className="!text-[10px] !text-gray-400 !font-mono">Reference ID: {c.case_id}</div>
                                                            </td>
                                                            <td className="!p-[18px]">
                                                                 <div className="!text-[14px] !font-bold !text-gray-700">{c.case_title}</div>
                                                                 <span className={`!inline-block !mt-1 !px-2 !py-0.5 !rounded !text-[10px] !font-bold !uppercase ${
                                                                      c.case_status === 'Active' ? '!bg-green-100 !text-green-600' : '!bg-orange-100 !text-orange-600'
                                                                 }`}>
                                                                      {c.case_status}
                                                                 </span>
                                                            </td>
                                                            <td className="!p-[18px]">
                                                                 <div className="!flex !flex-col !gap-1">
                                                                      <div className="!text-[12px] !text-gray-600"><span className="!font-bold">Judge:</span> {c.judge_code || "Unassigned"}</div>
                                                                      <div className="!text-[12px] !text-gray-600"><span className="!font-bold">Steno:</span> {c.steno_code || "Unassigned"}</div>
                                                                 </div>
                                                            </td>
                                                            <td className="!p-[18px] !text-right !pr-[30px]">
                                                                 <div className="!flex !justify-end !gap-2">
                                                                      <button onClick={() => setSelectedCase(c)} className="!px-4 !py-2 !bg-gray-100 !text-gray-700 !rounded-[8px] !text-[12px] !font-bold hover:!bg-gray-200 !transition-all">Edit Record</button>
                                                                      <button onClick={() => handleDelete(c)} className="!px-4 !py-2 !bg-red-50 !text-red-600 !rounded-[8px] !text-[12px] !font-bold hover:!bg-red-500 hover:!text-white !transition-all">Delete</button>
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
                                   {cases.map(c => (
                                        <div key={c.case_id} className="!p-5 !bg-gray-50 !rounded-[12px] !border !border-gray-100">
                                             <div className="!flex !justify-between !items-start !mb-3">
                                                  <div className="!font-bold !text-[#2c3e50]">{c.case_code}</div>
                                                  <span className="!text-[10px] !bg-green-100 !text-green-600 !px-2 !py-0.5 !rounded !font-bold !uppercase">{c.case_status}</span>
                                             </div>
                                             <div className="!text-[13px] !text-gray-600 !mb-4 !font-medium">{c.case_title}</div>
                                             <div className="!flex !gap-2">
                                                  <button onClick={() => setSelectedCase(c)} className="!flex-1 !py-3 !bg-gray-800 !text-white !rounded-[10px] !text-[12px] !font-bold">Modify</button>
                                                  <button onClick={() => handleDelete(c)} className="!px-4 !py-3 !bg-red-100 !text-red-600 !rounded-[10px] !text-[12px]">🗑️</button>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         </div>
                    </div>
               </div>

               {/* EDIT MODAL */}
               {selectedCase && (
                    <div className="!fixed !inset-0 !z-[1000] !flex !items-center !justify-center !p-4">
                         <div className="!absolute !inset-0 !bg-[#2c3e50]/70 !backdrop-blur-sm" onClick={() => setSelectedCase(null)}></div>
                         <div className="!relative !bg-white !w-full !max-w-[700px] !rounded-[20px] !shadow-2xl !max-h-[90vh] !overflow-y-auto">
                              <div className="!bg-[#2c3e50] !p-[30px] !text-white !sticky !top-0 !z-10">
                                   <div className="!flex !justify-between !items-center">
                                        <h3 className="!text-[1.4rem] !font-bold !m-0">Edit Case Record</h3>
                                        <span className="!bg-white/20 !px-3 !py-1 !rounded !text-[11px] !font-mono">{selectedCase.case_code}</span>
                                   </div>
                              </div>

                              <form className="!p-[35px] !space-y-6" onSubmit={handleUpdate}>
                                   <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-6">
                                        <div className="md:!col-span-2">
                                             <label className="!block !text-[11px] !font-bold !text-gray-400 !uppercase !mb-1.5">Official Case Title</label>
                                             <input className="!w-full !p-[14px] !border !rounded-[12px] !bg-gray-50 focus:!bg-white !outline-none" value={selectedCase.case_title || ""} onChange={e => setSelectedCase({...selectedCase, case_title: e.target.value})} required />
                                        </div>
                                        
                                        <div>
                                             <label className="!block !text-[11px] !font-bold !text-gray-400 !uppercase !mb-1.5">Matrimonial/Case Type</label>
                                             <input className="!w-full !p-[14px] !border !rounded-[12px] !bg-gray-50 focus:!bg-white !outline-none" value={selectedCase.case_type || ""} onChange={e => setSelectedCase({...selectedCase, case_type: e.target.value})} />
                                        </div>

                                        <div>
                                             <label className="!block !text-[11px] !font-bold !text-gray-400 !uppercase !mb-1.5">Litigation Level</label>
                                             <input className="!w-full !p-[14px] !border !rounded-[12px] !bg-gray-50 focus:!bg-white !outline-none" value={selectedCase.case_level || ""} onChange={e => setSelectedCase({...selectedCase, case_level: e.target.value})} />
                                        </div>

                                        <div>
                                             <label className="!block !text-[11px] !font-bold !text-gray-400 !uppercase !mb-1.5">Plaintiff / Party 1</label>
                                             <input className="!w-full !p-[14px] !border !rounded-[12px] !bg-gray-50 focus:!bg-white !outline-none" value={selectedCase.case_party1 || ""} onChange={e => setSelectedCase({...selectedCase, case_party1: e.target.value})} />
                                        </div>

                                        <div>
                                             <label className="!block !text-[11px] !font-bold !text-gray-400 !uppercase !mb-1.5">Defendant / Party 2</label>
                                             <input className="!w-full !p-[14px] !border !rounded-[12px] !bg-gray-50 focus:!bg-white !outline-none" value={selectedCase.case_party2 || ""} onChange={e => setSelectedCase({...selectedCase, case_party2: e.target.value})} />
                                        </div>

                                        <div className="!mt-4 md:!col-span-2 !border-t !pt-6">
                                             <h4 className="!text-[12px] !font-bold !text-[#2c3e50] !uppercase !mb-4">Judicial Assignments</h4>
                                             <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-4">
                                                  <div>
                                                       <label className="!block !text-[10px] !font-medium !text-gray-400 !mb-1">Judge Code</label>
                                                       <input className="!w-full !p-[10px] !border !rounded-[8px] !bg-gray-50 focus:!bg-white !outline-none !font-mono" value={selectedCase.judge_code || ""} onChange={e => setSelectedCase({...selectedCase, judge_code: e.target.value})} />
                                                  </div>
                                                  <div>
                                                       <label className="!block !text-[10px] !font-medium !text-gray-400 !mb-1">Steno Code</label>
                                                       <input className="!w-full !p-[10px] !border !rounded-[8px] !bg-gray-50 focus:!bg-white !outline-none !font-mono" value={selectedCase.steno_code || ""} onChange={e => setSelectedCase({...selectedCase, steno_code: e.target.value})} />
                                                  </div>
                                                  <div>
                                                       <label className="!block !text-[10px] !font-medium !text-gray-400 !mb-1">Court Location</label>
                                                       <input className="!w-full !p-[10px] !border !rounded-[8px] !bg-gray-50 focus:!bg-white !outline-none" value={selectedCase.court || ""} onChange={e => setSelectedCase({...selectedCase, court: e.target.value})} />
                                                  </div>
                                             </div>
                                        </div>

                                        <div className="!mt-2 md:!col-span-2">
                                             <label className="!block !text-[11px] !font-bold !text-gray-400 !uppercase !mb-1.5">Discretionary Status</label>
                                             <select className="!w-full !p-[14px] !border !rounded-[12px] !bg-orange-50/30 focus:!bg-white !outline-none" value={selectedCase.case_status || ""} onChange={e => setSelectedCase({...selectedCase, case_status: e.target.value})}>
                                                  <option value="Active">Active / In Progress</option>
                                                  <option value="Pending">Pending / Scheduled</option>
                                                  <option value="Completed">Completed / Concluded</option>
                                                  <option value="Stayed">Legal Stay / Paused</option>
                                             </select>
                                        </div>
                                   </div>

                                   <div className="!pt-6 !flex !gap-4 !sticky !bottom-0 !bg-white !pb-1">
                                        <button type="submit" className="!flex-1 !py-[16px] !bg-[#2c3e50] !text-white !rounded-[14px] !font-bold hover:!bg-[#1e2b38] !transition-all !shadow-xl">Override Record</button>
                                        <button type="button" onClick={() => setSelectedCase(null)} className="!px-10 !py-[16px] !bg-gray-100 !text-gray-600 !rounded-[14px] !font-bold hover:!bg-gray-200">Discard</button>
                                   </div>
                              </form>
                         </div>
                    </div>
               )}

               <Footer />
          </div>
     );
}
