import { describe, expect, it, vi } from "vitest";

import * as assets from "../src/services/assets.service";
import * as manifest from "../src/services/appjson.service";
import * as eas from "../src/services/eas.service";
import * as email from "../src/services/email.service";
import { runBuildJob } from "../src/jobs/build.job";

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data:
              table === "tenant_configs"
                ? {
                    logo_url: null,
                    primary_color: "#0F62FE",
                    splash_bg_color: "#FFFFFF",
                  }
                : {
                    app_name: "Demo Club",
                    bundle_id: "com.nidorali.demo",
                    contact_email: "contact@demo.test",
                    id: "tenant-1",
                    slug: "demo-club",
                  },
          }),
        }),
      }),
      update: () => ({
        eq: async () => ({ data: null }),
      }),
    }),
  }),
}));

describe("build job orchestration", () => {
  it("runs the build pipeline with mocked collaborators", async () => {
    vi.spyOn(manifest, "writeTenantManifest").mockResolvedValue({
      manifest: {
        android: { package: "com.nidorali.demo" },
        env: { EXPO_PUBLIC_TENANT_SLUG: "demo-club" },
        ios: { bundleIdentifier: "com.nidorali.demo" },
        name: "Demo Club",
        slug: "demo-club",
      },
      manifestPath: "/tmp/build-manifest.json",
      outputDir: "/tmp/demo-club",
    });
    vi.spyOn(assets, "generateTenantAssets").mockResolvedValue({
      adaptiveIconPath: "/tmp/adaptive-icon.png",
      iconPath: "/tmp/icon.png",
      splashPath: "/tmp/splash.png",
    });
    vi.spyOn(eas, "startEasBuild").mockResolvedValue({
      artifactUrl: "https://example.com/app.apk",
      buildId: "build-1",
      storeUrl: "https://store.example.com/app",
    });
    vi.spyOn(email, "sendTransactionalEmail").mockResolvedValue({ id: "email-1" } as never);

    await runBuildJob(
      {
        BUILD_SERVICE_SECRET: "secret",
        EAS_TOKEN: "test",
        EXPO_PROJECT_ID: "expo-id",
        MOBILE_APP_PATH: "../../apps/mobile",
        NODE_ENV: "test",
        PORT: 3002,
        REDIS_URL: "redis://localhost:6379",
        RESEND_API_KEY: "resend",
        SUPABASE_SERVICE_ROLE_KEY: "service-role",
        SUPABASE_URL: "https://example.supabase.co",
      },
      {
        build_job_id: "job-1",
        platform: "both",
        tenant_id: "tenant-1",
      },
    );

    expect(manifest.writeTenantManifest).toHaveBeenCalled();
    expect(assets.generateTenantAssets).toHaveBeenCalled();
    expect(eas.startEasBuild).toHaveBeenCalled();
  });
});
