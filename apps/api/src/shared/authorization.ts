import { AppError } from "./errors.js";

/**
 * Vérifie que l'utilisateur applicatif courant peut administrer le module.
 *
 * @param role - Rôle du membre connecté
 */
export function assertTenantAdmin(role: string) {
  if (role !== "admin" && role !== "moderator") {
    throw new AppError({
      code: "forbidden",
      message: "Un rôle administrateur est requis.",
      statusCode: 403,
    });
  }
}
