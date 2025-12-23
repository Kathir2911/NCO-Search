import { createContext, useContext, useState, useEffect } from 'react';

const RoleContext = createContext();

export const ROLES = {
    ENUMERATOR: 'ENUMERATOR',
    ADMIN: 'ADMIN',
    PUBLIC: 'PUBLIC',
};

export function RoleProvider({ children }) {
    const [currentRole, setCurrentRole] = useState(() => {
        // Check localStorage for saved role
        const savedRole = localStorage.getItem('nco-current-role');

        // Default to PUBLIC (since it's now the home page)
        return savedRole || ROLES.PUBLIC;
    });

    // Save role to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('nco-current-role', currentRole);
    }, [currentRole]);

    const switchRole = (role) => {
        setCurrentRole(role);
    };

    const hasPermission = (permission) => {
        const permissions = {
            [ROLES.ENUMERATOR]: ['search', 'select', 'viewDetails'],
            [ROLES.ADMIN]: ['search', 'override', 'viewDetails', 'manageSynonyms', 'viewAuditLogs', 'viewDashboard'],
            [ROLES.PUBLIC]: ['search', 'viewDetails'],
        };

        return permissions[currentRole]?.includes(permission) || false;
    };

    const value = {
        currentRole,
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
