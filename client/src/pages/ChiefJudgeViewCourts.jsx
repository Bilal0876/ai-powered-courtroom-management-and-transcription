import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { apiGet } from "../utils/api";
import Footer from "../components/footer";

export default function ChiefJudgeViewCourts() {
    const [courts, setCourts] = useState([]);
    const [search, setSearch] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            navigate("/");
            return;
        }
        setUser(storedUser);

        apiGet("/api/courts/view")
            .then(data => setCourts(data))
            .catch(err => console.error("❌ Error loading courts:", err));
    }, [navigate]);

    const filteredCourts = courts.filter(c =>
        c.court_name.toLowerCase().includes(search.toLowerCase()) ||
        c.court_city.toLowerCase().includes(search.toLowerCase()) ||
        c.court_level.toLowerCase().includes(search.toLowerCase())
    );

    if (!user) return null;

    return (
        <div className="!w-full !min-h-screen !flex !flex-col ![background-color:#f5f5f5] ![font-family:Arial,sans-serif]">
            <Header user={user} />

            <div className="!flex-1 !p-[20px]">
                {/* Breadcrumb */}
                <div className="![background:white] ![padding:15px_20px] ![margin-bottom:20px] ![border-radius:5px] ![box-shadow:0_2px_5px_rgba(0,0,0,0.1)] ![font-size:0.9rem]">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate("/chiefJudge-dashboard"); }} className="![text-decoration:none] ![color:#2c3e50] ![font-weight:bold] hover:![text-decoration:underline]">
                        Dashboard
                    </a>{" > "}
                    <strong>Courts Directory</strong>
                </div>

                <div className="!max-w-[1200px] !mx-auto">
                    {/* Page Title & Search Bar */}
                    <div className="!bg-white !rounded-[12px] !shadow-md !p-[25px] !mb-[30px] !flex !flex-col md:!flex-row !justify-between !items-center !gap-4">
                        <div>
                            <h2 className="!text-[#2c3e50] !font-bold !text-[1.5rem] !m-0">Registered Courts</h2>
                            <p className="!text-gray-400 !text-[13px] !mt-1">Manage and view judicial jurisdictions</p>
                        </div>
                        <div className="!flex !w-full md:!w-auto !gap-2">
                            <div className="!relative !flex-1 md:!w-[350px]">
                                <span className="!absolute !left-3 !top-1/2 !-translate-y-1/2 !text-gray-400">🔍</span>
                                <input
                                    type="text"
                                    className="!w-full !pl-10 !pr-4 !py-[10px] !border !rounded-[8px] !bg-gray-50 focus:!bg-white focus:!border-[#28a745] !outline-none !text-[14px]"
                                    placeholder="Search by name, city or level..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <button
                                className="!px-4 !py-2 !bg-gray-100 !text-gray-600 !rounded-[8px] !font-bold hover:!bg-gray-200 !transition-colors"
                                onClick={() => setSearch("")}
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Desktop View Table */}
                    <div className="!hidden lg:!block !bg-white !rounded-[15px] !shadow-lg !overflow-hidden">
                        <table className="!w-full !border-collapse">
                            <thead>
                                <tr className="!bg-[#2c3e50] !text-white">
                                    <th className="!p-[15px] !text-left !text-[12px] !uppercase !tracking-widest">ID</th>
                                    <th className="!p-[15px] !text-left !text-[12px] !uppercase !tracking-widest">Court Name</th>
                                    <th className="!p-[15px] !text-left !text-[12px] !uppercase !tracking-widest">Jurisdiction</th>
                                    <th className="!p-[15px] !text-left !text-[12px] !uppercase !tracking-widest">Location</th>
                                    <th className="!p-[15px] !text-left !text-[12px] !uppercase !tracking-widest">Case Specializations</th>
                                </tr>
                            </thead>
                            <tbody className="!divide-y !divide-gray-100">
                                {filteredCourts.map(c => (
                                    <tr key={c.court_id} className="hover:!bg-[#fcfcfc] !transition-colors">
                                        <td className="!p-[15px] !text-[13px] !font-bold !text-gray-400">#{c.court_id}</td>
                                        <td className="!p-[15px] !text-[14px] !font-bold !text-[#2c3e50]">{c.court_name}</td>
                                        <td className="!p-[15px]">
                                            <span className="!bg-blue-50 !text-blue-700 !text-[10px] !font-bold !px-2 !py-1 !rounded-[4px] !uppercase">
                                                {c.court_level}
                                            </span>
                                        </td>
                                        <td className="!p-[15px]">
                                            <div className="!text-[13px] !font-bold !text-gray-700">{c.court_city}</div>
                                            <div className="!text-[11px] !text-gray-400 !truncate !max-w-[200px]">{c.court_address || "—"}</div>
                                        </td>
                                        <td className="!p-[15px]">
                                            <div className="!flex !flex-wrap !gap-1">
                                                {c.case_types
                                                    ? c.case_types.split(", ").map(type => (
                                                        <span key={type} className="!bg-gray-100 !text-[#2c3e50] !text-[10px] !px-2 !py-0.5 !rounded-full !border !border-gray-200">
                                                            {type}
                                                        </span>
                                                    ))
                                                    : <span className="!text-gray-300 !text-[11px] !italic">Not Assigned</span>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile/Tablet Card View */}
                    <div className="lg:!hidden !grid !grid-cols-1 md:!grid-cols-2 !gap-4">
                        {filteredCourts.map(c => (
                            <div key={c.court_id} className="!bg-white !rounded-[12px] !shadow-md !p-[20px] !border-t-4 !border-[#2c3e50]">
                                <div className="!flex !justify-between !items-start !mb-3">
                                    <h3 className="!font-bold !text-[#2c3e50] !text-[1.1rem] !m-0">{c.court_name}</h3>
                                    <span className="!bg-blue-50 !text-blue-700 !text-[9px] !font-bold !px-2 !py-1 !rounded !uppercase">
                                        {c.court_level}
                                    </span>
                                </div>
                                <div className="!space-y-2 !mb-4">
                                    <div className="!flex !items-center !gap-2 !text-[12px] !text-gray-600">
                                        <span className="!text-gray-400">📍</span> {c.court_city}
                                    </div>
                                    <div className="!text-[11px] !text-gray-400 !bg-gray-50 !p-2 !rounded">
                                        {c.court_address || "No address provided"}
                                    </div>
                                </div>
                                <div className="!border-t !pt-3">
                                    <label className="!block !text-[10px] !uppercase !text-gray-400 !font-bold !mb-2">Case Specializations</label>
                                    <div className="!flex !flex-wrap !gap-1">
                                        {c.case_types
                                            ? c.case_types.split(", ").map(type => (
                                                <span key={type} className="!bg-[#28a745]/10 !text-[#28a745] !text-[9px] !px-2 !py-0.5 !rounded !font-bold">
                                                    {type}
                                                </span>
                                            ))
                                            : <span className="!text-gray-300 !text-[10px]">None</span>}
                                    </div>
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
