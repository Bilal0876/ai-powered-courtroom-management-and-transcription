import { useNavigate } from "react-router-dom";
import "../Styling/footer.css";


export default function Footer() {
    const navigate = useNavigate();

    return (
        <div className="gov-footer">
            <div className="footer-content">
                <p>&copy; 2025 Government of Punjab, Pakistan | Department of Social Justice</p>
                <p>Automated Trial Log System - Modernizing Pakistan's Judicial Documentation</p>
                <div className="footer-links">
                    <a href="#" className="gov-footer-link" onClick={(e) => { e.preventDefault(); navigate('/privacy-policy'); }}>Privacy Policy</a>
                    <a href="#" className="gov-footer-link" onClick={(e) => { e.preventDefault(); navigate('/terms-of-service'); }}>Terms of Service</a>
                    <a href="#" className="gov-footer-link" onClick={(e) => { e.preventDefault(); navigate('/contact-support'); }}>Contact Support</a>
                </div>
            </div>
        </div>
    );
}