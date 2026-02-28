import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Components/header";
import "./style.css";
import { API_BASE_URL } from "./config";
import { apiGet, apiPost, apiPut, apiDelete } from "./utils/api";
import Footer from "./Components/footer";

export default function AdminViewUsers() {
     const [data, setData] = useState(null);
     const navigate = useNavigate();

     useEffect(() => {
          // ✅ Use apiGet with JWT
          apiGet("/users-by-court")
               .then(result => setData(result))
               .catch(err => console.error("❌ Error:", err));
     }, []);

     return (
          <div className="login-container">

               {/* HEADER */}
               <Header />

               <div className="container">
                    <div className="breadcrumb">
                         <a href="#" onClick={() => navigate("/admin-dash")}>
                              Dashboard
                         </a>{" > "}
                         <strong>View Users</strong>
                    </div>

                    {!data ? (
                         <div style={{ padding: "40px", textAlign: "center" }}>
                              <p>Loading...</p>
                         </div>
                    ) : (
                         <>
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
                                                  <td>{data.chiefJudge.code}</td>
                                                  <td>{data.chiefJudge.name}</td>
                                                  <td>{data.chiefJudge.email}</td>
                                                  <td>{data.chiefJudge.cnic}</td>
                                                  <td>{data.chiefJudge.birthday?.split("T")[0]}</td>
                                             </tr>
                                        </tbody>
                                   </table>
                              </div>

                              {/* COURTS */}
                              {data.courts.map(court => (
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
                         </>
                    )}

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
