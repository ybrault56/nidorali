import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { success } from "../../shared/response.js";
import { ensureFormsEnabled, getTenantForm, listTenantForms, submitFormResponse } from "./service.js";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const responseSchema = z.object({
  answers: z.record(z.unknown()),
});

/**
 * Enregistre les routes du module formulaires.
 *
 * @param fastify - Instance Fastify
 */
export async function registerFormsRoutes(fastify: FastifyInstance) {
  const protectedHandlers = [fastify.resolveTenant, fastify.authenticateAppUser];

  fastify.get("/forms", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensureFormsEnabled(fastify, request.tenant!.id);
    return reply.send(success(await listTenantForms(fastify, request.tenant!.id)));
  });

  fastify.get("/forms/:id", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensureFormsEnabled(fastify, request.tenant!.id);
    const params = paramsSchema.parse(request.params);
    return reply.send(success(await getTenantForm(fastify, request.tenant!.id, params.id)));
  });

  fastify.post("/forms/:id/respond", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensureFormsEnabled(fastify, request.tenant!.id);
    const params = paramsSchema.parse(request.params);
    const body = responseSchema.parse(request.body);
    return reply
      .status(201)
      .send(success(await submitFormResponse(fastify, request.tenant!.id, params.id, request.authUser!.userId, body.answers)));
  });
}
