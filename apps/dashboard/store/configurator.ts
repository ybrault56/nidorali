"use client";

import { calculateMonthlyPrice, type ModuleFlags, type StripeCheckoutPayload, type TenantPlan } from "@nidorali/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { generateBundleId, generateTenantSlug, resolveGeneratedFont } from "../lib/naming";

export type OrganizationType = "association" | "autre" | "collectivite" | "entreprise";

export interface ConfiguratorState extends ModuleFlags {
  app_name: string;
  billing_email: string;
  bundle_id: string;
  font: string;
  logo_url: string | null;
  max_users: number;
  organization_type: OrganizationType;
  plan: TenantPlan;
  primary_color: string;
  secondary_color: string;
  slug: string;
  splash_bg_color: string;
}

interface ConfiguratorStore extends ConfiguratorState {
  getMonthlyPrice: () => number;
  getPayload: () => StripeCheckoutPayload;
  reset: () => void;
  setBranding: (patch: Partial<Pick<ConfiguratorState, "app_name" | "logo_url" | "primary_color" | "secondary_color" | "splash_bg_color">>) => void;
  setModules: (patch: Partial<ModuleFlags>) => void;
  setOrganization: (patch: Partial<Pick<ConfiguratorState, "billing_email" | "organization_type">>) => void;
  setPlan: (plan: TenantPlan) => void;
  setUsers: (maxUsers: number) => void;
}

/**
 * Applique la nomenclature automatique dérivée du nom d'application.
 *
 * @param appName - Nom fonctionnel saisi dans le tunnel
 * @returns Slug, bundle et police générés
 */
function buildComputedNaming(appName: string) {
  return {
    bundle_id: generateBundleId(appName),
    font: resolveGeneratedFont(),
    slug: generateTenantSlug(appName),
  };
}

const initialState: ConfiguratorState = {
  app_name: "Mon app",
  billing_email: "contact@example.com",
  ...buildComputedNaming("Mon app"),
  logo_url: null,
  max_users: 100,
  organization_type: "entreprise",
  plan: "starter",
  primary_color: "#0F62FE",
  secondary_color: "#A7D8FF",
  splash_bg_color: "#FFFFFF",
  module_documents: false,
  module_forms: false,
  module_map: false,
  module_members: true,
  module_messaging: false,
  module_news: false,
  module_notifications: true,
  module_planning: false,
};

/**
 * Store principal du configurateur Nidorali.
 */
export const useConfiguratorStore = create<ConfiguratorStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      getMonthlyPrice: () => calculateMonthlyPrice(get()),
      getPayload: () => {
        const state = get();
        return {
          app_name: state.app_name,
          billing_email: state.billing_email,
          bundle_id: state.bundle_id,
          plan: state.plan,
          slug: state.slug,
          tenant_config: {
            font: state.font,
            logo_url: state.logo_url,
            max_users: state.max_users,
            module_documents: state.module_documents,
            module_forms: state.module_forms,
            module_map: state.module_map,
            module_members: state.module_members,
            module_messaging: state.module_messaging,
            module_news: state.module_news,
            module_notifications: state.module_notifications,
            module_planning: state.module_planning,
            primary_color: state.primary_color,
            secondary_color: state.secondary_color,
            splash_bg_color: state.splash_bg_color,
          },
        };
      },
      reset: () => set(initialState),
      setBranding: (patch) =>
        set((state) => {
          const nextAppName = patch.app_name ?? state.app_name;
          return {
            ...state,
            ...patch,
            ...buildComputedNaming(nextAppName),
          };
        }),
      setModules: (patch) => set((state) => ({ ...state, ...patch })),
      setOrganization: (patch) => set((state) => ({ ...state, ...patch })),
      setPlan: (plan) => set({ plan }),
      setUsers: (max_users) => set({ max_users }),
    }),
    {
      name: "nidorali-configurator",
      partialize: (state) => ({
        app_name: state.app_name,
        billing_email: state.billing_email,
        bundle_id: state.bundle_id,
        font: state.font,
        logo_url: state.logo_url,
        max_users: state.max_users,
        organization_type: state.organization_type,
        plan: state.plan,
        primary_color: state.primary_color,
        secondary_color: state.secondary_color,
        slug: state.slug,
        splash_bg_color: state.splash_bg_color,
        module_documents: state.module_documents,
        module_forms: state.module_forms,
        module_map: state.module_map,
        module_members: state.module_members,
        module_messaging: state.module_messaging,
        module_news: state.module_news,
        module_notifications: state.module_notifications,
        module_planning: state.module_planning,
      }),
      storage:
        typeof window === "undefined"
          ? undefined
          : createJSONStorage(() => window.sessionStorage),
    },
  ),
);
