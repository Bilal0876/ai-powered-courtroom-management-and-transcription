import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { apiGet, apiPost } from "../utils/api";
import Footer from "../components/footer";

export default function ChiefJudgeAddUser() {
     const [courts, setCourt] = useState([]);
     const [user, setUser] = useState(null);
     const [form, setForm] = useState({
          fullName: "",
          email: "",
          cnic: "",
          birthDate: "",
          court: "",
          role: "",
          password: "",
          confirmPassword: "",
     });
     const navigate = useNavigate();

     useEffect(() => {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (!storedUser) {
               navigate("/");
               return;
          }
          setUser(storedUser);

          apiGet("/api/courts/names")
               .then(setCourt)
               .catch((err) => console.error("Error fetching court names:", err));
     }, [navigate]);

     const handleChange = (e) => {
          let { name, value } = e.target;
          if (name === "cnic") {
               const numbers = value.replace(/\D/g, "");
               if (numbers.length <= 5) {
                    value = numbers;
               } else if (numbers.length <= 12) {
                    value = `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
               } else {
                    value = `${numbers.slice(0, 5)}-${numbers.slice(5, 12)}-${numbers.slice(12, 13)}`;
               }
          }
          setForm({ ...form, [name]: value });
     };

     const handleSignup = async (e) => {
          e.preventDefault();
          if (form.password !== form.confirmPassword) {
               alert("❌ Passwords do not match!");
               return;
          }

          try {
               const data = await apiPost("/api/users/register", form);
               if (data.success) {
                    alert("✅ User registered successfully!");
                    navigate("/chiefJudge-dashboard");
               } else {
                    alert("❌ Error: " + data.message);
               }
          } catch (err) {
               console.error("❌ Signup failed:", err);
               alert("❌ Registration failed. Please try again.");
          }
     };

     return (
          <div className="!w-full !min-h-screen !flex !flex-col ![background-color:#f5f5f5] ![font-family:Arial,sans-serif]">
               <Header user={user} />

               <div className="!flex-1 !p-[20px]">
                    <div className="![background:white] ![padding:15px_20px] ![margin-bottom:20px] ![border-radius:5px] ![box-shadow:0_2px_5px_rgba(0,0,0,0.1)] ![font-size:0.9rem]">
                         <a href="#" onClick={(e) => { e.preventDefault(); navigate("/chiefJudge-dashboard"); }} className="![text-decoration:none] ![color:#2c3e50] ![font-weight:bold] hover:![text-decoration:underline]">
                              Dashboard
                         </a>{" > "}
                         <strong>Register Staff</strong>
                    </div>

                    <div className="!max-w-[800px] !mx-auto !bg-white !rounded-[12px] !shadow-xl !overflow-hidden">
                         <div className="!bg-[#2c3e50] !p-[25px] !text-white">
                              <h2 className="!text-[1.5rem] !font-bold !m-0">User Registration</h2>
                              <p className="!text-white/70 !text-[13px] !mt-1">Add new judges or administrative staff to the system</p>
                         </div>

                         <form className="!p-[30px] !grid !grid-cols-1 md:!grid-cols-2 !gap-[20px]" onSubmit={handleSignup}>
                              <div className="md:!col-span-2">
                                   <label className="!block !text-[12px] !font-bold !text-gray-500 !uppercase !mb-2">Full Name</label>
                                   <input name="fullName" className="!w-full !p-[12px] !border !rounded-[6px] !bg-gray-50 focus:!bg-white focus:!border-[#28a745] !outline-none" value={form.fullName} onChange={handleChange} required />
                              </div>

                              <div>
                                   <label className="!block !text-[12px] !font-bold !text-gray-500 !uppercase !mb-2">Email Address</label>
                                   <input name="email" type="email" className="!w-full !p-[12px] !border !rounded-[6px] !bg-gray-50 focus:!bg-white focus:!border-[#28a745] !outline-none" value={form.email} onChange={handleChange} required />
                              </div>

                              <div>
                                   <label className="!block !text-[12px] !font-bold !text-gray-500 !uppercase !mb-2">CNIC Number</label>
                                   <input name="cnic" maxLength="15" className="!w-full !p-[12px] !border !rounded-[6px] !bg-gray-50 focus:!bg-white focus:!border-[#28a745] !outline-none" value={form.cnic} onChange={handleChange} placeholder="12345-1234567-1" required />
                              </div>

                              <div>
                                   <label className="!block !text-[12px] !font-bold !text-gray-500 !uppercase !mb-2">Date of Birth</label>
                                   <input name="birthDate" type="date" className="!w-full !p-[12px] !border !rounded-[6px] !bg-gray-50 focus:!bg-white focus:!border-[#28a745] !outline-none" value={form.birthDate} onChange={handleChange} required />
                              </div>

                              <div>
                                   <label className="!block !text-[12px] !font-bold !text-gray-500 !uppercase !mb-2">Assigned Role</label>
                                   <select name="role" className="!w-full !p-[12px] !border !rounded-[6px] !bg-gray-50 focus:!bg-white focus:!border-[#28a745] !outline-none" value={form.role} onChange={handleChange} required>
                                        <option value="">Select role...</option>
                                        <option value="judge">Judge</option>
                                        <option value="chief-judge">Chief Judge</option>
                                        <option value="stenographer">Stenographer</option>
                                        <option value="admin">Admin</option>
                                   </select>
                              </div>

                              <div className="md:!col-span-2">
                                   <label className="!block !text-[12px] !font-bold !text-gray-500 !uppercase !mb-2">Assigned Court</label>
                                   <select name="court" className="!w-full !p-[12px] !border !rounded-[6px] !bg-gray-50 focus:!bg-white focus:!border-[#28a745] !outline-none" value={form.court} onChange={handleChange} required>
                                        <option value="">Select Court...</option>
                                        {courts.map((court) => (
                                             <option key={court.court_id} value={court.court_id}>
                                                  {court.court_name}
                                             </option>
                                        ))}
                                   </select>
                              </div>

                              <div>
                                   <label className="!block !text-[12px] !font-bold !text-gray-500 !uppercase !mb-2">Password</label>
                                   <input name="password" type="password" className="!w-full !p-[12px] !border !rounded-[6px] !bg-gray-50 focus:!bg-white focus:!border-[#28a745] !outline-none" value={form.password} onChange={handleChange} required />
                              </div>

                              <div>
                                   <label className="!block !text-[12px] !font-bold !text-gray-500 !uppercase !mb-2">Confirm Password</label>
                                   <input name="confirmPassword" type="password" className="!w-full !p-[12px] !border !rounded-[6px] !bg-gray-50 focus:!bg-white focus:!border-[#28a745] !outline-none" value={form.confirmPassword} onChange={handleChange} required />
                              </div>

                              <div className="md:!col-span-2 !mt-[10px]">
                                   <button type="submit" className="!w-full !p-[15px] !bg-[#28a745] !text-white !rounded-[8px] !font-bold hover:!bg-[#1e7e34] !transition-all !shadow-md">
                                        Register User
                                   </button>
                                   <button type="button" onClick={() => navigate("/chiefJudge-dashboard")} className="!w-full !mt-3 !p-[12px] !text-gray-500 hover:!text-gray-700 !font-semibold">
                                        Cancel & Return
                                   </button>
                              </div>
                         </form>
                    </div>
               </div>

               <Footer />
          </div>
     );
}
