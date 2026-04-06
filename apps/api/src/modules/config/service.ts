import type { FastifyInstance } from "fastify";

import { AppError } from "../../shared/errors.js";

/**
 * Retourne la configuration publique d'un tenant.
 *
 * @param fastify - Instance Fastify courante
 * @param identifier - Slug ou bundle ID du tenant
 * @returns Tenant enrichi de sa configuration
 */
export async function getPublicTenantConfig(fastify: FastifyInstance, identifier: string) {
  const tenant = await fastify.dataRepository.getConfigByTenantIdentifier(identifier);
  if (!tenant) {
    throw new AppError({
      code: "tenant_not_found",
      message: "Tenant introuvable.",
      statusCode: 404,
    });
  }

  if (tenant.status === "suspended" || tenant.status === "cancelled") {
    throw new AppError({
      code: "tenant_inactive",
      message: "Tenant indisponible.",
      statusCode: 403,
    });
  }

  return tenant;
}
