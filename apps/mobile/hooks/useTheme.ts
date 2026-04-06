import { useTenantStore } from "../store/tenant";

/**
 * Retourne les couleurs dynamiques du tenant courant.
 */
export function useTheme() {
  const config = useTenantStore((state) => state.bundle?.config);

  return {
    background: "#FFFFFF",
    muted: "#8890B5",
    primary: config?.primary_color ?? "#0F62FE",
    secondary: config?.secondary_color ?? "#A7D8FF",
    text: "#1A1D35",
  };
}
