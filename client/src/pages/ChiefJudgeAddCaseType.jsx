import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { apiPost } from "../utils/api";
import Footer from "../components/footer";

export default function ChiefJudgeAddCaseType() {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({
        typeName: "",
        typeCode: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            navigate("/");
            return;
        }
        setUser(storedUser);
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddType = async (e) => {
        e.preventDefault();
        if (!form.typeName || !form.typeCode) {
            alert("❌ Please fill all fields!");
            return;
        }

        try {
            const data = await apiPost("/api/courts/add-type", form);
            if (data.success) {
                alert("✅ Case type registered successfully!");
                navigate("/chiefJudge-dashboard");
            } else {
                alert("❌ Error: " + data.message);
            }
        } catch (err) {
            console.error("❌ Add type failed:", err);
            alert("❌ Failed to add case type. Please try again.");
        }
    };

    if (!user) return null;

    return (
        <div className="!w-full !min-h-screen !flex !flex-col ![background-color:#f5f5f5] ![font-family:Arial,sans-serif]">
            <Header user={user} />

            <div className="!flex-1 !p-[20px]">
                {/* Breadcrumb */}
                <div className="![background:white] ![padding:15px_20px] ![margin-bottom:20px] ![border-radius:5px] ![box-shadow:0_2px_5px_rgba(0,0,0,0.1)] ![font-size:0.9rem]">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate("/chiefJudge-dashboard"); }} className="![text-decoration:none] ![color:#2c3e50] ![font-weight:bold] hover:![text-decoration:underline]">
                        Dashboard
                    </a>{" > "}
                    <strong>Add Case Type</strong>
                </div>

                <div className="!max-w-[600px] !mx-auto !bg-white !rounded-[12px] !shadow-xl !overflow-hidden">
                    <div className="!bg-[#2c3e50] !p-[25px] !text-white">
                        <h2 className="!text-[1.5rem] !font-bold !m-0">New Case Classification</h2>
                        <p className="!text-white/70 !text-[13px] !mt-1">Define a new legal category for the judicial system</p>
                    </div>

                    <form className="!p-[30px] !space-y-[20px]" onSubmit={handleAddType}>
                        <div>
                            <label className="!block !text-[12px] !font-bold !text-gray-500 !uppercase !mb-2">Full Classification Name</label>
                            <input name="typeName" className="!w-full !p-[12px] !border !rounded-[6px] !bg-gray-50 focus:!bg-white focus:!border-[#2c3e50] !outline-none" placeholder="e.g., Criminal Appeal" value={form.typeName} onChange={handleChange} required />
                        </div>

                        <div>
                            <label className="!block !text-[12px] !font-bold !text-gray-500 !uppercase !mb-2">Reference Code (3 Letters)</label>
                            <input name="typeCode" maxLength="3" className="!w-full !p-[12px] !border !rounded-[6px] !bg-gray-50 focus:!bg-white focus:!border-[#2c3e50] !outline-none !uppercase !font-mono !tracking-widest" placeholder="CRA" value={form.typeCode} onChange={handleChange} required />
                            <p className="!text-[10px] !text-gray-400 !mt-1 italic">Used for case numbering (e.g., CRA-001)</p>
                        </div>

                        <div className="!pt-[10px] !flex !flex-col !gap-3">
                            <button type="submit" className="!w-full !py-[15px] !bg-[#28a745] !text-white !rounded-[8px] !font-bold !text-[1rem] hover:!bg-[#1e7e34] !transition-all !shadow-md active:!scale-[0.99]">
                                Register Case Type
                            </button>
                            <button type="button" onClick={() => navigate("/chiefJudge-dashboard")} className="!w-full !py-[12px] !text-gray-500 !font-semibold hover:!text-gray-700">
                                Cancel & Go Back
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
}
