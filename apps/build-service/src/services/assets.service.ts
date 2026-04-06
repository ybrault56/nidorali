import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

/**
 * Génère les assets principaux de marque pour un tenant.
 */
export async function generateTenantAssets(input: {
  initials: string;
  logoUrl: string | null;
  outDir: string;
  primaryColor: string;
  splashBackgroundColor: string;
}) {
  await mkdir(input.outDir, { recursive: true });

  const svg = `
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1024" height="1024" rx="240" fill="${input.primaryColor}"/>
      <text x="512" y="580" text-anchor="middle" font-size="320" font-family="Inter, Arial, sans-serif" fill="white">
        ${input.initials}
      </text>
    </svg>
  `;

  const iconPath = path.join(input.outDir, "icon.png");
  const adaptiveIconPath = path.join(input.outDir, "adaptive-icon.png");
  const splashPath = path.join(input.outDir, "splash.png");

  await sharp(Buffer.from(svg)).png().resize(1024, 1024).toFile(iconPath);
  await sharp(Buffer.from(svg)).png().resize(1024, 1024).toFile(adaptiveIconPath);

  const splashSvg = `
    <svg width="1284" height="2778" viewBox="0 0 1284 2778" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1284" height="2778" fill="${input.splashBackgroundColor}"/>
      <circle cx="642" cy="1389" r="220" fill="${input.primaryColor}" />
      <text x="642" y="1470" text-anchor="middle" font-size="180" font-family="Inter, Arial, sans-serif" fill="white">
        ${input.initials}
      </text>
    </svg>
  `;
  await sharp(Buffer.from(splashSvg)).png().toFile(splashPath);

  if (input.logoUrl) {
    await writeFile(path.join(input.outDir, "logo.source.txt"), input.logoUrl, "utf8");
  }

  return {
    adaptiveIconPath,
    iconPath,
    splashPath,
  };
}
