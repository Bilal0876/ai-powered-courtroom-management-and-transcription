import logo from '../../public/automated-trial-log-logo-v5.png';

export default function Header({ user }) {
    return (
        <div className="!bg-gradient-to-br !from-[#1e7e34] !to-[#28a745] !w-[99.4%] !text-white !p-[15px_0] sm:!p-[5px_0] !mx-auto !mt-[5px] !rounded-[10px] !shadow-[0_2px_10px_rgba(0,0,0,0.1)] !font-sans">
            <div className="!mx-auto !p-[0_10px] sm:!p-[0_20px] !flex !items-center !gap-[8px] sm:!gap-[20px] !min-h-0">
                {/* Logo */}
                <div className="!w-[60px] !h-[60px] sm:!w-[95px] sm:!h-[95px] !flex !items-center !justify-center !flex-shrink-0">
                    <img src={logo} alt="ATL logo" className="!w-full !h-full !object-contain" />
                </div>

                {/* Title Section */}
                <div className="!flex-1 !min-w-0">
                    <h2 className="!text-[1.3rem] sm:!text-[2rem] !font-[600] !mb-[2px] sm:!mb-[8px] !leading-tight !truncate">Automated Trial Log</h2>
                    <p className="!opacity-90 !text-[0.85rem] sm:!text-[1rem] !truncate">
                        Social Justice | Punjab
                    </p>
                </div>
            </div>
        </div>
    );
}