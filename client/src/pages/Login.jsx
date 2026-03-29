import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import LoginForm from "../components/loginForm";
import { authService } from "../services/authService";
import { API_BASE_URL } from "../config";
import Footer from "../components/footer";


export default function LoginPage({ onLogin }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async ({ email, password, role }) => {
        if (loading) return;

        if (email && password) {
            try {
                setLoading(true);
                console.log(" Sending login request:", { email, password, role });

                const data = await authService.login(email, password, role);
                console.log("Backend response:", data);

                if (data.success) {
                    const loggedInUser = {
                        role: role.toLowerCase(),
                        name:
                            data.user.judge_name ||
                            data.user.chief_judge_name ||
                            data.user.steno_name ||
                            data.user.admin_name,
                        id:
                            data.user.judge_code ||
                            data.user.chief_judge_code ||
                            data.user.steno_code ||
                            data.user.admin_code,
                        email:
                            data.user.judge_email ||
                            data.user.chief_judge_email ||
                            data.user.steno_email ||
                            data.user.admin_email,
                        court:
                            data.user.judge_court ||
                            data.user.chief_judge_court ||
                            data.user.steno_court ||
                            data.user.admin_court,
                    };

                    // Store user data
                    localStorage.setItem("user", JSON.stringify(loggedInUser));

                    //  Store JWT tokens for authenticated requests
                    if (data.session) {
                        localStorage.setItem("access_token", data.session.access_token);
                        localStorage.setItem("refresh_token", data.session.refresh_token);
                        console.log("JWT tokens stored");
                    }

                    // alert(`Welcome, ${loggedInUser.name}!`);

                    // Redirect to dashboard (based on role)
                    if (loggedInUser.role === "admin") {
                        console.log("Navigating to:", loggedInUser.role);
                        navigate("/admin-dash");
                    }

                    else if (loggedInUser.role === "chief-judge") {
                        navigate("/chiefJudge-dashboard");
                    }

                    else if (loggedInUser.role === "judge") {
                        navigate("/judge-dash");
                    }
                    else if (loggedInUser.role === "stenographer") {
                        navigate("/stenographer-dashboard");
                    }

                } else {
                    alert(" Invalid email or password.");
                }
            } catch (error) {
                alert("Server error. Please try again later.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        } else {
            alert("Please enter both email and password.");
        }
    };


    return (
        <div className="!w-full !min-h-screen !flex !flex-col !bg-[#f5f5f5] !font-sans">
            {/* Header */}
            <Header />

            {/* Login Form */}
            <LoginForm
                onSubmit={handleLogin}
                loading={loading}
            />

            {/* Footer */}
            <Footer />
        </div>
    );
}
