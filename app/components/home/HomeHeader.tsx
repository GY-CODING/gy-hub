import { ShimmeringText } from "@/components/animate-ui/primitives/texts/shimmering";
import {
  TypingText,
  TypingTextCursor,
} from "@/components/animate-ui/primitives/texts/typing";

/**
 * Componente HomeHeader
 * Responsabilidad: Mostrar título y descripción animados de la aplicación
 */
export function HomeHeader() {
  return (
    <div className="text-center mb-6 sm:mb-8 md:mb-12 relative z-10">
      <ShimmeringText
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight"
        text="GYCODING"
        duration={3}
        wave={false}
      />
      <div className="mt-2 sm:mt-3 md:mt-4 px-2">
        <TypingText
          delay={500}
          holdDelay={500}
          className="text-muted-foreground text-sm sm:text-base md:text-lg"
          text="Consulta datos y viaja a través de universos acerca de D&D, MTG, Heralds of Chaos, Stormlight Archive con IA avanzada de GYCODING."
          loop={false}
        >
          <TypingTextCursor className="!h-5 !w-0.5 rounded-full ml-1" />
        </TypingText>
      </div>
    </div>
  );
}
