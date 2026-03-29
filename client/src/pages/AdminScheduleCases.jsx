import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header"
import { API_BASE_URL } from "../config";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";
import Footer from "../components/footer";


const getBadgeBg = (type) => {
    const t = (type || "").toLowerCase();
    if (t === 'criminal') return '#dc3545';
    if (t === 'civil') return '#28a745';
    if (t === 'family') return '#fffb07';
    if (t === 'labor') return '#008cff';
    if (t === 'commercial') return '#ff8000';
    if (t === 'banking') return '#65f4a5';
    if (t === 'anti-corruption') return '#692865';
    if (t === 'election') return '#b29411';
    if (t === 'environmental') return '#492b02';
    if (t === 'constitutional') return '#03ffea';
    if (t === 'tax') return '#000000';
    if (t === 'customs') return '#dcdcdc';
    return '#555555';
};

const getBadgeText = (type) => {
    const t = (type || "").toLowerCase();
    if (['family', 'commercial', 'banking', 'constitutional', 'customs'].includes(t)) return '#212529';
    return '#ffffff';
};

export default function AdminScheduleHearing({ }) {
     const [cases, setCases] = useState([]);
     const [search, setSearch] = useState("");
     const [caseType, setCaseType] = useState("");
     const [status, setStatus] = useState("");
     const [selectedCaseId, setSelectedCaseId] = useState(null);

     const [courts, setCourt] = useState([]);
     const [judges, setJudges] = useState([]);
     const [stenographers, setStenographers] = useState([]);
     const [caseTypes, setCaseTypes] = useState([]);
     const [scheduleForm, setScheduleForm] = useState({
          court: "",
          judge: "",
          hearingDate: "",
          hearingTime: "",
          stenographer: ""
     });

     const navigate = useNavigate();


     useEffect(() => {
          const user = JSON.parse(localStorage.getItem("user"));
          console.log(user);
          if (!user) {
               console.error("❌ No user found in localStorage");
               return;
          }
     }, []);

     const fetchCases = async () => {
          try {
               // ✅ Use apiGet with JWT authentication
               const data = await apiGet("/api/hearings/unscheduled");
               setCases(data);
          } catch (err) {
               console.error("❌ Error loading cases:", err);
          }
     };

     useEffect(() => {
          fetchCases();
     }, []);

     useEffect(() => {
          async function fetchData() {
               try {
                    const data = await apiGet("/api/courts/types");
                    setCaseTypes(data);
               } catch (err) {
                    console.error("Error fetching case types:", err);
               }
          }
          fetchData();
     }, []);

     useEffect(() => {
          async function fetchData() {
               try {
                    const data = await apiGet("/api/courts/names");
                    setCourt(data);
               } catch (err) {
                    console.error("Error fetching court names:", err);
               }
          }
          fetchData();
     }, []);

     useEffect(() => {
          if (!scheduleForm.court) {
               setJudges([]);
               setStenographers([]);
               return;
          }

          // fetch judges of selected court
          apiGet(`/api/users/judges/${scheduleForm.court}`)
               .then(data => setJudges(data))
               .catch(err => console.error("Error fetching judges:", err));

          // fetch stenographers of selected court
          apiGet(`/api/users/stenos/${scheduleForm.court}`)
               .then(data => setStenographers(data))
               .catch(err => console.error("Error fetching stenographers:", err));

     }, [scheduleForm.court]);


     const handleScheduleChange = (e) => {
          setScheduleForm({
               ...scheduleForm,
               [e.target.name]: e.target.value
          });
     };

     const handleSubmitSchedule = async () => {
          if (!selectedCaseId) return;

          // Basic validation
          const { court, judge, stenographer, hearingDate, hearingTime } = scheduleForm;
          if (!court || !judge || !stenographer || !hearingDate || !hearingTime) {
               alert("Please fill all fields before scheduling.");
               return;
          }

          const payload = {
               caseNumber: selectedCaseId,
               court,
               judge,
               stenographer,
               hearingDate,
               hearingTime
          };

          try {
               // ✅ apiPost already returns parsed JSON data
               const data = await apiPost("/api/hearings/schedule", payload);

               if (data.success) {
                    alert("Hearing scheduled successfully!");
                    fetchCases();
                    // Reset the schedule form
                    setScheduleForm({ court: "", judge: "", stenographer: "", hearingDate: "", hearingTime: "" });
                    setSelectedCaseId(null);
               } else {
                    alert("Error: " + (data.error || "Unknown error"));
               }
          } catch (err) {
               console.error("Error scheduling hearing:", err);
               const errorMessage = err.data?.error || err.message || "Server error while scheduling hearing.";
               alert("Error: " + errorMessage);
          }
     };


     const filteredCases = cases.filter((c) => {
          const caseNumber =
               typeof c.caseNumber === "number"
                    ? c.caseNumber.toString().toLowerCase()
                    : (c.caseNumber || "").toString().toLowerCase();
          const parties = `${c.party1 || ""} ${c.party2 || ""}`.toLowerCase();
          const title = typeof c.caseTitle === "string" ? c.caseTitle.toLowerCase() : "";
          const caseTypeVal = typeof c.caseType === "string" ? c.caseType.toLowerCase() : "";
          const statusVal = typeof c.status === "string" ? c.status.toLowerCase() : "";

          return (
               (search === "" ||
                    caseNumber.includes(search.toLowerCase()) ||
                    parties.includes(search.toLowerCase()) ||
                    title.includes(search.toLowerCase())) &&
               (caseType === "" || caseTypeVal === caseType) &&
               (status === "" || statusVal === status)
          );
     });

     return (
          <div className="!w-full !min-h-screen !flex !flex-col !bg-[#f5f5f5] !font-sans">
               {/* Header */}
               <Header />
               <div className="!flex-1 !p-[20px]">
                    <div className="!bg-white !px-[20px] !py-[15px] !mb-[20px] !rounded-[5px] !shadow-[0_2px_5px_rgba(0,0,0,0.1)] !text-[0.9rem]">
                         <a href="#" onClick={() => navigate("/admin-dash")} className="!no-underline !text-black !font-bold hover:!underline">
                              Dashboard
                         </a>{" > "}
                         <strong>Schedule Cases</strong>
                    </div>

                    <div className="page-header">
                         <h2 className="!text-[1.5rem] !font-semibold !text-[#2c3e50] !mb-[15px]">Schedule Case Hearing</h2>
                         <div >
                              <button
                                   className="!w-full !p-[15px] !border-none !rounded-[10px] !text-[14px] !font-semibold !cursor-pointer !transition-colors !duration-300 !mb-[15px] !bg-[#28a745] !text-white hover:!bg-[#1e7e34] !flex !items-center !justify-center !gap-[8px]"
                                   onClick={() => navigate("/admin-dash/browse-cases")}>
                                   Scheduled Cases
                              </button>
                         </div>
                    </div>

                    <div className="!block !mb-[20px]">
                         {/* Cases Table */}
                         <div className="!bg-white !rounded-[5px] !shadow-[0_2px_5px_rgba(0,0,0,0.1)] !border-t-[4px] !border-white !overflow-hidden">
                              <div className="!bg-[#f8f9fa] !px-[20px] !py-[15px] !border-b !border-[#dee2e6] !font-semibold !text-[#2c3e50] !flex !items-center !gap-[10px]">Browse Cases</div>

                              {/* ✅ Move Search + Filters here */}
                              <div className="!flex !gap-[10px] !m-[15px] max-md:!flex-col">
                                   <div className="!flex !flex-col !w-full !max-w-md">
                                        <label htmlFor="schedule-search" className="sr-only">Search Cases</label>
                                        <input
                                             id="schedule-search"
                                             type="text"
                                             className="!p-[8px_12px] !border !border-[#dee2e6] !rounded-[4px] !text-[14px] !w-full focus:!border-[#28a745] focus:!outline-none"
                                             placeholder="Search by case number or party..."
                                             value={search}
                                             onChange={(e) => setSearch(e.target.value)}
                                        />
                                   </div>

                                   <div className="!flex !flex-col !w-full !max-w-xs">
                                        <label htmlFor="schedule-type-filter" className="sr-only">Filter by Case Type</label>
                                        <select
                                             id="schedule-type-filter"
                                             className="!p-[8px_12px] !border !border-[#dee2e6] !rounded-[4px] !text-[14px] !w-full focus:!border-[#28a745] focus:!outline-none !bg-white"
                                             value={caseType}
                                             onChange={(e) => setCaseType(e.target.value)}
                                        >
                                             <option value="">All Case Types</option>
                                             {caseTypes.map((ct) => (
                                                  <option key={ct.type_id} value={ct.type_name.toLowerCase()}>
                                                       {ct.type_name}
                                                  </option>
                                             ))}
                                        </select>
                                   </div>

                                   <button
                                        className="!p-[10px_20px] !border-none !rounded-[4px] !cursor-pointer !font-medium !transition-colors !duration-300 !flex !items-center !justify-center !gap-[8px] !bg-[#6c757d] !text-white hover:!bg-[#545b62] max-md:!w-full"
                                        onClick={() => {
                                             setSearch("");
                                             setCaseType("");
                                        }}
                                   >
                                        Clear
                                   </button>
                              </div>

                              {/* ✅ Full-width table */}
                              <table className="!w-full sm:!w-[95%] !mx-auto !text-center !border-collapse !text-[12px] xl:!text-[14px] max-md:!block">
                                   <thead className="max-md:!hidden">
                                        <tr>
                                             <th className="!bg-[#dfe5eb] !font-semibold !p-[6px] xl:!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !leading-tight !border-[#dee2e6]">Case Number</th>
                                             <th className="!bg-[#dfe5eb] !font-semibold !p-[6px] xl:!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !leading-tight !border-[#dee2e6]">Case Type</th>
                                             <th className="!bg-[#dfe5eb] !font-semibold !p-[6px] xl:!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !leading-tight !border-[#dee2e6]">Title</th>
                                             <th className="!bg-[#dfe5eb] !font-semibold !p-[6px] xl:!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !leading-tight !border-[#dee2e6]">Parties</th>
                                             <th className="!bg-[#dfe5eb] !font-semibold !p-[6px] xl:!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !leading-tight !border-[#dee2e6]"></th>
                                        </tr>
                                   </thead>

                                   <tbody className="max-md:!block">
                                        {filteredCases.map((c) => (
                                             <React.Fragment key={c.caseNumber}>

                                                  {/* Case row */}
                                                  <tr className="max-md:!block max-md:!bg-white max-md:!border max-md:!border-[#dee2e6] max-md:!rounded-[8px] max-md:!mb-[15px] max-md:!p-[10px] max-md:!shadow-sm max-md:!mx-[10px]">
                                                       <td className="!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !border-[#dee2e6] max-md:!flex max-md:!justify-between max-md:!items-center max-md:!border-b max-md:!border-[#f1f1f1] max-md:!text-[0.9rem] max-md:!text-right max-md:!p-[10px_5px]"><span className="hidden max-md:!inline-block !font-bold !text-[#6c757d]">Case No:</span> <strong>{c.caseCode}</strong></td>
                                                       <td className="!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !border-[#dee2e6] max-md:!flex max-md:!justify-between max-md:!items-center max-md:!border-b max-md:!border-[#f1f1f1] max-md:!text-[0.9rem] max-md:!text-right max-md:!p-[10px_5px]">
                                                            <span className="hidden max-md:!inline-block !font-bold !text-[#6c757d]">Type:</span>
                                                            <span className="!inline-block !px-[8px] !py-[3px] !rounded-[4px] !text-[10px] xl:!text-[0.85rem] !font-semibold" style={{ backgroundColor: getBadgeBg(c.caseType), color: getBadgeText(c.caseType) }}>
                                                                 {c.caseType}
                                                            </span>
                                                       </td>
                                                       <td className="!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !border-[#dee2e6] max-md:!flex max-md:!justify-between max-md:!items-center max-md:!border-b max-md:!border-[#f1f1f1] max-md:!text-[0.9rem] max-md:!text-right max-md:!p-[10px_5px]"><span className="hidden max-md:!inline-block !font-bold !text-[#6c757d]">Title:</span> <span>{c.caseTitle}</span></td>
                                                       <td className="!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !border-[#dee2e6] max-md:!flex max-md:!justify-between max-md:!items-center max-md:!border-b max-md:!border-[#f1f1f1] max-md:!text-[0.9rem] max-md:!text-right max-md:!p-[10px_5px]"><span className="hidden max-md:!inline-block !font-bold !text-[#6c757d]">Parties:</span> <span>{c.party1} vs {c.party2}</span></td>
                                                       <td className="!p-[6px] xl:!p-[12px] !text-center !align-middle !border-b !border-[#dee2e6] max-md:!block max-md:!border-none max-md:!p-[15px_5px_5px_5px]">
                                                            <button
                                                                 className="!p-[6px_10px] xl:!p-[8px_16px] !border-none !rounded-[5px] !text-[14px] !font-semibold !cursor-pointer !bg-[#28a745] !text-white !transition-colors !duration-300 hover:!bg-[#1e7e34] !whitespace-nowrap max-md:!w-full max-md:!py-[12px]"
                                                                 onClick={() =>
                                                                      setSelectedCaseId(
                                                                           selectedCaseId === c.caseNumber ? null : c.caseNumber
                                                                      )
                                                                 }
                                                            >
                                                                 {selectedCaseId === c.caseNumber ? "Close" : "Schedule"}
                                                            </button>

                                                       </td>
                                                  </tr>


                                                  {selectedCaseId === c.caseNumber && (
                                                       <tr className="schedule-row max-md:!block max-md:!px-[10px] max-md:!mb-[20px]">
                                                            <td colSpan="5" className="max-md:!block">
                                                                 <div className="!mt-[10px] !p-[20px] max-sm:!p-[15px] !bg-[#f8f9fa] !rounded-[8px] !shadow-inner !text-left !border !border-[#dee2e6] max-md:!shadow-sm">
                                                                      <h3 className="!text-[1.2rem] !font-bold !mb-[15px] !text-[#2c3e50]">Schedule Hearing</h3>

                                                                      <p className="!mb-[20px] !text-[#495057] !text-[0.95rem]">
                                                                           <strong className="!text-black">Case:</strong> {c.caseNumber} – {c.caseTitle}
                                                                      </p>

                                                                      <div className="!grid !grid-cols-2 max-md:!grid-cols-1 !gap-[20px] !mt-[20px]">
                                                                           <div className="!flex !flex-col">
                                                                                <label htmlFor={`court-${c.caseNumber}`} className="!mb-[5px] !font-semibold !text-[#495057]">Select Court</label>
                                                                                <select
                                                                                     id={`court-${c.caseNumber}`}
                                                                                     name="court"
                                                                                     className="!w-full !p-[12px_15px] !border-2 !border-[#dee2e6] !rounded-[5px] !text-[15px] !transition-colors !duration-300 focus:!border-[#28a745] focus:!outline-none !bg-white"
                                                                                     value={scheduleForm.court}
                                                                                     onChange={handleScheduleChange}
                                                                                >
                                                                                     <option value="">Select Court</option>
                                                                                     {courts
                                                                                          .filter(court => court.court_name !== "Lahore High Court")
                                                                                          .map((court) => (
                                                                                               <option key={court.court_id} value={court.court_id}>
                                                                                                    {court.court_name}
                                                                                               </option>
                                                                                          ))}
                                                                                </select>
                                                                           </div>

                                                                           <div className="!flex !flex-col">
                                                                                <label htmlFor={`date-${c.caseNumber}`} className="!mb-[5px] !font-semibold !text-[#495057]">Hearing Date</label>
                                                                                <input
                                                                                     id={`date-${c.caseNumber}`}
                                                                                     type="date"
                                                                                     name="hearingDate"
                                                                                     className="!w-full !p-[12px_15px] !border-2 !border-[#dee2e6] !rounded-[5px] !text-[15px] !transition-colors !duration-300 focus:!border-[#28a745] focus:!outline-none !bg-white"
                                                                                     value={scheduleForm.hearingDate}
                                                                                     onChange={handleScheduleChange}
                                                                                />
                                                                           </div>

                                                                           <div className="!flex !flex-col">
                                                                                <label htmlFor={`time-${c.caseNumber}`} className="!mb-[5px] !font-semibold !text-[#495057]">Hearing Time</label>
                                                                                <input
                                                                                     id={`time-${c.caseNumber}`}
                                                                                     type="time"
                                                                                     name="hearingTime"
                                                                                     className="!w-full !p-[12px_15px] !border-2 !border-[#dee2e6] !rounded-[5px] !text-[15px] !transition-colors !duration-300 focus:!border-[#28a745] focus:!outline-none !bg-white"
                                                                                     value={scheduleForm.hearingTime}
                                                                                     onChange={handleScheduleChange}
                                                                                />
                                                                           </div>

                                                                           <div className="!flex !flex-col">
                                                                                <label htmlFor={`judge-${c.caseNumber}`} className="!mb-[5px] !font-semibold !text-[#495057]">Assign Judge</label>
                                                                                <select
                                                                                     id={`judge-${c.caseNumber}`}
                                                                                     name="judge"
                                                                                     className="!w-full !p-[12px_15px] !border-2 !border-[#dee2e6] !rounded-[5px] !text-[15px] !transition-colors !duration-300 focus:!border-[#28a745] focus:!outline-none !bg-white"
                                                                                     value={scheduleForm.judge}
                                                                                     onChange={handleScheduleChange}
                                                                                     disabled={!judges.length}
                                                                                >
                                                                                     <option value="">Select Judge</option>
                                                                                     {judges.map((j) => (
                                                                                          <option key={j.judge_code} value={j.judge_code}>
                                                                                               Justice {j.judge_name}
                                                                                          </option>
                                                                                     ))}
                                                                                </select>
                                                                           </div>

                                                                           <div className="!flex !flex-col">
                                                                                <label htmlFor={`steno-${c.caseNumber}`} className="!mb-[5px] !font-semibold !text-[#495057]">Assign Stenographer</label>
                                                                                <select
                                                                                     id={`steno-${c.caseNumber}`}
                                                                                     name="stenographer"
                                                                                     className="!w-full !p-[12px_15px] !border-2 !border-[#dee2e6] !rounded-[5px] !text-[15px] !transition-colors !duration-300 focus:!border-[#28a745] focus:!outline-none !bg-white"
                                                                                     value={scheduleForm.stenographer}
                                                                                     onChange={handleScheduleChange}
                                                                                     disabled={!stenographers.length}
                                                                                >
                                                                                     <option value="">Select Stenographer</option>
                                                                                     {stenographers.map((s) => (
                                                                                          <option key={s.steno_code} value={s.steno_code}>
                                                                                               {s.steno_name}
                                                                                          </option>
                                                                                     ))}
                                                                                </select>
                                                                           </div>

                                                                           <div className="!flex !items-end">
                                                                                <button
                                                                                     className="!w-full !p-[12px_20px] !border-none !rounded-[5px] !font-semibold !cursor-pointer !transition-colors !duration-300 !bg-[#28a745] !text-white hover:!bg-[#1e7e34] !mt-[10px]"
                                                                                     onClick={handleSubmitSchedule}
                                                                                >
                                                                                     Confirm Schedule
                                                                                </button>
                                                                           </div>
                                                                      </div>

                                                                      <div className="form-actions">
                                                                      </div>
                                                                 </div>
                                                            </td>
                                                       </tr>
                                                  )}
                                             </React.Fragment>
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
