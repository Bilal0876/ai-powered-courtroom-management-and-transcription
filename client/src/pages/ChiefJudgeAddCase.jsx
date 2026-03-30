import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { apiGet, apiPost } from "../utils/api";
import Footer from "../components/footer";

export default function ChiefJudgeAddCase() {
     const navigate = useNavigate();
     const [user, setUser] = useState(null);
     const [caseTypes, setCaseTypes] = useState([]);
     const [form, setForm] = useState({
          caseType: "",
          caseTitle: "",
          caseLevel: "",
          party1: "",
          party2: "",
     });

     useEffect(() => {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (!storedUser) {
               navigate("/");
               return;
          }
          setUser(storedUser);

          apiGet("/api/courts/case-types")
               .then(setCaseTypes)
               .catch(err => console.error("Error fetching case types:", err));
     }, [navigate]);

     const handleChange = (e) => {
          setForm({ ...form, [e.target.name]: e.target.value });
     };

     const handleAddCase = async (e) => {
          e.preventDefault();
          if (!form.caseType || !form.caseLevel || !form.caseTitle || !form.party1 || !form.party2) {
               alert("❌ Please fill all required fields!");
               return;
          }

          try {
               const data = await apiPost("/api/cases/add", form);
               if (data.success) {
                    alert("✅ Case added successfully!");
                    navigate("/chiefJudge-dashboard");
               } else {
                    alert("❌ Error: " + data.message);
               }
          } catch (err) {
               console.error("Add case failed:", err);
               alert("❌ Failed to add case. Please try again.");
          }
     };

     if (!user) return null;

     return (
          <div className="!w-full !min-h-screen !flex !flex-col ![background-color:#f5f5f5] ![font-family:Arial,sans-serif]">
               <Header user={user} />

               <div className="!flex-1 !p-[20px]">
                    {/* Breadcrumb */}
                    <div className="![background:white] ![padding:15px_20px] ![margin-bottom:20px] ![border-radius:5px] ![box-shadow:0_2px_5px_rgba(0,0,0,0.1)] ![font-size:0.9rem]">
                         <a href="#" onClick={(e) => { e.preventDefault(); navigate("/chiefJudge-dashboard"); }} className="![text-decoration:none] ![color:#2c3e50] ![font-weight:bold] hover:![text-decoration:underline]">
                              Dashboard
                         </a>{" > "}
                         <strong>Initiate New Case</strong>
                    </div>

                    <div className="!max-w-[800px] !mx-auto !bg-white !rounded-[12px] !shadow-xl !overflow-hidden">
                         <div className="!bg-[#2c3e50] !p-[25px] !text-white">
                              <h2 className="!text-[1.5rem] !font-bold !m-0">New Case Entry</h2>
                              <p className="!text-white/70 !text-[13px] !mt-1">Establish a new legal proceeding in the judicial system</p>
                         </div>

                         <form className="!p-[30px] !grid !grid-cols-1 md:!grid-cols-2 !gap-[20px]" onSubmit={handleAddCase}>
                              <div className="md:!col-span-2">
                                   <label className="!block !text-[12px] !font-bold !text-gray-500 !uppercase !mb-2">Case Title / Description</label>
                                   <input name="caseTitle" className="!w-full !p-[12px] !border !rounded-[6px] !bg-gray-50 focus:!bg-white focus:!border-[#2c3e50] !outline-none" placeholder="e.g., State vs. John Doe" value={form.caseTitle} onChange={handleChange} required />
                              </div>

                              <div>
                                   <label className="!block !text-[12px] !font-bold !text-gray-500 !uppercase !mb-2">Legal Nature (Case Type)</label>
                                   <select name="caseType" className="!w-full !p-[12px] !border !rounded-[6px] !bg-gray-50 focus:!bg-white focus:!border-[#2c3e50] !outline-none" value={form.caseType} onChange={handleChange} required>
                                        <option value="">Select Category...</option>
                                        {caseTypes.map((ct) => (
                                             <option key={ct.type_id || ct.id} value={ct.type_name || ct.name}>
                                                  {ct.type_name || ct.name}
                                             </option>
                                        ))}
                                   </select>
                              </div>

                              <div>
                                   <label className="!block !text-[12px] !font-bold !text-gray-500 !uppercase !mb-2">Jurisdiction Level</label>
                                   <select name="caseLevel" className="!w-full !p-[12px] !border !rounded-[6px] !bg-gray-50 focus:!bg-white focus:!border-[#2c3e50] !outline-none" value={form.caseLevel} onChange={handleChange} required>
                                        <option value="">Select Level...</option>
                                        <option value="High Court">High Court</option>
                                        <option value="Subordinate Court">Subordinate Court</option>
                                   </select>
                              </div>

                              <div className="!bg-blue-50/50 !p-[20px] !rounded-[10px] !border !border-blue-100">
                                   <label className="!block !text-[12px] !font-bold !text-blue-600 !uppercase !mb-3">Plaintiff / Petitioner</label>
                                   <input name="party1" className="!w-full !p-[10px] !border !rounded-[6px] !bg-white focus:!border-blue-400 !outline-none" placeholder="Enter Full Name" value={form.party1} onChange={handleChange} required />
                              </div>

                              <div className="!bg-red-50/50 !p-[20px] !rounded-[10px] !border !border-red-100">
                                   <label className="!block !text-[12px] !font-bold !text-red-600 !uppercase !mb-3">Defendant / Respondent</label>
                                   <input name="party2" className="!w-full !p-[10px] !border !rounded-[6px] !bg-white focus:!border-red-400 !outline-none" placeholder="Enter Full Name" value={form.party2} onChange={handleChange} required />
                              </div>

                              <div className="md:!col-span-2 !pt-[20px] !flex !flex-col !gap-3">
                                   <button type="submit" className="!w-full !py-[15px] !bg-[#2c3e50] !text-white !rounded-[8px] !font-bold !text-[1rem] hover:!bg-[#1a252f] !transition-all !shadow-md active:!scale-[0.99]">
                                        Create Legal Case
                                   </button>
                                   <button type="button" onClick={() => navigate("/chiefJudge-dashboard")} className="!w-full !py-[12px] !text-gray-500 !font-semibold hover:!text-gray-700">
                                        Cancel & Go Back
                                   </button>
                              </div>
                         </form>
                    </div>
               </div>

               <Footer />
          </div>
     );
}
