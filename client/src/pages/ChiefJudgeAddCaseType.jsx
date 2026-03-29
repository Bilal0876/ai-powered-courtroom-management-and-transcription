import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import "../assets/styles/style.css";
import { API_BASE_URL } from "../config";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";
import Footer from "../components/footer";

export default function ChiefJudgeAddCaseType() {
    const [form, setForm] = useState({
        typeName: "",
        typeCode: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignup = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/add-type`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (data.success) {
                alert("Type registered successfully!");
                setForm({
                    typeName: "",
                    typeCode: "",
                });

                navigate("/chiefJudge-dashboard");
            } else {
                alert("❌ Error: " + data.message);
            }
        } catch (err) {
            console.error("❌ Signup failed:", err);
        }
    };

    return (
        <div className="login-container">
            {/* Header */}
            <Header user={user} />

            {/* Centered box — uses login-box so you get the same look as login page */}
            <div className="container">
                <div className="breadcrumb">
                    <a href="#" onClick={() => navigate("/chiefJudge-dashboard")}>
                        Dashboard
                    </a>{" > "}
                    <strong>Add New Type</strong>
                </div>

                <div className="login-box signup-box">
                    <div className="login-header">
                        <h2 className="login-title">Add New Case Type</h2>
                        <p className="login-subtitle">Add a new type of case to the system</p>
                    </div>

                    <div className="form">
                        <div className="form-group">
                            <label className="form-label" htmlFor="type">Type Name</label>
                            <input id="typeName" name="typeName" className="form-input" value={form.typeName} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="code">3 Letter Code</label>
                            <input id="typeCode" name="typeCode" maxLength="3" className="form-input" value={form.typeCode} onChange={handleChange} />
                        </div>

                        <button className="login-btn" onClick={handleSignup}>Add Type</button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
