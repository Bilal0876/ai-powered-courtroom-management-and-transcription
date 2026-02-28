import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Components/header";
import "./style.css";
import { API_BASE_URL } from "./config";
import { apiGet, apiPost, apiPut, apiDelete } from "./utils/api";
import Footer from "./Components/footer";

export default function ChiefJudgeAddCourt() {
     const [form, setForm] = useState({
          courtName: "",
          courtLevel: "",
          courtCity: "",
          courtAddress: "",
          courtPhone: "",
          courtStatus: "",
     });
     const navigate = useNavigate();

     const handleChange = (e) => {
          setForm({ ...form, [e.target.name]: e.target.value });
     };

     const handleSignup = async () => {
          try {
               const res = await fetch(`${API_BASE_URL}/register-court`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
               });
               const data = await res.json();

               if (data.success) {
                    alert("✅ User registered successfully!");
                    // ✅ Reset the form fields
                    setForm({
                         courtName: "",
                         courtLevel: "",
                         courtCity: "",
                         courtAddress: "",
                         courtPhone: "",
                         courtStatus: "",
                    });

                    // ✅ Go back to dashboard
                    navigate("/chiefJudge-dashboard");
               } else {
                    alert("❌ Error: " + data.message);
               }
          } catch (err) {
               console.error("❌ Signup failed:", err);
          }
     };

     // ✅ Handle browser back button
     useEffect(() => {
          // push a new history state when entering signup page
          window.history.pushState({ page: "signup" }, "", "");

          const handlePopState = () => {
               // when user clicks browser back, go to dashboard
               navigate("/chiefJudge-dashboard");
          };

          window.addEventListener("popstate", handlePopState);

          return () => {
               window.removeEventListener("popstate", handlePopState);
          };
     });

     return (
          <div className="login-container">
               {/* Header */}
               <Header user={user} />

               {/* Centered box — uses login-box so you get the same look as login page */}
               <div className="container">
                    <div className="breadcrumb">
                         <a href="#" onClick={() => navigate("/chiefJudge-dashboard")}>
                              Dashboard
                         </a>{" > "}
                         <strong>Add New Court</strong>
                    </div>

                    <div className="login-box signup-box">
                         <div className="login-header">
                              <h2 className="login-title">Add New Court</h2>
                              <p className="login-subtitle">Add a new court to the system</p>
                         </div>

                         <div className="form">
                              <div className="form-group">
                                   <label className="form-label" htmlFor="courtName">Court Name</label>
                                   <input id="courtName" name="courtName" className="form-input" value={form.courtName} onChange={handleChange} />
                              </div>

                              <div className="form-group">
                                   <label className="form-label" htmlFor="level">Court Level</label>
                                   <select id="courtLevel" name="courtLevel" className="form-input" value={form.courtLevel} onChange={handleChange}>
                                        <option value="">Select level</option>
                                        <option value="High Court">High Court</option>
                                        <option value="Session Court">Session Court</option>
                                        <option value="District Court">District Court</option>
                                        <option value="Tribunal Court">Tribunal Court</option>
                                   </select>
                              </div>

                              <div className="form-group">
                                   <label className="form-label" htmlFor="city">City</label>
                                   <input id="courtCity" name="courtCity" className="form-input" value={form.courtCity} onChange={handleChange} />
                              </div>

                              <div className="form-group">
                                   <label className="form-label" htmlFor="address">Address</label>
                                   <input id="courtAddress" name="courtAddress" className="form-input" value={form.courtAddress} onChange={handleChange} />
                              </div>

                              <div className="form-group">
                                   <label className="form-label" htmlFor="phone">Phone Number</label>
                                   <input id="courtPhone" name="courtPhone" maxLength="12" className="form-input" value={form.courtPhone} onChange={handleChange} />
                              </div>

                              <button className="login-btn" onClick={handleSignup}>Add Court</button>
                         </div>

                         <div className="login-footer">
                              <p>Assign case types to Court from dashboard<a href="#" className="footer-link">Terms of Service</a></p>
                         </div>
                    </div>
               </div>

               {/* Footer */}
               <Footer />
          </div>
     );
}