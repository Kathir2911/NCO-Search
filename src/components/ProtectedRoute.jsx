import { Navigate, useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';

/**
 * ProtectedRoute Component
 * 
 * Ensures that only authenticated users with the correct roles can access a route.
 * Redirects to the login page if not authenticated or unauthorized.
 * 
 * @param {Array} roles - List of roles permitted to view this route
 * @param {ReactNode} children - Component to render if authorized
 */
export default function ProtectedRoute({ roles, children }) {
    const { isAuthenticated, user, currentRole } = useRole();
    const location = useLocation();

    // 1. Check if authenticated
    if (!isAuthenticated) {
        // Redirect to login with the desired role as a hint
        const targetRole = roles[0]?.toLowerCase() || 'enumerator';
        return <Navigate to={`/login?role=${targetRole}`} state={{ from: location }} replace />;
    }

    // 2. Check if the user has the required role
    if (roles && !roles.includes(user.role)) {
        // If logged in but unauthorized for this specific section, redirect to home
        return <Navigate to="/" replace />;
    }

    return children;
}
