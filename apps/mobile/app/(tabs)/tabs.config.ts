import type { ModuleFlags } from "@nidorali/types";

export interface VisibleTab {
  href: string;
  key: string;
  title: string;
}

/**
 * Calcule les tabs visibles selon les modules activés.
 */
export function getVisibleTabs(modules: ModuleFlags): VisibleTab[] {
  const tabs: VisibleTab[] = [{ href: "/(tabs)", key: "index", title: "Accueil" }];

  if (modules.module_members) {
    tabs.push({ href: "/(tabs)/members", key: "members", title: "Membres" });
  }
  if (modules.module_messaging) {
    tabs.push({ href: "/(tabs)/messaging", key: "messaging/index", title: "Messages" });
  }
  if (modules.module_planning) {
    tabs.push({ href: "/(tabs)/planning", key: "planning/index", title: "Planning" });
  }
  if (modules.module_news) {
    tabs.push({ href: "/(tabs)/news", key: "news/index", title: "Actualités" });
  }

  tabs.push({ href: "/(tabs)/more", key: "more", title: "Plus" });

  return tabs;
}
