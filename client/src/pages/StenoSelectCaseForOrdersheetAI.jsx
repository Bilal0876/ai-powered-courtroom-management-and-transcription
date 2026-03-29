import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import "../assets/styles/style.css";
import { API_BASE_URL } from "../config";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";
import Footer from "../components/footer";




export default function StenoSelectsHearingForOrdersheet({ }) {
    const [cases, setCases] = useState([]);
    const [search, setSearch] = useState("");
    const [caseType, setCaseType] = useState("");
    const [judge, setJudge] = useState("");
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user);
        if (!user) {
            console.error("❌ No user found in localStorage");
            return;
        }

        fetch(`${API_BASE_URL}/sthearingsOrdersheet`, {
            headers: {
                "x-steno-code": user.id
            },
        })
            .then((res) => res.json())
            .then((data) => setCases(data))
            .catch((err) => console.error("❌ Error loading cases:", err));
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
                    <a href="#" onClick={() => navigate("/stenographer-dashboard")}>
                        Dashboard
                    </a>{" > "}
                    <strong>Browse Cases</strong>
                </div>

                <div className="page-header">
                    <h2 className="page-title">Select Case to Create Ordersheet</h2>
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
                                onChange={(e) => setCaseType(e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="criminal">Criminal</option>
                                <option value="civil">Civil</option>
                                <option value="family">Family</option>
                                <option value="commercial">Commercial</option>
                                <option value="labor">Labor</option>
                            </select>
                            <button
                                className="gov-btn2 gov-btn-secondary"
                                onClick={() => {
                                    setSearch("");
                                    setCaseType("");
                                    setJudge("");
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
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Judge</th>
                                    <th></th>
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
                                        <td>
                                            {c.caseTitle}
                                        </td>
                                        <td>{c.party1} vs {c.party2}</td>
                                        <td>
                                            {c.hearingDate}
                                        </td>
                                        <td>
                                            {c.hearingTime}
                                        </td>
                                        <td>Justice {c.judge}</td>
                                        <td>
                                            <button
                                                className="logout-btn"
                                                onClick={() =>
                                                    navigate("/stenographer-dashboard/select-case-ordersheet/ordersheet-generation-ai", { state: { selectedCase: c } })
                                                }

                                            >
                                                Create Ordersheet
                                            </button>
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
