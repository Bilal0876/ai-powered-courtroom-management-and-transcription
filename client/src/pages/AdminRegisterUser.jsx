import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
;
import { API_BASE_URL } from "../config";
import { apiGet, apiPost } from "../utils/api";
import Footer from "../components/footer";

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
        const data = await apiGet("/api/courts/names");
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
    <div className="!w-full !min-h-screen !flex !flex-col !bg-[#f5f5f5] !font-sans">
      {/* Header */}
      <Header />

      {/* Centered box — uses login-box so you get the same look as login page */}
      <div className="!flex-1 !p-[20px]">
        <div className="!bg-white !px-[20px] !py-[15px] !mb-[20px] !rounded-[5px] !shadow-[0_2px_5px_rgba(0,0,0,0.1)] !text-[0.9rem]">
          <a href="#" onClick={() => navigate("/admin-dash")} className="!no-underline !text-[#2c3e50] !font-bold hover:!underline">
            Dashboard
          </a>{" > "}
          <strong>Register Judge/Staff</strong>
        </div>

        <div className="!bg-white !p-[40px] max-md:!p-[25px] !rounded-[10px] !shadow-[0_4px_15px_rgba(0,0,0,0.1)] !w-full !max-w-[750px] !mx-auto">
          <div className="!text-center !mb-[30px]">
            <h2 className="!text-[24px] !font-bold !text-[#2c3e50] !mb-[10px] !mt-0">Register Judge/Staff</h2>
            <p className="!text-[#6c757d] !text-[15px] !m-0">Register for Court Transcription System</p>
          </div>

          <form className="!grid !grid-cols-2 !gap-[20px] max-md:!grid-cols-1" onSubmit={handleSignup}>
            <div className="!flex !flex-col !text-left">
              <label className="!mb-[8px] !font-semibold !text-[#495057] !text-[14px]" htmlFor="fullName">Full Name</label>
              <input id="fullName" name="fullName" className="!w-full !p-[12px] !border !border-[#ced4da] !rounded-[5px] !text-[15px] !transition-colors !duration-300 focus:!border-[#28a745] focus:!outline-none" value={form.fullName} onChange={handleChange} />
            </div>

            <div className="!flex !flex-col !text-left">
              <label className="!mb-[8px] !font-semibold !text-[#495057] !text-[14px]" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className="!w-full !p-[12px] !border !border-[#ced4da] !rounded-[5px] !text-[15px] !transition-colors !duration-300 focus:!border-[#28a745] focus:!outline-none" value={form.email}
                onChange={handleChange} required pattern="^[a-zA-Z0-9]+@courtlog\.com$" placeholder="username@courtlog.com"
                title="Email must be in format: username@courtlog.com" />
            </div>

            <div className="!flex !flex-col !text-left">
              <label className="!mb-[8px] !font-semibold !text-[#495057] !text-[14px]" htmlFor="cnic">CNIC</label>
              <input id="cnic" name="cnic" maxLength="15" className="!w-full !p-[12px] !border !border-[#ced4da] !rounded-[5px] !text-[15px] !transition-colors !duration-300 focus:!border-[#28a745] focus:!outline-none" value={form.cnic} onChange={handleChange}
                pattern="^[0-9]{5}-[0-9]{7}-[0-9]$"
                placeholder="12345-1234567-1"
                title="CNIC must be in format: 12345-1234567-1"
                required />
            </div>

            <div className="!flex !flex-col !text-left">
              <label className="!mb-[8px] !font-semibold !text-[#495057] !text-[14px]" htmlFor="birthDate">Date of Birth</label>
              <input id="birthDate" name="birthDate" type="date" className="!w-full !p-[12px] !border !border-[#ced4da] !rounded-[5px] !text-[15px] !transition-colors !duration-300 focus:!border-[#28a745] focus:!outline-none" value={form.birthDate} onChange={handleChange} required />
            </div>

            <div className="!flex !flex-col !text-left">
              <label className="!mb-[8px] !font-semibold !text-[#495057] !text-[14px]" htmlFor="court">Assigned Court</label>
              <select
                id="court"
                name="court"
                className="!w-full !p-[12px] !border !border-[#ced4da] !rounded-[5px] !text-[15px] !transition-colors !duration-300 focus:!border-[#28a745] focus:!outline-none"
                value={form.court}
                onChange={handleChange}
              >
                <option value="">Select Court</option>
                {courts.map((court, index) => (
                  <option key={court.court_id || `court-${index}`} value={court.court_id}>
                    {court.court_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="!flex !flex-col !text-left">
              <label className="!mb-[8px] !font-semibold !text-[#495057] !text-[14px]" htmlFor="role">Assigned Role</label>
              <select id="role" name="role" className="!w-full !p-[12px] !border !border-[#ced4da] !rounded-[5px] !text-[15px] !transition-colors !duration-300 focus:!border-[#28a745] focus:!outline-none" value={form.role} onChange={handleChange}>
                <option value="">Select role</option>
                <option value="stenographer">Stenographer</option>
                <option value="judge">Judge</option>
              </select>
            </div>

            <div className="!flex !flex-col !text-left">
              <label className="!mb-[8px] !font-semibold !text-[#495057] !text-[14px]" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" className="!w-full !p-[12px] !border !border-[#ced4da] !rounded-[5px] !text-[15px] !transition-colors !duration-300 focus:!border-[#28a745] focus:!outline-none" value={form.password} pattern="(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}" onChange={handleChange} />
            </div>

            <div className="!flex !flex-col !text-left">
              <label className="!mb-[8px] !font-semibold !text-[#495057] !text-[14px]" htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" className="!w-full !p-[12px] !border !border-[#ced4da] !rounded-[5px] !text-[15px] !transition-colors !duration-300 focus:!border-[#28a745] focus:!outline-none" value={form.confirmPassword} onChange={handleChange} />
            </div>

            <button type="submit" className="!w-full !p-[12px] !bg-[#28a745] !text-white !border-none !rounded-[5px] !font-semibold !text-[16px] !cursor-pointer !transition-colors !duration-300 hover:!bg-[#218838] !mt-[10px] !col-span-2 max-md:!col-span-1 disabled:!bg-[#6c757d]" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="!text-center !mt-[25px] !text-[14px] !text-[#6c757d]">
            <p>By creating an account, the user agrees to the <a href="#" className="!text-[#28a745] !no-underline hover:!underline">Terms of Service</a> and <a href="#" className="!text-[#28a745] !no-underline hover:!underline">Privacy Policy</a></p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
