import { beforeEach, describe, expect, it, vi } from "vitest";

import * as api from "../lib/api";
import { bootstrapTenant } from "../hooks/useTenant";
import { useTenantStore } from "../store/tenant";

describe("tenant bootstrap", () => {
  beforeEach(() => {
    useTenantStore.getState().setBundle(null);
    useTenantStore.getState().setBootstrapping(true);
  });

  it("stores the tenant bundle after loading config", async () => {
    vi.spyOn(api, "fetchTenantConfig").mockResolvedValue({
      app_name: "Demo Club",
      bundle_id: "com.nidorali.demo",
      config: {
        created_at: "",
        font: "Inter",
        id: "config-1",
        logo_url: null,
        max_users: 100,
        module_documents: false,
        module_forms: false,
        module_map: false,
        module_members: true,
        module_messaging: false,
        module_news: true,
        module_notifications: true,
        module_planning: false,
        primary_color: "#0F62FE",
        secondary_color: "#A7D8FF",
        splash_bg_color: "#FFFFFF",
        tenant_id: "tenant-1",
        updated_at: "",
      },
      contact_email: "contact@demo.test",
      created_at: "",
      id: "tenant-1",
      plan: "starter",
      slug: "demo-club",
      status: "live",
      stripe_customer_id: null,
      stripe_subscription_id: null,
      updated_at: "",
    });

    const bundle = await bootstrapTenant();

    expect(bundle.slug).toBe("demo-club");
    expect(useTenantStore.getState().bundle?.id).toBe("tenant-1");
  });
});
