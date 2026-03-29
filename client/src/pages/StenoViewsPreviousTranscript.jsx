import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import "../assets/styles/style.css";
import { API_BASE_URL } from "../config";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";
import Footer from "../components/footer";


export default function StenoDownloadCaseItems() {
     const [Ordersheets, setOrdersheets] = useState([]);
     const [search, setSearch] = useState("");
     const [caseType, setCaseType] = useState("");
     const [judgeFilter, setJudgeFilter] = useState("");
     const [caseTypes, setCaseTypes] = useState([]);
     const navigate = useNavigate();

     useEffect(() => {
          const user = JSON.parse(localStorage.getItem("user"));
          console.log(user);
          if (!user) {
               console.error(" No user found in localStorage");
               return;
          }
          fetch(`${API_BASE_URL}/steno-completed-cases`, {
               headers: {
                    "x-steno-code": user.id
               },
          })
               .then((res) => res.json())
               .then((data) => {
                    if (data.success) setOrdersheets(data.data);
               })
               .catch((err) => console.error("❌ Error loading Ordersheets:", err));
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
                         <a href="#" onClick={() => navigate("/stenographer-dashboard")}>
                              Dashboard
                         </a>{" > "}
                         <strong>Completed Transcripts</strong>
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
                                             <th>Judge</th>
                                             <th>Transcript</th>
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
                                                  <td><b>{t.case_code}</b></td>
                                                  <td>{t.case_type}</td>
                                                  <td>{t.case_title}</td>
                                                  <td>{t.case_party1} VS {t.case_party2}</td>
                                                  <td>Justice {t.judge_name}</td>
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
