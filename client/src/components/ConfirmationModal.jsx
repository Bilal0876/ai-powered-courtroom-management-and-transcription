import React from "react";

/**
 * A premium, reusable confirmation modal for the judicial dashboard.
 * 
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {string} title - The heading of the modal
 * @param {string} message - The body text/instructions
 * @param {function} onConfirm - Action to run when "Confirm" is clicked
 * @param {function} onCancel - Action to run when "Cancel" is clicked
 * @param {string} confirmText - Label for the confirm button
 * @param {string} cancelText - Label for the cancel button
 * @param {string} type - Modal theme: 'danger' (destructive) or 'info' (standard)
 */
export default function ConfirmationModal({ 
    isOpen, 
    title = "Confirm Action", 
    message = "Are you sure you want to proceed?", 
    onConfirm, 
    onCancel, 
    confirmText = "Confirm", 
    cancelText = "Cancel",
    type = "info"
}) {
    if (!isOpen) return null;

    const isDanger = type === "danger";
    const confirmBtnColor = isDanger 
        ? "active:!scale-95 !bg-red-600 !text-white hover:!bg-red-700 !shadow-red-200" 
        : "active:!scale-95 !bg-emerald-600 !text-white hover:!bg-emerald-700 !shadow-emerald-200";

    return (
        <div className="!fixed !inset-0 !z-[9999] !flex !items-center !justify-center !p-4 !animate-in !fade-in !duration-200">
            {/* Backdrop with Blur */}
            <div 
                className="!absolute !inset-0 !bg-slate-900/40 !backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal Container */}
            <div className="!relative !bg-white !w-full !max-w-md !rounded-2xl !shadow-2xl !p-6 !border !border-slate-100 !animate-in !zoom-in-95 !duration-300">
                
                {/* Icon (Optional but nice) */}
                <div className={`!w-12 !h-12 !rounded-full !flex !items-center !justify-center !mb-4 ${isDanger ? "!bg-red-50 !text-red-600" : "!bg-emerald-50 !text-emerald-600"}`}>
                    {isDanger ? (
                        <svg className="!w-6 !h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ) : (
                        <svg className="!w-6 !h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>

                <h3 className="!text-xl !font-black !text-slate-900 !mb-2 !tracking-tight">
                    {title}
                </h3>
                
                <p className="!text-slate-600 !text-[15px] !leading-relaxed !mb-8">
                    {message}
                </p>

                <div className="!flex !gap-3 !justify-end">
                    <button 
                        onClick={onCancel}
                        className="!px-5 !py-2.5 !bg-slate-50 !text-slate-700 !font-bold !rounded-xl hover:!bg-slate-100 !transition-all active:!scale-95"
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={onConfirm}
                        className={`!px-6 !py-2.5 !font-black !rounded-xl !transition-all !shadow-lg ${confirmBtnColor}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
