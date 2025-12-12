import { getCurrentUser, UserProfile } from "@/app/services/auth/authService";
import { useEffect, useState } from "react";

/**
 * Hook para gestionar el estado del usuario autenticado
 * Responsabilidad: Fetch y cache del perfil de usuario
 *
 * @returns {Object} Estado del usuario y flags de carga/autenticación
 */
export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      const userData = await getCurrentUser();

      if (isMounted) {
        setUser(userData);
        setIsAuthenticated(userData !== null);
        setIsLoading(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
  };
}
