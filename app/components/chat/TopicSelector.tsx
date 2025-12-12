"use client";
import { ChevronDown } from "lucide-react";
import * as React from "react";

interface TopicSelectorProps {
  topics: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TopicSelector({
  topics,
  value,
  onChange,
  disabled = false,
}: TopicSelectorProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full appearance-none rounded-lg border bg-white/5 backdrop-blur-sm px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {topics.map((topic) => (
          <option key={topic.value} value={topic.value}>
            {topic.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}
