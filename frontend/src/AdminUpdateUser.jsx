import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Components/header";
import "./style.css";
import { API_BASE_URL } from "./config";
import { apiGet, apiPost } from "./utils/api";
import Footer from "./Components/footer";

export default function AdminManageUsers() {
     const [data, setData] = useState(null);
     const [selectedUser, setSelectedUser] = useState(null);
     const navigate = useNavigate();

     useEffect(() => {
          // ✅ Use apiGet with JWT
          apiGet("/users-by-court")
               .then(result => setData(result))
               .catch(err => console.error("❌ Error:", err));
     }, []);

     const handleDelete = async (user) => {
          if (!window.confirm(`Delete ${user.name}?`)) return;

          // ✅ Use apiPost with JWT
          await apiPost("/delete-user", user);

          alert("User deleted");
          window.location.reload();
     };

     const handleUpdate = async () => {
          try {
               // Prepare payload - ensure empty strings become null/undefined for optional fields
               const payload = {
                    ...selectedUser,
                    // Convert empty strings to null for optional fields
                    cnic: selectedUser.cnic && selectedUser.cnic.trim() !== "" ? selectedUser.cnic : undefined,
                    birthday: selectedUser.birthday && selectedUser.birthday.trim() !== "" ? selectedUser.birthday : undefined,
                    password: selectedUser.password && selectedUser.password.trim() !== "" ? selectedUser.password : undefined,
                    // Ensure court is a number (it's court_id)
                    court: selectedUser.court ? Number(selectedUser.court) : undefined
               };

               // ✅ Use apiPost with JWT
               await apiPost("/update-user", payload);

               alert("User updated successfully");
               setSelectedUser(null);
               window.location.reload();
          } catch (err) {
               console.error("❌ Update failed:", err);
               // Show validation errors if available
               if (err.data && err.data.errors) {
                    const errorMessages = err.data.errors.map(e => `${e.field}: ${e.message}`).join('\n');
                    alert("Validation errors:\n" + errorMessages);
               } else {
                    const errorMessage = err.data?.message || err.message || "Failed to update user";
                    alert("❌ Error: " + errorMessage);
               }
          }
     };

     return (
          <div className="login-container">

               {/* HEADER */}
               <Header />

               <div className="container">
                    <div className="breadcrumb">
                         <a href="#" onClick={() => navigate("/admin-dash")}>
                              Dashboard
                         </a>{" > "}
                         <strong>Edit Info</strong>
                    </div>

                    {!data ? (
                         <div style={{ padding: "40px", textAlign: "center" }}>
                              <p>Loading...</p>
                         </div>
                    ) : (
                         data.courts.map(court => (
                              <div key={court.court_id} className="card" style={{ marginTop: "25px" }}>
                                   <div className="card-header" style={{ background: "#edf767c8", borderRadius: "10px" }}>
                                        Court: {court.court_name}
                                   </div>

                                   <UserSection title="Judges" users={court.judges} onEdit={setSelectedUser} onDelete={handleDelete} role="judge" />
                                   <UserSection title="Stenographers" users={court.stenographers} onEdit={setSelectedUser} onDelete={handleDelete} role="stenographer" />
                                   <UserSection title="Admins" users={court.admins} onEdit={setSelectedUser} onDelete={handleDelete} role="admin" />
                              </div>
                         ))
                    )}
               </div>

               {/* UPDATE MODAL */}
               {selectedUser && (
                    <div className="modal-overlay">
                         <div className="modal">
                              <h3>Update {selectedUser.role}</h3>

                              <label>Name</label>
                              <input
                                   value={selectedUser.name}
                                   onChange={e => setSelectedUser({ ...selectedUser, name: e.target.value })}
                              />

                              <label>Email</label>
                              <input
                                   value={selectedUser.email}
                                   onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })}
                              />

                              <label>CNIC</label>
                              <input
                                   value={selectedUser.cnic || ""}
                                   onChange={e => setSelectedUser({ ...selectedUser, cnic: e.target.value })}
                              />

                              <label>Date of Birth</label>
                              <input
                                   type="date"
                                   value={selectedUser.birthday || ""}
                                   onChange={e => setSelectedUser({ ...selectedUser, birthday: e.target.value })}
                              />

                              <label>Court ID</label>
                              <input
                                   type="number"
                                   value={selectedUser.court}
                                   onChange={e => setSelectedUser({ ...selectedUser, court: e.target.value })}
                              />

                              <label>New Password</label>
                              <input
                                   type="password"
                                   placeholder="Leave blank to keep unchanged"
                                   value={selectedUser.password}
                                   onChange={e =>
                                        setSelectedUser({ ...selectedUser, password: e.target.value })
                                   }
                              />

                              <div className="modal-actions">
                                   <button onClick={handleUpdate} className="action-btn action-btn-primary">
                                        Save Changes
                                   </button>
                                   <button onClick={() => setSelectedUser(null)} className="action-btn">
                                        Cancel
                                   </button>
                              </div>
                         </div>
                    </div>
               )}

               <Footer />


          </div>
     );
}

/* REUSABLE TABLE */
function UserSection({ title, users, onEdit, onDelete, role }) {
     if (users.length === 0) return null;

     return (
          <>
               <div className="card-header"><h4>{title}</h4></div>
               <table className="case-table full-width">
                    <thead>
                         <tr>
                              <th>Code</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>CNIC</th>
                              <th>DOB</th>
                              <th>Actions</th>
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
                                   <td>
                                        <button
                                             className="logout-btn"
                                             style={{ backgroundColor: 'grey', marginRight: '10px' }}
                                             onClick={() =>
                                                  onEdit({
                                                       ...u,
                                                       role,
                                                       court: u.court_id,
                                                       password: "" // important
                                                  })
                                             }
                                        >
                                             Edit
                                        </button>

                                        <button
                                             className="logout-btn"
                                             style={{ backgroundColor: 'red', marginRight: '10px' }}
                                             onClick={() => onDelete({ ...u, role })}
                                        >
                                             Delete
                                        </button>
                                   </td>
                              </tr>
                         ))}
                    </tbody>
               </table>
          </>
     );
}
