import "../Styling/header.css";
import logo from '../../Public/automated-trial-log-logo-v5.png';


export default function Header({ user }) {
    return (
        <div className="gov-header">
            <div className="header-content">
                {/* Logo */}
                <div className="gov-logo2">
                    <img src={logo} alt="ATL logo" />
                </div>

                {/* Title */}
                <div>
                    <h2 className="title">Automated Trial Log</h2>
                    <p className="subtitle">
                        Department of Social Justice | Government of Punjab
                    </p>
                </div>

                {/* User Info */}
                {user && (
                    <div className="gov-user-info">
                        <div>
                            <strong>{user.role || "User"}:</strong> {user.name || "Unknown"}
                        </div>
                        <div>
                            <strong>Court:</strong> {user.court || "Not assigned"}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}