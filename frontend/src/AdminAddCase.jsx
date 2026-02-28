import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Components/header";
import "./Styling/adminAddCase.css";
import { API_BASE_URL } from "./config";
import { apiPost } from "./utils/api";
import Footer from "./Components/footer";

export default function AdminAddCase() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        caseType: "",
        caseTitle: "",
        caseLevel: "",
        party1: "",
        party2: "",
        admin: "",
        steno: "",
        judge: "",
        court: "",
    });

    // Dropdown data fetched from backend
    const [caseTypes, setCaseTypes] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [stenos, setStenos] = useState([]);
    const [judges, setJudges] = useState([]);
    const [courts, setCourts] = useState([]);
    const [filteredCourts, setFilteredCourts] = useState([]);

    // Fetch initial dropdown data
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${API_BASE_URL}/case-types`);
                const data = await res.json();
                setCaseTypes(data);
            } catch (err) {
                console.error("Error fetching case types:", err);
            }
        }
        fetchData();
    }, []);


    // Filter courts based on selected case type
    useEffect(() => {
        if (form.caseType) {
            const filtered = courts.filter((c) => c.caseTypes.includes(form.caseType));
            setFilteredCourts(filtered);
            // Reset selected court if it no longer matches
            if (!filtered.some(c => c.id === form.court)) {
                setForm((prev) => ({ ...prev, court: "" }));
            }
        } else {
            setFilteredCourts([]);
        }
    }, [form.caseType, courts]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddCase = async () => {
        // Simple validation
        if (!form.caseType || !form.caseLevel || !form.caseTitle || !form.party1 || !form.party2) {
            alert("❌ Please fill all required fields!");
            return;
        }

        try {
            // ✅ Use apiPost - automatically sends JWT token
            const data = await apiPost("/add-case", form);

            if (data.success) {
                alert("✅ Case added successfully!");
                setForm({
                    caseType: "",
                    caseLevel: "",
                    caseTitle: "",
                    party1: "",
                    party2: "",
                });
                navigate("/admin-dash/browse-cases"); // redirect to case list
            } else {
                alert("❌ Error: " + data.message);
            }
        } catch (err) {
            console.error("Add case failed:", err);
            alert("❌ Failed to add case. Please try again.");
        }
    };

    return (
        <div className="admin-add-case-container">
            <Header />

            <div className="container">
                <div className="breadcrumb">
                    <a href="#" onClick={() => navigate("/admin-dash")}>Dashboard</a> {" > "}
                    <strong>Add New Case</strong>
                </div>

                <div className="main-box">
                    <div className="box-header">
                        <h2 className="box-title">Add New Case</h2>
                        <p className="box-subtitle">Fill details to add a new case</p>
                    </div>

                    <div className="form">
                        <div className="form-group">
                            <label className="form-label" htmlFor="caseType">Case Type</label>
                            <select id="caseType" name="caseType" className="form-input" value={form.caseType} onChange={handleChange}>
                                <option value="">Select Case Type</option>
                                {caseTypes.map((ct) => (
                                    <option key={ct.id} value={ct.name}>{ct.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="caseType">Court Type</label>
                            <select id="caseLevel" name="caseLevel" className="form-input" value={form.caseLevel} onChange={handleChange}>
                                <option value="">Select Court Type</option>
                                <option value="High Court">High Court</option>
                                <option value="Subordinate Court">Subordinate Court</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="caseTitle">Case Title</label>
                            <input id="caseTitle" name="caseTitle" className="form-input" value={form.caseTitle} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="party1">Plaintiff</label>
                            <input id="party1" name="party1" className="form-input" value={form.party1} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="party2">Defendent</label>
                            <input id="party2" name="party2" className="form-input" value={form.party2} onChange={handleChange} />
                        </div>

                        <button className="add-case-btn" onClick={handleAddCase}>Add Case</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
