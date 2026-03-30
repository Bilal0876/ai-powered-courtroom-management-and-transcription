import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import DashboardHero from "../components/DashboardHero";
import Footer from "../components/footer";
import ConfirmationModal from "../components/ConfirmationModal";
import { apiPost } from "../utils/api";

export default function StenoDashboard() {
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
            .catch((err) => console.error("❌ Error fetching stenographer profile:", err));
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

                {/* Dashboard Grid */}
                <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-8">
                    {/* Hearing Management */}
                    <div className="!group !bg-white !rounded-[28px] !border !border-gray-100 !shadow-sm hover:!shadow-2xl hover:!transform hover:!translate-y-[-8px] !transition-all !overflow-hidden">
                        <div className="!bg-[#f8fafc] !p-6 !border-b !border-gray-100">
                             <h3 className="!text-[#2c3e50] !text-[20px] !font-black !mb-1">Hearing Management</h3>
                             <p className="!text-gray-500 !text-[13px]">Capture and process verbatim court recordings</p>
                        </div>
                        <div className="!p-8 !space-y-4">
                            <button
                                className="!w-full !p-4 !bg-[#2c3e50] !text-white !rounded-xl !font-bold hover:!bg-[#1a252f] !transition-all !flex !justify-between !items-center !shadow-lg active:!scale-95"
                                onClick={() => navigate("/stenographer-dashboard/select-hearing")}
                            >
                                <span>+ Start New Hearing</span>
                                <span className="!text-emerald-400">⚡</span>
                            </button>
                            <button
                                className="!w-full !p-4 !bg-white !text-[#2c3e50] !border-2 !border-gray-100 !rounded-xl !font-bold hover:!border-emerald-500 hover:!text-emerald-600 !transition-all active:!scale-95"
                                onClick={() => navigate("/stenographer-dashboard/view-transcripts")}
                            >
                                Load Previous Sessions
                            </button>
                            <button
                                className="!w-full !p-4 !bg-white !text-[#2c3e50] !border-2 !border-gray-100 !rounded-xl !font-bold hover:!border-emerald-500 hover:!text-emerald-600 !transition-all active:!scale-95"
                                onClick={() => navigate("/stenographer-dashboard/view-hearings")}
                            >
                                View Hearing Calendar
                            </button>
                        </div>
                    </div>

                    {/* Ordersheet Generation */}
                    <div className="!group !bg-white !rounded-[28px] !border !border-gray-100 !shadow-sm hover:!shadow-2xl hover:!transform hover:!translate-y-[-8px] !transition-all !overflow-hidden">
                        <div className="!bg-[#f8fafc] !p-6 !border-b !border-gray-100">
                             <h3 className="!text-[#2c3e50] !text-[20px] !font-black !mb-1">Ordersheet Generation</h3>
                             <p className="!text-gray-500 !text-[13px]">Draft formal judicial orders and decrees</p>
                        </div>
                        <div className="!p-8 !space-y-4">
                            <button
                                className="!w-full !p-4 !bg-emerald-600 !text-white !rounded-xl !font-bold hover:!bg-emerald-700 !transition-all !shadow-lg active:!scale-95"
                                onClick={() => navigate("/stenographer-dashboard/case-for-ordersheet")}
                            >
                                Manual Order Drafting
                            </button>
                            <button
                                className="!w-full !p-4 !bg-white !text-emerald-700 !border-2 !border-emerald-100 !rounded-xl !font-bold hover:!bg-emerald-50 !transition-all !flex !items-center !justify-center !gap-2 active:!scale-95"
                                onClick={() => navigate("/stenographer-dashboard/case-for-ordersheet-ai")}
                            >
                                <span>✨</span> AI-Assisted Drafting
                            </button>
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
