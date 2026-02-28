import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Components/header";
import "./Styling/AdminDashboard.css"
import { API_BASE_URL } from "./config";
import { apiPost } from "./utils/api";
import Footer from "./Components/footer";

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (parsedUser) {
      setUser(parsedUser);

      // Fetch fresh details from backend in the background
      setTimeout(() => {
        apiPost("/profile", {
          email: parsedUser.email,
          role: parsedUser.role,
        })
          .then((data) => {
            if (data.success) {
              setUser(data.user);
            }
          })
          .catch((err) =>
            console.error("❌ Error fetching admin profile:", err)
          );
      }, 1000); // 1s second delay to let login settle
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      window.location.href = "/";
    }
  };

  if (!user) return <p>Loading...</p>; // ✅ prevent crash until data is ready

  return (
    <div className="login-container">
      {/* Header */}
      <Header user={user} />

      {/* Dashboard */}
      <div id="dashboardPage" className="page active">
        <div className="container">
          <div className="dashboard-nav">
            <div className="welcome-text">
              <h2>{user.name}</h2>
              <p>Admin-ID: {user.id}</p>
            </div>
            <div className="user-info">
              <div>
                <strong>Today:</strong>{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="dashboard-grid">
            {/* Case Management */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Case Management</h3>
                <p>Manage and Schedule case hearings</p>
              </div>
              <div className="card-body">
                <div className="action-buttons">
                  <button
                    className="action-btn action-btn-primary"
                    onClick={() => navigate("/admin-dash/add-case")}
                  >
                    + Add New Case
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => navigate("/admin-dash/schedule-cases")}
                  >
                    Schedule Hearings</button>
                  {/* Browse Cases Button */}
                  <button
                    className="action-btn"
                    onClick={() => navigate("/admin-dash/browse-cases")}
                  >
                    Browse Cases
                  </button>

                </div>
              </div>
            </div>

            {/* User Management */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3>User Management</h3>
                <p>Manage System Users</p>
              </div>
              <div className="card-body">
                <div className="action-buttons">
                  <button
                    className="action-btn"
                    onClick={() => navigate("/admin-dash/register")}
                  >
                    + Add New Judge/Staff
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => navigate("/admin-dash/update-users")}
                  >
                    Edit Judge/Staff Info
                  </button>
                  <button className="action-btn"
                    onClick={() => navigate("/admin-dash/view-users")}
                  >
                    View All Judge/Staff
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
    //   )}
    // </>
  );
}