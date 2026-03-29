import logo from '../../public/automated-trial-log-logo-v5.png';

export default function Header({ user }) {
    return (
        <div className="!bg-gradient-to-br !from-[#1e7e34] !to-[#28a745] !w-[99.4%] !text-white !p-[5px_0] !mx-auto !mt-[5px] !rounded-[10px] !shadow-[0_2px_10px_rgba(0,0,0,0.1)] !font-sans">
            <div className="!mx-auto !p-[0_20px] !flex !items-center !gap-[20px] !min-h-0">
                {/* Logo */}
                <div className="!w-[95px] !h-[95px] max-sm:!w-[60px] max-sm:!h-[60px] !flex !items-center !justify-center !flex-shrink-0">
                    <img src={logo} alt="ATL logo" className="!w-full !h-full !object-contain" />
                </div>

                {/* Title Section */}
                <div className="!flex-1 !min-w-0">
                    <h2 className="!text-[2rem] max-sm:!text-[1.3rem] !font-[600] !mb-[8px] !leading-tight">Automated Trial Log</h2>
                    <p className="!opacity-90 !text-[1rem] max-sm:!text-[0.85rem]">
                        Department of Social Justice | Government of Punjab
                    </p>
                </div>

                {/* User Info */}
                {user && (
                    <div className="!ml-auto !text-right !text-[0.9rem] max-sm:!text-[0.75rem] !flex-shrink-0">
                        <div>
                            <strong className="!font-bold">{user.role || "User"}:</strong> {user.name || "Unknown"}
                        </div>
                        <div>
                            <strong className="!font-bold">Court:</strong> {user.court || "Not assigned"}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}