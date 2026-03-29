import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import "../assets/styles/style.css";
import { API_BASE_URL } from "../config";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";
import Footer from "../components/footer";


export default function JudgeViewsCases({ setCurrentPage }) {
    const [cases, setCases] = useState([]);
    const [search, setSearch] = useState("");
    const [caseType, setCaseType] = useState("");
    const [status, setStatus] = useState("");
    const [caseTypes, setCaseTypes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user);
        if (!user) {
            console.error("❌ No user found in localStorage");
            return;
        }
        fetch(`${API_BASE_URL}/jcases`, {
            headers: {
                "x-judge-code": user.id
            },
        })
            .then((res) => res.json())
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

    return (
        <div className="login-container">
            {/* Header */}
            <Header user={user} />
            <div className="container">
                <div className="breadcrumb">
                    <a href="#" onClick={() => navigate("/judge-dash")}>
                        Dashboard
                    </a>{" > "}
                    <strong>View Cases</strong>
                </div>

                <div className="page-header">
                    <h2 className="page-title">Case Schedules</h2>
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
                                    <th>Date & Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCases.map((c) => (
                                    <tr key={c.id}>
                                        <td><strong>{c.caseNumber}</strong></td>
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
                                    </tr>
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
