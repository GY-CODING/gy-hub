"use client";
import { RenderIf } from "@/app/components/ui/RenderIf";
import { useAuth } from "@/app/hooks/auth/useAuth";
import { AuthenticatedContent } from "./states/AuthenticatedContent";
import { LoadingState } from "./states/LoadingState";
import { UnauthenticatedState } from "./states/UnauthenticatedState";
import { UnauthorizedState } from "./states/UnauthorizedState";
import { HomeHeader } from "./HomeHeader";

/**
 * Componente HomePage
 * Responsabilidad: Orquestar la lógica de autenticación y renderizado condicional
 *
 * Usa el patrón de composición para delegar el renderizado a componentes especializados
 */
export function HomePage() {
  const { user, isLoading, isAuthenticated, hasAccess } = useAuth();

  return (
    <>
      <HomeHeader />

      {/* Carta con efecto glassmorphism */}
      <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-5/6 relative z-10">
        <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-6 lg:p-8">
          <RenderIf condition={isLoading}>
            <LoadingState />
          </RenderIf>

          <RenderIf condition={!isLoading && !isAuthenticated}>
            <UnauthenticatedState />
          </RenderIf>

          <RenderIf condition={!isLoading && isAuthenticated && !hasAccess}>
            <UnauthorizedState user={user!} />
          </RenderIf>

          <RenderIf condition={!isLoading && isAuthenticated && hasAccess}>
            <AuthenticatedContent />
          </RenderIf>
        </div>
      </div>
    </>
  );
}
