"use client";
import * as React from "react";
import {
  Tabs,
  TabsList,
  TabsContents,
  TabsContent,
} from "@/components/animate-ui/components/animate/tabs";
import { ShimmeringText } from "@/components/animate-ui/primitives/texts/shimmering";
import {
  TypingText,
  TypingTextCursor,
} from "@/components/animate-ui/primitives/texts/typing";
import { GravityStarsBackground } from "@/components/animate-ui/components/backgrounds/gravity-stars";
import { ChatPanel } from "./components/ChatPanel";
import { TabTriggerItem } from "./components/TabTriggerItem";
import { TABS_CONFIG } from "@/lib/tabs-config";

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center py-20 px-4 overflow-hidden">
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
            text="Consulta y datos y viaja a través de universos acerca de D&D, MTG, Heraldos del Chaos, Stormlight Archive con IA avanzada de GYCODING."
            loop={false}
          >
            <TypingTextCursor className="!h-5 !w-0.5 rounded-full ml-1" />
          </TypingText>
        </div>
      </div>

      {/* Carta con efecto glassmorphism */}
      <div className="w-full max-w-5/6 relative z-10">
        <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8">
          <Tabs defaultValue={TABS_CONFIG[0].key} className="w-full">
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 h-auto mb-6">
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
        </div>
      </div>

      <footer className="mt-16 text-sm text-muted-foreground relative z-10">
        &copy; {new Date().getFullYear()} GyHub. Powered by Animate UI & Gemini
      </footer>
    </main>
  );
}
