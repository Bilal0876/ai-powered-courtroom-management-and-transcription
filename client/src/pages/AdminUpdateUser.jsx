import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { apiGet, apiPost } from "../utils/api";
import Footer from "../components/footer";
import ConfirmationModal from "../components/ConfirmationModal";

export default function AdminManageUsers() {
     const [data, setData] = useState(null);
     const [selectedUser, setSelectedUser] = useState(null);
     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
     const [userToDelete, setUserToDelete] = useState(null);
     const navigate = useNavigate();

     useEffect(() => {
          apiGet("/api/users")
               .then(result => setData(result))
               .catch(err => console.error("❌ Error:", err));
     }, []);

     const handleDelete = async (user) => {
          setUserToDelete(user);
          setIsDeleteModalOpen(true);
     };

     const confirmDelete = async () => {
          try {
               await apiPost("/api/users/delete", userToDelete);
               setIsDeleteModalOpen(false);
               setUserToDelete(null);
               alert("User deleted successfully");
               window.location.reload();
          } catch (err) {
               console.error("Delete error:", err);
               alert("Delete failed: " + (err.data?.message || err.message));
          }
     };

     const handleUpdate = async () => {
          try {
               const payload = {
                    ...selectedUser,
                    cnic: selectedUser.cnic && selectedUser.cnic.trim() !== "" ? selectedUser.cnic : undefined,
                    birthday: selectedUser.birthday && selectedUser.birthday.trim() !== "" ? selectedUser.birthday : undefined,
                    password: selectedUser.password && selectedUser.password.trim() !== "" ? selectedUser.password : undefined,
                    court: selectedUser.court ? Number(selectedUser.court) : undefined
               };

               await apiPost("/api/users/update", payload);
               alert("User updated successfully");
               setSelectedUser(null);
               window.location.reload();
          } catch (err) {
               console.error("❌ Update failed:", err);
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
          <div className="!w-full !min-h-screen !flex !flex-col !bg-[#f5f5f5] !font-sans">
               <Header />

               <div className="!flex-1 !p-[20px]">
                    <div className="!bg-white !px-[20px] !py-[15px] !mb-[20px] !rounded-[5px] !shadow-[0_2px_5px_rgba(0,0,0,0.1)] !text-[0.9rem]">
                         <a href="#" onClick={(e) => { e.preventDefault(); navigate("/admin-dash"); }} className="!no-underline !text-[#2c3e50] !font-bold hover:!underline">
                              Dashboard
                         </a>{" > "}
                         <strong>Edit User Info</strong>
                    </div>

                    {!data ? (
                         <div className="!bg-white !p-[40px] !text-center !rounded-[10px] !shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                              <p className="!text-[#6c757d] !text-[1.1rem]">Loading user data...</p>
                         </div>
                    ) : (
                         <div className="!space-y-[25px]">
                              {data.courts.map(court => (
                                   <div key={court.court_id} className="!bg-white !rounded-[10px] !shadow-[0_4px_15px_rgba(0,0,0,0.1)] !overflow-hidden">
                                        <div className="!bg-[#f8f9fa] !px-[20px] !py-[15px] !border-b !border-[#ececec] !flex !justify-between !items-center">
                                             <h3 className="!m-0 !text-[1.1rem] !font-bold !text-[#2c3e50]">
                                                  Court: <span className="!text-[#28a745]">{court.court_name}</span>
                                             </h3>
                                        </div>

                                        <div className="!p-[20px] !space-y-[30px]">
                                             <UserSection title="Judges" users={court.judges} onEdit={setSelectedUser} onDelete={handleDelete} role="judge" />
                                             <UserSection title="Stenographers" users={court.stenographers} onEdit={setSelectedUser} onDelete={handleDelete} role="stenographer" />
                                             <UserSection title="Admins" users={court.admins} onEdit={setSelectedUser} onDelete={handleDelete} role="admin" />
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}
               </div>

               {/* UPDATE MODAL */}
               {selectedUser && (
                    <div className="!fixed !inset-0 !bg-black/50 !flex !items-center !justify-center !z-[1000] !p-[20px]">
                         <div className="!bg-white !p-[30px] !rounded-[10px] !shadow-[0_10px_25px_rgba(0,0,0,0.2)] !w-full !max-w-[500px] !max-h-[90vh] !overflow-y-auto">
                              <h3 className="!text-[20px] !font-bold !text-[#2c3e50] !mb-[20px] !border-b !pb-[10px] !capitalize">Update {selectedUser.role}</h3>

                              <div className="!space-y-[15px]">
                                   <div className="!flex !flex-col">
                                        <label className="!mb-[5px] !font-semibold !text-[#495057] !text-[14px]">Full Name</label>
                                        <input
                                             className="!w-full !p-[10px] !border !border-[#ced4da] !rounded-[5px] focus:!border-[#28a745] focus:!outline-none"
                                             value={selectedUser.name}
                                             onChange={e => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                        />
                                   </div>

                                   <div className="!flex !flex-col">
                                        <label className="!mb-[5px] !font-semibold !text-[#495057] !text-[14px]">Email Address</label>
                                        <input
                                             className="!w-full !p-[10px] !border !border-[#ced4da] !rounded-[5px] focus:!border-[#28a745] focus:!outline-none"
                                             value={selectedUser.email}
                                             onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                        />
                                   </div>

                                   <div className="!flex !flex-col">
                                        <label className="!mb-[5px] !font-semibold !text-[#495057] !text-[14px]">CNIC</label>
                                        <input
                                             className="!w-full !p-[10px] !border !border-[#ced4da] !rounded-[5px] focus:!border-[#28a745] focus:!outline-none"
                                             value={selectedUser.cnic || ""}
                                             onChange={e => setSelectedUser({ ...selectedUser, cnic: e.target.value })}
                                        />
                                   </div>

                                   <div className="!flex !flex-col">
                                        <label className="!mb-[5px] !font-semibold !text-[#495057] !text-[14px]">Date of Birth</label>
                                        <input
                                             type="date"
                                             className="!w-full !p-[10px] !border !border-[#ced4da] !rounded-[5px] focus:!border-[#28a745] focus:!outline-none"
                                             value={selectedUser.birthday ? selectedUser.birthday.split('T')[0] : ""}
                                             onChange={e => setSelectedUser({ ...selectedUser, birthday: e.target.value })}
                                        />
                                   </div>

                                   <div className="!flex !flex-col">
                                        <label className="!mb-[5px] !font-semibold !text-[#495057] !text-[14px]">Assigned Court</label>
                                        <select
                                             className="!w-full !p-[10px] !border !border-[#ced4da] !rounded-[5px] focus:!border-[#28a745] focus:!outline-none !bg-white"
                                             value={selectedUser.court || ""}
                                             onChange={e => setSelectedUser({ ...selectedUser, court: e.target.value })}
                                        >
                                             <option value="">Select a Court</option>
                                             {data?.courts?.map(c => (
                                                  <option key={c.court_id} value={c.court_id}>
                                                       {c.court_name}
                                                  </option>
                                             ))}
                                        </select>
                                   </div>

                                   <div className="!flex !flex-col">
                                        <label className="!mb-[5px] !font-semibold !text-[#495057] !text-[14px]">New Password</label>
                                        <input
                                             type="password"
                                             placeholder="Leave blank to keep unchanged"
                                             className="!w-full !p-[10px] !border !border-[#ced4da] !rounded-[5px] focus:!border-[#28a745] focus:!outline-none"
                                             value={selectedUser.password || ""}
                                             onChange={e => setSelectedUser({ ...selectedUser, password: e.target.value })}
                                        />
                                   </div>
                              </div>

                              <div className="!mt-[25px] !flex !gap-[10px] !justify-end">
                                   <button onClick={() => setSelectedUser(null)} className="!px-[20px] !py-[10px] !bg-[#6c757d] !text-white !rounded-[5px] !font-semibold hover:!bg-[#5a6268] !transition-colors">
                                        Cancel
                                   </button>
                                   <button onClick={handleUpdate} className="!px-[20px] !py-[10px] !bg-[#28a745] !text-white !rounded-[5px] !font-semibold hover:!bg-[#218838] !transition-colors">
                                        Save Changes
                                   </button>
                              </div>
                         </div>
                    </div>
               )}

               <Footer />

               <ConfirmationModal 
                    isOpen={isDeleteModalOpen}
                    title="Delete User"
                    message={`Are you sure you want to delete ${userToDelete?.role} "${userToDelete?.name}"? This action will remove their profile and database records forever.`}
                    confirmText="Delete User"
                    type="danger"
                    onConfirm={confirmDelete}
                    onCancel={() => setIsDeleteModalOpen(false)}
               />
          </div>
     );
}

/* REUSABLE SECTION WITH RESPONSIVE TABLE */
function UserSection({ title, users, onEdit, onDelete, role }) {
     if (!users || users.length === 0) return null;

     return (
          <div className="!space-y-[15px]">
               <h4 className="!m-0 !text-[1rem] !font-bold !text-[#555]">{title}</h4>
               
               {/* Desktop Table */}
               <div className="max-md:!hidden !overflow-x-auto">
                    <table className="!w-full !border-collapse !text-[14px] !table-fixed">
                         <thead>
                              <tr className="!bg-[#f8f9fa] !text-[#2c3e50]">
                                   <th className="!p-[12px] !border !border-[#dee2e6] !text-left !w-[10%]">Code</th>
                                   <th className="!p-[12px] !border !border-[#dee2e6] !text-left !w-[20%]">Name</th>
                                   <th className="!p-[12px] !border !border-[#dee2e6] !text-left !w-[25%]">Email</th>
                                   <th className="!p-[12px] !border !border-[#dee2e6] !text-left !w-[15%]">CNIC</th>
                                   <th className="!p-[12px] !border !border-[#dee2e6] !text-left !w-[12%]">DOB</th>
                                   <th className="!p-[12px] !border !border-[#dee2e6] !text-center !w-[18%]">Actions</th>
                              </tr>
                         </thead>
                         <tbody>
                              {users.map((u, i) => (
                                   <tr key={i} className="hover:!bg-[#f1f1f1] !transition-colors">
                                        <td className="!p-[12px] !border !border-[#dee2e6] !font-mono !text-[#28a745] !whitespace-nowrap !truncate" title={u.code}>{u.code}</td>
                                        <td className="!p-[12px] !border !border-[#dee2e6] !font-semibold !whitespace-nowrap !truncate" title={u.name}>{u.name}</td>
                                        <td className="!p-[12px] !border !border-[#dee2e6] !whitespace-nowrap !truncate" title={u.email}>{u.email}</td>
                                        <td className="!p-[12px] !border !border-[#dee2e6] !whitespace-nowrap">{u.cnic || "—"}</td>
                                        <td className="!p-[12px] !border !border-[#dee2e6] !whitespace-nowrap">{u.birthday ? u.birthday.split("T")[0] : "—"}</td>
                                        <td className="!p-[12px] !border !border-[#dee2e6] !text-center">
                                             <div className="!flex !justify-center !gap-[8px]">
                                                  <button
                                                       className="!bg-[#6c757d] !text-white !px-[12px] !py-[6px] !rounded !text-[12px] !font-bold hover:!bg-[#5a6268] !transition-colors !whitespace-nowrap"
                                                       onClick={() => onEdit({ ...u, role, court: u.court_id, password: "" })}
                                                  >
                                                       Edit
                                                  </button>
                                                  <button
                                                       className="!bg-[#dc3545] !text-white !px-[12px] !py-[6px] !rounded !text-[12px] !font-bold hover:!bg-[#bb2d3b] !transition-colors !whitespace-nowrap"
                                                       onClick={() => onDelete({ ...u, role })}
                                                  >
                                                       Delete
                                                  </button>
                                             </div>
                                        </td>
                                   </tr>
                              ))}
                         </tbody>
                    </table>
               </div>

               {/* Mobile Cards */}
               <div className="md:!hidden !space-y-[15px]">
                    {users.map((u, i) => (
                         <div key={i} className="!bg-[#fcfcfc] !border !border-[#eee] !rounded-[8px] !p-[15px] !shadow-sm">
                              <div className="!flex !justify-between !items-start !mb-[10px]">
                                   <div>
                                        <div className="!text-[12px] !font-mono !text-[#28a745] !mb-[2px]">{u.code}</div>
                                        <div className="!text-[16px] !font-bold !text-[#2c3e50]">{u.name}</div>
                                   </div>
                                   <div className="!flex !gap-[5px]">
                                        <button
                                             className="!bg-[#6c757d] !text-white !p-[8px] !rounded hover:!bg-[#5a6268]"
                                             onClick={() => onEdit({ ...u, role, court: u.court_id, password: "" })}
                                        >
                                             Edit
                                        </button>
                                        <button
                                             className="!bg-[#dc3545] !text-white !p-[8px] !rounded hover:!bg-[#bb2d3b]"
                                             onClick={() => onDelete({ ...u, role })}
                                        >
                                             Delete
                                        </button>
                                   </div>
                              </div>
                              <div className="!grid !grid-cols-1 !gap-[8px] !text-[13px]">
                                   <div className="!flex !justify-between">
                                        <span className="!text-[#666]">Email:</span>
                                        <span className="!text-[#2c3e50] !truncate !max-w-[200px]">{u.email}</span>
                                   </div>
                                   <div className="!flex !justify-between">
                                        <span className="!text-[#666]">CNIC:</span>
                                        <span className="!text-[#2c3e50]">{u.cnic || "—"}</span>
                                   </div>
                                   <div className="!flex !justify-between">
                                        <span className="!text-[#666]">DOB:</span>
                                        <span className="!text-[#2c3e50]">{u.birthday ? u.birthday.split("T")[0] : "—"}</span>
                                   </div>
                              </div>
                         </div>
                    ))}
               </div>
          </div>
     );
}
