import { LucideIcon } from "lucide-react";
import * as React from "react";

export interface TabConfig {
  key: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon | React.ReactNode;
  endpoint: string;
  placeholder: string;
  title: string;
  assistantName: string;
  assistantAvatar?: string;
  topics?: { value: string; label: string }[];
  subtabs?: {
    value: string;
    label: string;
    endpoint: string;
    placeholder: string;
  }[];
}

export const TABS_CONFIG: TabConfig[] = [
  {
    key: "gycoding",
    label: "GYCODING",
    shortLabel: "GY",
    icon: (
      <img
        src="/icons/gy-logo.svg"
        alt="Stormlight"
        className="size-5 sm:size-6"
      />
    ),
    endpoint: "/api/assistants/gycoding",
    placeholder: "¿En qué puedo ayudarte?",
    title: "GYCODING",
    assistantName: "GY CODING",
    assistantAvatar:
      "https://github.com/GY-CODING/img-repo/blob/main/gycoding/dark/gy-logo-2025-dark-tilt-nobg.png?raw=true",
    subtabs: [
      {
        value: "api",
        label: "📚 API",
        endpoint: "/api/assistants/api-docs",
        placeholder:
          "Pregunta sobre APIs, endpoints, métodos HTTP, documentación...",
      },
      {
        value: "metadata",
        label: "🗄️ Metadata",
        endpoint: "/api/metadata",
        placeholder: "¿Qué quieres saber sobre la metadata?",
      },
      {
        value: "code-review",
        label: "🔍 Code Review",
        endpoint: "/api/assistants/code-review",
        placeholder:
          "Pega código o URLs de GitHub para revisar (ej: https://github.com/usuario/repo)...",
      },
    ],
  },
  {
    key: "heralds",
    label: "Heralds of Chaos",
    shortLabel: "Heralds of Chaos",
    icon: (
      <img
        src="https://github.com/GY-CODING/img-repo/blob/main/fall-of-the-gods/other/fotg-logo-white.png?raw=true"
        alt="Stormlight"
        className="size-5 sm:size-6"
      />
    ),
    endpoint: "/api/assistants/heralds",
    placeholder: "¿Qué quieres saber sobre Heralds of Chaos?",
    title: "Heralds of Chaos AI",
    assistantName: "Mimir",
    assistantAvatar:
      "https://cdna.artstation.com/p/assets/images/images/056/598/916/large/angelo-mimir-crop.jpg?1670439858",
  },
  {
    key: "stormlight",
    label: "Stormlight",
    shortLabel: "Storm",
    icon: (
      <img
        src="/icons/stormlight.svg"
        alt="Stormlight"
        className="size-5 sm:size-6"
      />
    ),
    endpoint: "/api/assistants/stormlight",
    placeholder: "¿Qué quieres saber sobre Stormlight Archive RPG?",
    title: "Stormlight Archive AI",
    assistantName: "PADRE TORMENTA",
    assistantAvatar:
      "https://uploads.coppermind.net/thumb/Stormfather.png/1200px-Stormfather.png",
    topics: [
      { value: "handbook", label: "Handbook - Reglas del juego" },
      { value: "world-guide", label: "World Guide - Guía del mundo" },
      { value: "first-steps", label: "First Steps - Primeros pasos" },
    ],
  },
  {
    key: "mtg",
    label: "Magic: The Gathering",
    shortLabel: "MTG",
    icon: <img src="/icons/mtg.svg" alt="MTG" className="size-4 sm:size-5" />,
    endpoint: "/api/assistants/mtg",
    placeholder: "Busca cartas, pregunta sobre reglas, mazos o estrategias...",
    title: "Magic: The Gathering AI",
    assistantName: "Planeswalker",
    assistantAvatar:
      "https://cards.scryfall.io/art_crop/front/2/8/28c93319-e235-4115-8c24-f3c6a6e5c1e5.jpg",
  },
];
