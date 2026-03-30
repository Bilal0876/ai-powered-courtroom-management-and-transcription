import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import DashboardHero from "../components/DashboardHero";
import { apiPost } from "../utils/api";
import Footer from "../components/footer";
import ConfirmationModal from "../components/ConfirmationModal";

export default function ChiefJudgeDashboard() {
    const [user, setUser] = useState(null);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;

        if (parsedUser) {
            setUser(parsedUser);

            // Fetch fresh details from backend
            apiPost("/profile", {
                email: parsedUser.email,
                role: parsedUser.role,
            })
            .then((data) => {
                if (data.success) {
                    setUser(data.user);
                }
            })
            .catch((err) => console.error("❌ Error fetching chief judge profile:", err));
        } else {
            navigate("/");
        }
    }, [navigate]);

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem("user");
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

            <div className="!flex-1 !max-w-[1400px] !mx-auto !w-full !p-6 lg:!p-10">
                {/* Welcome Section */}
                <DashboardHero user={user} onLogout={handleLogout} />

                    {/* Dashboard Grid */}
                    <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-[25px]">
                        {/* Case Management */}
                        <div className="!bg-white !rounded-[15px] !shadow-sm !border !border-[#eee] !overflow-hidden !transition-transform hover:!translate-y-[-5px]">
                            <div className="!bg-[#f8f9fa] !p-[20px] !border-bottom !border-[#eee]">
                                <h3 className="!text-[#2c3e50] !font-bold !text-[1.2rem]">Case Management</h3>
                                <p className="!text-gray-500 !text-[14px]">Schedules and Assignments</p>
                            </div>
                            <div className="!p-[25px] !space-y-[15px] !flex !flex-col !h-full">
                                <button
                                    className="!w-full !p-[15px] !bg-[#2c3e50] !text-white !rounded-[10px] !font-semibold hover:!bg-[#1a252f] !transition-all !text-left !flex !justify-between !items-center"
                                    onClick={() => navigate("/chiefJudge-dashboard/hearing-schedule")}
                                >
                                    <span>Assign Judge & Schedule Hearing</span>
                                    <span>→</span>
                                </button>
                                <button
                                    className="!w-full !p-[15px] !bg-white !text-[#2c3e50] !border !border-[#ddd] !rounded-[10px] !font-semibold hover:!bg-gray-50 !transition-all !text-left"
                                    onClick={() => navigate("/chiefJudge-dashboard/view-cases")}
                                >
                                    View All Cases
                                </button>
                                <button
                                    className="!w-full !p-[15px] !bg-white !text-[#2c3e50] !border !border-[#ddd] !rounded-[10px] !font-semibold hover:!bg-gray-50 !transition-all !text-left"
                                    onClick={() => navigate("/chiefJudge-dashboard/add-cases")}
                                >
                                    Add New Case
                                </button>
                            </div>
                        </div>

                        {/* Staff Management */}
                        <div className="!bg-white !rounded-[15px] !shadow-sm !border !border-[#eee] !overflow-hidden !transition-transform hover:!translate-y-[-5px]">
                            <div className="!bg-[#f8f9fa] !p-[20px] !border-bottom !border-[#eee]">
                                <h3 className="!text-[#2c3e50] !font-bold !text-[1.2rem]">Judge & Staff</h3>
                                <p className="!text-gray-500 !text-[14px]">User and Access Control</p>
                            </div>
                            <div className="!p-[25px] !space-y-[15px] !flex !flex-col !h-full">
                                <button
                                    className="!w-full !p-[15px] !bg-[#28a745] !text-white !rounded-[10px] !font-semibold hover:!bg-[#218838] !transition-all !text-left"
                                    onClick={() => navigate("/chiefJudge-dashboard/add-user")}
                                >
                                    + Add New Judge/Staff
                                </button>
                                <button
                                    className="!w-full !p-[15px] !bg-white !text-[#2c3e50] !border !border-[#ddd] !rounded-[10px] !font-semibold hover:!bg-gray-50 !transition-all !text-left"
                                    onClick={() => navigate("/chiefJudge-dashboard/update-staff")}
                                >
                                    Edit Staff Information
                                </button>
                                <button
                                    className="!w-full !p-[15px] !bg-white !text-[#2c3e50] !border !border-[#ddd] !rounded-[10px] !font-semibold hover:!bg-gray-50 !transition-all !text-left"
                                    onClick={() => navigate("/chiefJudge-dashboard/view-users")}
                                >
                                    View All Judicial Staff
                                </button>
                            </div>
                        </div>

                        {/* Court Management */}
                        <div className="!bg-white !rounded-[15px] !shadow-sm !border !border-[#eee] !overflow-hidden !transition-transform hover:!translate-y-[-5px]">
                            <div className="!bg-[#f8f9fa] !p-[20px] !border-bottom !border-[#eee]">
                                <h3 className="!text-[#2c3e50] !font-bold !text-[1.2rem]">Court Infrastructure</h3>
                                <p className="!text-gray-500 !text-[14px]">Manage Courts and Case Types</p>
                            </div>
                            <div className="!p-[25px] !space-y-[15px] !flex !flex-col !h-full">
                                <div className="!grid !grid-cols-2 !gap-[10px]">
                                    <button
                                        className="!p-[15px] !bg-white !text-[#2c3e50] !border !border-[#ddd] !rounded-[10px] !font-semibold hover:!bg-gray-50 !transition-all !text-[13px]"
                                        onClick={() => navigate("/chiefJudge-dashboard/add-court")}
                                    >
                                        Add Court
                                    </button>
                                    <button
                                        className="!p-[15px] !bg-white !text-[#2c3e50] !border !border-[#ddd] !rounded-[10px] !font-semibold hover:!bg-gray-50 !transition-all !text-[13px]"
                                        onClick={() => navigate("/chiefJudge-dashboard/add-type")}
                                    >
                                        Add Case Type
                                    </button>
                                </div>
                                <button
                                    className="!w-full !p-[15px] !bg-white !text-[#2c3e50] !border !border-[#ddd] !rounded-[10px] !font-semibold hover:!bg-gray-50 !transition-all !text-left"
                                    onClick={() => navigate("/chiefJudge-dashboard/assign-type-to-court")}
                                >
                                    Assign Case Type to Court
                                </button>
                                <button
                                    className="!w-full !p-[15px] !bg-white !text-[#2c3e50] !border !border-[#ddd] !rounded-[10px] !font-semibold hover:!bg-gray-50 !transition-all !text-left"
                                    onClick={() => navigate("/chiefJudge-dashboard/view-courts")}
                                >
                                    View All Courts
                                </button>
                            </div>
                        </div>

                        {/* Archive & Downloads */}
                        <div className="!bg-white !rounded-[15px] !shadow-sm !border !border-[#eee] !overflow-hidden !transition-transform hover:!translate-y-[-5px]">
                            <div className="!bg-[#f8f9fa] !p-[20px] !border-bottom !border-[#eee]">
                                <h3 className="!text-[#2c3e50] !font-bold !text-[1.2rem]">Archives & Records</h3>
                                <p className="!text-gray-500 !text-[14px]">Transcripts and Ordersheets</p>
                            </div>
                            <div className="!p-[25px] !space-y-[15px] !flex !flex-col !h-full">
                                <button
                                    className="!w-full !p-[20px] !bg-blue-600 !text-white !rounded-[12px] !font-bold hover:!bg-blue-700 !transition-all !shadow-md !flex !items-center !justify-center !gap-[10px]"
                                    onClick={() => navigate("/chiefJudge-dashboard/download-case")}
                                >
                                    <span className="!text-[24px]">📥</span>
                                    <span>Download Case Logs</span>
                                </button>
                                <p className="!text-center !text-[12px] !text-gray-400 !italic"> Access finalized case documents and audio recordings</p>
                            </div>
                        </div>
                    </div>
                </div>

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
