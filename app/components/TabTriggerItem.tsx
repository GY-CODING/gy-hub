"use client";
import { TabsTrigger } from "@/components/animate-ui/components/animate/tabs";
import { LucideIcon } from "lucide-react";
import * as React from "react";

interface TabTriggerItemProps {
  value: string;
  icon: LucideIcon | React.ReactNode;
  label: string;
  shortLabel: string;
}

export function TabTriggerItem({
  value,
  icon,
  label,
  shortLabel,
}: TabTriggerItemProps) {
  const renderIcon = () => {
    // Si es un componente React (Lucide o cualquier componente)
    if (React.isValidElement(icon)) {
      return icon;
    }
    // Si es un componente Lucide (función/clase de componente)
    if (
      typeof icon === "function" ||
      (icon && typeof icon === "object" && "$$typeof" in icon)
    ) {
      const Icon = icon as LucideIcon;
      return <Icon className="size-4" />;
    }
    // Si es cualquier otro ReactNode
    return (
      <span className="size-4 flex items-center justify-center">{icon}</span>
    );
  };

  return (
    <TabsTrigger value={value} className="flex items-center gap-2 py-3">
      {renderIcon()}
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{shortLabel}</span>
    </TabsTrigger>
  );
}
