import { UserMenu } from "@/app/components/ui/UserMenu";
import { GravityStarsBackground } from "@/components/animate-ui/components/backgrounds/gravity-stars";
import * as React from "react";

interface HomeLayoutProps {
  children: React.ReactNode;
}

/**
 * Componente HomeLayout
 * Responsabilidad: Proporcionar estructura y layout común (fondo, menú, footer)
 */
export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-start pt-20 sm:pt-24 md:pt-20 pb-8 sm:pb-12 md:pb-20 px-2 sm:px-4">
      {/* User Menu en la esquina superior derecha */}
      <div className="absolute top-4 right-4 z-20">
        <UserMenu />
      </div>

      {/* Fondo de estrellas */}
      <div className="absolute inset-0 -z-10">
        <GravityStarsBackground
          className="absolute inset-0"
          starsCount={150}
          movementSpeed={0.5}
          mouseInfluence={100}
        />
      </div>

      {/* Contenido principal */}
      {children}

      {/* Footer */}
      <footer className="mt-16 text-sm text-muted-foreground relative z-10">
        &copy; {new Date().getFullYear()} GYCODING
      </footer>
    </main>
  );
}
