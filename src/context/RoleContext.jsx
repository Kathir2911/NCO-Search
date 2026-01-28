import { createContext, useContext, useState, useEffect } from 'react';

const RoleContext = createContext();

export const ROLES = {
    ENUMERATOR: 'ENUMERATOR',
    ADMIN: 'ADMIN',
    PUBLIC: 'PUBLIC',
};

export function RoleProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('nco-user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [currentRole, setCurrentRole] = useState(() => {
        const savedRole = localStorage.getItem('nco-current-role');
        return savedRole || ROLES.PUBLIC;
    });

    // Synchronize currentRole with user object if available
    useEffect(() => {
        if (user) {
            setCurrentRole(user.role);
            localStorage.setItem('nco-current-role', user.role);
        }
    }, [user]);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('nco-user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setCurrentRole(ROLES.PUBLIC);
        localStorage.removeItem('nco-user');
        localStorage.setItem('nco-current-role', ROLES.PUBLIC);
    };

    const switchRole = (role) => {
        // Only allow switching to PUBLIC or roles already held by user
        if (role === ROLES.PUBLIC || (user && user.role === role)) {
            setCurrentRole(role);
            localStorage.setItem('nco-current-role', role);
        } else if (!user && (role === ROLES.ENUMERATOR || role === ROLES.ADMIN)) {
            // If not logged in and trying to switch to protected role, 
            // the UI will handle navigation to login
            setCurrentRole(role);
        }
    };

    const hasPermission = (permission) => {
        // PUBLIC role always limited
        if (currentRole === ROLES.PUBLIC) {
            return ['search', 'viewDetails'].includes(permission);
        }

        // ENUMERATOR role permissions
        if (currentRole === ROLES.ENUMERATOR) {
            return ['search', 'select', 'viewDetails', 'saveSearch'].includes(permission);
        }

        // ADMIN role permissions
        if (currentRole === ROLES.ADMIN) {
            return true; // Admin has all permissions
        }

        return false;
    };

    const value = {
        user,
        currentRole,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
        hasPermission,
        isEnumerator: currentRole === ROLES.ENUMERATOR,
        isAdmin: currentRole === ROLES.ADMIN,
        isPublic: currentRole === ROLES.PUBLIC,
    };

    return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
}
