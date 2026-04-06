import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { success } from "../../shared/response.js";
import { documentSchema } from "./schema.js";
import { createTenantDocument, deleteTenantDocument, ensureDocumentsEnabled, listTenantDocuments } from "./service.js";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Enregistre les routes du module documents.
 *
 * @param fastify - Instance Fastify
 */
export async function registerDocumentsRoutes(fastify: FastifyInstance) {
  const protectedHandlers = [fastify.resolveTenant, fastify.authenticateAppUser];

  fastify.get("/documents", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensureDocumentsEnabled(fastify, request.tenant!.id);
    return reply.send(success(await listTenantDocuments(fastify, request.tenant!.id)));
  });

  fastify.post("/documents", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensureDocumentsEnabled(fastify, request.tenant!.id);
    const body = documentSchema.parse(request.body);
    const document = await createTenantDocument(fastify, request.tenant!.id, {
      ...body,
      uploaded_by: request.authUser!.userId,
    });
    return reply.status(201).send(success(document));
  });

  fastify.delete("/documents/:id", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensureDocumentsEnabled(fastify, request.tenant!.id);
    const params = paramsSchema.parse(request.params);
    await deleteTenantDocument(fastify, request.tenant!.id, params.id);
    return reply.send(success({ deleted: true }));
  });
}
