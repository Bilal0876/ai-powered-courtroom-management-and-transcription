import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Components/header";
import "./style.css";
import { API_BASE_URL } from "./config";
import { apiGet, apiPost, apiPut, apiDelete } from "./utils/api";
import Footer from "./Components/footer";


export default function JudgePendingOrdersheets() {
     const [Ordersheets, setOrdersheets] = useState([]);
     const [search, setSearch] = useState("");
     const [caseType, setCaseType] = useState("");
     const [judgeFilter, setJudgeFilter] = useState("");
     const navigate = useNavigate();

     useEffect(() => {
          const user = JSON.parse(localStorage.getItem("user"));
          console.log(user);
          if (!user) {
               console.error("❌ No user found in localStorage");
               return;
          }
          fetch(`${API_BASE_URL}/pending-ordersheets`, {
               headers: {
                    "x-judge-code": user.id
               },
          })
               .then((res) => res.json())
               .then((data) => {
                    if (data.success) setOrdersheets(data.data);
               })
               .catch((err) => console.error("❌ Error loading Ordersheets:", err));
     }, []);

     const filteredOrdersheets = Ordersheets.filter((t) => {
          const caseNumber =
               typeof t.case_id === "number"
                    ? t.case_id.toString().toLowerCase()
                    : (t.case_id || "").toString().toLowerCase();
          const title = (t.case_title || "").toLowerCase();
          const caseTypeVal = (t.case_type || "").toLowerCase();
          const judgeVal = (t.judge || "").toLowerCase();

          return (
               (search === "" || caseNumber.includes(search.toLowerCase()) || title.includes(search.toLowerCase())) &&
               (caseType === "" || caseTypeVal === caseType) &&
               (judgeFilter === "" || judgeVal === judgeFilter)
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
                         <strong>Pending Ordersheets</strong>
                    </div>

                    <div className="page-header">
                         <h2 className="page-title">Ordersheets Pending Approval</h2>
                    </div>

                    {/* Filters */}
                    <div className="content-grid">
                         {/* Cases Table */}
                         <div className="main-content">
                              <div className="card-header">Browse Cases</div>
                              <div className="filters-top">
                                   <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Search by case number or title..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                   />
                                   <select
                                        className="form-select"
                                        value={caseType}
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
                                             setJudgeFilter("");
                                        }}
                                   >
                                        Clear
                                   </button>
                              </div>

                              {/* Ordersheets Table */}
                              <div className="card-header">Pending Ordersheets</div>
                              <table className="case-table full-width">
                                   <thead>
                                        <tr>
                                             <th>Case Number</th>
                                             <th>Case Type</th>
                                             <th>Title</th>
                                             <th>Parties</th>
                                             <th>Submitted By</th>
                                             <th>Submitted At</th>
                                             <th>Action</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {filteredOrdersheets.length === 0 && (
                                             <tr>
                                                  <td colSpan="8" style={{ textAlign: "center" }}>
                                                       ✅ No Ordersheets pending approval
                                                  </td>
                                             </tr>
                                        )}
                                        {filteredOrdersheets.map((t) => (
                                             <tr key={t.case_id}>
                                                  <td>{t.case_code}</td>
                                                  <td>{t.case_type}</td>
                                                  <td>{t.case_title}</td>
                                                  <td>{t.party1} VS {t.party2}</td>
                                                  <td>{t.submitted_by}</td>
                                                  <td>{new Date(t.submitted_at).toLocaleString()}</td>
                                                  <td>
                                                       <button
                                                            className="logout-btn"
                                                            onClick={() => navigate("/judge-dash/review-ordersheet", { state: { selectedCase: t } })}
                                                       >
                                                            Review Ordersheet
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
