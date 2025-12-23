import { useRole } from '../context/RoleContext';

/**
 * RoleGuard component for conditional rendering based on user role
 * 
 * Usage:
 *   <RoleGuard roles={['ADMIN']}>
 *     <AdminOnlyComponent />
 *   </RoleGuard>
 * 
 *   <RoleGuard permission="override">
 *     <OverrideButton />
 *   </RoleGuard>
 */
export default function RoleGuard({ children, roles = [], permission = null }) {
    const { currentRole, hasPermission } = useRole();

    // Check by permission
    if (permission && !hasPermission(permission)) {
        return null;
    }

    // Check by role
    if (roles.length > 0 && !roles.includes(currentRole)) {
        return null;
    }

    return <>{children}</>;
}
