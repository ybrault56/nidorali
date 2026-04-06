import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { failure, success } from "../../shared/response.js";
import { buildTriggerSchema, simulationBuildUpdateSchema, uploadLogoSchema } from "./schema.js";
import { createLogoUploadUrl, getAdminTenant, listAdminBuilds, listAdminTenants, triggerTenantBuild, updateSimulationBuildJob } from "./service.js";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Enregistre les routes d'administration Nidorali.
 *
 * @param fastify - Instance Fastify
 */
export async function registerTenantRoutes(fastify: FastifyInstance) {
  fastify.get("/admin/tenants", { preHandler: [fastify.authenticateAdmin] }, async (_request, reply) => {
    return reply.send(success(await listAdminTenants(fastify)));
  });

  fastify.get("/admin/tenants/:id", { preHandler: [fastify.authenticateAdmin] }, async (request, reply) => {
    const params = paramsSchema.parse(request.params);
    return reply.send(success(await getAdminTenant(fastify, params.id)));
  });

  fastify.post("/admin/tenants/:id/trigger-build", { preHandler: [fastify.authenticateAdmin] }, async (request, reply) => {
    const params = paramsSchema.parse(request.params);
    const body = buildTriggerSchema.parse(request.body);
    return reply.send(success(await triggerTenantBuild(fastify, params.id, body.platform)));
  });

  fastify.get("/admin/builds", { preHandler: [fastify.authenticateAdmin] }, async (_request, reply) => {
    return reply.send(success(await listAdminBuilds(fastify)));
  });

  fastify.post("/admin/uploads/logo", { preHandler: [fastify.authenticateAdmin] }, async (request, reply) => {
    const body = uploadLogoSchema.parse(request.body);
    return reply.status(201).send(success(await createLogoUploadUrl(fastify, body.tenant_id)));
  });

  fastify.post("/internal/simulation/build-jobs/:id", async (request, reply) => {
    if (!fastify.env.NIDORALI_SIMULATION_MODE) {
      return reply.status(404).send(failure("simulation_disabled", "Le mode simulation n'est pas activé."));
    }

    if (request.headers["x-build-service-secret"] !== fastify.env.BUILD_SERVICE_SECRET) {
      return reply.status(401).send(failure("simulation_forbidden", "Secret build-service invalide."));
    }

    const params = paramsSchema.parse(request.params);
    const body = simulationBuildUpdateSchema.parse(request.body);
    return reply.send(success(await updateSimulationBuildJob(fastify, params.id, body)));
  });
}
