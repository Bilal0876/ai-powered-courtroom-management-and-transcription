import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { apiGet, apiPost } from "../utils/api";
import Footer from "../components/footer";

export default function ChiefJudgeManageUsers() {
    const [data, setData] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            navigate("/");
            return;
        }
        setUser(storedUser);

        fetchUserData();
    }, [navigate]);

    const fetchUserData = () => {
        apiGet("/api/users")
            .then(result => setData(result))
            .catch(err => console.error("❌ Error fetching users:", err));
    };

    const handleDelete = async (u) => {
        if (!window.confirm(`Are you absolutely sure you want to remove ${u.name} (${u.role})?`)) return;

        try {
            const res = await apiPost("/api/users/delete", { code: u.code, role: u.role });
            if (res.success) {
                alert("✅ User removed successfully");
                fetchUserData();
            } else {
                alert("❌ Error: " + res.error);
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("❌ Failed to delete user.");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await apiPost("/api/users/update", selectedUser);
            if (res.success) {
                alert("✅ User information updated successfully");
                setSelectedUser(null);
                fetchUserData();
            } else {
                alert("❌ Error: " + res.error);
            }
        } catch (err) {
            console.error("Update error:", err);
            alert("❌ Failed to update user.");
        }
    };

    if (!user || !data) return (
        <div className="!min-h-screen !flex !items-center !justify-center !bg-gray-50">
            <div className="!animate-spin !rounded-full !h-12 !w-12 !border-b-2 !border-[#2c3e50]"></div>
        </div>
    );

    return (
        <div className="!w-full !min-h-screen !flex !flex-col ![background-color:#f8fafc] ![font-family:Inter,sans-serif]">
            <Header user={user} />

            <div className="!flex-1 !p-[20px] lg:!p-[40px]">
                {/* Breadcrumb */}
                <div className="!max-w-[1200px] !mx-auto !flex !items-center !gap-2 !mb-8 !text-[13px]">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate("/chiefJudge-dashboard"); }} className="!text-blue-600 hover:!underline">Dashboard</a>
                    <span className="!text-gray-400">/</span>
                    <span className="!text-gray-600 !font-semibold">Modify Records</span>
                </div>

                <div className="!max-w-[1200px] !mx-auto">
                    <div className="!mb-8">
                        <h1 className="!text-[1.8rem] !font-bold !text-[#2c3e50] !m-0">User Directory Management</h1>
                        <p className="!text-gray-500 !mt-1">Update personnel details or remove users from the judicial system</p>
                    </div>

                    {data.courts.map(court => (
                        <div key={court.court_id} className="!mb-12 !bg-white !rounded-[16px] !shadow-sm !border !border-gray-100 !overflow-hidden">
                            <div className="!bg-[#2c3e50] !p-[20px] !text-white !flex !justify-between !items-center">
                                <h2 className="!text-[1.1rem] !font-bold !m-0 !flex !items-center !gap-2">
                                    <span className="!bg-[#28a745] !p-1.5 !rounded !text-[10px] !uppercase">Jurisdiction</span>
                                    {court.court_name}
                                </h2>
                                <span className="!text-[12px] !opacity-70">{court.judges.length + court.stenographers.length + court.admins.length} Total Users</span>
                            </div>

                            <div className="!p-[10px]">
                                <UserSection title="Judiciary Officers (Judges)" users={court.judges} onEdit={setSelectedUser} onDelete={handleDelete} role="judge" />
                                <UserSection title="Administrative Staff (Stenographers)" users={court.stenographers} onEdit={setSelectedUser} onDelete={handleDelete} role="stenographer" />
                                <UserSection title="System Administrators" users={court.admins} onEdit={setSelectedUser} onDelete={handleDelete} role="admin" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL */}
            {selectedUser && (
                <div className="!fixed !inset-0 !z-[1000] !flex !items-center !justify-center !p-4">
                    <div className="!absolute !inset-0 !bg-[#2c3e50]/60 !backdrop-blur-sm" onClick={() => setSelectedUser(null)}></div>
                    <div className="!relative !bg-white !w-full !max-w-[550px] !rounded-[20px] !shadow-2xl !overflow-hidden !animate-in !fade-in !zoom-in !duration-200">
                        <div className="!bg-[#2c3e50] !p-[25px] !text-white">
                            <h3 className="!text-[1.3rem] !font-bold !m-0">Modify {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}</h3>
                            <p className="!text-white/60 !text-[12px] !mt-1">Code: {selectedUser.code}</p>
                        </div>

                        <form className="!p-[30px] !space-y-5" onSubmit={handleUpdate}>
                            <div className="!grid !grid-cols-2 !gap-4">
                                <div className="!col-span-2">
                                    <label className="!block !text-[11px] !font-bold !text-gray-400 !uppercase !mb-1.5">Full Legal Name</label>
                                    <input className="!w-full !p-[12px] !border !rounded-[10px] !bg-gray-50 focus:!bg-white !outline-none" value={selectedUser.name} onChange={e => setSelectedUser({ ...selectedUser, name: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="!block !text-[11px] !font-bold !text-gray-400 !uppercase !mb-1.5">Official Email</label>
                                    <input className="!w-full !p-[12px] !border !rounded-[10px] !bg-gray-50 focus:!bg-white !outline-none" type="email" value={selectedUser.email} onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="!block !text-[11px] !font-bold !text-gray-400 !uppercase !mb-1.5">National ID (CNIC)</label>
                                    <input className="!w-full !p-[12px] !border !rounded-[10px] !bg-gray-50 focus:!bg-white !outline-none" value={selectedUser.cnic || ""} onChange={e => setSelectedUser({ ...selectedUser, cnic: e.target.value })} />
                                </div>
                                <div>
                                    <label className="!block !text-[11px] !font-bold !text-gray-400 !uppercase !mb-1.5">Date of Birth</label>
                                    <input className="!w-full !p-[12px] !border !rounded-[10px] !bg-gray-50 focus:!bg-white !outline-none" type="date" value={selectedUser.birthday ? selectedUser.birthday.split('T')[0] : ""} onChange={e => setSelectedUser({ ...selectedUser, birthday: e.target.value })} />
                                </div>
                                <div>
                                    <label className="!block !text-[11px] !font-bold !text-gray-400 !uppercase !mb-1.5">Court Assignment (ID)</label>
                                    <input className="!w-full !p-[12px] !border !rounded-[10px] !bg-gray-50 focus:!bg-white !outline-none" type="number" value={selectedUser.court} onChange={e => setSelectedUser({ ...selectedUser, court: e.target.value })} required />
                                </div>
                                <div className="!col-span-2">
                                    <label className="!block !text-[11px] !font-bold !text-gray-400 !uppercase !mb-1.5">Reset Password (Optional)</label>
                                    <input className="!w-full !p-[12px] !border !rounded-[10px] !bg-orange-50/50 focus:!bg-white focus:!border-orange-200 !outline-none" type="password" placeholder="••••••••" value={selectedUser.password} onChange={e => setSelectedUser({ ...selectedUser, password: e.target.value })} />
                                </div>
                            </div>

                            <div className="!pt-4 !flex !gap-3">
                                <button type="submit" className="!flex-1 !py-[14px] !bg-[#2c3e50] !text-white !rounded-[10px] !font-bold hover:!bg-[#1e2b38] !transition-all !shadow-lg">Save Record</button>
                                <button type="button" onClick={() => setSelectedUser(null)} className="!px-6 !py-[14px] !bg-gray-100 !text-gray-600 !rounded-[10px] !font-bold hover:!bg-gray-200 !transition-all">Dismiss</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

function UserSection({ title, users, onEdit, onDelete, role }) {
    if (users.length === 0) return null;

    return (
        <div className="!mt-2 !mb-6">
            <h4 className="!text-[13px] !font-bold !text-gray-400 !uppercase !px-[15px] !py-[10px] !mb-2">{title}</h4>
            <div className="!overflow-x-auto">
                <table className="!w-full !text-left">
                    <thead>
                        <tr className="!text-[11px] !text-gray-400 !border-b !border-gray-50">
                            <th className="!p-[15px] !font-bold">CODE</th>
                            <th className="!p-[15px] !font-bold">IDENTITY</th>
                            <th className="!p-[15px] !font-bold">CNIC / DOB</th>
                            <th className="!p-[15px] !text-right">OPERATION</th>
                        </tr>
                    </thead>
                    <tbody className="!divide-y !divide-gray-50">
                        {users.map((u, i) => (
                            <tr key={i} className="hover:!bg-gray-50/50 !transition-colors">
                                <td className="!p-[15px]">
                                    <span className="!font-mono !text-[12px] !bg-[#f0f4f8] !px-2 !py-1 !rounded !text-[#2c3e50]">{u.code}</span>
                                </td>
                                <td className="!p-[15px]">
                                    <div className="!font-bold !text-[#2c3e50] !text-[14px]">{u.name}</div>
                                    <div className="!text-gray-400 !text-[12px]">{u.email}</div>
                                </td>
                                <td className="!p-[15px]">
                                    <div className="!text-[12px] !text-gray-600">{u.cnic || "—"}</div>
                                    <div className="!text-[11px] !text-gray-400">{u.birthday ? u.birthday.split("T")[0] : "—"}</div>
                                </td>
                                <td className="!p-[15px] !text-right">
                                    <div className="!flex !justify-end !gap-2">
                                        <button 
                                            onClick={() => onEdit({ ...u, role, court: u.court_id, password: "" })}
                                            className="!p-2 !text-[#2c3e50] hover:!bg-blue-50 !rounded-[8px] !transition-colors"
                                            title="Edit Record"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            onClick={() => onDelete({ ...u, role })}
                                            className="!p-2 !text-red-500 hover:!bg-red-50 !rounded-[8px] !transition-colors"
                                            title="Remove User"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
