import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  experiments: {
    typedRoutes: true,
  },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    tenantSlug: process.env.EXPO_PUBLIC_TENANT_SLUG,
  },
  ios: {
    bundleIdentifier: "com.nidorali.template",
    supportsTablet: true,
  },
  name: "Nidorali Mobile",
  orientation: "portrait",
  owner: "nidorali",
  plugins: ["expo-router", "expo-notifications"],
  scheme: "nidorali",
  slug: "nidorali-mobile",
  splash: { backgroundColor: "#FFFFFF" },
  userInterfaceStyle: "light",
  version: "0.1.0",
  web: {
    bundler: "metro",
  },
};

export default config;
