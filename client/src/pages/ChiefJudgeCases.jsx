import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { API_BASE_URL } from "../config";
import { apiGet, apiPost } from "../utils/api";
import Footer from "../components/footer";

export default function ChiefJudgeViewsCases() {
    const [cases, setCases] = useState([]);
    const [search, setSearch] = useState("");
    const [caseType, setCaseType] = useState("");
    const [status, setStatus] = useState("");
    const [caseTypes, setCaseTypes] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            navigate("/");
            return;
        }
        setUser(storedUser);

        apiGet("/api/cases/cj-cases")
            .then((data) => setCases(data))
            .catch((err) => console.error("❌ Error loading cases:", err));
    }, [navigate]);

    useEffect(() => {
        apiGet("/case-types")
            .then((data) => setCaseTypes(data))
            .catch((err) => console.error("Error fetching case types:", err));
    }, []);

    const filteredCases = cases.filter((c) => {
        const caseNumber = (c.case_code || c.caseNumber || "").toString().toLowerCase();
        const parties = `${c.party1 || c.Case_Party1 || ""} ${c.party2 || c.Case_Party2 || ""}`.toLowerCase();
        const title = (c.caseTitle || c.Case_Title || "").toLowerCase();
        const caseTypeVal = (c.caseType || c.Case_Type || "").toLowerCase();
        const statusVal = (c.status || c.Case_Status || "").toLowerCase();

        return (
            (search === "" ||
                caseNumber.includes(search.toLowerCase()) ||
                parties.includes(search.toLowerCase()) ||
                title.includes(search.toLowerCase())) &&
            (caseType === "" || caseTypeVal === caseType) &&
            (status === "" || statusVal === status)
        );
    });

    const handleDelete = async (caseCode) => {
        if (!window.confirm(`Are you sure you want to delete case ${caseCode}?`)) return;
        try {
            const res = await apiPost("/api/cases/delete", { case_code: caseCode });
            if (res.success) {
                setCases(cases.filter(c => (c.case_code || c.Case_code) !== caseCode));
                alert("Case deleted successfully");
            }
        } catch (err) {
            console.error("❌ Delete case error:", err);
            alert("Failed to delete case");
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await apiPost("/api/cases/update", selectedCase);
            if (res.success) {
                setCases(cases.map(c => (c.case_code || c.Case_code) === selectedCase.case_code ? { ...c, ...selectedCase } : c));
                setSelectedCase(null);
                alert("Case updated successfully");
            }
        } catch (err) {
            console.error("❌ Update case error:", err);
            alert("Failed to update case");
        }
    };

    return (
        <div className="!w-full !min-h-screen !flex !flex-col ![background-color:#f5f5f5] ![font-family:Arial,sans-serif]">
            <Header user={user} />

            <div className="!flex-1 !p-[20px]">
                {/* Breadcrumb */}
                <div className="![background:white] ![padding:15px_20px] ![margin-bottom:20px] ![border-radius:5px] ![box-shadow:0_2px_5px_rgba(0,0,0,0.1)] ![font-size:0.9rem]">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate("/chiefJudge-dashboard"); }} className="![text-decoration:none] ![color:#2c3e50] ![font-weight:bold] hover:![text-decoration:underline]">
                        Dashboard
                    </a>{" > "}
                    <strong>View Cases</strong>
                </div>

                <div className="!max-w-[1400px] !mx-auto">
                    <div className="![background:white] ![border-radius:10px] ![box-shadow:0_4px_15px_rgba(0,0,0,0.1)] !overflow-hidden">
                        <div className="![background:#f8f9fa] ![padding:25px] ![border-bottom:1px_solid_#dee2e6] !flex !flex-col md:!flex-row !justify-between !items-center !gap-[15px]">
                            <div>
                                <h2 className="![color:#2c3e50] ![font-size:1.5rem] ![font-weight:bold] ![margin:0]">Case Management</h2>
                                <p className="![color:#6c757d] ![font-size:0.9rem] ![margin-top:5px]">Comprehensive list of all court cases and schedules</p>
                            </div>
                            <button
                                className="!p-[12px_25px] !bg-[#28a745] !text-white !rounded-[8px] !font-bold hover:!bg-[#1e7e34] !transition-all !shadow-md !flex !items-center !gap-2"
                                onClick={() => window.open(`${API_BASE_URL}/api/cases/download`, "_blank")}
                            >
                                📥 Download Report
                            </button>
                        </div>

                        <div className="!p-[25px]">
                            {/* Filters */}
                            <div className="!grid !grid-cols-1 md:!grid-cols-4 !gap-[15px] !mb-[25px]">
                                <input
                                    type="text"
                                    className="!w-full !p-[12px] !border !border-[#ddd] !rounded-[5px] !outline-none focus:!border-[#28a745]"
                                    placeholder="Search case #, title or party..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <select
                                    className="!w-full !p-[12px] !border !border-[#ddd] !rounded-[5px] !bg-white !outline-none focus:!border-[#28a745]"
                                    value={caseType}
                                    onChange={(e) => setCaseType(e.target.value)}
                                >
                                    <option value="">All Case Types</option>
                                    {caseTypes.map((ct) => (
                                        <option key={ct.type_id} value={ct.type_name?.toLowerCase() || ""}>
                                            {ct.type_name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="!w-full !p-[12px] !border !border-[#ddd] !rounded-[5px] !bg-white !outline-none focus:!border-[#28a745]"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="postponed">Postponed</option>
                                </select>
                                <button
                                    className="!p-[12px] !bg-[#6c757d] !text-white !rounded-[5px] !font-semibold hover:!bg-[#5a6268] !transition-colors"
                                    onClick={() => { setSearch(""); setCaseType(""); setStatus(""); }}
                                >
                                    Reset Filters
                                </button>
                            </div>

                            {/* Desktop Table */}
                            <div className="max-md:!hidden !overflow-x-auto">
                                <table className="!w-full !border-collapse !text-[13px]">
                                    <thead>
                                        <tr className="!bg-[#f8f9fa] !text-[#2c3e50]">
                                            <th className="!p-[12px] !border !border-[#dee2e6] !text-left">Case Detail</th>
                                            <th className="!p-[12px] !border !border-[#dee2e6] !text-left">Parties</th>
                                            <th className="!p-[12px] !border !border-[#dee2e6] !text-left">Judicial Staff</th>
                                            <th className="!p-[12px] !border !border-[#dee2e6] !text-left">Hearing</th>
                                            <th className="!p-[12px] !border !border-[#dee2e6] !text-center">Status</th>
                                            <th className="!p-[12px] !border !border-[#dee2e6] !text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCases.map((c) => (
                                            <tr key={c.Case_id || c.id} className="hover:!bg-[#fcfcfc]">
                                                <td className="!p-[12px] !border !border-[#dee2e6]">
                                                    <div className="!font-bold !text-[#2c3e50]">{c.caseCode || c.Case_code}</div>
                                                    <div className="!text-[11px] !text-gray-500 !mt-1 !uppercase !font-bold">{c.caseType || c.Case_Type}</div>
                                                    <div className="!mt-1 !text-[12px]">{c.caseTitle || c.Case_Title}</div>
                                                </td>
                                                <td className="!p-[12px] !border !border-[#dee2e6]">
                                                    <div className="!flex !flex-col !gap-1">
                                                        <span className="!text-[12px]"><strong>P1:</strong> {c.party1 || c.Case_Party1}</span>
                                                        <span className="!text-gray-400 !px-2">vs</span>
                                                        <span className="!text-[12px]"><strong>P2:</strong> {c.party2 || c.Case_Party2}</span>
                                                    </div>
                                                </td>
                                                <td className="!p-[12px] !border !border-[#dee2e6]">
                                                    <div className="!text-[12px]"><strong>Judge:</strong> {c.judge || "Unassigned"}</div>
                                                    <div className="!text-[12px] !mt-1"><strong>Steno:</strong> {c.steno || c.stenographer || "Unassigned"}</div>
                                                    <div className="!text-[11px] !text-blue-600 !mt-1">{c.court || "No Court Assigned"}</div>
                                                </td>
                                                <td className="!p-[12px] !border !border-[#dee2e6]">
                                                    {c.hearingDate ? (
                                                        <div className="!text-[12px]">
                                                            <div className="!font-bold">{c.hearingDate}</div>
                                                            <div className="!text-gray-500">{c.hearingTime}</div>
                                                        </div>
                                                    ) : <span className="!text-gray-400 !italic">Not Scheduled</span>}
                                                </td>
                                                <td className="!p-[12px] !border !border-[#dee2e6] !text-center">
                                                    <span className={`!px-[10px] !py-[4px] !rounded-full !text-[10px] !font-bold !uppercase !shadow-sm ${
                                                        (c.status || c.Case_Status || "").toLowerCase() === 'completed' ? '!bg-green-100 !text-green-700' :
                                                        (c.status || c.Case_Status || "").toLowerCase() === 'scheduled' ? '!bg-blue-100 !text-blue-700' :
                                                        (c.status || c.Case_Status || "").toLowerCase() === 'postponed' ? '!bg-red-100 !text-red-700' :
                                                        '!bg-yellow-100 !text-yellow-700'
                                                    }`}>
                                                        {c.status || c.Case_Status}
                                                    </span>
                                                </td>
                                                <td className="!p-[12px] !border !border-[#dee2e6]">
                                                    <div className="!flex !justify-center !gap-2">
                                                        <button 
                                                            className="!p-[6px_12px] !bg-[#6c757d] !text-white !rounded !text-[11px] hover:!bg-[#5a6268]"
                                                            onClick={() => setSelectedCase({
                                                                case_code: c.caseCode || c.Case_code,
                                                                case_type: c.caseType || c.Case_Type,
                                                                case_title: c.caseTitle || c.Case_Title,
                                                                case_status: c.status || c.Case_Status,
                                                                case_party1: c.party1 || c.Case_Party1,
                                                                case_party2: c.party2 || c.Case_Party2,
                                                                judge_code: c.judge_code || "",
                                                                steno_code: c.steno_code || "",
                                                                court: c.court || "",
                                                                case_level: c.caseLevel || c.Case_Level || ""
                                                            })}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            className="!p-[6px_12px] !bg-red-600 !text-white !rounded !text-[11px] hover:!bg-red-700"
                                                            onClick={() => handleDelete(c.caseCode || c.Case_code)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:!hidden !flex !flex-col !gap-[15px]">
                                {filteredCases.map((c) => (
                                    <div key={c.Case_id || c.id} className="!bg-white !p-[15px] !border !border-[#eee] !rounded-[8px] !shadow-sm">
                                        <div className="!flex !justify-between !items-start !mb-2">
                                            <div>
                                                <div className="!font-bold !text-[#2c3e50]">{c.caseCode || c.Case_code}</div>
                                                <div className="!text-[10px] !text-gray-400 !uppercase">{c.caseType || c.Case_Type}</div>
                                            </div>
                                            <span className={`!px-[8px] !py-[2px] !rounded-full !text-[9px] !font-bold !uppercase ${
                                                (c.status || c.Case_Status || "").toLowerCase() === 'completed' ? '!bg-green-100 !text-green-700' :
                                                '!bg-yellow-100 !text-yellow-700'
                                            }`}>
                                                {c.status || c.Case_Status}
                                            </span>
                                        </div>
                                        <div className="!text-[13px] !mb-3">{c.caseTitle || c.Case_Title}</div>
                                        <div className="!text-[12px] !text-gray-600 !mb-3">
                                            <strong>{c.party1 || c.Case_Party1}</strong> vs <strong>{c.party2 || c.Case_Party2}</strong>
                                        </div>
                                        <div className="!bg-[#f8f9fa] !p-[10px] !rounded !mb-3 !text-[11px]">
                                            <div><strong>Staff:</strong> {c.judge || "N/A"} (Judge) | {c.steno || "N/A"} (Steno)</div>
                                            <div className="!mt-1"><strong>Hearing:</strong> {c.hearingDate ? `${c.hearingDate} ${c.hearingTime}` : "TBD"}</div>
                                        </div>
                                        <div className="!flex !gap-2">
                                            <button className="!flex-1 !p-[8px] !bg-[#6c757d] !text-white !rounded !text-[12px]" onClick={() => setSelectedCase({ /* same as above */ })}>Edit</button>
                                            <button className="!flex-1 !p-[8px] !bg-red-600 !text-white !rounded !text-[12px]" onClick={() => handleDelete(c.caseCode || c.Case_code)}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            {selectedCase && (
                <div className="!fixed !inset-0 !bg-black/60 !backdrop-blur-sm !flex !items-center !justify-center !z-[1000] !p-4">
                    <div className="!bg-white !w-full !max-w-[600px] !rounded-[12px] !shadow-2xl !animate-in !fade-in !zoom-in !duration-200">
                        <div className="!p-[20px] !border-b !flex !justify-between !items-center">
                            <h3 className="!font-bold !text-[1.2rem] !text-[#2c3e50]">Edit Case Detail</h3>
                            <button onClick={() => setSelectedCase(null)} className="!text-gray-400 hover:!text-gray-600">✕</button>
                        </div>
                        <div className="!p-[25px] !max-h-[70vh] !overflow-y-auto">
                            <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-[20px]">
                                {[
                                    { label: "Case Type", key: "case_type", type: "select", options: caseTypes.map(ct => ct.type_name) },
                                    { label: "Case Title", key: "case_title", type: "input" },
                                    { label: "Status", key: "case_status", type: "select", options: ["Scheduled", "In Progress", "Completed", "Postponed"] },
                                    { label: "Party 1", key: "case_party1", type: "input" },
                                    { label: "Party 2", key: "case_party2", type: "input" },
                                    { label: "Judge Code", key: "judge_code", type: "input" },
                                    { label: "Steno Code", key: "steno_code", type: "input" },
                                    { label: "Court", key: "court", type: "input" },
                                    { label: "Case Level", key: "case_level", type: "select", options: ["High Court", "Subordinate Court"] },
                                ].map((field) => (
                                    <div key={field.key} className={field.key === "case_title" ? "md:!col-span-2" : ""}>
                                        <label className="!block !text-[12px] !font-bold !text-gray-500 !uppercase !mb-2">{field.label}</label>
                                        {field.type === "select" ? (
                                            <select 
                                                className="!w-full !p-[10px] !border !rounded-[6px] !bg-gray-50 focus:!bg-white focus:!border-[#28a745]"
                                                value={selectedCase[field.key] || ""}
                                                onChange={(e) => setSelectedCase({ ...selectedCase, [field.key]: e.target.value })}
                                            >
                                                <option value="">Select...</option>
                                                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        ) : (
                                            <input 
                                                className="!w-full !p-[10px] !border !rounded-[6px] !bg-gray-50 focus:!bg-white focus:!border-[#28a745]"
                                                value={selectedCase[field.key] || ""}
                                                onChange={(e) => setSelectedCase({ ...selectedCase, [field.key]: e.target.value })}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="!p-[20px] !bg-gray-50 !border-t !flex !justify-end !gap-[10px] !rounded-b-[12px]">
                            <button className="!px-6 !py-2 !text-gray-600 hover:!bg-gray-100 !rounded-[6px]" onClick={() => setSelectedCase(null)}>Cancel</button>
                            <button className="!px-6 !py-2 !bg-[#2c3e50] !text-white !rounded-[6px] !font-bold hover:!bg-[#1a252f]" onClick={handleUpdate}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
