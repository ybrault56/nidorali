import { fetchTenantConfig } from "../lib/api";
import { useTenantStore } from "../store/tenant";

/**
 * Charge la configuration du tenant courant.
 */
export async function bootstrapTenant() {
  const bundle = await fetchTenantConfig();
  useTenantStore.getState().setBundle(bundle);
  useTenantStore.getState().setBootstrapping(false);
  return bundle;
}

/**
 * Retourne le bundle tenant courant.
 */
export function useTenant() {
  return useTenantStore((state) => state.bundle);
}
