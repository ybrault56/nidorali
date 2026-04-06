import { loginTenantUser, registerTenantUser } from "../lib/api";
import { useAuthStore } from "../store/auth";

/**
 * Expose les actions d'authentification mobile.
 */
export function useAuth() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setSession = useAuthStore((state) => state.setSession);
  const user = useAuthStore((state) => state.user);

  return {
    accessToken,
    async login(input: { email: string; password: string }) {
      const result = await loginTenantUser(input);
      setSession(result.token.accessToken, result.user);
      return result;
    },
    logout() {
      clearSession();
    },
    async register(input: { display_name?: string; email: string; password: string }) {
      const result = await registerTenantUser(input);
      setSession(result.token.accessToken, result.user);
      return result;
    },
    user,
  };
}
