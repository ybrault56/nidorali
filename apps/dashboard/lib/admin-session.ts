"use client";

import { supabaseBrowserClient } from "./supabase";

export const isDashboardSimulationMode = process.env.NEXT_PUBLIC_NIDORALI_SIMULATION_MODE === "true";
const simulationAdminToken = process.env.NEXT_PUBLIC_NIDORALI_ADMIN_BEARER_TOKEN ?? "nidorali-local-admin";

/**
 * Retourne le jeton admin exploitable par le dashboard.
 *
 * @returns Jeton Supabase réel ou jeton local simulé
 */
export async function getAdminAccessToken() {
  if (isDashboardSimulationMode) {
    return simulationAdminToken;
  }

  const session = await supabaseBrowserClient.auth.getSession();
  return session.data.session?.access_token ?? null;
}

/**
 * Indique si le back-office peut être considéré comme accessible.
 *
 * @returns `true` si une session admin est disponible
 */
export async function hasAdminSession() {
  return Boolean(await getAdminAccessToken());
}
