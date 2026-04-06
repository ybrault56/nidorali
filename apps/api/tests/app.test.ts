import type { SupabaseClient } from "@supabase/supabase-js";
import type { StripeCheckoutPayload, TenantBundle } from "@nidorali/types";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createApp } from "../src/app";
import { createInMemoryRepository } from "../src/shared/repository";

const demoTenant: TenantBundle = {
  app_name: "Club Démo",
  bundle_id: "com.nidorali.democlub",
  config: {
    created_at: new Date().toISOString(),
    font: "Inter",
    id: "00000000-0000-0000-0000-000000000001",
    logo_url: null,
    max_users: 500,
    module_documents: true,
    module_forms: true,
    module_map: false,
    module_members: true,
    module_messaging: true,
    module_news: true,
    module_notifications: true,
    module_planning: true,
    primary_color: "#0F62FE",
    secondary_color: "#A7D8FF",
    splash_bg_color: "#FFFFFF",
    tenant_id: "11111111-1111-1111-1111-111111111111",
    updated_at: new Date().toISOString(),
  },
  contact_email: "contact@demo.test",
  created_at: new Date().toISOString(),
  id: "11111111-1111-1111-1111-111111111111",
  plan: "starter",
  slug: "demo-club",
  status: "live",
  stripe_customer_id: null,
  stripe_subscription_id: null,
  updated_at: new Date().toISOString(),
};

describe("api app", () => {
  const repository = createInMemoryRepository({
    forms: [
      {
        created_at: new Date().toISOString(),
        description: "Formulaire de sortie",
        fields: [],
        id: "22222222-2222-2222-2222-222222222222",
        is_active: true,
        tenant_id: "11111111-1111-1111-1111-111111111111",
        title: "Sortie club",
      },
    ],
    tenants: [demoTenant],
  });

  const supabase = {
    auth: {
      getUser: async (token: string) => ({
        data: {
          user:
            token === "admin-token"
              ? {
                  app_metadata: { role: "super_admin" },
                  email: "admin@nidorali.app",
                  id: "admin-user",
                }
              : null,
        },
        error: token === "admin-token" ? null : { message: "invalid token" },
      }),
    },
    storage: {
      from: () => ({
        createSignedUploadUrl: async (path: string) => ({
          data: { path, signedUrl: `https://upload.example.com/${path}`, token: "signed-token" },
          error: null,
        }),
        getPublicUrl: (path: string) => ({
          data: { publicUrl: `https://cdn.example.com/${path}` },
        }),
      }),
    },
  } as unknown as SupabaseClient;

  const stripe = {
    checkout: {
      sessions: {
        create: async () => ({
          id: "cs_test_123",
          url: "https://checkout.stripe.com/pay/cs_test_123",
        }),
      },
    },
  } as unknown;

  let app: Awaited<ReturnType<typeof createApp>>;
  let authToken = "";
  let customerToken = "";

  beforeAll(async () => {
    app = await createApp({
      env: {
        ALLOWED_ORIGINS: "http://localhost:3000",
        BUILD_SERVICE_SECRET: "secret",
        BUILD_SERVICE_URL: "http://localhost:3002",
        JWT_EXPIRES_IN: "7d",
        JWT_SECRET: "this-is-a-test-secret",
        LOG_LEVEL: "silent",
        NIDORALI_ADMIN_BEARER_TOKEN: "local-admin",
        NIDORALI_SIMULATION_MODE: false,
        NODE_ENV: "test",
        PORT: 3001,
        RESEND_API_KEY: "resend-test",
        STRIPE_SECRET_KEY: "sk_test",
        STRIPE_WEBHOOK_SECRET: "whsec_test",
        SUPABASE_SERVICE_ROLE_KEY: "service-role",
        SUPABASE_URL: "https://example.supabase.co",
      },
      repository,
      stripe: stripe as never,
      supabase,
    });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("returns the public tenant config", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/config?tenant=demo-club",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data.slug).toBe("demo-club");
  });

  it("registers and logs in a tenant user", async () => {
    const registerResponse = await app.inject({
      headers: {
        "x-tenant-id": "demo-club",
      },
      method: "POST",
      payload: {
        display_name: "Alice",
        email: "alice@demo.test",
        password: "password123",
      },
      url: "/api/auth/register",
    });

    authToken = registerResponse.json().data.token.accessToken;
    expect(registerResponse.statusCode).toBe(201);

    const loginResponse = await app.inject({
      headers: {
        "x-tenant-id": "demo-club",
      },
      method: "POST",
      payload: {
        email: "alice@demo.test",
        password: "password123",
      },
      url: "/api/auth/login",
    });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.json().data.user.email).toBe("alice@demo.test");
  });

  it("serves protected member and module routes", async () => {
    const membersResponse = await app.inject({
      headers: {
        authorization: `Bearer ${authToken}`,
        "x-tenant-id": "demo-club",
      },
      method: "GET",
      url: "/api/members",
    });

    expect(membersResponse.statusCode).toBe(200);

    const formsResponse = await app.inject({
      headers: {
        authorization: `Bearer ${authToken}`,
        "x-tenant-id": "demo-club",
      },
      method: "POST",
      payload: {
        answers: { attending: "Oui" },
      },
      url: "/api/forms/22222222-2222-2222-2222-222222222222/respond",
    });

    expect(formsResponse.statusCode).toBe(201);
  });

  it("creates a checkout session for an authenticated client", async () => {
    const customerRegisterResponse = await app.inject({
      method: "POST",
      payload: {
        display_name: "Kilfen",
        email: "contact@demo.test",
        password: "password123",
      },
      url: "/api/customer/register",
    });

    customerToken = customerRegisterResponse.json().data.token.accessToken;

    const payload: StripeCheckoutPayload = {
      app_name: "Club Démo",
      billing_email: "contact@demo.test",
      bundle_id: "com.nidorali.democlub",
      plan: "starter",
      slug: "demo-club",
      tenant_config: demoTenant.config,
    };

    const response = await app.inject({
      headers: {
        authorization: `Bearer ${customerToken}`,
      },
      method: "POST",
      payload,
      url: "/api/billing/checkout-session",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data.url).toContain("checkout.stripe.com");
  });

  it("returns customer orders for the authenticated client", async () => {
    const response = await app.inject({
      headers: {
        authorization: `Bearer ${customerToken}`,
      },
      method: "GET",
      url: "/api/customer/orders",
    });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.json().data)).toBe(true);
  });

  it("exposes admin routes when the supabase token is valid", async () => {
    const response = await app.inject({
      headers: {
        authorization: "Bearer admin-token",
      },
      method: "GET",
      url: "/api/admin/tenants",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toHaveLength(1);
  });
});
