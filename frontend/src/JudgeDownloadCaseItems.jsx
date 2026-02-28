import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Components/header";
import "./style.css";
import { API_BASE_URL } from "./config";
import { apiGet, apiPost, apiPut, apiDelete } from "./utils/api";
import Footer from "./Components/footer";


export default function JudgeDownloadCaseItems() {
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
          fetch(`${API_BASE_URL}/completed-cases`, {
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

     const downloadFile = (url, filename) => {
          console.log(url);

          if (!url) {
               alert("File not available");
               return;
          }

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename); // force download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
     };


     return (
          <div className="login-container">
               {/* Header */}
               <Header user={user} />

               <div className="container">
                    <div className="breadcrumb">
                         <a href="#" onClick={() => navigate("/judge-dash")}>
                              Dashboard
                         </a>{" > "}
                         <strong>Download Case Logs</strong>
                    </div>

                    <div className="page-header">
                         <h2 className="page-title">Download Case Details</h2>
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
                              <div className="card-header">Cases Completed</div>
                              <table className="case-table full-width">
                                   <thead>
                                        <tr>
                                             <th>Case Number</th>
                                             <th>Case Type</th>
                                             <th>Title</th>
                                             <th>Parties</th>
                                             <th>Ordersheet</th>
                                             <th>Transcript</th>
                                             <th>Hearing Recording</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {filteredOrdersheets.length === 0 && (
                                             <tr>
                                                  <td colSpan="8" style={{ textAlign: "center" }}>
                                                       ✅ No Case Completed
                                                  </td>
                                             </tr>
                                        )}
                                        {filteredOrdersheets.map((t) => (
                                             <tr key={t.case_id}>
                                                  <td>{t.case_id}</td>
                                                  <td>{t.case_type}</td>
                                                  <td>{t.case_title}</td>
                                                  <td>{t.case_party1} VS {t.case_party2}</td>
                                                  <td>
                                                       <button
                                                            className="logout-btn"
                                                            onClick={() =>
                                                                 downloadFile(
                                                                      t.ordersheet_url,
                                                                      `Ordersheet_Case_${t.case_id}.pdf`
                                                                 )
                                                            }

                                                       >
                                                            Download Ordersheet
                                                       </button>
                                                  </td>
                                                  <td>
                                                       <button
                                                            className="logout-btn"
                                                            onClick={() =>
                                                                 downloadFile(
                                                                      t.transcript_url,
                                                                      `Transcript_Case_${t.case_id}.pdf`
                                                                 )
                                                            }

                                                       >
                                                            Download Transcript
                                                       </button>
                                                  </td>
                                                  <td>
                                                       <button
                                                            className="logout-btn"
                                                            onClick={() =>
                                                                 downloadFile(
                                                                      t.recording_url,
                                                                      `Recording_Case_${t.case_id}.wav`
                                                                 )
                                                            }
                                                       >
                                                            Download Hearing Audio
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
