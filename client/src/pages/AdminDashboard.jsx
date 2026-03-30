import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import DashboardHero from "../components/DashboardHero";
import { API_BASE_URL } from "../config";
import { apiPost } from "../utils/api";
import Footer from "../components/footer";
import ConfirmationModal from "../components/ConfirmationModal";

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (parsedUser) {
      setUser(parsedUser);

      // Fetch fresh details from backend in the background
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
    }
  }, []);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    window.location.href = "/";
  };

  if (!user) return (
    <div className="!min-h-screen !flex !items-center !justify-center !bg-gray-50">
      <div className="!animate-spin !rounded-full !h-12 !w-12 !border-b-2 !border-[#2c3e50]"></div>
    </div>
  );

  return (
    <div className="!w-full !min-h-screen !flex !flex-col ![background-color:#f8fafc] ![font-family:Inter,sans-serif]">
      {/* Header */}
      <Header user={user} />

      {/* Dashboard */}
      <main className="!flex-1 !max-w-[1400px] !mx-auto !w-full !p-6 lg:!p-10">
        <DashboardHero user={user} onLogout={handleLogout} />

        <div className="![display:grid] ![grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] ![gap:25px] ![margin-bottom:30px] ![width:100%] ![margin-left:auto] ![margin-right:auto]">
          {/* Case Management */}
          <div className="![background:white] ![border-radius:10px] ![box-shadow:0_5px_15px_rgba(0,0,0,0.1)] ![overflow:hidden] ![transition:transform_0.3s_ease] hover:![transform:translateY(-5px)]">
            <div className="![background:#f8f9fa] ![padding:20px] ![border-bottom:1px_solid_#dee2e6] ![font-weight:bold]">
              <h3 className="![color:#2c3e50] ![margin-bottom:5px] ![display:flex] ![align-items:center] ![gap:10px] ![font-size:1.17em]">
                Case Management
              </h3>
              <p className="![color:#6c757d] ![font-size:0.9rem]">Manage and Schedule case hearings</p>
            </div>
            <div className="![padding:25px]">
              <div className="![display:flex] ![flex-direction:column] ![gap:15px]">
                <button
                  className="![padding:15px_20px] ![border:2px_solid_#e7e6e6] ![box-shadow:0_5px_15px_rgba(0,0,0,0.1)] ![background:#28a745] ![color:white] ![border-radius:8px] ![cursor:pointer] ![font-weight:600] ![transition:all_0.3s_ease] ![display:flex] ![align-items:center] ![gap:10px] ![text-align:left] hover:![background:#1e7e34] hover:![transform:translateX(5px)]"
                  onClick={() => navigate("/admin-dash/add-case")}
                >
                  + Add New Case
                </button>
                <button
                  className="![padding:15px_20px] ![border:2px_solid_#e7e6e6] ![box-shadow:0_5px_15px_rgba(0,0,0,0.1)] ![background:white] ![color:#585b5c] ![border-radius:8px] ![cursor:pointer] ![font-weight:600] ![transition:all_0.3s_ease] ![display:flex] ![align-items:center] ![gap:10px] ![text-align:left] hover:![background:#28a745] hover:![color:white] hover:![transform:translateX(5px)]"
                  onClick={() => navigate("/admin-dash/schedule-cases")}
                >
                  Schedule Hearings
                </button>
                <button
                  className="![padding:15px_20px] ![border:2px_solid_#e7e6e6] ![box-shadow:0_5px_15px_rgba(0,0,0,0.1)] ![background:white] ![color:#585b5c] ![border-radius:8px] ![cursor:pointer] ![font-weight:600] ![transition:all_0.3s_ease] ![display:flex] ![align-items:center] ![gap:10px] ![text-align:left] hover:![background:#28a745] hover:![color:white] hover:![transform:translateX(5px)]"
                  onClick={() => navigate("/admin-dash/browse-cases")}
                >
                  Browse Cases
                </button>
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="![background:white] ![border-radius:10px] ![box-shadow:0_5px_15px_rgba(0,0,0,0.1)] ![overflow:hidden] ![transition:transform_0.3s_ease] hover:![transform:translateY(-5px)]">
            <div className="![background:#f8f9fa] ![padding:20px] ![border-bottom:1px_solid_#dee2e6] ![font-weight:bold]">
              <h3 className="![color:#2c3e50] ![margin-bottom:5px] ![display:flex] ![align-items:center] ![gap:10px] ![font-size:1.17em]">
                User Management
              </h3>
              <p className="![color:#6c757d] ![font-size:0.9rem]">Manage System Users</p>
            </div>
            <div className="![padding:25px]">
              <div className="![display:flex] ![flex-direction:column] ![gap:15px]">
                <button
                  className="![padding:15px_20px] ![border:2px_solid_#e7e6e6] ![box-shadow:0_5px_15px_rgba(0,0,0,0.1)] ![background:white] ![color:#585b5c] ![border-radius:8px] ![cursor:pointer] ![font-weight:600] ![transition:all_0.3s_ease] ![display:flex] ![align-items:center] ![gap:10px] ![text-align:left] hover:![background:#28a745] hover:![color:white] hover:![transform:translateX(5px)]"
                  onClick={() => navigate("/admin-dash/register")}
                >
                  + Add New Judge/Staff
                </button>
                <button
                  className="![padding:15px_20px] ![border:2px_solid_#e7e6e6] ![box-shadow:0_5px_15px_rgba(0,0,0,0.1)] ![background:white] ![color:#585b5c] ![border-radius:8px] ![cursor:pointer] ![font-weight:600] ![transition:all_0.3s_ease] ![display:flex] ![align-items:center] ![gap:10px] ![text-align:left] hover:![background:#28a745] hover:![color:white] hover:![transform:translateX(5px)]"
                  onClick={() => navigate("/admin-dash/update-users")}
                >
                  Edit Judge/Staff Info
                </button>
                <button
                  className="![padding:15px_20px] ![border:2px_solid_#e7e6e6] ![box-shadow:0_5px_15px_rgba(0,0,0,0.1)] ![background:white] ![color:#585b5c] ![border-radius:8px] ![cursor:pointer] ![font-weight:600] ![transition:all_0.3s_ease] ![display:flex] ![align-items:center] ![gap:10px] ![text-align:left] hover:![background:#28a745] hover:![color:white] hover:![transform:translateX(5px)]"
                  onClick={() => navigate("/admin-dash/view-users")}
                >
                  View All Judge/Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      <ConfirmationModal 
        isOpen={isLogoutModalOpen}
        title="Logout Confirmation"
        message="Are you sure you want to logout? You will need to sign in again to access the dashboard."
        confirmText="Logout"
        onConfirm={confirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
}
