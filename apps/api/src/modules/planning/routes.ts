import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { success } from "../../shared/response.js";
import { eventAttendanceSchema, eventSchema } from "./schema.js";
import {
  attendTenantEvent,
  createTenantEvent,
  deleteTenantEvent,
  ensurePlanningEnabled,
  getTenantEvent,
  listTenantEvents,
  updateTenantEvent,
} from "./service.js";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Enregistre les routes du module planning.
 *
 * @param fastify - Instance Fastify
 */
export async function registerPlanningRoutes(fastify: FastifyInstance) {
  const protectedHandlers = [fastify.resolveTenant, fastify.authenticateAppUser];

  fastify.get("/events", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensurePlanningEnabled(fastify, request.tenant!.id);
    return reply.send(success(await listTenantEvents(fastify, request.tenant!.id)));
  });

  fastify.post("/events", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensurePlanningEnabled(fastify, request.tenant!.id);
    const body = eventSchema.parse(request.body);
    const event = await createTenantEvent(fastify, request.tenant!.id, {
      ...body,
      created_by: request.authUser!.userId,
    });
    return reply.status(201).send(success(event));
  });

  fastify.get("/events/:id", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensurePlanningEnabled(fastify, request.tenant!.id);
    const params = paramsSchema.parse(request.params);
    return reply.send(success(await getTenantEvent(fastify, request.tenant!.id, params.id)));
  });

  fastify.patch("/events/:id", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensurePlanningEnabled(fastify, request.tenant!.id);
    const params = paramsSchema.parse(request.params);
    const body = eventSchema.partial().parse(request.body);
    const event = await updateTenantEvent(fastify, request.tenant!.id, params.id, body);
    return reply.send(success(event));
  });

  fastify.delete("/events/:id", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensurePlanningEnabled(fastify, request.tenant!.id);
    const params = paramsSchema.parse(request.params);
    await deleteTenantEvent(fastify, request.tenant!.id, params.id);
    return reply.send(success({ deleted: true }));
  });

  fastify.post("/events/:id/attend", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensurePlanningEnabled(fastify, request.tenant!.id);
    const params = paramsSchema.parse(request.params);
    const body = eventAttendanceSchema.parse(request.body);
    const result = await attendTenantEvent(fastify, request.tenant!.id, params.id, request.authUser!.userId, body.status);
    return reply.send(success(result));
  });
}
