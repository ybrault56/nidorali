"use client";

import type { CustomerAccount } from "@nidorali/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CustomerSessionState {
  account: CustomerAccount | null;
  clearSession: () => void;
  token: string | null;
  setSession: (input: { account: CustomerAccount; token: string }) => void;
}

/**
 * Persiste la session client du portail de commande.
 */
export const useCustomerSessionStore = create<CustomerSessionState>()(
  persist(
    (set) => ({
      account: null,
      clearSession: () => set({ account: null, token: null }),
      token: null,
      setSession: ({ account, token }) => set({ account, token }),
    }),
    {
      name: "nidorali-customer-session",
      storage:
        typeof window === "undefined"
          ? undefined
          : createJSONStorage(() => window.localStorage),
    },
  ),
);
