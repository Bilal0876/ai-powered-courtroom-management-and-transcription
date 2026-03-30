import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import DashboardHero from "../components/DashboardHero";
import { apiPost } from "../utils/api";
import Footer from "../components/footer";
import ConfirmationModal from "../components/ConfirmationModal";

export default function JudgeDashboard() {
  const [user, setUser] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (parsedUser) {
      setUser(parsedUser);

      // Fetch fresh details from backend using standardized apiPost
      apiPost("/profile", {
        email: parsedUser.email,
        role: parsedUser.role,
      })
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        }
      })
      .catch((err) => console.error("❌ Error fetching judge profile:", err));
    } else {
        navigate("/");
    }
  }, [navigate]);

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
      <Header user={user} />

      <main className="!flex-1 !max-w-[1400px] !mx-auto !w-full !p-6 lg:!p-10">
        {/* Reusable Hero Section */}
        <DashboardHero user={user} onLogout={handleLogout} />

        {/* Action Grid */}
        <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4 !gap-6 !mb-12">
            <DashboardCard 
                title="Audit Transcripts"
                desc="Review and seal verbatim records from recent hearings."
                icon="🖋️"
                count="4 Pending"
                color="!bg-amber-50"
                onClick={() => navigate("/judge-dash/pending-transcripts")}
            />
            <DashboardCard 
                title="Review Ordersheets"
                desc="Examine and authorize draft judicial orders."
                icon="📜"
                count="2 Drafts"
                color="!bg-indigo-50"
                onClick={() => navigate("/judge-dash/pending-ordersheets")}
            />
            <DashboardCard 
                title="Chambers Docket"
                desc="View upcoming hearing schedules and case assignments."
                icon="📅"
                color="!bg-emerald-50"
                onClick={() => navigate("/judge-dash/view-cases")}
            />
            <DashboardCard 
                title="Case Repository"
                desc="Access archived artifacts and digital case logs."
                icon="📂"
                color="!bg-slate-100"
                onClick={() => navigate("/judge-dash/download-case-items")}
            />
        </div>

        {/* Quick Stats / Recent Activity Placeholder */}
        <div className="!bg-white !rounded-[24px] !p-8 !border !border-gray-100 !shadow-sm">
            <h3 className="!text-[#2c3e50] !font-bold !text-[18px] !mb-6 !flex !items-center !gap-3">
                <span className="!w-2 !h-8 !bg-emerald-500 !rounded-full"></span>
                Judicial Summary
            </h3>
            <div className="!grid !grid-cols-1 sm:!grid-cols-3 !gap-8">
                <div className="!text-center p-4 !bg-gray-50 !rounded-2xl">
                    <div className="!text-2xl !font-black !text-[#2c3e50]">12</div>
                    <div className="!text-[10px] !uppercase !tracking-widest !text-gray-400 !font-bold !mt-1">Cases Heard This week</div>
                </div>
                <div className="!text-center p-4 !bg-gray-50 !rounded-2xl">
                    <div className="!text-2xl !font-black !text-[#2c3e50]">98%</div>
                    <div className="!text-[10px] !uppercase !tracking-widest !text-gray-400 !font-bold !mt-1">Accuracy Rating</div>
                </div>
                <div className="!text-center p-4 !bg-gray-50 !rounded-2xl">
                    <div className="!text-2xl !font-black !text-[#2c3e50]">0</div>
                    <div className="!text-[10px] !uppercase !tracking-widest !text-gray-400 !font-bold !mt-1">Critical Alerts</div>
                </div>
            </div>
        </div>
      </main>

      <Footer />

      <ConfirmationModal 
          isOpen={isLogoutModalOpen}
          title="Logout Confirmation"
          message="Are you sure you want to logout? You will need to sign in again to access your judicial workspace."
          confirmText="Logout"
          onConfirm={confirmLogout}
          onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
}

function DashboardCard({ title, desc, icon, count, color, onClick }) {
    return (
        <button 
            onClick={onClick}
            className={`!group !text-left !p-8 !rounded-[28px] !border !border-gray-100 !shadow-sm hover:!shadow-2xl hover:!transform hover:!translate-y-[-8px] !transition-all !bg-white !flex !flex-col !h-full !relative !overflow-hidden`}
        >
            <div className={`!w-14 !h-14 ${color || '!bg-gray-50'} !rounded-2xl !flex !items-center !justify-center !text-2xl !mb-6 !group-hover:!scale-110 !transition-transform`}>
                {icon}
            </div>
            <h4 className="!text-[#2c3e50] !text-[18px] !font-black !mb-2">{title}</h4>
            <p className="!text-gray-500 !text-[13px] !leading-relaxed !flex-1">{desc}</p>
            {count && (
                <div className="!mt-4 !inline-flex !items-center !gap-2 !text-[11px] !font-bold !text-emerald-600 !uppercase !tracking-tighter">
                    <span className="!w-1.5 !h-1.5 !bg-emerald-500 !rounded-full !animate-pulse"></span>
                    {count}
                </div>
            )}
            <div className="!absolute !bottom-0 !right-0 !p-4 !opacity-0 !group-hover:!opacity-100 !transition-opacity !text-emerald-500">
                <span className="!text-xl">→</span>
            </div>
        </button>
    )
}
