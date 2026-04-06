import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { success } from "../../shared/response.js";
import { getPublicTenantConfig } from "./service.js";

const querySchema = z.object({
  tenant: z.string().min(1),
});

/**
 * Enregistre l'endpoint de configuration publique.
 *
 * @param fastify - Instance Fastify
 */
export async function registerConfigRoutes(fastify: FastifyInstance) {
  fastify.get("/config", async (request, reply) => {
    const query = querySchema.parse(request.query);
    const tenant = await getPublicTenantConfig(fastify, query.tenant);

    return reply.send(success(tenant));
  });
}
