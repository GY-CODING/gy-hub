"use client";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { IconRenderer } from "@/app/components/ui/IconRenderer";
import { useChatState } from "@/app/hooks/useChatState";
import { Loader2, LucideIcon, Send } from "lucide-react";
import * as React from "react";
import { ChatResponse } from "./ChatResponse";
import { TopicSelector } from "./TopicSelector";

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

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full overflow-hidden">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 sm:gap-3">
          {icon && <IconRenderer icon={icon} className="size-6 sm:size-10" />}
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight break-words">
            {title}
          </h3>
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

      <div className="space-y-3 sm:space-y-4">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={currentPlaceholder}
          disabled={loading}
          className="w-full min-h-[120px] sm:min-h-[140px] rounded-lg border bg-white/5 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-started resize-none"
        />
        <div className="flex items-center justify-end">
          <Button
            onClick={() => send()}
            disabled={loading || !value.trim()}
            className="gap-2 text-sm sm:text-base"
          >
            {loading ? (
              <>
                <Loader2 className="size-4" />
                <span className="hidden sm:inline">Pensando...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span className="hidden sm:inline">Enviar</span>
                <span className="sm:hidden">→</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 sm:p-4 text-sm text-destructive overflow-hidden">
          <p className="font-medium break-words">⚠️ {error}</p>
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
