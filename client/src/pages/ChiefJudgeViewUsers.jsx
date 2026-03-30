import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { apiGet } from "../utils/api";
import Footer from "../components/footer";

export default function ChiefJudgeViewUsers() {
    const [data, setData] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            navigate("/");
            return;
        }
        setUser(storedUser);

        apiGet("/api/users/by-court")
            .then(result => setData(result))
            .catch(err => console.error("❌ Error loading users:", err));
    }, [navigate]);

    if (!data || !user) {
        return (
            <div className="!min-h-screen !flex !items-center !justify-center !bg-[#f5f5f5]">
                <div className="!animate-spin !rounded-full !h-12 !w-12 !border-b-2 !border-[#2c3e50]"></div>
            </div>
        );
    }

    const { chiefJudge, courts } = data;

    return (
        <div className="!w-full !min-h-screen !flex !flex-col ![background-color:#f5f5f5] ![font-family:Arial,sans-serif]">
            <Header user={user} />

            <div className="!flex-1 !p-[20px]">
                {/* Breadcrumb */}
                <div className="![background:white] ![padding:15px_20px] ![margin-bottom:20px] ![border-radius:5px] ![box-shadow:0_2px_5px_rgba(0,0,0,0.1)] ![font-size:0.9rem]">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate("/chiefJudge-dashboard"); }} className="![text-decoration:none] ![color:#2c3e50] ![font-weight:bold] hover:![text-decoration:underline]">
                        Dashboard
                    </a>{" > "}
                    <strong>Courts & Staff</strong>
                </div>

                <div className="!max-w-[1200px] !mx-auto">
                    {/* Chief Judge Section */}
                    {chiefJudge && (
                        <div className="!bg-white !rounded-[12px] !shadow-md !p-[25px] !mb-[30px] !border-l-[6px] !border-[#2c3e50]">
                            <h3 className="!text-[#2c3e50] !font-bold !text-[1.25rem] !mb-[20px] !flex !items-center !gap-2">
                                ⚖️ Chief Judge Presence
                            </h3>
                            <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-[20px]">
                                <div>
                                    <label className="!block !text-[11px] !uppercase !tracking-widest !text-gray-400 !font-bold !mb-1">Name & Code</label>
                                    <div className="!font-bold !text-[#2c3e50]">{chiefJudge.name} ({chiefJudge.code})</div>
                                </div>
                                <div>
                                    <label className="!block !text-[11px] !uppercase !tracking-widest !text-gray-400 !font-bold !mb-1">Credential Email</label>
                                    <div className="!text-gray-600">{chiefJudge.email}</div>
                                </div>
                                <div>
                                    <label className="!block !text-[11px] !uppercase !tracking-widest !text-gray-400 !font-bold !mb-1">Identification (CNIC)</label>
                                    <div className="!text-gray-600">{chiefJudge.cnic}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Courts & Staff Sections */}
                    <div className="!space-y-[40px]">
                        {courts.map(court => (
                            <div key={court.court_id} className="!bg-white !rounded-[15px] !shadow-lg !overflow-hidden">
                                <div className="!bg-[#2c3e50] !p-[20px] !text-white !flex !justify-between !items-center">
                                    <h2 className="!font-bold !text-[1.3rem] !m-0">{court.court_name}</h2>
                                    <span className="!bg-white/20 !px-[12px] !py-[4px] !rounded-full !text-[11px] !font-bold !uppercase !tracking-tighter">
                                        Active Jurisdiction
                                    </span>
                                </div>

                                <div className="!p-[25px] !space-y-[30px]">
                                    <StaffSection title="🧑‍⚖️ Judges" users={court.judges} color="green" />
                                    <StaffSection title="⌨️ Stenographers" users={court.stenographers} color="blue" />
                                    <StaffSection title="🛡️ Administrative Staff" users={court.admins} color="slate" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

function StaffSection({ title, users, color }) {
    if (!users || users.length === 0) return null;

    const accentColor = color === 'green' ? '#28a745' : color === 'blue' ? '#007bff' : '#6c757d';

    return (
        <div className="!mb-[20px]">
            <h4 className="!text-[1rem] !font-bold !text-[#2c3e50] !mb-[15px] !border-b !pb-2 !flex !items-center !gap-2">
                {title} <span className="!bg-gray-100 !text-[#2c3e50] !text-[10px] !px-2 !py-0.5 !rounded-full">{users.length}</span>
            </h4>

            {/* Desktop Table View */}
            <div className="!hidden md:!block !overflow-x-auto">
                <table className="!w-full !border-collapse">
                    <thead>
                        <tr className="!bg-gray-50">
                            <th className="!p-[12px] !text-left !text-[11px] !uppercase !tracking-wider !text-gray-400 !border-b">Code</th>
                            <th className="!p-[12px] !text-left !text-[11px] !uppercase !tracking-wider !text-gray-400 !border-b">Full Name</th>
                            <th className="!p-[12px] !text-left !text-[11px] !uppercase !tracking-wider !text-gray-400 !border-b">Email Address</th>
                            <th className="!p-[12px] !text-left !text-[11px] !uppercase !tracking-wider !text-gray-400 !border-b">CNIC Number</th>
                            <th className="!p-[12px] !text-left !text-[11px] !uppercase !tracking-wider !text-gray-400 !border-b">Date of Birth</th>
                        </tr>
                    </thead>
                    <tbody className="!divide-y !divide-gray-100">
                        {users.map((u, i) => (
                            <tr key={u.code || i} className="hover:!bg-[#fcfcfc]">
                                <td className="!p-[12px] !text-[13px] !font-bold !text-[#2c3e50]">{u.code}</td>
                                <td className="!p-[12px] !text-[13px]">{u.name}</td>
                                <td className="!p-[12px] !text-[13px] !text-blue-600">{u.email}</td>
                                <td className="!p-[12px] !text-[13px] !text-gray-500">{u.cnic || "—"}</td>
                                <td className="!p-[12px] !text-[13px] !text-gray-500">
                                    {u.birthday ? new Date(u.birthday).toLocaleDateString() : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:!hidden !space-y-3">
                {users.map((u, i) => (
                    <div key={u.code || i} className="!bg-gray-50 !p-[15px] !rounded-[10px] !border !border-gray-100">
                        <div className="!flex !justify-between !items-start !mb-2">
                            <span className="!font-bold !text-[#2c3e50]">{u.name}</span>
                            <span className="!bg-white !text-gray-500 !text-[10px] !px-2 !py-1 !rounded !border">{u.code}</span>
                        </div>
                        <div className="!text-[12px] !text-blue-600 !mb-1">{u.email}</div>
                        <div className="!grid !grid-cols-2 !gap-2 !mt-3 !pt-3 !border-t !border-gray-200">
                            <div>
                                <label className="!block !text-[9px] !uppercase !text-gray-400">CNIC</label>
                                <span className="!text-[11px]">{u.cnic || "—"}</span>
                            </div>
                            <div>
                                <label className="!block !text-[9px] !uppercase !text-gray-400">DOB</label>
                                <span className="!text-[11px]">{u.birthday ? new Date(u.birthday).toLocaleDateString() : "—"}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
