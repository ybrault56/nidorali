import { mkdtemp, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { generateTenantAssets } from "../src/services/assets.service";

describe("build service assets", () => {
  it("creates icon and splash files", async () => {
    const outDir = await mkdtemp(path.join(os.tmpdir(), "nidorali-assets-"));
    const result = await generateTenantAssets({
      initials: "ND",
      logoUrl: null,
      outDir,
      primaryColor: "#0F62FE",
      splashBackgroundColor: "#FFFFFF",
    });

    await expect(stat(result.iconPath)).resolves.toBeDefined();
    await expect(stat(result.splashPath)).resolves.toBeDefined();
  });
});
