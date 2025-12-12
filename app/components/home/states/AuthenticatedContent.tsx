import { ChatPanel } from "@/app/components/chat/ChatPanel";
import { TabTriggerItem } from "@/app/components/ui/TabTriggerItem";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
} from "@/components/animate-ui/components/animate/tabs";
import { TABS_CONFIG } from "@/app/config/tabs";

/**
 * Componente AuthenticatedContent
 * Responsabilidad: Renderizar el contenido principal para usuarios autenticados y autorizados
 */
export function AuthenticatedContent() {
  return (
    <Tabs defaultValue={TABS_CONFIG[0].key} className="w-full">
      <TabsList className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 h-auto mb-4 md:mb-6">
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
  );
}
