import { execFile } from "node:child_process";
import { promisify } from "node:util";

import type { BuildServiceEnv } from "../config/index.js";

const execFileAsync = promisify(execFile);

export interface EasBuildResult {
  artifactUrl: string;
  buildId: string;
  storeUrl: string;
}

/**
 * Lance un build EAS pour une plateforme.
 */
export async function startEasBuild(
  env: BuildServiceEnv,
  input: { manifestPath: string; platform: "android" | "ios"; workingDirectory: string },
): Promise<EasBuildResult> {
  if (env.NODE_ENV === "test") {
    return {
      artifactUrl: `https://example.com/${input.platform}.apk`,
      buildId: `mock-${input.platform}-build`,
      storeUrl: `https://store.example.com/${input.platform}`,
    };
  }

  const { stdout } = await execFileAsync(
    "npx",
    [
      "eas",
      "build",
      "--non-interactive",
      "--json",
      "--platform",
      input.platform,
      "--profile",
      "production",
      "--local",
      "--clear-cache",
    ],
    {
      cwd: input.workingDirectory,
      env: {
        ...process.env,
        EAS_TOKEN: env.EAS_TOKEN,
        NIDORALI_BUILD_MANIFEST: input.manifestPath,
      },
    },
  );

  const parsed = JSON.parse(stdout) as { artifacts?: { buildUrl?: string }; id?: string };
  return {
    artifactUrl: parsed.artifacts?.buildUrl ?? "",
    buildId: parsed.id ?? "",
    storeUrl: "",
  };
}
