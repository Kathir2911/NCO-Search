import { Link, useSearchParams } from 'react-router-dom';
import '../styles/Login.css';

export default function Login() {
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'user';

    // Capitalize role name for display
    const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Logo */}
                <div className="login-logo">
                    <div className="logo-badge-large">NCO</div>
                </div>

                {/* Title */}
                <h1 className="login-title">NCO Search System</h1>
                <h2 className="login-subtitle">{roleDisplay} Login</h2>

                {/* Coming Soon Notice */}
                <div className="coming-soon-box">
                    <div className="coming-soon-icon">🔒</div>
                    <h3 className="coming-soon-title">Authentication System Coming Soon</h3>
                    <p className="coming-soon-text">
                        The login functionality for {roleDisplay.toLowerCase()} users is currently under development.
                        This page will allow authorized users to securely access the system using their credentials.
                    </p>
                </div>

                {/* Information Box */}
                <div className="info-box">
                    <h4 className="info-title">What to Expect:</h4>
                    <ul className="info-list">
                        <li><strong>Secure Authentication:</strong> Username and password verification</li>
                        <li><strong>Role-Based Access:</strong> Appropriate permissions based on your role</li>
                        <li><strong>Session Management:</strong> Secure session handling and timeout</li>
                        <li><strong>Account Recovery:</strong> Password reset and account recovery options</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="login-actions">
                    <Link to="/" className="btn-back">
                        ← Back to Get Started
                    </Link>
                    <Link to="/demo" className="btn-demo-alt">
                        Try Public Demo Instead
                    </Link>
                </div>

                {/* Footer Note */}
                <div className="login-footer">
                    <p>
                        <strong>Note:</strong> User accounts are created by authorized officials only.
                        If you require access, please contact your supervising officer.
                    </p>
                </div>
            </div>
        </div>
    );
}
