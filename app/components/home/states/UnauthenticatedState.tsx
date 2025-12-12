import { LogIn } from "lucide-react";

/**
 * Componente UnauthenticatedState
 * Responsabilidad: Mostrar pantalla de login para usuarios no autenticados
 */
export function UnauthenticatedState() {
  const handleLogin = () => {
    window.location.href = "/auth/login";
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <LogIn className="size-16 text-primary mb-6" />
      <h2 className="text-2xl font-bold mb-4">Inicia Sesión</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Debes iniciar sesión para acceder a los servicios de IA de GYCODING.
      </p>
      <button
        onClick={handleLogin}
        className="px-6 py-3 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/40 transition-colors cursor-pointer font-medium flex items-center gap-2"
      >
        <LogIn className="size-5" />
        Iniciar Sesión
      </button>
    </div>
  );
}
