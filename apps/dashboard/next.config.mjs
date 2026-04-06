import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@nidorali/types": path.resolve(__dirname, "../../packages/types/dist/index.js"),
      "@nidorali/ui": path.resolve(__dirname, "../../packages/ui/dist/index.js"),
    };

    return config;
  },
};

export default nextConfig;
