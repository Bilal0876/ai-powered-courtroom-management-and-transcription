import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import "../assets/styles/style.css";
import { API_BASE_URL } from "../config";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";
import Footer from "../components/footer";

export default function ChiefJudgeViewsCases({ setCurrentPage }) {
    const [cases, setCases] = useState([]);
    const [search, setSearch] = useState("");
    const [caseType, setCaseType] = useState("");
    const [status, setStatus] = useState("");
    const [caseTypes, setCaseTypes] = useState([]);
    const navigate = useNavigate();
    const [selectedCase, setSelectedCase] = useState(null);

    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});

    useEffect(() => {
        apiGet("/cjcases")
            .then((data) => setCases(data))
            .catch((err) => console.error("❌ Error loading cases:", err));
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
    const handleDelete = async (c) => {
        console.log("DELETE PAYLOAD:", c);
        if (!window.confirm(`Delete case ${c.case_code}?`)) return;

        await apiPost("/delete-case", { case_code: c.case_code });

        window.location.reload();
    };

    const handleUpdate = async () => {
        await apiPost("/update-case", selectedCase);

        setSelectedCase(null);
        window.location.reload();
    };

    return (
        <div className="login-container">
            {/* Header */}
            <Header user={user} />
            <div className="container">
                <div className="breadcrumb">
                    <a href="#" onClick={() => navigate("/chiefJudge-dashboard")}>
                        Dashboard
                    </a>{" > "}
                    <strong>View Cases</strong>
                </div>

                <div className="page-header">
                    <h2 className="page-title">Case Schedules</h2>
                    <button
                        className="action-btn"
                        onClick={() => {
                            window.open(`${API_BASE_URL}/download-cases-pdf", "_blank`);
                        }}
                    >
                        Download Cases PDF
                    </button>
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

                            <select
                                className="form-select"
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="postponed">Postponed</option>
                            </select>
                            <button
                                className="gov-btn2 gov-btn-secondary"
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
                        <table className="case-table full-width">
                            <thead>
                                <tr>
                                    <th>Case Number</th>
                                    <th>Case Type</th>
                                    <th>Title</th>
                                    <th>Parties</th>
                                    <th>Stenographer</th>
                                    <th>Judge</th>
                                    <th>Court</th>
                                    <th>Date & Time</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCases.map((c) => (
                                    <tr key={c.id}>
                                        <td><strong>{c.caseCode}</strong></td>
                                        <td>
                                            <span
                                                className={`case-item ${c.caseType.toLowerCase()}`}
                                                style={{ display: "inline-block" }}
                                            >
                                                {c.caseType}
                                            </span>
                                        </td>
                                        <td>{c.caseTitle}</td>
                                        <td>{c.party1} vs {c.party2}</td>
                                        <td>{c.stenographer}</td>
                                        <td>Justice {c.judge}</td>
                                        <td>{c.court}</td>
                                        <td>
                                            {c.hearingDate ? `${c.hearingDate} ${c.hearingTime}` : "Not Scheduled"}
                                        </td>

                                        <td>
                                            <span
                                                className={`status-badge status-${c.status
                                                    .toLowerCase()
                                                    .replace(" ", "-")}`}
                                            >
                                                {c.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="logout-btn"
                                                style={{ backgroundColor: 'grey', marginRight: '10px' }}
                                                onClick={() =>
                                                    setSelectedCase({
                                                        case_code: c.caseCode,
                                                        case_type: c.caseType,
                                                        case_title: c.caseTitle,
                                                        case_status: c.status,
                                                        case_party1: c.party1,
                                                        case_party2: c.party2,
                                                        judge_code: c.judge_code || "",
                                                        steno_code: c.stenographer || "",
                                                        court: c.court || "",
                                                        case_level: c.caseLevel || ""
                                                    })
                                                }

                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="logout-btn"
                                                style={{ background: "red" }}
                                                onClick={() =>
                                                    handleDelete({
                                                        case_code: c.caseCode
                                                    })
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* EDIT MODAL */}
                    {selectedCase && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h3>Edit Case</h3>

                                {/* Case Type */}
                                <label>Case Type</label>
                                <select
                                    value={selectedCase.case_type || ""}
                                    onChange={(e) =>
                                        setSelectedCase({ ...selectedCase, case_type: e.target.value })
                                    }
                                >
                                    <option value="">Select Case Type</option>
                                    {caseTypes.map((ct) => (
                                        <option key={ct.id} value={ct.name}>
                                            {ct.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Case Title */}
                                <label>Case Title</label>
                                <input
                                    value={selectedCase.case_title || ""}
                                    onChange={(e) =>
                                        setSelectedCase({ ...selectedCase, case_title: e.target.value })
                                    }
                                />

                                {/* Case Status */}
                                <label>Status</label>
                                <select
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
                                <label>Party 1</label>
                                <input
                                    value={selectedCase.case_party1 || ""}
                                    onChange={(e) =>
                                        setSelectedCase({ ...selectedCase, case_party1: e.target.value })
                                    }
                                />

                                {/* Party 2 */}
                                <label>Party 2</label>
                                <input
                                    value={selectedCase.case_party2 || ""}
                                    onChange={(e) =>
                                        setSelectedCase({ ...selectedCase, case_party2: e.target.value })
                                    }
                                />

                                {/* Judge Code */}
                                <label>Judge Code</label>
                                <input
                                    value={selectedCase.judge_code || ""}
                                    onChange={(e) =>
                                        setSelectedCase({ ...selectedCase, judge_code: e.target.value })
                                    }
                                />

                                {/* Stenographer Code */}
                                <label>Stenographer Code</label>
                                <input
                                    value={selectedCase.steno_code || ""}
                                    onChange={(e) =>
                                        setSelectedCase({ ...selectedCase, steno_code: e.target.value })
                                    }
                                />

                                {/* Court */}
                                <label>Court</label>
                                <input
                                    type="number"
                                    value={selectedCase.court || ""}
                                    onChange={(e) =>
                                        setSelectedCase({ ...selectedCase, court: e.target.value })
                                    }
                                />

                                {/* Case Level */}
                                <label>Case Level</label>
                                <select
                                    value={selectedCase.case_status || ""}
                                    onChange={(e) =>
                                        setSelectedCase({ ...selectedCase, case_level: e.target.value })
                                    }
                                >
                                    <option value="High Court">High Court</option>
                                    <option value="Subordinate Court">Subordinate Court</option>
                                </select>

                                {/* Actions */}
                                <div className="modal-actions">
                                    <button
                                        className="action-btn action-btn-primary"
                                        onClick={handleUpdate}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="action-btn"
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

            {/* Footer */}
            <Footer />
        </div>
    );
}
