const DEFAULT_AUTO_FONT = "Inter";

/**
 * Convertit un nom d'application en slug stable et lisible.
 *
 * @param appName - Nom libre saisi par le client
 * @returns Slug URL-safe en minuscules
 */
export function generateTenantSlug(appName: string) {
  const normalized = appName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized.length > 0 ? normalized : "application-nidorali";
}

/**
 * Génère le bundle identifier mobile à partir du nom d'application.
 *
 * @param appName - Nom libre saisi par le client
 * @returns Bundle ID exploitable pour iOS et Android
 */
export function generateBundleId(appName: string) {
  const slug = generateTenantSlug(appName).replace(/-/g, "");
  const safeSuffix = slug.length > 0 ? slug : "appnidorali";
  return `com.nidorali.${safeSuffix}`;
}

/**
 * Retourne la police standard appliquée au tenant.
 *
 * @returns Nom de police stabilisé pour le MVP
 */
export function resolveGeneratedFont() {
  return DEFAULT_AUTO_FONT;
}
