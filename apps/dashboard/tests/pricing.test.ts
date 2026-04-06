import { describe, expect, it } from "vitest";

import { calculateMonthlyPrice } from "../lib/pricing";

describe("dashboard pricing", () => {
  it("adds enabled module surcharges and user tier", () => {
    expect(
      calculateMonthlyPrice({
        max_users: 500,
        module_documents: true,
        module_forms: false,
        module_map: false,
        module_members: true,
        module_messaging: true,
        module_news: true,
        module_notifications: true,
        module_planning: true,
      }),
    ).toBe(2000);
  });
});
