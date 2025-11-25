"use client";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
} from "@/components/animate-ui/components/animate/tabs";
import { GravityStarsBackground } from "@/components/animate-ui/components/backgrounds/gravity-stars";
import { ShimmeringText } from "@/components/animate-ui/primitives/texts/shimmering";
import {
  TypingText,
  TypingTextCursor,
} from "@/components/animate-ui/primitives/texts/typing";
import { TABS_CONFIG } from "@/lib/tabs-config";
import { Loader2, LogIn, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { ChatPanel } from "./components/ChatPanel";
import { TabTriggerItem } from "./components/TabTriggerItem";
import { UserMenu } from "./components/UserMenu";

interface UserProfile {
  username: string;
  roles?: string[];
}

const ALLOWED_ROLES = ["IA", "ADMIN", "DEVELOPER"];

export default function HomePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setIsAuthenticated(true);

          // Verificar si el usuario tiene alguno de los roles permitidos
          const userHasAccess =
            data.roles?.some((role: string) =>
              ALLOWED_ROLES.includes(role.toUpperCase())
            ) || false;

          setHasAccess(userHasAccess);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setHasAccess(false);
        }
      })
      .catch(() => {
        setUser(null);
        setIsAuthenticated(false);
        setHasAccess(false);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center py-20 px-4 overflow-hidden">
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

      <div className="text-center mb-12 relative z-10">
        <ShimmeringText
          className="text-6xl md:text-7xl font-black tracking-tight"
          text="GYCODING"
          duration={3}
          wave={false}
        />
        <div className="mt-4">
          <TypingText
            delay={500}
            holdDelay={500}
            className="text-muted-foreground text-lg"
            text="Consulta datos y viaja a través de universos acerca de D&D, MTG, Heralds of Chaos, Stormlight Archive con IA avanzada de GYCODING."
            loop={false}
          >
            <TypingTextCursor className="!h-5 !w-0.5 rounded-full ml-1" />
          </TypingText>
        </div>
      </div>

      {/* Carta con efecto glassmorphism */}
      <div className="w-full max-w-5/6 relative z-10">
        <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8">
          {isLoading ? (
            // Estado de carga
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="size-12 animate-spin text-primary mb-4" />
              <p className="text-lg text-muted-foreground">Cargando...</p>
            </div>
          ) : !isAuthenticated ? (
            // No autenticado - solicitar login
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <LogIn className="size-16 text-primary mb-6" />
              <h2 className="text-2xl font-bold mb-4">Inicia Sesión</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Debes iniciar sesión para acceder a los servicios de IA de
                GYCODING.
              </p>
              <button
                onClick={() => (window.location.href = "/auth/login")}
                className="px-6 py-3 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/40 transition-colors cursor-pointer font-medium flex items-center gap-2"
              >
                <LogIn className="size-5" />
                Iniciar Sesión
              </button>
            </div>
          ) : !hasAccess ? (
            // Autenticado pero sin permisos
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShieldAlert className="size-16 text-destructive mb-6" />
              <h2 className="text-2xl font-bold mb-4">Acceso Restringido</h2>
              <p className="text-muted-foreground mb-2 max-w-md">
                Hola{" "}
                <span className="text-primary font-semibold">
                  {user?.username}
                </span>
                , no tienes los privilegios necesarios para acceder a estos
                servicios.
              </p>
              <button
                onClick={() =>
                  (window.location.href =
                    "mailto:support@gycoding.com?subject=Solicitud de Permisos GyHub")
                }
                className="px-6 py-3 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/40 transition-colors cursor-pointer font-medium"
              >
                Solicitar Permisos
              </button>
            </div>
          ) : (
            // Usuario autenticado con acceso
            <Tabs defaultValue={TABS_CONFIG[0].key} className="w-full">
              <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 h-auto mb-6">
                {TABS_CONFIG.map((tab) => (
                  <TabTriggerItem
                    key={tab.key}
                    value={tab.key}
                    icon={tab.icon}
                    label={tab.label}
                    shortLabel={tab.shortLabel}
                  />
                ))}
              </TabsList>

              <TabsContents>
                {TABS_CONFIG.map((tab) => (
                  <TabsContent key={tab.key} value={tab.key} className="mt-0">
                    <ChatPanel
                      endpoint={tab.endpoint}
                      placeholder={tab.placeholder}
                      title={tab.title}
                      icon={tab.icon}
                      assistantName={tab.assistantName}
                      assistantAvatar={tab.assistantAvatar}
                      topics={tab.topics}
                      subtabs={tab.subtabs}
                    />
                  </TabsContent>
                ))}
              </TabsContents>
            </Tabs>
          )}
        </div>
      </div>

      <footer className="mt-16 text-sm text-muted-foreground relative z-10">
        &copy; {new Date().getFullYear()} GYCODING
      </footer>
    </main>
  );
}
