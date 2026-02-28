import React, { useEffect, useState } from "react";
import Header from "./Components/header"
import "./style.css";
import { API_BASE_URL } from "./config";
import { apiGet, apiPost, apiPut, apiDelete } from "./utils/api";


export default function ChiefJudgeManageCases() {
     const [cases, setCases] = useState([]);
     const [selectedCase, setSelectedCase] = useState(null);

     useEffect(() => {
          apiGet("/cjcases")
               .then(data => setCases(data));
     }, []);

     const handleDelete = async (c) => {
          if (!window.confirm(`Delete case ${c.case_code}?`)) return;

          await apiPost("/delete-case", { case_id: c.case_id });

          window.location.reload();
     };

     const handleUpdate = async () => {
          await apiPost("/update-case", selectedCase);

          setSelectedCase(null);
          window.location.reload();
     };

     return (
          <div className="login-container">

               {/* HEADER */}
               <Header user={user} />

               <div className="container">
                    <table className="case-table full-width">
                         <thead>
                              <tr>
                                   <th>Case Code</th>
                                   <th>Title</th>
                                   <th>Status</th>
                                   <th>Judge</th>
                                   <th>Steno</th>
                                   <th>Court</th>
                                   <th>Actions</th>
                              </tr>
                         </thead>
                         <tbody>
                              {cases.map(c => (
                                   <tr key={c.case_id}>
                                        <td>{c.case_code}</td>
                                        <td>{c.case_title}</td>
                                        <td>{c.case_status}</td>
                                        <td>{c.judge_code || "—"}</td>
                                        <td>{c.steno_code || "—"}</td>
                                        <td>{c.court || "—"}</td>
                                        <td>
                                             <button
                                                  className="logout-btn"
                                                  onClick={() => setSelectedCase(c)}
                                             >
                                                  Edit
                                             </button>

                                             <button
                                                  className="logout-btn"
                                                  style={{ background: "red" }}
                                                  onClick={() => handleDelete(c)}
                                             >
                                                  Delete
                                             </button>
                                        </td>
                                   </tr>
                              ))}
                         </tbody>
                    </table>
               </div>

               {/* EDIT MODAL */}
               {selectedCase && (
                    <div className="modal-overlay">
                         <div className="modal">
                              <h3>Edit Case</h3>

                              {[
                                   "case_type",
                                   "case_title",
                                   "case_status",
                                   "case_party1",
                                   "case_party2",
                                   "judge_code",
                                   "steno_code",
                                   "court",
                                   "case_level",
                                   "transcript",
                                   "ordersheet"
                              ].map(field => (
                                   <input
                                        key={field}
                                        placeholder={field.replace("_", " ").toUpperCase()}
                                        value={selectedCase[field] || ""}
                                        onChange={e =>
                                             setSelectedCase({
                                                  ...selectedCase,
                                                  [field]: e.target.value
                                             })
                                        }
                                   />
                              ))}

                              <div className="modal-actions">
                                   <button className="action-btn action-btn-primary" onClick={handleUpdate}>
                                        Save
                                   </button>
                                   <button className="action-btn" onClick={() => setSelectedCase(null)}>
                                        Cancel
                                   </button>
                              </div>
                         </div>
                    </div>
               )}

          </div>
     );
}
