import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { apiGet, apiPost } from "../utils/api";
import Footer from "../components/footer";

export default function ScheduleHearing() {
    const [cases, setCases] = useState([]);
    const [search, setSearch] = useState("");
    const [caseType, setCaseType] = useState("");
    const [selectedCaseId, setSelectedCaseId] = useState(null);
    const [user, setUser] = useState(null);

    const [courts, setCourt] = useState([]);
    const [judges, setJudges] = useState([]);
    const [stenographers, setStenographers] = useState([]);
    const [caseTypes, setCaseTypes] = useState([]);
    const [scheduleForm, setScheduleForm] = useState({
        court: "",
        judge: "",
        hearingDate: "",
        hearingTime: "",
        stenographer: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            navigate("/");
            return;
        }
        setUser(storedUser);
    }, [navigate]);

    const fetchCases = async () => {
        try {
            const data = await apiGet("/api/cases/pending-schedule");
            setCases(data);
        } catch (err) {
            console.error("❌ Error loading cases:", err);
        }
    };

    useEffect(() => {
        fetchCases();
        apiGet("/api/courts/case-types").then(setCaseTypes).catch(console.error);
        apiGet("/api/courts/names").then(setCourt).catch(console.error);
    }, []);

    useEffect(() => {
        if (!scheduleForm.court) {
            setJudges([]);
            setStenographers([]);
            return;
        }
        apiGet(`/api/users/judges-by-court/${scheduleForm.court}`).then(setJudges).catch(console.error);
        apiGet(`/api/users/stenographers-by-court/${scheduleForm.court}`).then(setStenographers).catch(console.error);
    }, [scheduleForm.court]);

    const handleScheduleChange = (e) => {
        setScheduleForm({ ...scheduleForm, [e.target.name]: e.target.value });
    };

    const handleSubmitSchedule = async () => {
        if (!selectedCaseId) return;
        const { court, judge, stenographer, hearingDate, hearingTime } = scheduleForm;
        if (!court || !judge || !stenographer || !hearingDate || !hearingTime) {
            alert("Please fill all fields before scheduling.");
            return;
        }

        const payload = {
            caseNumber: selectedCaseId,
            court,
            judge,
            stenographer,
            hearingDate,
            hearingTime
        };

        try {
            const data = await apiPost("/api/hearings/schedule", payload);
            if (data.success) {
                alert("✅ Hearing scheduled successfully!");
                fetchCases();
                setScheduleForm({ court: "", judge: "", stenographer: "", hearingDate: "", hearingTime: "" });
                setSelectedCaseId(null);
            } else {
                alert("❌ Error: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            console.error("Error scheduling hearing:", err);
            alert("❌ Server error while scheduling hearing.");
        }
    };

    const filteredCases = cases.filter((c) => {
        const caseNumber = (c.caseCode || c.caseNumber || "").toString().toLowerCase();
        const parties = `${c.party1 || ""} ${c.party2 || ""}`.toLowerCase();
        const title = (c.caseTitle || "").toString().toLowerCase();
        const caseTypeVal = (c.caseType || "").toString().toLowerCase();

        return (
            (search === "" || caseNumber.includes(search.toLowerCase()) || parties.includes(search.toLowerCase()) || title.includes(search.toLowerCase())) &&
            (caseType === "" || caseTypeVal === caseType.toLowerCase())
        );
    });

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
                    <strong>Case Scheduling</strong>
                </div>

                <div className="!max-w-[1200px] !mx-auto">
                    {/* Header Controls */}
                    <div className="!bg-white !rounded-[12px] !shadow-md !p-[25px] !mb-[30px] !flex !flex-col md:!flex-row !justify-between !items-center !gap-4">
                        <div>
                            <h2 className="!text-[#2c3e50] !font-bold !text-[1.5rem] !m-0">Schedule Hearing</h2>
                            <p className="!text-gray-400 !text-[13px] !mt-1">Assign judges, stenographers, and timeslots to pending cases</p>
                        </div>
                        <div className="!flex !w-full md:!w-auto !gap-2">
                            <div className="!relative !flex-1 md:!w-[250px]">
                                <span className="!absolute !left-3 !top-1/2 !-translate-y-1/2 !text-gray-400">🔍</span>
                                <input
                                    type="text"
                                    className="!w-full !pl-10 !pr-4 !py-[10px] !border !rounded-[8px] !bg-gray-50 focus:!bg-white focus:!border-[#28a745] !outline-none !text-[14px]"
                                    placeholder="Case # or Party..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <select
                                className="!px-3 !py-[10px] !border !rounded-[8px] !bg-gray-50 focus:!bg-white !outline-none !text-[14px]"
                                value={caseType}
                                onChange={(e) => setCaseType(e.target.value)}
                            >
                                <option value="">All Types</option>
                                {caseTypes.map((ct) => (
                                    <option key={ct.type_id || ct.id} value={ct.type_name || ct.name}>
                                        {ct.type_name || ct.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="!bg-white !rounded-[15px] !shadow-lg !overflow-hidden">
                        <div className="!overflow-x-auto">
                            <table className="!w-full !border-collapse">
                                <thead>
                                    <tr className="!bg-[#2c3e50] !text-white">
                                        <th className="!p-[15px] !text-left !text-[12px] !uppercase !tracking-widest">Case Code</th>
                                        <th className="!p-[15px] !text-left !text-[12px] !uppercase !tracking-widest">Description</th>
                                        <th className="!p-[15px] !text-left !text-[12px] !uppercase !tracking-widest">Parties</th>
                                        <th className="!p-[15px] !text-right !text-[12px] !uppercase !tracking-widest !pr-[25px]">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="!divide-y !divide-gray-100">
                                    {filteredCases.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="!p-20 !text-center !text-gray-400 !italic">No pending cases found for scheduling</td>
                                        </tr>
                                    ) : (
                                        filteredCases.map((c) => (
                                            <React.Fragment key={c.caseNumber}>
                                                <tr className={`hover:!bg-[#f8f9fa] !transition-colors ${selectedCaseId === c.caseNumber ? '!bg-blue-50/30' : ''}`}>
                                                    <td className="!p-[15px]">
                                                        <div className="!font-bold !text-[#2c3e50]">{c.caseCode}</div>
                                                        <span className="!text-[10px] !bg-gray-100 !px-2 !py-0.5 !rounded !text-gray-500 !uppercase !font-bold">
                                                            {c.caseType}
                                                        </span>
                                                    </td>
                                                    <td className="!p-[15px] !text-[13px] !text-gray-600 !max-w-[300px] !truncate">
                                                        {c.caseTitle}
                                                    </td>
                                                    <td className="!p-[15px]">
                                                        <div className="!text-[12px] !font-bold !text-gray-800">{c.party1}</div>
                                                        <div className="!text-[10px] !text-gray-400 !uppercase">Vs</div>
                                                        <div className="!text-[12px] !font-bold !text-gray-800">{c.party2}</div>
                                                    </td>
                                                    <td className="!p-[15px] !text-right !pr-[25px]">
                                                        <button
                                                            className={`!px-[15px] !py-[8px] !rounded-[6px] !text-[12px] !font-bold !transition-all ${
                                                                selectedCaseId === c.caseNumber
                                                                    ? "!bg-red-500 !text-white hover:!bg-red-600"
                                                                    : "!bg-[#28a745] !text-white hover:!bg-[#1e7e34] !shadow-sm"
                                                            }`}
                                                            onClick={() => setSelectedCaseId(selectedCaseId === c.caseNumber ? null : c.caseNumber)}
                                                        >
                                                            {selectedCaseId === c.caseNumber ? "Cancel" : "Schedule"}
                                                        </button>
                                                    </td>
                                                </tr>

                                                {/* Expanded Scheduling Form */}
                                                {selectedCaseId === c.caseNumber && (
                                                    <td colSpan="4" className="!p-0 ![background-color:#fcfcfc]">
                                                        <div className="!px-[25px] !py-[30px] !border-x-4 !border-blue-500 !m-3 !bg-white !rounded-[12px] !shadow-inner">
                                                            <div className="!flex !items-center !gap-2 !mb-6">
                                                                <span className="!bg-blue-500 !text-white !w-8 !h-8 !rounded-full !flex !items-center !justify-center !font-bold">📅</span>
                                                                <h3 className="!text-[1.1rem] !font-bold !text-[#2c3e50] !m-0">Configure Hearing Details</h3>
                                                            </div>

                                                            <div className="!grid !grid-cols-1 md:!grid-cols-3 lg:!grid-cols-5 !gap-[15px]">
                                                                <div className="!space-y-1">
                                                                    <label className="!text-[10px] !uppercase !text-gray-400 !font-bold">Assigned Court</label>
                                                                    <select name="court" className="!w-full !p-[10px] !border !rounded-[8px] !bg-white focus:!border-blue-500 !outline-none !text-[13px]" value={scheduleForm.court} onChange={handleScheduleChange}>
                                                                        <option value="">Select Court</option>
                                                                        {courts.map((court) => (
                                                                            <option key={court.court_id || court.Cid} value={court.court_id || court.Cid}>
                                                                                {court.court_name || court.Cname}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>

                                                                <div className="!space-y-1">
                                                                    <label className="!text-[10px] !uppercase !text-gray-400 !font-bold">Presiding Judge</label>
                                                                    <select name="judge" className="!w-full !p-[10px] !border !rounded-[8px] !bg-white focus:!border-blue-500 !outline-none !text-[13px]" value={scheduleForm.judge} onChange={handleScheduleChange} disabled={!judges.length}>
                                                                        <option value="">{scheduleForm.court ? (judges.length ? "Select Judge" : "No Judges Found") : "Select Court First"}</option>
                                                                        {judges.map((j) => (
                                                                            <option key={j.judge_code} value={j.judge_code}>Justice {j.judge_name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>

                                                                <div className="!space-y-1">
                                                                    <label className="!text-[10px] !uppercase !text-gray-400 !font-bold">Stenographer</label>
                                                                    <select name="stenographer" className="!w-full !p-[10px] !border !rounded-[8px] !bg-white focus:!border-blue-500 !outline-none !text-[13px]" value={scheduleForm.stenographer} onChange={handleScheduleChange} disabled={!stenographers.length}>
                                                                        <option value="">{scheduleForm.court ? (stenographers.length ? "Select Staff" : "No Staff Found") : "Select Court First"}</option>
                                                                        {stenographers.map((s) => (
                                                                            <option key={s.steno_code} value={s.steno_code}>{s.steno_name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>

                                                                <div className="!space-y-1">
                                                                    <label className="!text-[10px] !uppercase !text-gray-400 !font-bold">Hearing Date</label>
                                                                    <input type="date" name="hearingDate" className="!w-full !p-[10px] !border !rounded-[8px] !bg-white focus:!border-blue-500 !outline-none !text-[13px]" value={scheduleForm.hearingDate} onChange={handleScheduleChange} />
                                                                </div>

                                                                <div className="!space-y-1">
                                                                    <label className="!text-[10px] !uppercase !text-gray-400 !font-bold">Session Time</label>
                                                                    <input type="time" name="hearingTime" className="!w-full !p-[10px] !border !rounded-[8px] !bg-white focus:!border-blue-500 !outline-none !text-[13px]" value={scheduleForm.hearingTime} onChange={handleScheduleChange} />
                                                                </div>
                                                            </div>

                                                            <div className="!mt-6 !flex !justify-end !gap-3">
                                                                <button
                                                                    className="!px-[30px] !py-[12px] !bg-[#2c3e50] !text-white !rounded-[8px] !font-bold !text-[13px] hover:!bg-[#1a252f] !transition-all !shadow-md active:!scale-[0.98]"
                                                                    onClick={handleSubmitSchedule}
                                                                >
                                                                    Confirm Hearing Schedule
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                )}
                                            </React.Fragment>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
