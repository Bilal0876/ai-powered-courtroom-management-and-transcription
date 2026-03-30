import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { apiGet, apiPost } from "../utils/api";
import Footer from "../components/footer";

export default function ChiefJudgeAddTypeToCourt() {
    const [courts, setCourts] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedCourt, setSelectedCourt] = useState("");
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            navigate("/");
            return;
        }
        setUser(storedUser);

        apiGet("/api/courts/names").then(setCourts).catch(console.error);
        apiGet("/api/courts/types").then(setTypes).catch(console.error);
    }, [navigate]);

    const toggleType = (typeId) => {
        setSelectedTypes(prev =>
            prev.includes(typeId)
                ? prev.filter(id => id !== typeId)
                : [...prev, typeId]
        );
    };

    const handleAssign = async () => {
        if (!selectedCourt || selectedTypes.length === 0) {
            alert("❌ Please select a court and at least one case type");
            return;
        }

        try {
            const data = await apiPost("/api/courts/assign-type", {
                courtId: selectedCourt,
                typeIds: selectedTypes,
            });

            if (data.success) {
                alert("✅ Case types successfully assigned to the court!");
                navigate("/chiefJudge-dashboard");
            } else {
                alert("❌ Failed to assign: " + data.message);
            }
        } catch (err) {
            console.error("Assign error:", err);
            alert("❌ Server error during assignment.");
        }
    };

    if (!user) return null;

    return (
        <div className="!w-full !min-h-screen !flex !flex-col ![background-color:#f5f7f9] ![font-family:Inter,sans-serif]">
            <Header user={user} />

            <div className="!flex-1 !p-[20px] lg:!p-[40px]">
                {/* Breadcrumb */}
                <div className="!max-w-[800px] !mx-auto !flex !items-center !gap-2 !mb-8 !text-[13px]">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate("/chiefJudge-dashboard"); }} className="!text-blue-600 hover:!underline">Dashboard</a>
                    <span className="!text-gray-400">/</span>
                    <span className="!text-gray-600 !font-semibold">Jurisdiction Mapping</span>
                </div>

                <div className="!max-w-[800px] !mx-auto !bg-white !rounded-[20px] !shadow-2xl !overflow-hidden">
                    <div className="!bg-[#2c3e50] !p-[30px] !text-white">
                        <h2 className="!text-[1.5rem] !font-bold !m-0">Assign Case Jurisdictions</h2>
                        <p className="!text-white/60 !text-[13px] !mt-1">Link specific legal classifications to a judicial court</p>
                    </div>

                    <div className="!p-[40px] !space-y-[30px]">
                        {/* Court selector */}
                        <div className="!space-y-2">
                            <label className="!block !text-[12px] !font-bold !text-gray-500 !uppercase !tracking-wider">Target Court</label>
                            <select
                                className="!w-full !p-[15px] !border !rounded-[12px] !bg-gray-50 focus:!bg-white focus:!border-[#28a745] !outline-none !transition-all"
                                value={selectedCourt}
                                onChange={(e) => setSelectedCourt(e.target.value)}
                            >
                                <option value="">Select a court from the registry...</option>
                                {courts.map(c => (
                                    <option key={c.court_id || c.Cid} value={c.court_id || c.Cid}>
                                        {c.court_name || c.Cname}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Case Types Multi-Select */}
                        <div className="!space-y-4">
                            <label className="!block !text-[12px] !font-bold !text-gray-500 !uppercase !tracking-wider">Available Classifications</label>
                            <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-3">
                                {types.map(t => (
                                    <div 
                                        key={t.type_id || t.id}
                                        onClick={() => toggleType(t.type_id || t.id)}
                                        className={`!flex !items-center !gap-3 !p-[15px] !border !rounded-[12px] !cursor-pointer !transition-all ${
                                            selectedTypes.includes(t.type_id || t.id)
                                                ? "!bg-green-50 !border-[#28a745] !ring-2 !ring-green-100"
                                                : "!bg-white hover:!bg-gray-50 hover:!border-gray-300"
                                        }`}
                                    >
                                        <div className={`!w-5 !h-5 !rounded !border !flex !items-center !justify-center !transition-colors ${
                                            selectedTypes.includes(t.type_id || t.id)
                                                ? "!bg-[#28a745] !border-[#28a745]"
                                                : "!border-gray-300 !bg-white"
                                        }`}>
                                            {selectedTypes.includes(t.type_id || t.id) && <span className="!text-white !text-[10px]">✓</span>}
                                        </div>
                                        <div>
                                            <div className="!text-[14px] !font-bold !text-[#2c3e50]">{t.type_name || t.name}</div>
                                            <div className="!text-[11px] !text-gray-400 !font-mono">{t.type_code || "CODE"}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="!pt-[20px] !flex !flex-col !gap-3">
                            <button 
                                className="!w-full !py-[18px] !bg-[#2c3e50] !text-white !rounded-[12px] !font-bold !text-[1rem] hover:!bg-[#1e2b38] !transition-all !shadow-lg active:!scale-[0.98]"
                                onClick={handleAssign}
                            >
                                Confirm Jurisdictions
                            </button>
                            <button 
                                type="button" 
                                onClick={() => navigate("/chiefJudge-dashboard")} 
                                className="!w-full !py-[12px] !text-gray-500 !font-semibold hover:!text-gray-700 !transition-colors"
                            >
                                Cancel & Return to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
