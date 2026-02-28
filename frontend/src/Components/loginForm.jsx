import { useState } from "react";
import "../Styling/loginForm.css";

export default function LoginForm({ onSubmit, loading }) {
    const [role, setRole] = useState("judge");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ email, password, role });
    };

    return (

        <div className="login-box">
            <div className="login-header">
                <h2 className="login-title">Login</h2>
                <p className="login-subtitle">Access the Court Transcription System</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
                {/* Role */}
                <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                        className="form-input"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={loading}
                    >
                        <option value="judge">Judge</option>
                        <option value="chief-judge">Chief Judge</option>
                        <option value="stenographer">Stenographer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* Email */}
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-input"
                        placeholder="username@courtlog.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required pattern="^[a-zA-Z0-9]+@courtlog\.com$"
                        title="Email must be in format: username@courtlog.com"
                        disabled={loading}
                    />
                </div>

                {/* Password */}
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-input"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    className={`login-btn ${loading ? 'loading' : ''}`}
                    disabled={loading}
                >
                    {loading ? (
                        <svg className="spinner-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
                            <path d="M12 2 a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    ) : (
                        "Login"
                    )}
                </button>
            </form>

            <div className="login-footer">
                <p>
                    <a href="#" className="footer-link">Forgot Password?</a> |
                    <a href="#" className="footer-link"> System Help</a> |
                    <a href="#" className="footer-link"> Contact IT Support</a>
                </p>
            </div>
        </div>
    );
}