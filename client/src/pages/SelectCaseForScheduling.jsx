import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import "../assets/styles/style.css";
import { API_BASE_URL } from "../config";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";
import Footer from "../components/footer";

export default function ScheduleHearing({ }) {
    const [cases, setCases] = useState([]);
    const [search, setSearch] = useState("");
    const [caseType, setCaseType] = useState("");
    const [status, setStatus] = useState("");
    const [selectedCaseId, setSelectedCaseId] = useState(null);

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
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user);
        if (!user) {
            console.error("❌ No user found in localStorage");
            return;
        }

        // fetch(`${API_BASE_URL}/selectCase", {
        //     headers: {
        //         "x-cjudge-code": user.id
        //     },
        // })
        //     .then((res) => res.json())
        //     .then((data) => setCases(data))
        //     .catch((err) => console.error("❌ Error loading cases:", err));
    }, []);

    const fetchCases = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) return;

            const res = await fetch(`${API_BASE_URL}/selectCase`, {
                headers: { "x-cjudge-code": user.id }
            });
            const data = await res.json();
            setCases(data);
        } catch (err) {
            console.error("❌ Error loading cases:", err);
        }
    };

    useEffect(() => {
        fetchCases();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await apiGet("/case-types");
                setCaseTypes(data);
            } catch (err) {
                console.error("Error fetching case types:", err);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await apiGet("/court-names");
                setCourt(data);
            } catch (err) {
                console.error("Error fetching court names:", err);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (!scheduleForm.court) {
            setJudges([]);
            setStenographers([]);
            return;
        }

        // fetch judges of selected court
        apiGet("/judges-by-court/${scheduleForm.court}")
            .then(data => setJudges(data))
            .catch(err => console.error("Error fetching judges:", err));

        // fetch stenographers of selected court
        apiGet("/stenographers-by-court/${scheduleForm.court}")
            .then(data => setStenographers(data))
            .catch(err => console.error("Error fetching stenographers:", err));

    }, [scheduleForm.court]);


    const handleScheduleChange = (e) => {
        setScheduleForm({
            ...scheduleForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitSchedule = async () => {
        if (!selectedCaseId) return;

        // Basic validation
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
            const res = await apiPost("/schedule-hearing", payload);

            const data = await res.json();
            if (data.success) {
                alert("Hearing scheduled successfully!");
                fetchCases();
                // Reset the schedule form
                setScheduleForm({ court: "", judge: "", stenographer: "", hearingDate: "", hearingTime: "" });
                setSelectedCaseId(null);
            } else {
                alert("Error: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            console.error("Error scheduling hearing:", err);
            alert("Server error while scheduling hearing.");
        }
    };


    const filteredCases = cases.filter((c) => {
        const caseNumber =
            typeof c.caseNumber === "number"
                ? c.caseNumber.toString().toLowerCase()
                : (c.caseNumber || "").toString().toLowerCase();
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

    return (
        <div className="login-container">
            {/* Header */}
            <Header user={user} />
            <div className="container">
                <div className="breadcrumb">
                    <a href="#" onClick={() => navigate("/chiefJudge-dashboard")}>
                        Dashboard
                    </a>{" > "}
                    <strong>Browse Cases</strong>
                </div>

                <div className="page-header">
                    <h2 className="page-title">Schedule Case Hearing</h2>
                    <div className="header-actions">
                        <button
                            className="gov-btn gov-btn-primary"
                            onClick={() => navigate("/chiefJudge-dashboard/view-cases")}>
                            Scheduled Cases
                        </button>
                    </div>
                </div>

                <div className="content-grid">
                    {/* Cases Table */}
                    <div className="main-content">
                        <div className="card-header">Browse Cases</div>

                        {/* ✅ Move Search + Filters here */}
                        <div className="filters-top">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search by case number or party..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <select
                                className="form-select"
                                value={caseType}
                                onChange={(e) => setCaseType(e.target.value)}
                            >
                                <option value="">All Case Types</option>
                                {caseTypes.map((ct) => (
                                    <option key={ct.id} value={ct.name.toLowerCase()}>
                                        {ct.name}
                                    </option>
                                ))}
                            </select>

                            <button
                                className="gov-btn2 gov-btn-secondary"
                                onClick={() => {
                                    setSearch("");
                                    setCaseType("");
                                }}
                            >
                                Clear
                            </button>
                        </div>

                        {/* ✅ Full-width table */}
                        <table className="case-table full-width">
                            <thead>
                                <tr>
                                    <th>Case Number</th>
                                    <th>Case Type</th>
                                    <th>Title</th>
                                    <th>Parties</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredCases.map((c) => (
                                    <React.Fragment key={c.caseNumber}>

                                        {/* Case row */}
                                        <tr>
                                            <td><strong>{c.caseCode}</strong></td>
                                            <td>
                                                <span className={`case-item ${c.caseType.toLowerCase()}`}>
                                                    {c.caseType}
                                                </span>
                                            </td>
                                            <td>{c.caseTitle}</td>
                                            <td>{c.party1} vs {c.party2}</td>
                                            <td>
                                                <button
                                                    className="logout-btn"
                                                    onClick={() =>
                                                        setSelectedCaseId(
                                                            selectedCaseId === c.caseNumber ? null : c.caseNumber
                                                        )
                                                    }
                                                >
                                                    {selectedCaseId === c.caseNumber ? "Close" : "Schedule"}
                                                </button>

                                            </td>
                                        </tr>


                                        {selectedCaseId === c.caseNumber && (
                                            <tr className="schedule-row">
                                                <td colSpan="5">
                                                    <div className="schedule-form-card">
                                                        <h3>Schedule Hearing</h3>

                                                        <p>
                                                            <strong>Case:</strong> {c.caseNumber} – {c.caseTitle}
                                                        </p>

                                                        <div className="form-grid">
                                                            <select
                                                                name="court"
                                                                className="form-input2"
                                                                value={scheduleForm.court}
                                                                onChange={handleScheduleChange}
                                                            >
                                                                <option value="">Select Court</option>
                                                                {courts.map((court) => (
                                                                    <option key={court.Cid} value={court.Cid}>
                                                                        {court.Cname}
                                                                    </option>
                                                                ))}
                                                            </select>


                                                            <input
                                                                type="date"
                                                                name="hearingDate"
                                                                className="form-input2"
                                                                value={scheduleForm.hearingDate}
                                                                onChange={handleScheduleChange}
                                                            />

                                                            <input
                                                                type="time"
                                                                name="hearingTime"
                                                                className="form-input2"
                                                                value={scheduleForm.hearingTime}
                                                                onChange={handleScheduleChange}
                                                            />
                                                            <select
                                                                name="judge"
                                                                className="form-input2"
                                                                value={scheduleForm.judge}
                                                                onChange={handleScheduleChange}
                                                                disabled={!judges.length}
                                                            >
                                                                <option value="">Select Judge</option>
                                                                {judges.map((j) => (
                                                                    <option key={j.judge_code} value={j.judge_code}>
                                                                        Justice {j.judge_name}
                                                                    </option>
                                                                ))}
                                                            </select>


                                                            <select
                                                                name="stenographer"
                                                                className="form-input2"
                                                                value={scheduleForm.stenographer}
                                                                onChange={handleScheduleChange}
                                                                disabled={!stenographers.length}
                                                            >
                                                                <option value="">Select Stenographer</option>
                                                                {stenographers.map((s) => (
                                                                    <option key={s.steno_code} value={s.steno_code}>
                                                                        {s.steno_name}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            <button
                                                                className="gov-btn2 gov-btn-primary"
                                                                onClick={handleSubmitSchedule}
                                                            >
                                                                Confirm Schedule
                                                            </button>
                                                        </div>

                                                        <div className="form-actions">
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
