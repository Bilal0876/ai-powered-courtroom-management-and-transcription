import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { apiGet } from "../utils/api";
import Footer from "../components/footer";

export default function AdminViewUsers() {
     const [data, setData] = useState(null);
     const navigate = useNavigate();

     useEffect(() => {
          apiGet("/users-by-court")
               .then(result => setData(result))
               .catch(err => console.error("❌ Error:", err));
     }, []);

     return (
          <div className="!w-full !min-h-screen !flex !flex-col !bg-[#f5f5f5] !font-sans">
               <Header />

               <div className="!flex-1 !p-[20px]">
                    <div className="!bg-white !px-[20px] !py-[15px] !mb-[20px] !rounded-[5px] !shadow-[0_2px_5px_rgba(0,0,0,0.1)] !text-[0.9rem]">
                         <a href="#" onClick={(e) => { e.preventDefault(); navigate("/admin-dash"); }} className="!no-underline !text-[#2c3e50] !font-bold hover:!underline">
                              Dashboard
                         </a>{" > "}
                         <strong>View Users</strong>
                    </div>

                    {!data ? (
                         <div className="!bg-white !p-[40px] !text-center !rounded-[10px] !shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                              <p className="!text-[#6c757d] !text-[1.1rem]">Loading user data...</p>
                         </div>
                    ) : (
                         <div className="!space-y-[30px]">
                              {/* CHIEF JUDGE SECTION */}
                              <div className="!bg-white !rounded-[10px] !shadow-[0_4px_15px_rgba(0,0,0,0.1)] !overflow-hidden">
                                   <div className="!bg-[#2c3e50] !text-white !px-[20px] !py-[12px] !font-bold !text-[1.1rem]">
                                        Chief Judge
                                   </div>
                                   <div className="!p-[20px]">
                                        <Section users={[data.chiefJudge]} isChief={true} />
                                   </div>
                              </div>

                              {/* COURTS SECTION */}
                              {data.courts.map(court => (
                                   <div key={court.court_id} className="!bg-white !rounded-[10px] !shadow-[0_4px_15px_rgba(0,0,0,0.1)] !overflow-hidden">
                                        <div className="!bg-[#f8f9fa] !px-[20px] !py-[15px] !border-b !border-[#ececec]">
                                             <h3 className="!m-0 !text-[1.1rem] !font-bold !text-[#2c3e50]">
                                                  Court: <span className="!text-[#28a745]">{court.court_name}</span>
                                             </h3>
                                        </div>

                                        <div className="!p-[20px] !space-y-[30px]">
                                             <Section title="Judges" users={court.judges} />
                                             <Section title="Stenographers" users={court.stenographers} />
                                             <Section title="Admins" users={court.admins} />
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}
               </div>

               <Footer />
          </div>
     );
}

/* 🔹 REUSABLE SECTION COMPONENT WITH RESPONSIVE LAYOUT */
function Section({ title, users, isChief = false }) {
     if (!users || users.length === 0) return (
          <div className="!space-y-[10px]">
               {title && <h4 className="!m-0 !text-[1rem] !font-bold !text-[#555]">{title}</h4>}
               <p className="!text-[#777] !italic !text-[14px]">No records found.</p>
          </div>
     );

     return (
          <div className="!space-y-[15px]">
               {title && <h4 className="!m-0 !text-[1rem] !font-bold !text-[#555]">{title}</h4>}
               
               {/* Desktop Table */}
               <div className="max-md:!hidden !overflow-x-auto">
                    <table className="!w-full !border-collapse !text-[14px] !table-fixed">
                         <thead>
                              <tr className="!bg-[#f8f9fa] !text-[#2c3e50]">
                                   <th className="!p-[12px] !border !border-[#dee2e6] !text-left !w-[15%]">Code</th>
                                   <th className="!p-[12px] !border !border-[#dee2e6] !text-left !w-[25%]">Name</th>
                                   <th className="!p-[12px] !border !border-[#dee2e6] !text-left !w-[30%]">Email</th>
                                   <th className="!p-[12px] !border !border-[#dee2e6] !text-left !w-[15%]">CNIC</th>
                                   <th className="!p-[12px] !border !border-[#dee2e6] !text-left !w-[15%]">Birthday</th>
                              </tr>
                         </thead>
                         <tbody>
                              {users.map((u, i) => (
                                   <tr key={i} className="hover:!bg-[#f1f1f1] !transition-colors">
                                        <td className="!p-[12px] !border !border-[#dee2e6] !font-mono !text-[#28a745] !whitespace-nowrap">{u.code}</td>
                                        <td className="!p-[12px] !border !border-[#dee2e6] !font-semibold">{u.name}</td>
                                        <td className="!p-[12px] !border !border-[#dee2e6]">{u.email}</td>
                                        <td className="!p-[12px] !border !border-[#dee2e6] !whitespace-nowrap">{u.cnic || "—"}</td>
                                        <td className="!p-[12px] !border !border-[#dee2e6] !whitespace-nowrap">{u.birthday ? u.birthday.split("T")[0] : "—"}</td>
                                   </tr>
                              ))}
                         </tbody>
                    </table>
               </div>

               {/* Mobile Cards */}
               <div className="md:!hidden !space-y-[12px]">
                    {users.map((u, i) => (
                         <div key={i} className="!bg-[#fcfcfc] !border !border-[#eee] !rounded-[8px] !p-[15px] !shadow-sm">
                              <div className="!flex !justify-between !items-start !mb-[10px]">
                                   <div>
                                        <div className="!text-[12px] !font-mono !text-[#28a745] !mb-[2px]">{u.code}</div>
                                        <div className="!text-[16px] !font-bold !text-[#2c3e50]">{u.name}</div>
                                   </div>
                              </div>
                              <div className="!grid !grid-cols-1 !gap-[6px] !text-[13px]">
                                   <div className="!flex !justify-between">
                                        <span className="!text-[#666]">Email:</span>
                                        <span className="!text-[#2c3e50] !truncate !max-w-[200px]">{u.email}</span>
                                   </div>
                                   <div className="!flex !justify-between">
                                        <span className="!text-[#666]">CNIC:</span>
                                        <span className="!text-[#2c3e50]">{u.cnic || "—"}</span>
                                   </div>
                                   <div className="!flex !justify-between">
                                        <span className="!text-[#666]">Birthday:</span>
                                        <span className="!text-[#2c3e50]">{u.birthday ? u.birthday.split("T")[0] : "—"}</span>
                                   </div>
                              </div>
                         </div>
                    ))}
               </div>
          </div>
     );
}
