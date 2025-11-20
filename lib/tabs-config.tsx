import { Database, LucideIcon } from "lucide-react";
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
    icon: <img src="/icons/gy-logo.svg" alt="Stormlight" className="size-6" />,
    endpoint: "/api/gemini",
    placeholder: "¿En qué puedo ayudarte?",
    title: "GYCODING",
    assistantName: "GY CODING",
    assistantAvatar:
      "https://github.com/GY-CODING/img-repo/blob/main/gycoding/dark/gy-logo-2025-dark-tilt-nobg.png?raw=true",
    subtabs: [
      {
        value: "api",
        label: "📚 API",
        endpoint: "/api/gemini/api",
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
        endpoint: "/api/gemini/code-review",
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
        className="size-6"
      />
    ),
    endpoint: "/api/heralds",
    placeholder: "¿Qué quieres saber sobre Heralds of Chaos?",
    title: "Heralds of Chaos AI",
    assistantName: "Mimir",
    assistantAvatar:
      "https://cdna.artstation.com/p/assets/images/images/056/598/916/large/angelo-mimir-crop.jpg?1670439858", // Pon tu URL aquí
  },
  {
    key: "stormlight",
    label: "Stormlight",
    shortLabel: "Storm",
    icon: (
      <img src="/icons/stormlight.svg" alt="Stormlight" className="size-6" />
    ),
    endpoint: "/api/stormlight",
    placeholder: "¿Qué quieres saber sobre Stormlight Archive RPG?",
    title: "Stormlight Archive AI",
    assistantName: "PADRE TORMENTA",
    assistantAvatar:
      "https://static.wikia.nocookie.net/stormlightarchive/images/5/55/Sf_CC.jpg/revision/latest?cb=20191103002947", // Pon tu URL aquí
    topics: [
      { value: "handbook", label: "Handbook - Reglas del juego" },
      { value: "world-guide", label: "World Guide - Guía del mundo" },
      { value: "first-steps", label: "First Steps - Primeros pasos" },
    ],
  },
];
