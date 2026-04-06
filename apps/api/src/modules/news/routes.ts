import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { assertTenantAdmin } from "../../shared/authorization.js";
import { success } from "../../shared/response.js";
import { newsSchema } from "./schema.js";
import {
  createTenantNews,
  deleteTenantNews,
  ensureNewsEnabled,
  getTenantNewsPost,
  listTenantNews,
  updateTenantNews,
} from "./service.js";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Enregistre les routes du module actualités.
 *
 * @param fastify - Instance Fastify
 */
export async function registerNewsRoutes(fastify: FastifyInstance) {
  const protectedHandlers = [fastify.resolveTenant, fastify.authenticateAppUser];

  fastify.get("/news", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensureNewsEnabled(fastify, request.tenant!.id);
    return reply.send(success(await listTenantNews(fastify, request.tenant!.id)));
  });

  fastify.post("/news", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensureNewsEnabled(fastify, request.tenant!.id);
    assertTenantAdmin(request.authUser!.role);
    const body = newsSchema.parse(request.body);
    const article = await createTenantNews(fastify, request.tenant!.id, {
      ...body,
      author_id: request.authUser!.userId,
    });
    return reply.status(201).send(success(article));
  });

  fastify.get("/news/:id", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensureNewsEnabled(fastify, request.tenant!.id);
    const params = paramsSchema.parse(request.params);
    return reply.send(success(await getTenantNewsPost(fastify, request.tenant!.id, params.id)));
  });

  fastify.patch("/news/:id", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensureNewsEnabled(fastify, request.tenant!.id);
    assertTenantAdmin(request.authUser!.role);
    const params = paramsSchema.parse(request.params);
    const body = newsSchema.partial().parse(request.body);
    return reply.send(success(await updateTenantNews(fastify, request.tenant!.id, params.id, body)));
  });

  fastify.delete("/news/:id", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensureNewsEnabled(fastify, request.tenant!.id);
    assertTenantAdmin(request.authUser!.role);
    const params = paramsSchema.parse(request.params);
    await deleteTenantNews(fastify, request.tenant!.id, params.id);
    return reply.send(success({ deleted: true }));
  });
}
