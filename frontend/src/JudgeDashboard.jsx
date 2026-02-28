import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Components/header";
import "./style.css";
import { API_BASE_URL } from "./config";
import { apiGet, apiPost, apiPut, apiDelete } from "./utils/api";
import Footer from "./Components/footer";


export default function JudgeDashboard() {
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
          .catch((err) => console.error("❌ Error fetching judge profile:", err));
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
              <h2>Justice {user.name}</h2>
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

          {/* Stats */}
          {/* <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-number">12</div>
              <div className="stat-label">Cases Today</div>
            </div>
          </div> */}

          {/* Manage Transcriptions */}
          <div className="dashboard-grid">
            <div className="dashboard-card transcriptions">
              <div className="card-header">
                <h3>Manage Transcriptions</h3>
                <p>Review and manage transcriptions</p>
              </div>
              <div className="card-body">
                <div className="action-buttons">
                  <button className="action-btn action-btn-primary"
                    onClick={() => navigate("/judge-dash/pending-transcripts")}>
                    Review Transcripts
                  </button>
                  <button className="action-btn"
                    onClick={() => navigate("/judge-dash/pending-ordersheets")}>
                    Review Ordersheet
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => navigate("/judge-dash/view-cases")}>Case Schedule</button>
                  <button
                    className="action-btn"
                    onClick={() => navigate("/judge-dash/download-case-items")}>Download Case Logs</button>
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