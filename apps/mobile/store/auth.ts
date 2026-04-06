import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  clearSession: () => void;
  setSession: (accessToken: string, user: AuthState["user"]) => void;
  user: {
    avatar_url: string | null;
    display_name: string | null;
    email: string;
    id: string;
    role: string;
    tenant_id: string;
  } | null;
}

/**
 * Store d'auth persisté pour le mobile.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      clearSession: () => set({ accessToken: null, user: null }),
      setSession: (accessToken, user) => set({ accessToken, user }),
      user: null,
    }),
    {
      name: "nidorali-auth",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
