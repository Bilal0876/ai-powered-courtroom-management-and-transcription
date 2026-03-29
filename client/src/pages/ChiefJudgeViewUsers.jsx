import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header"
import "../assets/styles/style.css";
import { API_BASE_URL } from "../config";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";
import Footer from "../components/footer";

export default function ChiefJudgeViewUsers() {
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        apiGet("/users-by-court")
            .then(result => setData(result))
            .catch(err => console.error("❌ Error:", err));
    }, []);

    if (!data) return <p style={{ padding: "20px" }}>Loading...</p>;

    const { chiefJudge, courts } = data;

    return (
        <div className="login-container">

            {/* HEADER */}
            <Header user={user} />

            <div className="container">
                <div className="breadcrumb">
                    <a href="#" onClick={() => navigate("/chiefJudge-dashboard")}>
                        Dashboard
                    </a>{" > "}
                    <strong>Courts</strong>
                </div>

                {/* CHIEF JUDGE */}
                <div className="card">
                    <div className="card-header">Chief Judge</div>
                    <table className="case-table full-width">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>CNIC</th>
                                <th>Birthday</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{chiefJudge.code}</td>
                                <td>{chiefJudge.name}</td>
                                <td>{chiefJudge.email}</td>
                                <td>{chiefJudge.cnic}</td>
                                <td>{chiefJudge.birthday?.split("T")[0]}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* COURTS */}
                {courts.map(court => (
                    <div key={court.court_id} className="card" style={{ marginTop: "30px" }}>

                        <div className="card-header"
                            style={{ backgroundColor: "#edf767c8", borderRadius: "10px" }}>
                            Court: {court.court_name}
                        </div>

                        {/* JUDGES */}
                        <Section title="Judges" users={court.judges} />

                        {/* STENOGRAPHERS */}
                        <Section title="Stenographers" users={court.stenographers} />

                        {/* ADMINS */}
                        <Section title="Admins" users={court.admins} />
                    </div>
                ))}

            </div>

            <Footer />
        </div>
    );
}

/* 🔹 REUSABLE SECTION COMPONENT */
function Section({ title, users }) {
    return (
        <>
            <div className="card-header">
                <h4>{title}</h4>
            </div>
            {users.length === 0 ? (
                <p style={{ color: "#777" }}>No records</p>
            ) : (
                <table className="case-table full-width">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>CNIC</th>
                            <th>Birthday</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, i) => (
                            <tr key={i}>
                                <td>{u.code}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.cnic || "—"}</td>
                                <td>{u.birthday ? u.birthday.split("T")[0] : "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
}
