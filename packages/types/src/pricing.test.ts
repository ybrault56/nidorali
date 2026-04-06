import { describe, expect, it } from "vitest";

import { calculateMonthlyPrice } from "./pricing.js";

describe("shared pricing", () => {
  it("keeps included modules free", () => {
    expect(
      calculateMonthlyPrice({
        max_users: 100,
        module_documents: false,
        module_forms: false,
        module_map: false,
        module_members: true,
        module_messaging: false,
        module_news: false,
        module_notifications: true,
        module_planning: false,
      }),
    ).toBe(500);
  });
});
