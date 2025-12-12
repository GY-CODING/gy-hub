/**
 * Servicio de autenticación
 * Responsabilidad: Gestionar llamadas API relacionadas con autenticación
 */

export interface UserProfile {
  username: string;
  roles?: string[];
}

/**
 * Obtiene el perfil del usuario autenticado actual
 * @returns Promise con el perfil del usuario o null si no está autenticado
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const response = await fetch("/api/auth/me");

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
