import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import '../styles/GetStarted.css';

export default function GetStarted() {
    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="get-started-page">
            <div className="get-started-container">
                {/* Header Section */}
                <header className="get-started-header">
                    <div className="get-started-logo-wrapper">
                        <div className="logo-badge get-started-logo-badge">NCO</div>
                    </div>
                    <h1 className="page-title">NCO Semantic Occupation Search System</h1>
                    <p className="page-subtitle">AI-Enabled Semantic Search for National Classification of Occupations</p>
                </header>
                {/* Introduction Section */}
                <section className="intro-section">
                    <h2 className="section-title">About This System</h2>
                    <p className="intro-text">
                        This system uses advanced semantic search technology to map free-text job descriptions
                        to standardized National Classification of Occupations (NCO) codes. Instead of relying
                        on exact keyword matching, the system understands the meaning and context of job descriptions
                        to find the most appropriate occupation classification.
                    </p>
                </section>

                {/* Who Can Use Section */}
                <section className="users-section">
                    <h2 className="section-title">Who Can Use This System</h2>

                    <div className="user-cards">
                        {/* Enumerator Card */}
                        <div className="user-card">
                            <div className="user-card-icon">📝</div>
                            <h3 className="user-card-title">Enumerators</h3>
                            <p className="user-card-description">
                                Census field workers who collect occupational information from respondents.
                                Enumerators use this system to quickly and accurately map free-text job
                                descriptions provided by respondents to the appropriate NCO codes.
                            </p>
                            <p className="user-card-requirement">
                                <strong>Requires:</strong> Authorized account credentials
                            </p>
                        </div>

                        {/* Admin Card */}
                        <div className="user-card">
                            <div className="user-card-icon">⚙️</div>
                            <h3 className="user-card-title">Administrators / Analysts</h3>
                            <p className="user-card-description">
                                System administrators and data analysts who oversee the classification process.
                                Admins can view system analytics, manage synonym mappings, review audit logs,
                                and ensure data quality across the platform.
                            </p>
                            <p className="user-card-requirement">
                                <strong>Requires:</strong> Authorized account credentials
                            </p>
                        </div>

                        {/* Public Demo Card */}
                        <div className="user-card public-demo-card">
                            <div className="user-card-icon">👁️</div>
                            <h3 className="user-card-title">Public Demo</h3>
                            <p className="user-card-description">
                                A read-only demonstration mode for educational purposes and public awareness.
                                Explore how the AI-powered semantic search works without needing to log in.
                                This mode allows you to test searches and view results.
                            </p>
                            <p className="user-card-requirement public-demo-requirement">
                                <strong>No login required</strong> • Read-only access
                            </p>
                        </div>
                    </div>
                </section>

                {/* Get Started Button */}
                <div className="cta-section">
                    <Link to="/demo" className="btn-get-started">
                        Get Started
                    </Link>
                </div>

                {/* Footer */}
                <footer className="get-started-footer">
                    <p>National Classification of Occupations (NCO) • Government of India</p>
                </footer>
            </div>
        </div>
    );
}
