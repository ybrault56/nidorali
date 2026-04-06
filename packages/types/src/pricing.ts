import type { ModuleFlags } from "./types.js";

export const PRICING = {
  base: 500,
  modules: {
    module_documents: 200,
    module_forms: 300,
    module_map: 100,
    module_members: 0,
    module_messaging: 300,
    module_news: 200,
    module_notifications: 0,
    module_planning: 300,
  },
  userTiers: [
    { extra: 0, max: 100 },
    { extra: 500, max: 500 },
    { extra: 1500, max: 2000 },
    { extra: 4000, max: 10000 },
    { extra: 10000, max: Number.POSITIVE_INFINITY },
  ],
} as const;

export interface PricingSelection extends ModuleFlags {
  max_users: number;
}

/**
 * Retourne le palier tarifaire utilisateur applicable.
 *
 * @param userCount - Nombre d'utilisateurs maximal choisi
 * @returns Le palier correspondant
 */
export function resolveUserTier(userCount: number) {
  return PRICING.userTiers.find((tier) => userCount <= tier.max) ?? PRICING.userTiers.at(-1)!;
}

/**
 * Calcule le montant mensuel total en centimes.
 *
 * @param selection - Configuration fonctionnelle et quota utilisateurs
 * @returns Prix mensuel TTC en centimes
 */
export function calculateMonthlyPrice(selection: PricingSelection): number {
  const moduleTotal = Object.entries(PRICING.modules).reduce((total, [moduleKey, cents]) => {
    const enabled = selection[moduleKey as keyof ModuleFlags];
    return enabled ? total + cents : total;
  }, 0);

  return PRICING.base + moduleTotal + resolveUserTier(selection.max_users).extra;
}

/**
 * Formate un montant en euros.
 *
 * @param cents - Montant en centimes
 * @returns Représentation utilisateur en euro
 */
export function formatPriceEur(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    currency: "EUR",
    style: "currency",
  }).format(cents / 100);
}
