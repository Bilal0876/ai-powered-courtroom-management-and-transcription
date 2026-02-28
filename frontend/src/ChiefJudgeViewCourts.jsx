import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Components/header"
import "./style.css";
import { API_BASE_URL } from "./config";
import { apiGet, apiPost, apiPut, apiDelete } from "./utils/api";
import Footer from "./Components/footer";




export default function ChiefJudgeViewCourts() {
    const [courts, setCourts] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        apiGet("/view-courts")
            .then(data => setCourts(data))
            .catch(err => console.error("❌ Error loading courts:", err));
    }, []);

    const filteredCourts = courts.filter(c =>
        c.court_name.toLowerCase().includes(search.toLowerCase()) ||
        c.court_city.toLowerCase().includes(search.toLowerCase()) ||
        c.court_level.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="login-container">
            {/* Header */}
            <Header user={user} />

            <div className="container">
                <div className="breadcrumb">
                    <a href="#" onClick={() => navigate("/chiefJudge-dashboard")}>
                        Dashboard
                    </a>{" > "}
                    <strong>Courts</strong>
                </div>

                <div className="page-header">
                    <h2 className="page-title">Registered Courts</h2>
                </div>

                <div className="content-grid">
                    <div className="main-content">
                        <div className="card-header">Browse Courts</div>

                        {/* Search */}
                        <div className="filters-top">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search by court name, city or level..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button
                                className="gov-btn2 gov-btn-secondary"
                                onClick={() => setSearch("")}
                            >
                                Clear
                            </button>
                        </div>

                        {/* Courts Table */}
                        <table className="case-table full-width">
                            <thead>
                                <tr>
                                    <th>Court #</th>
                                    <th>Court Name</th>
                                    <th>Level</th>
                                    <th>City</th>
                                    <th>Address</th>
                                    <th>Cases Dealt In</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourts.map(c => (
                                    <tr key={c.court_id}>
                                        <td><strong>{c.court_id}</strong></td>
                                        <td><strong>{c.court_name}</strong></td>
                                        <td>
                                            <span className="status-badge status-scheduled">
                                                {c.court_level}
                                            </span>
                                        </td>
                                        <td>{c.court_city}</td>
                                        <td>{c.court_address || "—"}</td>
                                        <td>
                                            {c.case_types
                                                ? c.case_types.split(", ").map(type => (
                                                    <span
                                                        key={type}
                                                        className={`case-item ${type.toLowerCase().replace(/\s+/g, "-")}`}
                                                        style={{ marginRight: "8px" }}
                                                    >
                                                        {type}
                                                    </span>
                                                ))
                                                : "Not Assigned"}

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
