import type { AuthTokens, TenantBundle } from "@nidorali/types";

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";
const tenantSlug = process.env.EXPO_PUBLIC_TENANT_SLUG ?? "demo-club";

export interface AuthResponse {
  token: AuthTokens;
  user: {
    avatar_url: string | null;
    display_name: string | null;
    email: string;
    id: string;
    is_active: boolean;
    last_seen_at: string | null;
    push_token: string | null;
    role: string;
    tenant_id: string;
  };
}

/**
 * Effectue une requête API typée pour le mobile.
 */
export async function mobileApiFetch<TData>(path: string, init?: RequestInit, tenantIdentifier = tenantSlug): Promise<TData> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      "x-tenant-id": tenantIdentifier,
      ...(init?.headers ?? {}),
    },
  });
  const payload = (await response.json()) as { data: TData; error?: { message: string }; success: boolean };

  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message ?? "Mobile API request failed");
  }

  return payload.data;
}

/**
 * Charge la configuration du tenant à partir du slug injecté au build.
 */
export function fetchTenantConfig(slug = tenantSlug) {
  return mobileApiFetch<TenantBundle>(`/api/config?tenant=${slug}`, { method: "GET" }, slug);
}

/**
 * Inscrit un utilisateur final.
 */
export function registerTenantUser(input: { display_name?: string; email: string; password: string }, slug = tenantSlug) {
  return mobileApiFetch<AuthResponse>("/api/auth/register", {
    body: JSON.stringify(input),
    method: "POST",
  }, slug);
}

/**
 * Connecte un utilisateur final.
 */
export function loginTenantUser(input: { email: string; password: string }, slug = tenantSlug) {
  return mobileApiFetch<AuthResponse>("/api/auth/login", {
    body: JSON.stringify(input),
    method: "POST",
  }, slug);
}

/**
 * Envoie le token push Expo à l'API.
 */
export function savePushToken(pushToken: string, accessToken: string, slug = tenantSlug) {
  return mobileApiFetch("/api/auth/push-token", {
    body: JSON.stringify({ push_token: pushToken }),
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
  }, slug);
}
