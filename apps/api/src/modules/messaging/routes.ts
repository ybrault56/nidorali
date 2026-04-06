import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { success } from "../../shared/response.js";
import { createConversationSchema, createMessageSchema } from "./schema.js";
import {
  createConversationMessage,
  createTenantConversation,
  ensureMessagingEnabled,
  listConversationMessages,
  listTenantConversations,
} from "./service.js";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Enregistre les routes du module messagerie.
 *
 * @param fastify - Instance Fastify
 */
export async function registerMessagingRoutes(fastify: FastifyInstance) {
  const protectedHandlers = [fastify.resolveTenant, fastify.authenticateAppUser];

  fastify.get("/conversations", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensureMessagingEnabled(fastify, request.tenant!.id);
    const conversations = await listTenantConversations(fastify, request.tenant!.id, request.authUser!.userId);
    return reply.send(success(conversations));
  });

  fastify.post("/conversations", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensureMessagingEnabled(fastify, request.tenant!.id);
    const body = createConversationSchema.parse(request.body);
    const conversation = await createTenantConversation(fastify, request.tenant!.id, {
      created_by: request.authUser!.userId,
      member_ids: Array.from(new Set([request.authUser!.userId, ...body.member_ids])),
      title: body.title,
      type: body.type,
    });
    return reply.status(201).send(success(conversation));
  });

  fastify.get("/conversations/:id/messages", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensureMessagingEnabled(fastify, request.tenant!.id);
    const params = paramsSchema.parse(request.params);
    const messages = await listConversationMessages(fastify, request.tenant!.id, params.id);
    return reply.send(success(messages));
  });

  fastify.post("/conversations/:id/messages", { preHandler: protectedHandlers }, async (request, reply) => {
    await ensureMessagingEnabled(fastify, request.tenant!.id);
    const params = paramsSchema.parse(request.params);
    const body = createMessageSchema.parse(request.body);
    const message = await createConversationMessage(fastify, request.tenant!.id, params.id, {
      content: body.content,
      media_url: body.media_url,
      sender_id: request.authUser!.userId,
      type: body.type,
    });
    return reply.status(201).send(success(message));
  });
}
