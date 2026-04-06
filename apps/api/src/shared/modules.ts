import type { ModuleFlags, TenantBundle } from "@nidorali/types";

import { AppError } from "./errors.js";

/**
 * Vérifie qu'un module est activé pour le tenant courant.
 *
 * @param tenant - Tenant courant
 * @param key - Clé du module à vérifier
 */
export function assertModuleEnabled(tenant: TenantBundle, key: keyof ModuleFlags) {
  if (!tenant.config[key]) {
    throw new AppError({
      code: "module_disabled",
      details: { module: key },
      message: "Le module demandé n'est pas activé pour ce tenant.",
      statusCode: 403,
    });
  }
}
