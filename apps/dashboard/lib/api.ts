import type { BuildJob, CustomerOrderSummary, CustomerSession, StripeCheckoutPayload, TenantBundle } from "@nidorali/types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * Effectue une requête JSON typée vers l'API.
 *
 * @param path - Chemin API à appeler
 * @param init - Options fetch complémentaires
 * @returns Payload `data` de l'API
 */
export async function apiFetch<TData>(path: string, init?: RequestInit): Promise<TData> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const payload = (await response.json()) as { data: TData; error?: { message: string }; success: boolean };

  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message ?? "API request failed");
  }

  return payload.data;
}

/**
 * Crée une session Stripe Checkout côté API.
 *
 * @param payload - Configuration tenant à facturer
 * @returns URL Stripe et identifiant de session
 */
export function createCheckoutSession(payload: StripeCheckoutPayload, accessToken: string) {
  return apiFetch<{ checkoutSessionId: string; url: string }>("/api/billing/checkout-session", {
    body: JSON.stringify(payload),
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
  });
}

/**
 * Crée un compte client de suivi des commandes.
 *
 * @param payload - Identité et mot de passe
 * @returns Session client persistable
 */
export function registerCustomerAccount(payload: { display_name?: string; email: string; password: string }) {
  return apiFetch<CustomerSession>("/api/customer/register", {
    body: JSON.stringify(payload),
    method: "POST",
  });
}

/**
 * Ouvre une session client existante.
 *
 * @param payload - Identifiants du compte client
 * @returns Session client persistable
 */
export function loginCustomerAccount(payload: { email: string; password: string }) {
  return apiFetch<CustomerSession>("/api/customer/login", {
    body: JSON.stringify(payload),
    method: "POST",
  });
}

/**
 * Liste les commandes visibles par le client connecté.
 *
 * @param accessToken - Jeton du portail client
 * @returns Commandes et statut associé
 */
export function listCustomerOrders(accessToken: string) {
  return apiFetch<CustomerOrderSummary[]>("/api/customer/orders", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
}

/**
 * Liste les tenants pour le back-office.
 *
 * @param accessToken - Jeton Supabase admin
 * @returns Tenants avec configuration
 */
export function listAdminTenants(accessToken: string) {
  return apiFetch<TenantBundle[]>("/api/admin/tenants", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
}

/**
 * Retourne le détail d'un tenant pour le back-office.
 *
 * @param tenantId - Identifiant du tenant
 * @param accessToken - Jeton Supabase admin
 * @returns Détail tenant + builds
 */
export function getAdminTenant(tenantId: string, accessToken: string) {
  return apiFetch<TenantBundle & { buildJobs: BuildJob[] }>(`/api/admin/tenants/${tenantId}`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
}

/**
 * Liste les builds du back-office.
 *
 * @param accessToken - Jeton Supabase admin
 * @returns Historique des builds
 */
export function listAdminBuilds(accessToken: string) {
  return apiFetch<BuildJob[]>("/api/admin/builds", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
}

/**
 * Déclenche un build manuellement.
 *
 * @param tenantId - Tenant ciblé
 * @param accessToken - Jeton Supabase admin
 */
export function triggerBuild(tenantId: string, accessToken: string) {
  return apiFetch<BuildJob>(`/api/admin/tenants/${tenantId}/trigger-build`, {
    body: JSON.stringify({ platform: "both" }),
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
  });
}
