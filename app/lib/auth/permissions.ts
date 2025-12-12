// Tipos de roles
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  DEVELOPER = "developer",
  VIEWER = "viewer",
}

// Permisos por funcionalidad
export enum Permission {
  // GYCODING
  ACCESS_API_DOCS = "access:api-docs",
  ACCESS_METADATA = "access:metadata",
  ACCESS_CODE_REVIEW = "access:code-review",

  // Heralds of Chaos
  ACCESS_HERALDS = "access:heralds",

  // Stormlight
  ACCESS_STORMLIGHT = "access:stormlight",

  // Gestión
  MANAGE_USERS = "manage:users",
  VIEW_ANALYTICS = "view:analytics",
}

// Mapa de roles a permisos
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Acceso total
    Permission.ACCESS_API_DOCS,
    Permission.ACCESS_METADATA,
    Permission.ACCESS_CODE_REVIEW,
    Permission.ACCESS_HERALDS,
    Permission.ACCESS_STORMLIGHT,
    Permission.MANAGE_USERS,
    Permission.VIEW_ANALYTICS,
  ],
  [UserRole.DEVELOPER]: [
    // Acceso técnico
    Permission.ACCESS_API_DOCS,
    Permission.ACCESS_METADATA,
    Permission.ACCESS_CODE_REVIEW,
    Permission.VIEW_ANALYTICS,
  ],
  [UserRole.USER]: [
    // Acceso básico
    Permission.ACCESS_HERALDS,
    Permission.ACCESS_STORMLIGHT,
  ],
  [UserRole.VIEWER]: [
    // Solo visualización
    Permission.ACCESS_HERALDS,
    Permission.ACCESS_STORMLIGHT,
  ],
};

// Helper para verificar si un usuario tiene un permiso
export function hasPermission(
  userRole: UserRole,
  permission: Permission
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  return permissions.includes(permission);
}

// Helper para verificar si un usuario tiene acceso a una tab
export function canAccessTab(userRole: UserRole, tabKey: string): boolean {
  const tabPermissions: Record<string, Permission> = {
    gycoding: Permission.ACCESS_API_DOCS, // Si tiene uno de los permisos de GYCODING
    heralds: Permission.ACCESS_HERALDS,
    stormlight: Permission.ACCESS_STORMLIGHT,
  };

  const requiredPermission = tabPermissions[tabKey];
  if (!requiredPermission) return false;

  return hasPermission(userRole, requiredPermission);
}

// Helper para verificar si un usuario tiene acceso a un subtab
export function canAccessSubtab(
  userRole: UserRole,
  subtabValue: string
): boolean {
  const subtabPermissions: Record<string, Permission> = {
    api: Permission.ACCESS_API_DOCS,
    metadata: Permission.ACCESS_METADATA,
    "code-review": Permission.ACCESS_CODE_REVIEW,
  };

  const requiredPermission = subtabPermissions[subtabValue];
  if (!requiredPermission) return false;

  return hasPermission(userRole, requiredPermission);
}
