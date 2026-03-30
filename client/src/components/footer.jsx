import { useNavigate } from "react-router-dom";

export default function Footer() {
    const navigate = useNavigate();

    return (
        <div className="!bg-[#2c3e50] !w-full  !text-white !text-center !px-[25px] !py-[25px] !mt-[50px] !font-sans">
            <div>
                <p className="!mb-[10px] max-sm:!text-[0.85rem]">&copy; 2025 Government of Punjab, Pakistan | Department of Social Justice</p>
                <p className="!mb-[10px] max-sm:!text-[0.85rem]">Automated Trial Log System - Modernizing Pakistan's Judicial Documentation</p>
                <div className="!flex !justify-center !gap-[25px] !mt-[15px] !flex-wrap">
                    <a
                        href="#"
                        className="!text-[#adb5bd] !no-underline !text-[0.9rem] max-sm:!text-[0.8rem] !transition-colors !duration-300 !hover:text-white"
                        onClick={(e) => { e.preventDefault(); navigate('/privacy-policy'); }}
                    >
                        Privacy Policy
                    </a>
                    <a
                        href="#"
                        className="!text-[#adb5bd] !no-underline !text-[0.9rem] max-sm:!text-[0.8rem] !transition-colors !duration-300 !hover:text-white"
                        onClick={(e) => { e.preventDefault(); navigate('/terms-of-service'); }}
                    >
                        Terms of Service
                    </a>
                    <a
                        href="#"
                        className="!text-[#adb5bd] !no-underline !text-[0.9rem] max-sm:!text-[0.8rem] !transition-colors !duration-300 !hover:text-white"
                        onClick={(e) => { e.preventDefault(); navigate('/contact-support'); }}
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}