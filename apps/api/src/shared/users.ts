import type { AppUser } from "@nidorali/types";

/**
 * Retire les champs sensibles d'un utilisateur applicatif.
 *
 * @param user - Enregistrement complet
 * @returns Vue publique sans hash de mot de passe
 */
export function sanitizeAppUser(user: AppUser) {
  const safeUser = { ...user };
  delete safeUser.password_hash;
  return safeUser;
}
