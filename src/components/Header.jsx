import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useRole, ROLES } from '../context/RoleContext';
import { useTheme } from '../context/ThemeContext';
import RoleGuard from './RoleGuard';
import TextSizeAdjuster from './TextSizeAdjuster';

export default function Header() {
    const { currentRole, switchRole } = useRole();
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
                    <div className="header-logo">
                        <span>NCO</span>
                    </div>
                    <div>
                        <h1 className="header-title">NCO Search</h1>
                        <p className="header-subtitle">AI-Enabled Semantic Search</p>
                    </div>
                </Link>

                {/* Right side - Role selector and controls */}
                <div className="header-right">
                    {/* Role Navigation Bar */}
                    <div className="role-navigation">
                        <button
                            onClick={() => handleRoleSwitch(ROLES.ENUMERATOR)}
                            className={getRoleButtonClass(ROLES.ENUMERATOR)}
                            title="Switch to Enumerator Mode"
                        >
                            <span className="role-icon">📝</span>
                            <span className="role-name">Enumerator</span>
                        </button>

                        <button
                            onClick={() => handleRoleSwitch(ROLES.PUBLIC)}
                            className={getRoleButtonClass(ROLES.PUBLIC)}
                            title="Switch to Public Demo Mode"
                        >
                            <span className="role-icon">👁️</span>
                            <span className="role-name">Public Demo</span>
                        </button>

                        <button
                            onClick={() => handleRoleSwitch(ROLES.ADMIN)}
                            className={getRoleButtonClass(ROLES.ADMIN)}
                            title="Switch to Admin Mode"
                        >
                            <span className="role-icon">⚙️</span>
                            <span className="role-name">Admin</span>
                        </button>
                    </div>

                    {/* Text Size Adjuster */}
                    <TextSizeAdjuster />

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="btn-icon"
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>

                    {/* Admin Dashboard Link */}
                    <RoleGuard roles={['ADMIN']}>
                        <Link to="/admin/dashboard" className="btn btn-primary">
                            📊 Dashboard
                        </Link>
                    </RoleGuard>
                </div>
            </div>

            {/* Admin Navigation - Only show on non-Get Started pages */}
            {!isGetStartedPage && !location.pathname.startsWith('/demo') && (
                <RoleGuard roles={['ADMIN']}>
                    <nav className="admin-nav">
                        <Link to="/admin/search" className="nav-link">
                            <span className="nav-icon">🔍</span>
                            Search
                        </Link>
                        <Link to="/admin/dashboard" className="nav-link">
                            <span className="nav-icon">📊</span>
                            Dashboard
                        </Link>
                        <Link to="/admin/synonyms" className="nav-link">
                            <span className="nav-icon">📝</span>
                            Synonyms
                        </Link>
                        <Link to="/admin/audit-logs" className="nav-link">
                            <span className="nav-icon">📋</span>
                            Audit Logs
                        </Link>
                    </nav>
                </RoleGuard>
            )}
        </header>
    );
}
