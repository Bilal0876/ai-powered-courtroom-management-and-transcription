import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header"
import "../assets/styles/style.css";
import { API_BASE_URL } from "../config";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";
import Footer from "../components/footer";

export default function ChiefJudgeAddUser() {
     const [courts, setCourt] = useState([]);
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
          async function fetchData() {
               try {
                    const data = await apiGet("/court-names");
                    setCourt(data);
               } catch (err) {
                    console.error("Error fetching court names:", err);
               }
          }
          fetchData();
     }, []);

     const handleChange = (e) => {
          let { name, value } = e.target;
          // ✅ Automatic CNIC Formatting (12345-1234567-1)
          if (name === "cnic") {
               const numbers = value.replace(/\D/g, ""); // Remove non-digits

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
          e.preventDefault(); // 🔴 VERY IMPORTANT

          if (form.password !== form.confirmPassword) {
               alert("❌ Passwords do not match!");
               return;
          }

          try {
               const data = await apiPost("/register-user", form);

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
          <div className="login-container">
               {/* Header */}
               <Header user={user} />

               {/* Centered box — uses login-box so you get the same look as login page */}
               <div className="container">
                    <div className="breadcrumb">
                         <a href="#" onClick={() => navigate("/chiefJudge-dashboard")}>
                              Dashboard
                         </a>{" > "}
                         <strong>Register Judge/Staff</strong>
                    </div>

                    <div className="login-box signup-box">
                         <div className="login-header">
                              <h2 className="login-title">Register Judge/Staff</h2>
                              <p className="login-subtitle">Register for Court Transcription System</p>
                         </div>

                         <form className="form" onSubmit={handleSignup}>
                              <div className="form-group">
                                   <label className="form-label" htmlFor="fullName">Full Name</label>
                                   <input id="fullName" name="fullName" className="form-input" value={form.fullName} onChange={handleChange} />
                              </div>

                              <div className="form-group">
                                   <label className="form-label" htmlFor="email">Email</label>
                                   <input id="email" name="email" type="email" className="form-input" value={form.email} onChange={handleChange} required pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" />
                              </div>

                              <div className="form-group">
                                   <label className="form-label" htmlFor="cnic">CNIC</label>
                                   <input id="cnic" name="cnic" maxLength="13" className="form-input" value={form.cnic} onChange={handleChange} />
                              </div>

                              <div className="form-group">
                                   <label className="form-label" htmlFor="birthDate">Date of Birth</label>
                                   <input id="birthDate" name="birthDate" type="date" className="form-input" value={form.birthDate} onChange={handleChange} required />
                              </div>

                              <div className="form-group">
                                   <label className="form-label" htmlFor="court">Assigned Court</label>
                                   <select
                                        name="court"
                                        className="form-input"
                                        value={form.court}
                                        onChange={handleChange}
                                   >
                                        <option value="">Select Court</option>
                                        {courts.map((court) => (
                                             <option key={court.Cid} value={court.Cid}>
                                                  {court.Cname}
                                             </option>
                                        ))}
                                   </select>
                              </div>

                              <div className="form-group">
                                   <label className="form-label" htmlFor="role">Assigned Role</label>
                                   <select id="role" name="role" className="form-input" value={form.role} onChange={handleChange}>
                                        <option value="">Select role</option>
                                        <option value="judge">Judge</option>
                                        <option value="chief-judge">Chief Judge</option>
                                        <option value="stenographer">Stenographer</option>
                                        <option value="admin">Admin</option>
                                   </select>
                              </div>

                              <div className="form-group">
                                   <label className="form-label" htmlFor="password">Password</label>
                                   <input id="password" name="password" type="password" className="form-input" value={form.password} onChange={handleChange} />
                              </div>

                              <div className="form-group">
                                   <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                                   <input id="confirmPassword" name="confirmPassword" type="password" className="form-input" value={form.confirmPassword} onChange={handleChange} />
                              </div>

                              <button type="submit" className="login-btn">
                                   Register
                              </button>

                         </form>

                         <div className="login-footer">
                              <p>By creating an account, the user agrees to the <a href="#" className="footer-link">Terms of Service</a> and <a href="#" className="footer-link">Privacy Policy</a></p>
                         </div>
                    </div>
               </div>

               {/* Footer */}
               <Footer />
          </div>
     );
}
