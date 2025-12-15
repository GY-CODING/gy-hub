/**
 * Roles permitidos para acceder a la aplicación
 */
export const ALLOWED_ROLES = [ "ADMIN",] as const;
// export const ALLOWED_ROLES = ["IA", "ADMIN", "DEVELOPER"] as const;

export type AllowedRole = (typeof ALLOWED_ROLES)[number];
