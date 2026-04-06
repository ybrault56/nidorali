import type { TenantBundle } from "@nidorali/types";
import { create } from "zustand";

interface TenantState {
  bundle: TenantBundle | null;
  isBootstrapping: boolean;
  setBootstrapping: (value: boolean) => void;
  setBundle: (bundle: TenantBundle | null) => void;
}

/**
 * Store du tenant courant côté mobile.
 */
export const useTenantStore = create<TenantState>((set) => ({
  bundle: null,
  isBootstrapping: true,
  setBootstrapping: (isBootstrapping) => set({ isBootstrapping }),
  setBundle: (bundle) => set({ bundle }),
}));
