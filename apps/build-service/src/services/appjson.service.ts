import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { TenantBundle } from "@nidorali/types";

import type { BuildServiceEnv } from "../config/index.js";

export interface BuildManifest {
  env: {
    EXPO_PUBLIC_TENANT_SLUG: string;
  };
  ios: {
    bundleIdentifier: string;
  };
  name: string;
  slug: string;
  android: {
    package: string;
  };
}

/**
 * Génère un manifest Expo tenant-aware sans muter le template source.
 */
export async function writeTenantManifest(env: BuildServiceEnv, tenant: TenantBundle) {
  const mobileRoot = path.resolve(process.cwd(), env.MOBILE_APP_PATH);
  const outputDir = path.join(mobileRoot, ".generated", tenant.slug);
  await mkdir(outputDir, { recursive: true });

  const manifest: BuildManifest = {
    android: {
      package: tenant.bundle_id,
    },
    env: {
      EXPO_PUBLIC_TENANT_SLUG: tenant.slug,
    },
    ios: {
      bundleIdentifier: tenant.bundle_id,
    },
    name: tenant.app_name,
    slug: tenant.slug,
  };

  const manifestPath = path.join(outputDir, "build-manifest.json");
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  return { manifest, manifestPath, outputDir };
}
