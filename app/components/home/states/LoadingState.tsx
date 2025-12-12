import { Loader2 } from "lucide-react";

/**
 * Componente LoadingState
 * Responsabilidad: Mostrar estado de carga durante la autenticación
 */
export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="size-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">Cargando...</p>
    </div>
  );
}
