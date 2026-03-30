import React from 'react';

const DashboardHero = ({ user, onLogout }) => {
    if (!user) return null;

    const isJudicial = user.role === 'judge' || user.role === 'chief-judge';
    const displayName = isJudicial ? `Justice ${user.name}` : user.name;
    const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    const courtLabel = user.court || "Chambers Unavailable";

    return (
        <section className="!bg-gradient-to-br !from-[#2c3e50] !to-[#1a252f] !rounded-xl lg:!rounded-2xl !p-3 lg:!p-4 !shadow-2xl !mb-3 lg:!mb-4 !relative !overflow-hidden">
            <div className="!absolute !top-0 !right-0 !w-32 lg:!w-48 !h-32 lg:!h-48 !bg-emerald-500/10 !rounded-full !blur-2xl !-mr-6 lg:!-mr-12 !-mt-6 lg:!-mt-12"></div>
            <div className="!relative !z-10">
                <div className="!flex !flex-row !justify-between !items-center !gap-2 lg:!gap-4">
                    <div className="!min-w-0 !flex-1">
                        <h1 className="!text-white !text-base lg:!text-xl !font-black !mb-0 lg:!mb-0.5 !truncate">
                            {displayName}
                        </h1>
                        <p className="!text-emerald-400 !font-bold !uppercase !tracking-[0.1em] !text-[8px] lg:!text-[9px] !mb-1 lg:!mb-1.5">
                            {courtLabel} • {roleLabel}
                        </p>
                        <div className="!flex !items-center !gap-2 !text-slate-300/60">
                            <span className="!px-2 !py-0.5 !bg-white/5 !rounded-full !text-[8.5px] lg:!text-[10px] !font-medium">
                                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                            <span className="!text-[8.5px] lg:!text-[10px] !hidden sm:!block">● Secure Terminal</span>
                        </div>
                    </div>
                    <button 
                        onClick={onLogout}
                        className="!w-fit !px-3 lg:!px-6 !py-1 lg:!py-2 !bg-emerald-500 !text-white !rounded-lg lg:!rounded-xl !font-bold hover:!bg-emerald-600 !transition-all !shadow-lg active:!scale-95 !flex !items-center !justify-center !gap-2 !text-[9px] lg:!text-[11.5px]"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </section>
    );
};

export default DashboardHero;
