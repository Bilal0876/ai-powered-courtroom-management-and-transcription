import { useState } from "react";

export default function LoginForm({ onSubmit, loading }) {
    const [role, setRole] = useState("judge");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ email, password, role });
    };

    return (
        <div className="!max-w-[500px] !mx-auto !mt-[50px] !mb-[50px] !bg-white !rounded-[10px] !shadow-[0_10px_30px_rgba(0,0,0,0.18)] !overflow-hidden !font-sans">
            <div className="!bg-[#f8f9fa] !px-[25px] !py-[15px] !text-center !border-b !border-[#dee2e6]">
                <h2 className="!text-[#2c3e50] !mb-[10px] !text-[1.8rem] !font-bold">Login</h2>
                <p className="!text-[#6c757d] !text-[0.95rem]">Access the Court Transcription System</p>
            </div>

            <form className="!px-[35px] !py-[15px]" onSubmit={handleSubmit}>
                {/* Role */}
                <div className="!mb-[15px] !w-full">
                    <label className="!block !mb-[8px] !text-[#495057] !font-semibold">Role</label>
                    <select
                        className="!w-full !px-[15px] !py-[12px] !border-2 !border-[#dee2e6] !rounded-[5px] !text-[16px] !transition-[border-color] !duration-300 !focus:border-[#28a745] !focus:outline-none !focus:shadow-[0_0_6px_rgba(40,167,69,0.25)] !bg-white !text-[#212529] !block !appearance-none"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={loading}
                    >
                        <option value="judge">Judge</option>
                        <option value="chief-judge">Chief Judge</option>
                        <option value="stenographer">Stenographer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* Email */}
                <div className="!mb-[15px] !w-full">
                    <label className="!block !mb-[8px] !text-[#495057] !font-semibold">Email</label>
                    <input
                        type="email"
                        className="!w-full !px-[15px] !py-[12px] !border-2 !border-[#dee2e6] !rounded-[5px] !text-[16px] !transition-[border-color] !duration-300 !focus:border-[#28a745] !focus:outline-none !focus:shadow-[0_0_6px_rgba(40,167,69,0.25)] !bg-white !text-[#212529] !block"
                        placeholder="username@courtlog.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required pattern="^[a-zA-Z0-9]+@courtlog\.com$"
                        title="Email must be in format: username@courtlog.com"
                        disabled={loading}
                    />
                </div>

                {/* Password */}
                <div className="!mb-[20px] !w-full">
                    <label className="!block !mb-[8px] !text-[#495057] !font-semibold">Password</label>
                    <input
                        type="password"
                        className="!w-full !px-[15px] !py-[12px] !border-2 !border-[#dee2e6] !rounded-[5px] !text-[16px] !transition-[border-color] !duration-300 !focus:border-[#28a745] !focus:outline-none !focus:shadow-[0_0_6px_rgba(40,167,69,0.25)] !bg-white !text-[#212529] !block"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    className={`!w-full !px-[15px] !py-[10px] !border-none !rounded-[5px] !text-[16px] !font-semibold !cursor-pointer !bg-[#28a745] !text-white !transition-all !duration-200 !hover:bg-[#1e7e34] !hover:-translate-y-[1px] !disabled:bg-[#218838] !disabled:cursor-not-allowed !block !box-border ${loading ? '!flex !items-center !justify-center' : ''}`}
                    disabled={loading}
                >
                    {loading ? (
                        <svg className="!w-[18px] !h-[18px] !animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
                            <path d="M12 2 a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    ) : (
                        "Login"
                    )}
                </button>
            </form>

            <div className="!text-center !p-[20px] !bg-[#f8f9fa] !border-t !border-[#dee2e6]">
                <p>
                    <a href="#" className="!text-[#28a745] !no-underline !hover:underline">Forgot Password?</a> |
                    <a href="#" className="!text-[#28a745] !no-underline !hover:underline"> System Help</a> |
                    <a href="#" className="!text-[#28a745] !no-underline !hover:underline"> Contact IT Support</a>
                </p>
            </div>
        </div>
    );
}