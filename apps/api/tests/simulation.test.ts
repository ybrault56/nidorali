import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createApp } from "../src/app";

describe("api simulation mode", () => {
  let app: Awaited<ReturnType<typeof createApp>>;

  beforeAll(async () => {
    app = await createApp({
      env: {
        ALLOWED_ORIGINS: "http://localhost:3000",
        BUILD_SERVICE_SECRET: "simulation-build-secret",
        BUILD_SERVICE_URL: "http://localhost:3002",
        JWT_EXPIRES_IN: "7d",
        JWT_SECRET: "simulation-jwt-secret",
        LOG_LEVEL: "silent",
        NIDORALI_ADMIN_BEARER_TOKEN: "simulation-admin-token",
        NIDORALI_SIMULATION_MODE: true,
        NODE_ENV: "test",
        PORT: 3001,
        RESEND_API_KEY: "resend-test",
        STRIPE_SECRET_KEY: "sk_test",
        STRIPE_WEBHOOK_SECRET: "whsec_test",
        SUPABASE_SERVICE_ROLE_KEY: "service-role",
        SUPABASE_URL: "https://example.supabase.co",
      },
    });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("exposes seeded tenants with the simulation admin token", async () => {
    const response = await app.inject({
      headers: {
        authorization: "Bearer simulation-admin-token",
      },
      method: "GET",
      url: "/api/admin/tenants",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data[0].slug).toBe("demo-club");
  });

  it("accepts internal build lifecycle updates in simulation mode", async () => {
    const buildsResponse = await app.inject({
      headers: {
        authorization: "Bearer simulation-admin-token",
      },
      method: "GET",
      url: "/api/admin/builds",
    });

    const buildId = buildsResponse.json().data[0].id as string;
    const tenantId = buildsResponse.json().data[0].tenant_id as string;
    const updateResponse = await app.inject({
      headers: {
        "x-build-service-secret": "simulation-build-secret",
      },
      method: "POST",
      payload: {
        completed_at: new Date().toISOString(),
        status: "done",
        tenant_id: tenantId,
      },
      url: `/api/internal/simulation/build-jobs/${buildId}`,
    });

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.json().data.status).toBe("done");
  });
});
