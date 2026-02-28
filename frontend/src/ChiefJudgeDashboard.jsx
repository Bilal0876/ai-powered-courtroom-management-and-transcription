import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Components/header"
import "./style.css";
import { API_BASE_URL } from "./config";
import { apiGet, apiPost, apiPut, apiDelete } from "./utils/api";
import Footer from "./Components/footer";

export default function ChiefJudgeDashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;

        if (parsedUser) {
            setUser(parsedUser);

            // Fetch fresh details from backend in the background after a delay
            setTimeout(() => {
                fetch(`${API_BASE_URL}/profile`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: parsedUser.email,
                        role: parsedUser.role,
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.success) {
                            setUser(data.user);
                        }
                    })
                    .catch((err) => console.error("❌ Error fetching chief judge profile:", err));
            }, 2000);
        }
    }, []);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("user");
            window.location.href = "/";
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="login-container">
            {/* Header (reused from AdminDashboard) */}
            <Header user={user} />

            {/* Dashboard */}
            <div id="dashboardPage" className="page active">
                <div className="container">
                    <div className="dashboard-nav">
                        <div className="welcome-text">
                            <h2>Chief Justice {user.name}</h2>
                            <p>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)} -{" "}
                                {user.court || "Court not assigned"}
                            </p>
                        </div>
                        <div className="user-info">
                            <div>
                                <strong>Today:</strong>{" "}
                                {new Date().toLocaleDateString("en-PK", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>
                            <div>
                                <strong>Session:</strong> Morning Session
                            </div>
                            <div>
                                <button onClick={handleLogout} className="logout-btn">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Manage Transcriptions */}
                    <div className="dashboard-grid">
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h3>Case Management</h3>
                                <p>Manage Case Schedules and Judge Assignment</p>
                            </div>
                            <div className="card-body">
                                <div className="action-buttons">
                                    <button
                                        className="action-btn action-btn-primary"
                                        onClick={() => navigate("/chiefJudge-dashboard/hearing-schedule")}
                                    >
                                        Assign Judge & Schedule Hearing Date
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => navigate("/chiefJudge-dashboard/view-cases")}
                                    >
                                        View All Cases
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => navigate("/chiefJudge-dashboard/add-cases")}
                                    >
                                        Add New Case
                                    </button>
                                    {/* <button className="action-btn">Reschedule Case</button> */}
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-card">
                            <div className="card-header">
                                <h3>Judge/Staff Management</h3>
                                <p>Manage System Users</p>
                            </div>
                            <div className="card-body">
                                <div className="action-buttons">
                                    <button
                                        className="action-btn"
                                        onClick={() => navigate("/chiefJudge-dashboard/add-user")}
                                    >
                                        + Add New Judge/Staff
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => navigate("/chiefJudge-dashboard/update-staff")}
                                    >Edit Judge/Staff Info</button>
                                    <button
                                        className="action-btn"
                                        onClick={() => navigate("/chiefJudge-dashboard/view-users")}
                                    >
                                        View All Judge/Staff
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-card">
                            <div className="card-header">
                                <h3>Court Management</h3>
                                <p>Manage Courts and Types</p>
                            </div>
                            <div className="card-body">
                                <div className="action-buttons">
                                    <button
                                        className="action-btn"
                                        onClick={() => navigate("/chiefJudge-dashboard/add-court")}
                                    >
                                        Add New Court
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => navigate("/chiefJudge-dashboard/add-type")}
                                    >
                                        Add New Case Type
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => navigate("/chiefJudge-dashboard/assign-type-to-court")}
                                    >
                                        Assign Case Type to Court
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => navigate("/chiefJudge-dashboard/view-courts")}
                                    >
                                        View All Courts
                                    </button>
                                    {/* <button className="action-btn">Reschedule Case</button> */}
                                </div>
                            </div>
                        </div>
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h3>Transcript and Ordersheet</h3>
                                <p>View Transcripts and Ordersheets of Cases</p>
                            </div>
                            <div className="card-body">
                                <div className="action-buttons">
                                    <button
                                        className="action-btn"
                                        onClick={() => navigate("/chiefJudge-dashboard/download-case")}
                                    >
                                        Transcripts & Ordersheets
                                    </button>
                                    {/* <button
                                        className="action-btn"
                                        onClick={() => navigate("/chiefJudge-dashboard/view-cases")}
                                    >
                                        Manage Transcripts & Ordersheets
                                    </button> */}
                                    {/* <button className="action-btn">Reschedule Case</button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer (reused from AdminDashboard) */}
            <Footer />
        </div>
    );
}