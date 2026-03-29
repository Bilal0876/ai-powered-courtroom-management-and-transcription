import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import "../assets/styles/style.css";
import { API_BASE_URL } from "../config";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";
import Footer from "../components/footer";

export default function ChiefJudgeAddTypeToCourt() {
    const [courts, setCourts] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedCourt, setSelectedCourt] = useState("");
    const [selectedTypes, setSelectedTypes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        apiGet("/assign-court-types/courts")
            .then(setCourts);

        apiGet("/assign-court-types/types")
            .then(setTypes);
    }, []);

    const toggleType = (typeId) => {
        setSelectedTypes(prev =>
            prev.includes(typeId)
                ? prev.filter(id => id !== typeId)
                : [...prev, typeId]
        );
    };

    const handleAssign = async () => {
        if (!selectedCourt || selectedTypes.length === 0) {
            alert("Select court and at least one case type");
            return;
        }

        const res = await fetch(`${API_BASE_URL}/assign-court-types`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                courtId: selectedCourt,
                typeIds: selectedTypes,
            }),
        });

        const data = await res.json();

        if (data.success) {
            alert("✅ Case types assigned");
            navigate("/chiefJudge-dashboard");
        } else {
            alert("❌ Failed to assign");
        }
    };

    return (
        <div className="login-container">
            <Header user={user} />

            <div className="container">
                <div className="breadcrumb">
                    <a href="#" onClick={() => navigate("/chiefJudge-dashboard")}>
                        Dashboard
                    </a>{" > "}
                    <strong>Assign Case Types</strong>
                </div>

                <div className="login-box signup-box">
                    <div className="login-header">
                        <h2 className="login-title">Assign Case Types to Court</h2>
                    </div>

                    {/* Court selector */}
                    <div className="form">
                        <div className="form-group">
                            <label className="form-label">Select Court</label>
                            <select
                                className="form-input"
                                value={selectedCourt}
                                onChange={(e) => setSelectedCourt(e.target.value)}
                            >
                                <option value="">Select court</option>
                                {courts.map(c => (
                                    <option key={c.court_id} value={c.court_id}>
                                        {c.court_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Case Types */}
                        <div className="form-group">
                            <label className="form-label">Case Types</label>
                            <div>
                                {types.map(t => (
                                    <label key={t.type_id}
                                        className={`case-item ${t.type_name.toLowerCase().replace(/\s+/g, "-")}`}
                                        style={{ display: "block", marginBottom: "6px", padding: "8px" }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedTypes.includes(t.type_id)}
                                            onChange={() => toggleType(t.type_id)}
                                            style={{ marginRight: "8px" }}
                                        />
                                        {t.type_name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button className="login-btn" onClick={handleAssign}>
                            Assign Types
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
