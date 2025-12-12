import { UserProfile } from "@/app/services/auth/authService";
import { ShieldAlert } from "lucide-react";

interface UnauthorizedStateProps {
  user: UserProfile;
}

/**
 * Componente UnauthorizedState
 * Responsabilidad: Mostrar mensaje de acceso denegado para usuarios sin permisos
 */
export function UnauthorizedState({ user }: UnauthorizedStateProps) {
  const handleRequestAccess = () => {
    window.location.href =
      "mailto:support@gycoding.com?subject=Solicitud de Permisos GyHub";
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShieldAlert className="size-16 text-destructive mb-6" />
      <h2 className="text-2xl font-bold mb-4">Acceso Restringido</h2>
      <p className="text-muted-foreground mb-2 max-w-md">
        Hola <span className="text-primary font-semibold">{user.username}</span>
        , no tienes los privilegios necesarios para acceder a estos servicios.
      </p>
      <button
        onClick={handleRequestAccess}
        className="px-6 py-3 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/40 transition-colors cursor-pointer font-medium"
      >
        Solicitar Permisos
      </button>
    </div>
  );
}
