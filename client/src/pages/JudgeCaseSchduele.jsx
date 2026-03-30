import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { apiGet } from "../utils/api";
import Footer from "../components/footer";

export default function JudgeViewsCases() {
    const [cases, setCases] = useState([]);
    const [search, setSearch] = useState("");
    const [caseType, setCaseType] = useState("");
    const [status, setStatus] = useState("");
    const [caseTypes, setCaseTypes] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            navigate("/");
            return;
        }
        setUser(storedUser);

        apiGet("/api/hearings/judge")
            .then((data) => setCases(data))
            .catch((err) => console.error("❌ Error loading cases:", err));
            
        apiGet("/api/courts/types")
            .then((data) => setCaseTypes(data))
            .catch((err) => console.error("Error fetching case types:", err));
    }, [navigate]);

    const filteredCases = cases.filter((c) => {
        const caseNumber = (c.caseNumber || "").toString().toLowerCase();
        const parties = `${c.party1 || ""} ${c.party2 || ""}`.toLowerCase();
        const title = (c.caseTitle || "").toLowerCase();
        const caseTypeVal = (c.caseType || "").toLowerCase();
        const statusVal = (c.status || "").toLowerCase();

        return (
            (search === "" ||
                caseNumber.includes(search.toLowerCase()) ||
                parties.includes(search.toLowerCase()) ||
                title.includes(search.toLowerCase())) &&
            (caseType === "" || caseTypeVal === caseType.toLowerCase()) &&
            (status === "" || statusVal === status.toLowerCase())
        );
    });

    if (!user) return (
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
                     <a href="#" onClick={(e) => { e.preventDefault(); navigate("/judge-dashboard"); }} className="!text-blue-600 hover:!underline">Dashboard</a>
                     <span className="!text-gray-400">/</span>
                     <span className="!text-gray-600 !font-semibold">Judicial Docket</span>
                </div>

                <div className="!max-w-[1200px] !mx-auto">
                    <div className="!mb-8 !flex !flex-col md:!flex-row !justify-between !items-start md:!items-center !gap-4">
                        <div>
                            <h1 className="!text-[1.8rem] !font-bold !text-[#2c3e50] !m-0">Presiding Officer's Docket</h1>
                            <p className="!text-gray-500 !mt-1">Review and manage your upcoming judicial proceedings</p>
                        </div>
                        <div className="!bg-[#2c3e50] !text-white !px-4 !py-2 !rounded-lg !text-[12px] !font-bold">
                            {filteredCases.length} Hearings Found
                        </div>
                    </div>

                    <div className="!bg-white !rounded-[16px] !shadow-xl !overflow-hidden !border !border-gray-100">
                        {/* Filter Bar */}
                        <div className="!bg-[#fcfdfd] !p-[25px] !border-b !border-gray-100">
                            <div className="!grid !grid-cols-1 md:!grid-cols-4 !gap-4">
                                <div className="!relative">
                                    <span className="!absolute !left-3 !top-1/2 !-translate-y-1/2 !text-gray-400">🔍</span>
                                    <input
                                        type="text"
                                        className="!w-full !pl-10 !pr-4 !py-[12px] !border !rounded-[10px] !bg-white focus:!border-[#2c3e50] !outline-none !text-[14px]"
                                        placeholder="Case # or Party..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="!w-full !p-[12px] !border !rounded-[10px] !bg-white focus:!border-[#2c3e50] !outline-none !text-[14px]"
                                    value={caseType}
                                    onChange={(e) => setCaseType(e.target.value)}
                                >
                                    <option value="">All Case Types</option>
                                    {caseTypes.map((ct) => (
                                        <option key={ct.type_id || ct.id} value={ct.type_name || ct.name}>
                                            {ct.type_name || ct.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="!w-full !p-[12px] !border !rounded-[10px] !bg-white focus:!border-[#2c3e50] !outline-none !text-[14px]"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="scheduled">Date Scheduled</option>
                                    <option value="in-progress">Hearings Active</option>
                                    <option value="completed">Concluded</option>
                                    <option value="postponed">Adjourned</option>
                                </select>
                                <button
                                    className="!py-[12px] !px-4 !bg-gray-100 !text-gray-600 !rounded-[10px] !font-bold hover:!bg-gray-200 !transition-all !text-[13px]"
                                    onClick={() => {
                                        setSearch("");
                                        setCaseType("");
                                        setStatus("");
                                    }}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>

                        {/* Desktop View */}
                        <div className="!hidden md:!block !overflow-x-auto">
                            <table className="!w-full !text-left">
                                <thead>
                                    <tr className="!bg-gray-50/50 !text-gray-400 !text-[11px] !font-bold !uppercase !tracking-wider">
                                        <th className="!p-[18px]">Reference</th>
                                        <th className="!p-[18px]">Jurisdiction</th>
                                        <th className="!p-[18px]">Litigant Parties</th>
                                        <th className="!p-[18px]">Staff Support</th>
                                        <th className="!p-[18px]">Hearing Time</th>
                                        <th className="!p-[18px] !text-right !pr-[30px]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="!divide-y !divide-gray-50">
                                    {filteredCases.map((c) => (
                                        <tr key={c.id} className="hover:!bg-[#f8fafc] !transition-colors">
                                            <td className="!p-[18px] !font-bold !text-[#2c3e50] !text-[14px]">{c.caseNumber}</td>
                                            <td className="!p-[18px]">
                                                <span className="!px-2 !py-1 !bg-blue-50 !text-blue-600 !rounded !text-[10px] !font-bold !uppercase">
                                                    {c.caseType}
                                                </span>
                                            </td>
                                            <td className="!p-[18px]">
                                                <div className="!font-bold !text-gray-800 !text-[13px]">{c.party1}</div>
                                                <div className="!text-[11px] !text-gray-400 !font-bold">VS. {c.party2}</div>
                                            </td>
                                            <td className="!p-[18px] !text-[12px] !text-gray-500">
                                                <div className="!flex !items-center !gap-1.5">
                                                    <span className="!opacity-50">✍️</span> {c.stenographer || "Unassigned"}
                                                </div>
                                            </td>
                                            <td className="!p-[18px]">
                                                {c.hearingDate ? (
                                                    <div className="!group">
                                                        <div className="!font-bold !text-[#2c3e50] !text-[13px]">{c.hearingDate}</div>
                                                        <div className="!text-[11px] !text-gray-400">{c.hearingTime}</div>
                                                    </div>
                                                ) : <span className="!text-orange-400 !text-[12px] !italic">Not Calendered</span>}
                                            </td>
                                            <td className="!p-[18px] !text-right !pr-[30px]">
                                                <span className={`!inline-block !px-3 !py-1 !rounded-full !text-[10px] !font-bold !uppercase !tracking-wide ${getStatusClass(c.status)}`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="md:!hidden !p-4 !space-y-4">
                            {filteredCases.map((c) => (
                                <div key={c.id} className="!bg-[#fcfcfc] !border !border-gray-100 !rounded-[12px] !p-5 !shadow-sm !relative !overflow-hidden">
                                    <div className={`!absolute !left-0 !top-0 !bottom-0 !w-1 ${getStatusBorder(c.status)}`}></div>
                                    <div className="!flex !justify-between !items-start !mb-4">
                                        <div>
                                            <div className="!text-[11px] !font-bold !text-[#28a745] !uppercase !tracking-widest">{c.caseNumber}</div>
                                            <div className="!text-[15px] !font-bold !text-[#2c3e50] !mt-1">{c.caseTitle || "Unnamed Case"}</div>
                                        </div>
                                        <span className={`!px-2 !py-0.5 !rounded !text-[9px] !font-bold !uppercase ${getStatusClass(c.status)}`}>
                                            {c.status}
                                        </span>
                                    </div>
                                    <div className="!space-y-3 !text-[13px] !text-gray-600">
                                        <div className="!flex !justify-between">
                                            <span className="!text-gray-400 !text-[11px] !uppercase !font-bold">Litigants</span>
                                            <span className="!font-bold !text-[#2c3e50]">{c.party1} vs {c.party2}</span>
                                        </div>
                                        <div className="!flex !justify-between">
                                            <span className="!text-gray-400 !text-[11px] !uppercase !font-bold">Schedule</span>
                                            <span className="!font-medium">{c.hearingDate || "No Date"} • {c.hearingTime || "No Time"}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredCases.length === 0 && (
                            <div className="!text-center !py-[60px]">
                                <div className="!text-[3rem] !mb-2">📋</div>
                                <div className="!text-[#2c3e50] !font-bold">No Records Found</div>
                                <div className="!text-gray-400 !text-[13px] !mt-1">Adjust your filters to refine the search results</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

function getStatusClass(status) {
    const s = (status || "").toLowerCase();
    if (s.includes("scheduled")) return "!bg-blue-100 !text-blue-700";
    if (s.includes("progress")) return "!bg-orange-100 !text-orange-700";
    if (s.includes("completed")) return "!bg-green-100 !text-green-700";
    if (s.includes("postponed") || s.includes("adjourned")) return "!bg-red-100 !text-red-700";
    return "!bg-gray-100 !text-gray-700";
}

function getStatusBorder(status) {
    const s = (status || "").toLowerCase();
    if (s.includes("scheduled")) return "!bg-blue-500";
    if (s.includes("progress")) return "!bg-orange-500";
    if (s.includes("completed")) return "!bg-green-500";
    if (s.includes("postponed") || s.includes("adjourned")) return "!bg-red-500";
    return "!bg-gray-400";
}
