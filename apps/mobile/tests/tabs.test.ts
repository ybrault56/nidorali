import { describe, expect, it } from "vitest";

import { getVisibleTabs } from "../app/(tabs)/tabs.config";

describe("mobile visible tabs", () => {
  it("hides disabled modules and keeps home and more", () => {
    const tabs = getVisibleTabs({
      module_documents: false,
      module_forms: false,
      module_map: false,
      module_members: true,
      module_messaging: false,
      module_news: true,
      module_notifications: true,
      module_planning: false,
    });

    expect(tabs.map((tab) => tab.key)).toEqual(["index", "members", "news/index", "more"]);
  });
});
