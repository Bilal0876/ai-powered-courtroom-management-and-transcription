import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Components/header";
import "./style.css";
import { API_BASE_URL } from "./config";
import { apiGet, apiPost, apiPut, apiDelete } from "./utils/api";
import Footer from "./Components/footer";


export default function JudgePendingTranscripts() {
     const [transcripts, setTranscripts] = useState([]);
     const [search, setSearch] = useState("");
     const [caseType, setCaseType] = useState("");

     const [caseTypes, setCaseTypes] = useState([]);
     const navigate = useNavigate();

     useEffect(() => {
          const user = JSON.parse(localStorage.getItem("user"));
          console.log(user);
          if (!user) {
               console.error("❌ No user found in localStorage");
               return;
          }
          fetch(`${API_BASE_URL}/pending-transcripts`, {
               headers: {
                    "x-judge-code": user.id
               },
          })
               .then((res) => res.json())
               .then((data) => {
                    if (data.success) setTranscripts(data.data);
               })
               .catch((err) => console.error("❌ Error loading transcripts:", err));
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

     const filteredTranscripts = transcripts.filter((t) => {
          const caseCode = (t.case_code || "").toString().toLowerCase();
          const title = (t.case_title || "").toLowerCase();
          const caseTypeVal = (t.case_type || "").toLowerCase();

          return (
               (search === "" ||
                    caseCode.includes(search.toLowerCase()) ||
                    title.includes(search.toLowerCase())) &&
               (caseType === "" || caseTypeVal === caseType)
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
                         <strong>Pending Transcripts</strong>
                    </div>

                    <div className="page-header">
                         <h2 className="page-title">Transcripts Pending Approval</h2>
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
                                        <option value="">All Case Types</option>
                                        {caseTypes.map((ct) => (
                                             <option key={ct.id} value={ct.name.toLowerCase()}>
                                                  {ct.name}
                                             </option>
                                        ))}
                                   </select>
                                   <button
                                        className="gov-btn2 gov-btn-secondary"
                                        onClick={() => {
                                             setSearch("");
                                             setCaseType("");
                                        }}
                                   >
                                        Clear
                                   </button>
                              </div>

                              {/* Transcripts Table */}
                              <div className="card-header">Pending Transcripts</div>
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
                                        {filteredTranscripts.length === 0 && (
                                             <tr>
                                                  <td colSpan="8" style={{ textAlign: "center" }}>
                                                       ✅ No transcripts pending approval
                                                  </td>
                                             </tr>
                                        )}
                                        {filteredTranscripts.map((t) => (
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
                                                            onClick={() => navigate("/judge-dash/review-transcripts", { state: { selectedCase: t } })}
                                                       >
                                                            Review Transcript
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
