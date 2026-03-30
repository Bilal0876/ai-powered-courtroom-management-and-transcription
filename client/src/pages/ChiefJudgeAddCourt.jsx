import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { apiPost } from "../utils/api";
import Footer from "../components/footer";

export default function ChiefJudgeAddCourt() {
     const [user, setUser] = useState(null);
     const [form, setForm] = useState({
          courtName: "",
          courtLevel: "",
          courtCity: "",
          courtAddress: "",
          courtPhone: "",
          courtStatus: "Active",
     });
     const navigate = useNavigate();

     useEffect(() => {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (!storedUser) {
               navigate("/");
               return;
          }
          setUser(storedUser);

          // Handle browser back button UX
          window.history.pushState({ page: "add-court" }, "", "");
          const handlePopState = () => navigate("/chiefJudge-dashboard");
          window.addEventListener("popstate", handlePopState);
          return () => window.removeEventListener("popstate", handlePopState);
     }, [navigate]);

     const handleChange = (e) => {
          setForm({ ...form, [e.target.name]: e.target.value });
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          try {
               const data = await apiPost("/api/courts/register", form);
               if (data.success) {
                    alert("✅ Court registered successfully!");
                    setForm({
                         courtName: "",
                         courtLevel: "",
                         courtCity: "",
                         courtAddress: "",
                         courtPhone: "",
                         courtStatus: "Active",
                    });
                    navigate("/chiefJudge-dashboard");
               } else {
                    alert("❌ Error: " + data.message);
               }
          } catch (err) {
               console.error("❌ Registration failed:", err);
               alert("❌ Connection failed. Please check backend server.");
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
                         <strong>Setup New Court</strong>
                    </div>

                    <div className="!max-w-[700px] !mx-auto !bg-white !rounded-[15px] !shadow-2xl !overflow-hidden">
                         <div className="!bg-[#2c3e50] !p-[30px] !text-white !relative">
                              <div className="!absolute !right-[30px] !top-[30px] !bg-white/10 !p-3 !rounded-full">🏛️</div>
                              <h2 className="!text-[1.8rem] !font-bold !m-0">Court Establishment</h2>
                              <p className="!text-white/60 !text-[14px] !mt-2">Formal registration of a new judicial jurisdiction</p>
                         </div>

                         <form className="!p-[40px] !space-y-[25px]" onSubmit={handleSubmit}>
                              <div>
                                   <label className="!block !text-[12px] !font-bold !text-gray-400 !uppercase !tracking-widest !mb-2">Official Name</label>
                                   <input name="courtName" className="!w-full !p-[14px] !border-2 !border-gray-100 !rounded-[10px] focus:!border-[#28a745] !outline-none !transition-all" placeholder="e.g., High Court Division IV" value={form.courtName} onChange={handleChange} required />
                              </div>

                              <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-[20px]">
                                   <div>
                                        <label className="!block !text-[12px] !font-bold !text-gray-400 !uppercase !tracking-widest !mb-2">Jurisdiction Level</label>
                                        <select name="courtLevel" className="!w-full !p-[14px] !border-2 !border-gray-100 !rounded-[10px] focus:!border-[#28a745] !outline-none !transition-all" value={form.courtLevel} onChange={handleChange} required>
                                             <option value="">Select level...</option>
                                             <option value="High Court">High Court</option>
                                             <option value="Session Court">Session Court</option>
                                             <option value="District Court">District Court</option>
                                             <option value="Tribunal Court">Tribunal Court</option>
                                        </select>
                                   </div>
                                   <div>
                                        <label className="!block !text-[12px] !font-bold !text-gray-400 !uppercase !tracking-widest !mb-2">City / District</label>
                                        <input name="courtCity" className="!w-full !p-[14px] !border-2 !border-gray-100 !rounded-[10px] focus:!border-[#28a745] !outline-none !transition-all" placeholder="e.g., Lahore" value={form.courtCity} onChange={handleChange} required />
                                   </div>
                              </div>

                              <div>
                                   <label className="!block !text-[12px] !font-bold !text-gray-400 !uppercase !tracking-widest !mb-2">Physical Address</label>
                                   <textarea name="courtAddress" rows="3" className="!w-full !p-[14px] !border-2 !border-gray-100 !rounded-[10px] focus:!border-[#28a745] !outline-none !transition-all !resize-none" placeholder="Full postal address of the court building..." value={form.courtAddress} onChange={handleChange} required />
                              </div>

                              <div>
                                   <label className="!block !text-[12px] !font-bold !text-gray-400 !uppercase !tracking-widest !mb-2">Primary Contact Number</label>
                                   <input name="courtPhone" maxLength="15" className="!w-full !p-[14px] !border-2 !border-gray-100 !rounded-[10px] focus:!border-[#28a745] !outline-none !transition-all" placeholder="+92 XXX XXXXXXX" value={form.courtPhone} onChange={handleChange} required />
                              </div>

                              <div className="!pt-4 !flex !flex-col !gap-3">
                                   <button type="submit" className="!w-full !py-[16px] !bg-[#28a745] !text-white !rounded-[10px] !font-bold !text-[1.1rem] hover:!bg-[#1e7e34] !transition-all !shadow-lg active:!scale-[0.98]">
                                        Establish Court
                                   </button>
                                   <button type="button" onClick={() => navigate("/chiefJudge-dashboard")} className="!w-full !py-[14px] !text-[#2c3e50] !font-bold hover:!bg-gray-50 !rounded-[10px] !transition-all">
                                        Discard & Go Back
                                   </button>
                              </div>
                         </form>
                    </div>

                    <div className="!max-w-[700px] !mx-auto !mt-6 !p-4 !bg-blue-50 !rounded-[8px] !border !border-blue-100 !flex !items-start !gap-3">
                         <span className="!text-blue-500 !mt-1">ℹ️</span>
                         <p className="!text-[12px] !text-blue-700 !m-0">
                              Establishment creates a record. Case specialization (Civil, Criminal, etc.) can be assigned from the <strong className="!cursor-pointer hover:!underline" onClick={() => navigate("/chiefJudge-dashboard")}>Dashboard</strong> after creation.
                         </p>
                    </div>
               </div>

               <Footer />
          </div>
     );
}
