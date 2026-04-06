import type { FastifyInstance } from "fastify";

import { sanitizeAppUser } from "../../shared/users.js";

/**
 * Retourne la liste des membres du tenant courant.
 *
 * @param fastify - Instance Fastify
 * @param tenantId - Identifiant du tenant
 * @returns Liste publique des membres
 */
export async function listTenantMembers(fastify: FastifyInstance, tenantId: string) {
  const users = await fastify.dataRepository.listMembers(tenantId);
  return users.map(sanitizeAppUser);
}

/**
 * Retourne le profil du membre connecté.
 *
 * @param fastify - Instance Fastify
 * @param tenantId - Identifiant du tenant
 * @param userId - Identifiant du membre
 * @returns Profil public du membre
 */
export async function getCurrentMember(fastify: FastifyInstance, tenantId: string, userId: string) {
  const user = await fastify.dataRepository.getUserById(tenantId, userId);
  return user ? sanitizeAppUser(user) : null;
}

/**
 * Met à jour le profil du membre connecté.
 *
 * @param fastify - Instance Fastify
 * @param tenantId - Identifiant du tenant
 * @param userId - Identifiant du membre
 * @param patch - Données modifiables
 * @returns Profil public mis à jour
 */
export async function updateCurrentMember(
  fastify: FastifyInstance,
  tenantId: string,
  userId: string,
  patch: { avatar_url?: string | null; display_name?: string | null },
) {
  const user = await fastify.dataRepository.updateUser(tenantId, userId, patch);
  return sanitizeAppUser(user);
}
