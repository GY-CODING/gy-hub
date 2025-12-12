"use client";
import { TabsTrigger } from "@/components/animate-ui/components/animate/tabs";
import { IconRenderer } from "./IconRenderer";
import { LucideIcon } from "lucide-react";
import * as React from "react";

interface TabTriggerItemProps {
  value: string;
  icon: LucideIcon | React.ReactNode;
  label: string;
  shortLabel: string;
}

/**
 * Componente TabTriggerItem
 * Responsabilidad: Renderizar un tab trigger con icono y etiquetas responsive
 */
export function TabTriggerItem({
  value,
  icon,
  label,
  shortLabel,
}: TabTriggerItemProps) {
  return (
    <TabsTrigger
      value={value}
      className="flex items-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm"
    >
      <IconRenderer icon={icon} className="size-4 sm:size-5 flex-shrink-0" />
      <span className="hidden md:inline">{label}</span>
      <span className="md:hidden">{shortLabel}</span>
    </TabsTrigger>
  );
}
