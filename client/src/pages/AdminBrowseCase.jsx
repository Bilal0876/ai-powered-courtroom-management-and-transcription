import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { API_BASE_URL } from "../config";
import { apiGet, apiPost } from "../utils/api";
import Footer from "../components/footer";
import ConfirmationModal from "../components/ConfirmationModal";


const getBadgeBg = (type) => {
    const t = (type || "").toLowerCase();
    if (t === 'criminal') return '#dc3545';
    if (t === 'civil') return '#28a745';
    if (t === 'family') return '#fffb07';
    if (t === 'labor') return '#008cff';
    if (t === 'commercial') return '#ff8000';
    if (t === 'banking') return '#65f4a5';
    if (t === 'anti-corruption') return '#692865';
    if (t === 'election') return '#b29411';
    if (t === 'environmental') return '#492b02';
    if (t === 'constitutional') return '#03ffea';
    if (t === 'tax') return '#000000';
    if (t === 'customs') return '#dcdcdc';
    return '#555555';
};

const getBadgeText = (type) => {
    const t = (type || "").toLowerCase();
    if (['family', 'commercial', 'banking', 'constitutional', 'customs'].includes(t)) return '#212529';
    return '#ffffff';
};

const getStatusBg = (status) => {
    const s = (status || "postponed").toLowerCase();
    if (s === 'scheduled') return '#007bff';
    if (s === 'in progress' || s === 'in-progress') return '#ffc107';
    if (s === 'completed') return '#28a745';
    if (s === 'postponed') return '#dc3545';
    return '#6c757d';
};

const getStatusText = (status) => {
    const s = (status || "postponed").toLowerCase();
    if (s === 'in progress' || s === 'in-progress') return '#212529';
    return '#ffffff';
};

export default function AdminBrowseCases({ setCurrentPage }) {
    const [cases, setCases] = useState([]);
    const [search, setSearch] = useState("");
    const [caseType, setCaseType] = useState("");
    const [status, setStatus] = useState("");
    const [caseTypes, setCaseTypes] = useState([]);
    const navigate = useNavigate();
    const [selectedCase, setSelectedCase] = useState(null);
    const [allJudges, setAllJudges] = useState([]);
    const [allStenos, setAllStenos] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [caseToDelete, setCaseToDelete] = useState(null);

    useEffect(() => {
        // ✅ Use apiGet with JWT
        apiGet("/api/cases")
            .then((data) => setCases(data))
            .catch((err) => console.error("❌ Error loading cases:", err));
    }, []);

    const handleDelete = async (caseCode) => {
        setCaseToDelete(caseCode);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await apiPost("/api/cases/delete", { case_code: caseToDelete });
            setCases((prev) => prev.filter((c) => c.caseCode !== caseToDelete));
            setIsDeleteModalOpen(false);
            setCaseToDelete(null);
        } catch (err) {
            console.error("Delete error:", err);
            alert("Delete failed: " + (err.data?.message || err.message));
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await apiGet("/api/courts/types");
                setCaseTypes(data);
            } catch (err) {
                console.error("Error fetching case types:", err);
            }
        }
        
        async function fetchJudgesAndStenos() {
            try {
                // Fetch all judges and stenos by passing 'all' to the backend
                const judgesData = await apiGet("/api/users/judges/all");
                const stenosData = await apiGet("/api/users/stenos/all");
                setAllJudges(judgesData || []);
                setAllStenos(stenosData || []);
            } catch (err) {
                console.error("Error fetching judges/stenos:", err);
            }
        }

        fetchData();
        fetchJudgesAndStenos();
    }, []);

    const filteredCases = cases.filter((c) => {
        const caseNumber = typeof c.caseCode === "string" ? c.caseCode.toLowerCase() : "";
        const parties = `${c.party1 || ""} ${c.party2 || ""}`.toLowerCase();
        const title = typeof c.caseTitle === "string" ? c.caseTitle.toLowerCase() : "";
        const caseTypeVal = typeof c.caseType === "string" ? c.caseType.toLowerCase() : "";
        const statusVal = typeof c.status === "string" ? c.status.toLowerCase() : "";

        return (
            (search === "" ||
                caseNumber.includes(search.toLowerCase()) ||
                parties.includes(search.toLowerCase()) ||
                title.includes(search.toLowerCase())) &&
            (caseType === "" || caseTypeVal === caseType) &&
            (status === "" || statusVal === status)
        );
    });

    const handleUpdate = async () => {
        try {
            // ✅ Use apiPost with JWT
            await apiPost("/api/cases/update", selectedCase);

            alert("✅ Case updated successfully!");
            setSelectedCase(null);
            window.location.reload();
        } catch (err) {
            console.error("❌ Update failed:", err);
            const errorMessage = err.data?.error || err.message || "Failed to update case";
            alert("❌ Error: " + errorMessage);
        }
    };

    return (
        <div className="!w-full !min-h-screen !flex !flex-col !bg-[#f5f5f5] !font-sans">
            {/* Header */}
            <Header />
            <div className="!flex-1 !p-[20px]">
                <div className="!bg-white !px-[20px] !py-[15px] !mb-[20px] !rounded-[5px] !shadow-[0_2px_5px_rgba(0,0,0,0.1)] !text-[0.9rem]">
                    <a href="#" onClick={() => navigate("/admin-dash")} className="!no-underline !text-black !font-bold hover:!underline">
                        Dashboard
                    </a>{" > "}
                    <strong>View Cases</strong>
                </div>

                <div className="!flex !justify-between !items-center !mb-[20px]">
                    <h2 className="!text-[1.5rem] !font-semibold !text-[#2c3e50] !mb-[15px]">Case Schedules</h2>
                </div>

                <div className="!block !mb-[20px]">
                    {/* Cases Table */}
                    <div className="!bg-white !rounded-[5px] !shadow-[0_2px_5px_rgba(0,0,0,0.1)] !border-t-[4px] !border-white !overflow-hidden max-md:!overflow-x-auto">
                        <div className="!bg-[#f8f9fa] !px-[20px] !py-[15px] !border-b !border-[#dee2e6] !font-semibold !text-[#2c3e50] !flex !items-center !gap-[10px]">Browse Cases</div>

                        {/* ✅ Move Search + Filters here */}
                        <div className="!flex !gap-[10px] !m-[15px] max-md:!flex-col">
                            <div className="!flex !flex-col !w-full !max-w-md">
                                <label htmlFor="search-input" className="sr-only">Search Cases</label>
                                <input 
                                    id="search-input"
                                    type="text"
                                    className="!p-[8px_12px] !border !border-[#ced4da] !rounded-[4px] !text-[14px] !w-full focus:!border-[#28a745] focus:!outline-none"
                                    placeholder="Search by case number or party..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="!flex !flex-col !w-full !max-w-xs">
                                <label htmlFor="type-filter" className="sr-only">Filter by Case Type</label>
                                <select 
                                    id="type-filter"
                                    className="!p-[8px_12px] !border !border-[#ced4da] !rounded-[4px] !text-[14px] !w-full focus:!border-[#28a745] focus:!outline-none !bg-white"
                                    value={caseType}
                                    onChange={(e) => setCaseType(e.target.value)}
                                >
                                    <option value="">All Case Types</option>
                                    {caseTypes.map((ct, index) => (
                                        <option key={ct.type_id || `case-type-${index}`} value={(ct.type_name || "").toLowerCase()}>
                                            {ct.type_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="!flex !flex-col !w-full !max-w-xs">
                                <label htmlFor="status-filter" className="sr-only">Filter by Status</label>
                                <select 
                                    id="status-filter"
                                    className="!p-[8px_12px] !border !border-[#ced4da] !rounded-[4px] !text-[14px] !w-full focus:!border-[#28a745] focus:!outline-none !bg-white"
                                    onChange={(e) => setStatus(e.target.value)}
                                    value={status}
                                >
                                    <option value="">All Status</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="postponed">Postponed</option>
                                </select>
                            </div>
                            <button
                                className="!p-[10px_20px] !border-none !rounded-[4px] !cursor-pointer !font-medium !transition-colors !duration-300 !flex !items-center !justify-center !gap-[8px] !bg-[#6c757d] !text-white hover:!bg-[#545b62] max-md:!w-full"
                                onClick={() => {
                                    setSearch("");
                                    setCaseType("");
                                    setStatus("");
                                }}
                            >
                                Clear
                            </button>
                        </div>

                        {/* ✅ Full-width table */}
                        <div>
                            <table className="!w-[95%] !mx-auto !text-center !border-collapse !text-[12px] xl:!text-[14px] !min-w-[700px] max-md:!block max-md:!min-w-0 max-md:!w-full">
                                <thead className="max-md:!hidden">
                                    <tr>
                                        <th className="!bg-[#dfe5eb] !font-semibold !p-[6px] xl:!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !leading-tight !border-[#dee2e6]">Case Number</th>
                                        <th className="!bg-[#dfe5eb] !font-semibold !p-[6px] xl:!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !leading-tight !border-[#dee2e6]">Case Type</th>
                                        <th className="!bg-[#dfe5eb] !font-semibold !p-[6px] xl:!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !leading-tight !border-[#dee2e6]">Title</th>
                                        <th className="!bg-[#dfe5eb] !font-semibold !p-[6px] xl:!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !leading-tight !border-[#dee2e6]">Parties</th>
                                        <th className="!bg-[#dfe5eb] !font-semibold !p-[6px] xl:!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !leading-tight !border-[#dee2e6]">Judge</th>
                                        <th className="!bg-[#dfe5eb] !font-semibold !p-[6px] xl:!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !leading-tight !border-[#dee2e6]">Stenographer</th>
                                        <th className="!bg-[#dfe5eb] !font-semibold !p-[6px] xl:!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !leading-tight !border-[#dee2e6]">Date & Time</th>
                                        <th className="!bg-[#dfe5eb] !font-semibold !p-[6px] xl:!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !leading-tight !border-[#dee2e6]">Status</th>
                                        <th className="!bg-[#dfe5eb] !font-semibold !p-[6px] xl:!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !leading-tight !border-[#dee2e6]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="max-md:!block">
                                    {filteredCases.map((c) => (
                                        <tr key={c.case_code || c.caseCode || `case-${c.id || Math.random()}`} className="max-md:!block max-md:!bg-white max-md:!border max-md:!border-[#dee2e6] max-md:!rounded-[8px] max-md:!mb-[15px] max-md:!p-[10px] max-md:!shadow-sm max-md:!mx-[10px]">
                                            <td className="!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !border-[#dee2e6] max-md:!flex max-md:!justify-between max-md:!items-center max-md:!border-[#f1f1f1] max-md:!text-[0.9rem] max-md:!p-[10px_5px]"><span className="hidden max-md:!inline-block !font-bold !text-[#6c757d]">Case No:</span> <strong>{c.caseCode}</strong></td>
                                            <td className="!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !border-[#dee2e6] max-md:!flex max-md:!justify-between max-md:!items-center max-md:!border-[#f1f1f1] max-md:!text-[0.9rem] max-md:!p-[10px_5px]">
                                                <span className="hidden max-md:!inline-block !font-bold !text-[#6c757d]">Type:</span>
                                                <span className="!inline-block !px-[8px] !py-[3px] !rounded-[4px] !text-[10px] xl:!text-[0.85rem] !font-semibold" style={{ backgroundColor: getBadgeBg(c.caseType), color: getBadgeText(c.caseType) }}>
                                                    {c.caseType}
                                                </span>
                                            </td>
                                            <td className="!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !border-[#dee2e6] max-md:!flex max-md:!justify-between max-md:!items-center max-md:!border-[#f1f1f1] max-md:!text-[0.9rem] max-md:!p-[10px_5px]"><span className="hidden max-md:!inline-block !font-bold !text-[#6c757d]">Title:</span> <span>{c.caseTitle}</span></td>
                                            <td className="!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !border-[#dee2e6] max-md:!flex max-md:!justify-between max-md:!items-center max-md:!border-[#f1f1f1] max-md:!text-[0.9rem] max-md:!p-[10px_5px]"><span className="hidden max-md:!inline-block !font-bold !text-[#6c757d]">Parties:</span> <span>{c.party1} vs {c.party2}</span></td>
                                            <td className="!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !border-[#dee2e6] max-md:!flex max-md:!justify-between max-md:!items-center max-md:!border-[#f1f1f1] max-md:!text-[0.9rem] max-md:!p-[10px_5px]"><span className="hidden max-md:!inline-block !font-bold !text-[#6c757d]">Judge:</span> <span>Justice {c.judge}</span></td>
                                            <td className="!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !border-[#dee2e6] max-md:!flex max-md:!justify-between max-md:!items-center max-md:!border-[#f1f1f1] max-md:!text-[0.9rem] max-md:!p-[10px_5px]"><span className="hidden max-md:!inline-block !font-bold !text-[#6c757d]">Steno:</span> <span>{c.steno}</span></td>
                                            <td className="!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !border-[#dee2e6] max-md:!flex max-md:!justify-between max-md:!items-center max-md:!border-[#f1f1f1] max-md:!text-[0.9rem] max-md:!p-[10px_5px]">
                                                <span className="hidden max-md:!inline-block !font-bold !text-[#6c757d]">Date:</span>
                                                <span>{c.hearingDate ? `${c.hearingDate} ${c.hearingTime}` : "Not Scheduled"}</span>
                                            </td>

                                            <td className="!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !border-[#dee2e6] max-md:!flex max-md:!justify-between max-md:!items-center max-md:!border-[#f1f1f1] max-md:!text-[0.9rem] max-md:!p-[10px_5px]">
                                                <span className="hidden max-md:!inline-block !font-bold !text-[#6c757d]">Status:</span>
                                                <span className="!inline-block !px-[8px] !py-[3px] !rounded-[12px] !text-[0.8rem] !font-bold !tracking-[0.5px] !uppercase" style={{ backgroundColor: getStatusBg(c.status), color: getStatusText(c.status) }}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !border-[#dee2e6] max-md:!flex max-md:!flex-col max-md:!border-none max-md:!p-[15px_5px_5px_5px]">
                                                <div className="!flex !justify-center !items-center !gap-[8px] !whitespace-nowrap max-md:!w-full">
                                                    <button
                                                        className="!p-[6px_10px] xl:!p-[8px_16px] !border-none !rounded-[5px] !text-[11px] xl:!text-[13px] !font-semibold !cursor-pointer !bg-[#6c757d] !text-white hover:!bg-[#5a6268] max-md:!w-full max-md:!py-[12px]"
                                                        onClick={() =>
                                                            setSelectedCase({
                                                                case_code: c.caseCode,
                                                                case_type: c.caseType,
                                                                case_title: c.caseTitle,
                                                                case_status: c.status,
                                                                case_party1: c.party1,
                                                                case_party2: c.party2,
                                                                judge_code: c.judge_code || "",
                                                                steno_code: c.steno_code || "",
                                                                court: c.court || "",
                                                                case_level: c.caseLevel || ""
                                                            })
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="!p-[6px_10px] xl:!p-[8px_16px] !border-none !rounded-[5px] !text-[11px] xl:!text-[13px] !font-semibold !cursor-pointer !bg-[#dc3545] !text-white hover:!bg-[#c82333] max-md:!w-full max-md:!py-[12px]"
                                                        onClick={() => handleDelete(c.caseCode)}
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
                    </div>
                    {/* EDIT MODAL */}
                    {selectedCase && (
                        <div className="!fixed !inset-0 !bg-[rgba(0,0,0,0.5)] !flex !justify-center !items-center !z-50 !p-[20px]">
                            <div className="!bg-white !p-[30px] !rounded-[8px] !w-full !max-w-[500px] !shadow-lg !max-h-[90vh] !overflow-y-auto">
                                <h3 className="!mt-0 !mb-[20px] !text-[1.5rem] !font-semibold !text-[#2c3e50] !border-b !border-[#dee2e6] !pb-[10px]">Edit Case</h3>

                                {/* Case Type */}
                                <label className="!block !mb-[5px] !font-semibold !text-[#495057] !mt-[15px]">Case Type</label>
                                <select className="!w-full !p-[10px] !mb-[5px] !border !border-[#ced4da] !rounded-[4px] !text-[1rem] focus:!border-[#28a745] focus:!outline-none"
                                    value={selectedCase.case_type || ""}
                                    onChange={(e) =>
                                        setSelectedCase({ ...selectedCase, case_type: e.target.value })
                                    }
                                >
                                    <option value="">Select Case Type</option>
                                    {caseTypes.map((ct, index) => (
                                        <option key={ct.type_id || `case-type-edit-${index}`} value={ct.type_name}>
                                            {ct.type_name}
                                        </option>
                                    ))}
                                </select>

                                {/* Case Title */}
                                <label className="!block !mb-[5px] !font-semibold !text-[#495057] !mt-[15px]">Case Title</label>
                                <input className="!w-full !p-[10px] !mb-[5px] !border !border-[#ced4da] !rounded-[4px] !text-[1rem] focus:!border-[#28a745] focus:!outline-none"
                                    value={selectedCase.case_title || ""}
                                    onChange={(e) =>
                                        setSelectedCase({ ...selectedCase, case_title: e.target.value })
                                    }
                                />

                                {/* Case Status */}
                                <label className="!block !mb-[5px] !font-semibold !text-[#495057] !mt-[15px]">Status</label>
                                <select className="!w-full !p-[10px] !mb-[5px] !border !border-[#ced4da] !rounded-[4px] !text-[1rem] focus:!border-[#28a745] focus:!outline-none"
                                    value={selectedCase.case_status || ""}
                                    onChange={(e) =>
                                        setSelectedCase({ ...selectedCase, case_status: e.target.value })
                                    }
                                >
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Postponed">Postponed</option>
                                </select>

                                {/* Party 1 */}
                                <label className="!block !mb-[5px] !font-semibold !text-[#495057] !mt-[15px]" htmlFor="edit-party1">Party 1</label>
                                <input id="edit-party1" className="!w-full !p-[10px] !mb-[5px] !border !border-[#ced4da] !rounded-[4px] !text-[1rem] focus:!border-[#28a745] focus:!outline-none"
                                    value={selectedCase.case_party1 || ""}
                                    onChange={(e) =>
                                        setSelectedCase({ ...selectedCase, case_party1: e.target.value })
                                    }
                                />

                                {/* Party 2 */}
                                <label className="!block !mb-[5px] !font-semibold !text-[#495057] !mt-[15px]" htmlFor="edit-party2">Party 2</label>
                                <input id="edit-party2" className="!w-full !p-[10px] !mb-[5px] !border !border-[#ced4da] !rounded-[4px] !text-[1rem] focus:!border-[#28a745] focus:!outline-none"
                                    value={selectedCase.case_party2 || ""}
                                    onChange={(e) =>
                                        setSelectedCase({ ...selectedCase, case_party2: e.target.value })
                                    }
                                />

                                {/* Judge Dropdown */}
                                <label className="!block !mb-[5px] !font-semibold !text-[#495057] !mt-[15px]" htmlFor="edit-judge">Select Judge</label>
                                <select 
                                    id="edit-judge" 
                                    className="!w-full !p-[10px] !mb-[5px] !border !border-[#ced4da] !rounded-[4px] !text-[1rem] focus:!border-[#28a745] focus:!outline-none !bg-white"
                                    value={selectedCase.judge_code || ""}
                                    onChange={(e) =>
                                        setSelectedCase({ ...selectedCase, judge_code: e.target.value })
                                    }
                                >
                                    <option value="">Choose a Judge</option>
                                    {allJudges
                                        .filter(j => !selectedCase.court || j.judge_court === selectedCase.court)
                                        .map((j) => (
                                            <option key={j.judge_code} value={j.judge_code}>
                                                Justice {j.judge_name} ({j.judge_code})
                                            </option>
                                        ))}
                                </select>

                                {/* Stenographer Dropdown */}
                                <label className="!block !mb-[5px] !font-semibold !text-[#495057] !mt-[15px]" htmlFor="edit-steno">Select Stenographer</label>
                                <select 
                                    id="edit-steno" 
                                    className="!w-full !p-[10px] !mb-[5px] !border !border-[#ced4da] !rounded-[4px] !text-[1rem] focus:!border-[#28a745] focus:!outline-none !bg-white"
                                    value={selectedCase.steno_code || ""}
                                    onChange={(e) =>
                                        setSelectedCase({ ...selectedCase, steno_code: e.target.value })
                                    }
                                >
                                    <option value="">Choose a Stenographer</option>
                                    {allStenos
                                        .filter(s => !selectedCase.court || s.steno_court === selectedCase.court)
                                        .map((s) => (
                                            <option key={s.steno_code} value={s.steno_code}>
                                                {s.steno_name} ({s.steno_code})
                                            </option>
                                        ))}
                                </select>

                                {/* Actions */}
                                <div className="!flex !justify-end !gap-[10px] !mt-[20px] !pt-[15px] !border-t !border-[#dee2e6] max-md:!flex-col max-md:!gap-[15px]">
                                    <button
                                        className="!px-[20px] !py-[10px] !border-none !rounded-[5px] !font-semibold !cursor-pointer !transition-colors !duration-300 !bg-[#28a745] !text-white hover:!bg-[#218838] max-md:!w-full"
                                        onClick={handleUpdate}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="!px-[20px] !py-[10px] !border-none !rounded-[5px] !font-semibold !cursor-pointer !transition-colors !duration-300 !bg-[#6c757d] !text-white hover:!bg-[#5a6268] max-md:!w-full"
                                        onClick={() => setSelectedCase(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal 
                isOpen={isDeleteModalOpen}
                title="Delete Case"
                message={`Are you sure you want to delete case ${caseToDelete}? This action cannot be undone.`}
                confirmText="Delete Case"
                type="danger"
                onConfirm={confirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />

            {/* Footer */}
            <Footer />
        </div>
    );
}
