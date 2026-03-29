import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { API_BASE_URL } from "../config";
import { apiGet, apiPost } from "../utils/api";
import Footer from "../components/footer";

export default function AdminAddCase() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        caseType: "",
        caseTitle: "",
        caseLevel: "",
        party1: "",
        party2: "",
        admin: "",
        steno: "",
        judge: "",
        court: "",
    });

    // Dropdown data fetched from backend
    const [caseTypes, setCaseTypes] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [stenos, setStenos] = useState([]);
    const [judges, setJudges] = useState([]);
    const [courts, setCourts] = useState([]);
    const [filteredCourts, setFilteredCourts] = useState([]);

    // Fetch initial dropdown data
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


    // Filter courts based on selected case type
    useEffect(() => {
        if (form.caseType) {
            const filtered = courts.filter((c) => c.caseTypes.includes(form.caseType));
            setFilteredCourts(filtered);
            // Reset selected court if it no longer matches
            if (!filtered.some(c => c.id === form.court)) {
                setForm((prev) => ({ ...prev, court: "" }));
            }
        } else {
            setFilteredCourts([]);
        }
    }, [form.caseType, courts]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddCase = async () => {
        // Simple validation
        if (!form.caseType || !form.caseLevel || !form.caseTitle || !form.party1 || !form.party2) {
            alert("❌ Please fill all required fields!");
            return;
        }

        try {
            // ✅ Use apiPost - automatically sends JWT token
            const data = await apiPost("/api/cases/add", form);

            if (data.success) {
                alert("✅ Case added successfully!");
                setForm({
                    caseType: "",
                    caseLevel: "",
                    caseTitle: "",
                    party1: "",
                    party2: "",
                });
                navigate("/admin-dash/browse-cases"); // redirect to case list
            } else {
                alert("❌ Error: " + data.message);
            }
        } catch (err) {
            console.error("Add case failed:", err);
            alert("❌ Failed to add case. Please try again.");
        }
    };

    return (
        <div className="!w-full !min-h-screen !flex !flex-col !bg-[#f5f5f5] !font-sans">
            <Header />

            <div className="!flex-1">
                <div className="!bg-white !px-[20px] !py-[10px] !mb-[20px] !rounded-[5px] !shadow-[0_2px_5px_rgba(0,0,0,0.1)] !text-[0.9rem] !mx-[20px] !mt-[20px]">
                    <a href="#" className="!no-underline !text-black !font-bold" onClick={() => navigate("/admin-dash")}>Dashboard</a> {" > "}
                    <strong>Add New Case</strong>
                </div>

                <div className="!w-[calc(100%-40px)] !max-w-[650px] !mx-auto !my-[15px] !bg-white !rounded-[10px] !shadow-[0_10px_30px_rgba(0,0,0,0.18)] !overflow-hidden">
                    <div className="!bg-[#f8f9fa] !p-[25px] !text-center !border-b !border-[#dee2e6]">
                        <h2 className="!text-[#2c3e50] !mb-[5px] !text-[1.8rem] !font-bold">Add New Case</h2>
                        <p className="!text-[#6c757d] !text-[0.95rem]">Fill details to add a new case</p>
                    </div>

                    <div className="!p-[40px] !pt-[20px] !px-[20px]">
                        <div className="!flex !gap-[15px] !mb-[15px] max-sm:!flex-col">
                            <div className="!flex-1">
                                <label className="!block !mb-[8px] !text-[#495057] !font-semibold" htmlFor="caseType">Case Type</label>
                                <select id="caseType" name="caseType" className="!w-full !px-[15px] !py-[12px] !border-2 !border-[#dee2e6] !rounded-[5px] !text-[16px] !transition-[border-color] !duration-300 !focus:border-[#28a745] !focus:outline-none !focus:shadow-[0_0_6px_rgba(40,167,69,0.25)] !bg-white !text-[#212529] !block !appearance-none" value={form.caseType} onChange={handleChange}>
                                    <option value="">Select Case Type</option>
                                    {caseTypes.map((ct, index) => (
                                        <option key={ct.type_id || `ctype-${index}`} value={ct.type_name}>{ct.type_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="!flex-1">
                                <label className="!block !mb-[8px] !text-[#495057] !font-semibold" htmlFor="caseLevel">Court Type</label>
                                <select id="caseLevel" name="caseLevel" className="!w-full !px-[15px] !py-[12px] !border-2 !border-[#dee2e6] !rounded-[5px] !text-[16px] !transition-[border-color] !duration-300 !focus:border-[#28a745] !focus:outline-none !focus:shadow-[0_0_6px_rgba(40,167,69,0.25)] !bg-white !text-[#212529] !block !appearance-none" value={form.caseLevel} onChange={handleChange}>
                                    <option value="">Select Court Type</option>
                                    <option value="High Court">High Court</option>
                                    <option value="Subordinate Court">Subordinate Court</option>
                                </select>
                            </div>
                        </div>

                        <div className="!mb-[20px] !w-full">
                            <label className="!block !mb-[8px] !text-[#495057] !font-semibold" htmlFor="caseTitle">Case Title</label>
                            <input id="caseTitle" name="caseTitle" className="!w-full !px-[15px] !py-[12px] !border-2 !border-[#dee2e6] !rounded-[5px] !text-[16px] !transition-[border-color] !duration-300 !focus:border-[#28a745] !focus:outline-none !focus:shadow-[0_0_6px_rgba(40,167,69,0.25)] !bg-white !text-[#212529] !block" value={form.caseTitle} onChange={handleChange} />
                        </div>

                        <div className="!flex !gap-[15px] !mb-[30px] max-sm:!flex-col">
                            <div className="!flex-1">
                                <label className="!block !mb-[8px] !text-[#495057] !font-semibold" htmlFor="party1">Plaintiff</label>
                                <input id="party1" name="party1" className="!w-full !px-[15px] !py-[12px] !border-2 !border-[#dee2e6] !rounded-[5px] !text-[16px] !transition-[border-color] !duration-300 !focus:border-[#28a745] !focus:outline-none !focus:shadow-[0_0_6px_rgba(40,167,69,0.25)] !bg-white !text-[#212529] !block" value={form.party1} onChange={handleChange} />
                            </div>

                            <div className="!flex-1">
                                <label className="!block !mb-[5px] !text-[#495057] !font-semibold" htmlFor="party2">Defendent</label>
                                <input id="party2" name="party2" className="!w-full !px-[15px] !py-[12px] !border-2 !border-[#dee2e6] !rounded-[5px] !text-[16px] !transition-[border-color] !duration-300 !focus:border-[#28a745] !focus:outline-none !focus:shadow-[0_0_6px_rgba(40,167,69,0.25)] !bg-white !text-[#212529] !block" value={form.party2} onChange={handleChange} />
                            </div>
                        </div>

                        <button className="!w-full !px-[15px] !py-[8px] !border-none !rounded-[5px] !text-[17px] !font-semibold !cursor-pointer !bg-[#28a745] !text-white !transition-all !duration-200 !hover:bg-[#1e7e34] !hover:-translate-y-[1px] !block" onClick={handleAddCase}>Add Case</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
