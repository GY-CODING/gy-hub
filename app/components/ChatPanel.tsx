"use client";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Loader2, Send, LucideIcon } from "lucide-react";
import * as React from "react";
import { useChatState } from "@/hooks/useChatState";
import { TopicSelector } from "./TopicSelector";
import { ChatResponse } from "./ChatResponse";

export interface ChatPanelProps {
  endpoint: string;
  placeholder: string;
  title: string;
  icon?: LucideIcon | React.ReactNode;
  assistantName?: string;
  assistantAvatar?: string;
  topics?: { value: string; label: string }[];
  subtabs?: {
    value: string;
    label: string;
    endpoint: string;
    placeholder: string;
  }[];
}

export function ChatPanel({
  endpoint,
  placeholder,
  title,
  icon,
  assistantName = "IA",
  assistantAvatar,
  topics,
  subtabs,
}: ChatPanelProps) {
  // Estado para sub-tabs
  const [selectedSubtab, setSelectedSubtab] = React.useState<string>(
    subtabs?.[0]?.value || ""
  );

  // Determinar endpoint y placeholder dinámicos basados en sub-tab
  const currentEndpoint =
    subtabs && selectedSubtab
      ? subtabs.find((st) => st.value === selectedSubtab)?.endpoint || endpoint
      : endpoint;

  const currentPlaceholder =
    subtabs && selectedSubtab
      ? subtabs.find((st) => st.value === selectedSubtab)?.placeholder ||
        placeholder
      : placeholder;

  const {
    loading,
    value,
    setValue,
    response,
    error,
    copied,
    selectedTopic,
    setSelectedTopic,
    send,
    copyToClipboard,
  } = useChatState({ endpoint: currentEndpoint });

  // Inicializar tópico seleccionado
  React.useEffect(() => {
    if (topics && topics.length > 0 && !selectedTopic) {
      setSelectedTopic(topics[0].value);
    }
  }, [topics, selectedTopic, setSelectedTopic]);

  const renderIcon = () => {
    if (!icon) return null;

    // Si es un componente React
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as React.ReactElement, {
        className: "size-10",
      });
    }
    // Si es un componente Lucide
    if (
      typeof icon === "function" ||
      (icon && typeof icon === "object" && "$$typeof" in icon)
    ) {
      const Icon = icon as LucideIcon;
      return <Icon className="size-6" />;
    }
    return (
      <span className="size-6 flex items-center justify-center">{icon}</span>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {renderIcon()}
          <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        </div>
        {subtabs && subtabs.length > 0 && (
          <TopicSelector
            topics={subtabs}
            value={selectedSubtab}
            onChange={setSelectedSubtab}
            disabled={loading}
          />
        )}
        {topics && topics.length > 0 && (
          <TopicSelector
            topics={topics}
            value={selectedTopic}
            onChange={setSelectedTopic}
            disabled={loading}
          />
        )}
      </div>

      <div className="space-y-4">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={currentPlaceholder}
          disabled={loading}
          className="w-full min-h-[140px] rounded-lg border bg-white/5 backdrop-blur-sm px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-started resize-none"
        />
        <div className="flex items-center justify-end">
          <Button
            onClick={() => send()}
            disabled={loading || !value.trim()}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Pensando...
              </>
            ) : (
              <>
                <Send className="size-4" />
                Enviar
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-medium">⚠️ {error}</p>
        </div>
      )}

      {response && (
        <ChatResponse
          response={response}
          copied={copied}
          onCopy={copyToClipboard}
          assistantName={assistantName}
          assistantAvatar={assistantAvatar}
        />
      )}
    </div>
  );
}
