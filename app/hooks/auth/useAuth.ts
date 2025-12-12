import { useAccessControl } from "./useAccessControl";
import { useUser } from "./useUser";

/**
 * Hook principal de autenticación
 * Responsabilidad: Orquestar estado de autenticación y autorización
 *
 * Combina useUser y useAccessControl en un único hook conveniente
 *
 * @returns {Object} Estado completo de autenticación
 *
 * @example
 * const { user, isLoading, isAuthenticated, hasAccess } = useAuth();
 */
export function useAuth() {
  const { user, isLoading, isAuthenticated } = useUser();
  const { hasAccess, allowedRoles } = useAccessControl(user);

  return {
    // User state
    user,
    isLoading,

    // Authentication state
    isAuthenticated,

    // Authorization state
    hasAccess,
    allowedRoles,
  };
}
