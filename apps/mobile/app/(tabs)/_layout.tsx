import { Tabs } from "expo-router";

import { useTenantStore } from "../../store/tenant";
import { getVisibleTabs } from "./tabs.config";

/**
 * Tab bar dynamique selon les modules actifs.
 */
export default function TabsLayout() {
  const modules = useTenantStore((state) => state.bundle?.config);
  const visibleTabs = getVisibleTabs(
    modules ?? {
      module_documents: false,
      module_forms: false,
      module_map: false,
      module_members: true,
      module_messaging: false,
      module_news: false,
      module_notifications: true,
      module_planning: false,
    },
  );

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {visibleTabs.map((tab) => (
        <Tabs.Screen key={tab.key} name={tab.key} options={{ title: tab.title }} />
      ))}
      <Tabs.Screen name="documents" options={{ href: null }} />
    </Tabs>
  );
}
