import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useRole, ROLES } from '../context/RoleContext';
import { useTheme } from '../context/ThemeContext';
import RoleGuard from './RoleGuard';
import TextSizeAdjuster from './TextSizeAdjuster';

export default function Header() {
    const { user, currentRole, isAuthenticated, logout, switchRole } = useRole();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we're on the Get Started page
    const isGetStartedPage = location.pathname === '/';

    const handleRoleSwitch = (role) => {
        switchRole(role);

        // Navigate to appropriate route based on role
        if (role === ROLES.PUBLIC) {
            navigate('/demo');
        } else if (role === ROLES.ENUMERATOR) {
            navigate('/enumerator');
        } else if (role === ROLES.ADMIN) {
            navigate('/admin/dashboard');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getRoleButtonClass = (role) => {
        const baseClass = 'role-nav-item';

        // Don't show active state on Get Started page
        if (isGetStartedPage) {
            return baseClass;
        }

        // Determine active role based on current route
        let activeRoleByRoute = null;

        if (location.pathname.startsWith('/demo')) {
            activeRoleByRoute = ROLES.PUBLIC;
        } else if (location.pathname.startsWith('/enumerator')) {
            activeRoleByRoute = ROLES.ENUMERATOR;
        } else if (location.pathname.startsWith('/admin')) {
            activeRoleByRoute = ROLES.ADMIN;
        }

        return role === activeRoleByRoute ? `${baseClass} active` : baseClass;
    };

    return (
        <header className="header">
            <div className="header-content">
                {/* Logo and Title */}
                <Link to="/" className="header-left">
                    <div className="logo-section" style={{ marginRight: '1rem' }}>
                        <div className="logo-badge header-logo-badge">NCO</div>
                    </div>
                    <div>
                        <h1 className="header-title">NCO Search</h1>
                    </div>
                </Link>

                {/* Right side - Role selector and controls */}
                <div className="header-right">
                    {/* Role Navigation Bar - Hide when authenticated */}
                    {!isAuthenticated && (
                        <div className="role-navigation">
                            <button
                                onClick={() => handleRoleSwitch(ROLES.ENUMERATOR)}
                                className={getRoleButtonClass(ROLES.ENUMERATOR)}
                                title="Switch to Enumerator Mode"
                            >
                                <span className="role-name">Enumerator</span>
                            </button>

                            <button
                                onClick={() => handleRoleSwitch(ROLES.PUBLIC)}
                                className={getRoleButtonClass(ROLES.PUBLIC)}
                                title="Switch to Public Demo Mode"
                            >
                                <span className="role-name">Public Demo</span>
                            </button>

                            <button
                                onClick={() => handleRoleSwitch(ROLES.ADMIN)}
                                className={getRoleButtonClass(ROLES.ADMIN)}
                                title="Switch to Admin Mode"
                            >
                                <span className="role-name">Admin</span>
                            </button>
                        </div>
                    )}

                    {/* Text Size Adjuster */}
                    <TextSizeAdjuster />

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle-btn"
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill={theme === 'dark' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                    </button>

                    {/* Auth Section - Only show Logout when authenticated */}
                    {isAuthenticated && (
                        <div className="auth-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '0.5rem' }}>
                            <div className="user-info" style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                                <p style={{ fontSize: '0.875rem', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>{user.name}</p>
                                <p style={{ fontSize: '0.75rem', opacity: 0.8, color: '#FFFFFF', margin: 0 }}>{user.role.toLowerCase()}</p>
                            </div>
                            <button onClick={handleLogout} className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)' }}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Secondary Navigation - Only show on non-Get Started pages */}
            {!isGetStartedPage && (
                <div className="admin-nav">
                    {/* Public Demo Navigation */}
                    {currentRole === ROLES.PUBLIC && (
                        <>
                            <Link to="/demo" className="nav-link">
                                Search
                            </Link>
                            <Link to="/about" className="nav-link">
                                About Us
                            </Link>
                            <Link to="/how-it-works" className="nav-link">
                                How It Works
                            </Link>
                        </>
                    )}

                    {/* Enumerator Navigation */}
                    {currentRole === ROLES.ENUMERATOR && (
                        <>
                            {isAuthenticated && (
                                <>
                                    <Link to="/enumerator" className="nav-link">
                                        Search
                                    </Link>
                                    <Link to="/saved-searches" className="nav-link">
                                        Saved Searches
                                    </Link>
                                </>
                            )}
                            <Link to="/guidelines" className="nav-link">
                                Guidelines / Help
                            </Link>
                            <Link to="/about" className="nav-link">
                                About Us
                            </Link>
                        </>
                    )}

                    {/* Admin Navigation */}
                    {currentRole === ROLES.ADMIN && (
                        <>
                            {isAuthenticated && (
                                <>
                                    <Link to="/admin/search" className="nav-link">
                                        Search
                                    </Link>
                                    <Link to="/admin/synonyms" className="nav-link">
                                        Synonyms
                                    </Link>
                                    <Link to="/admin/audit-logs" className="nav-link">
                                        Audit Logs
                                    </Link>
                                    <Link to="/admin/users" className="nav-link">
                                        Manage Enumerators
                                    </Link>
                                </>
                            )}
                            <Link to="/about" className="nav-link">
                                About Us
                            </Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
