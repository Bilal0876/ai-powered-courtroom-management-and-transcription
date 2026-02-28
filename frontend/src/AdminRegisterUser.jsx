import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Components/header";
import "./style.css";
import { API_BASE_URL } from "./config";
import { apiPost } from "./utils/api";
import Footer from "./Components/footer";

export default function SignupPage({ setCurrentPage }) {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE_URL}/court-names`);
        const data = await res.json();
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

    // Prevent duplicate submissions
    if (isSubmitting) {
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ Use apiPost - automatically sends JWT token
      const data = await apiPost("/register-user", form);

      // If we get here, registration was successful
      alert("✅ User registered successfully!");
      navigate("/admin-dash");
    } catch (err) {
      console.error("❌ Signup failed:", err);
      // Show specific error message if available, otherwise generic message
      const errorMessage = err.data?.message || err.message || "Registration failed. Please try again.";
      alert("❌ Error: " + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Handle browser back button
  useEffect(() => {
    // push a new history state when entering signup page
    window.history.pushState({ page: "signup" }, "", "");

    const handlePopState = () => {
      // when user clicks browser back, go to dashboard
      navigate("/admin-dash");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setCurrentPage]);

  return (
    <div className="login-container">
      {/* Header */}
      <Header />

      {/* Centered box — uses login-box so you get the same look as login page */}
      <div className="container">
        <div className="breadcrumb">
          <a href="#" onClick={() => navigate("/admin-dash")}>
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
              <input id="email" name="email" type="email" className="form-input" value={form.email}
                onChange={handleChange} required pattern="^[a-zA-Z0-9]+@courtlog\.com$" placeholder="username@courtlog.com"
                title="Email must be in format: username@courtlog.com" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cnic">CNIC</label>
              <input id="cnic" name="cnic" maxLength="15" className="form-input" value={form.cnic} onChange={handleChange}
                pattern="^[0-9]{5}-[0-9]{7}-[0-9]$"
                placeholder="12345-1234567-1"
                title="CNIC must be in format: 12345-1234567-1"
                required />
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
                <option value="stenographer">Stenographer</option>
                <option value="judge">Judge</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" className="form-input" value={form.password} pattern="(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" className="form-input" value={form.confirmPassword} onChange={handleChange} />
            </div>

            <button type="submit" className="login-btn" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
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