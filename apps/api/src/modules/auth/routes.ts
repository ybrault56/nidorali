import type { FastifyInstance } from "fastify";

import { success } from "../../shared/response.js";
import { loginSchema, pushTokenSchema, registerSchema } from "./schema.js";
import { loginTenantUser, registerTenantUser, savePushToken } from "./service.js";

/**
 * Enregistre les routes d'authentification mobile.
 *
 * @param fastify - Instance Fastify
 */
export async function registerAuthRoutes(fastify: FastifyInstance) {
  fastify.post("/auth/register", { preHandler: [fastify.resolveTenant] }, async (request, reply) => {
    const body = registerSchema.parse(request.body);
    const result = await registerTenantUser(fastify, request.tenant!.id, body);
    return reply.status(201).send(success(result));
  });

  fastify.post("/auth/login", { preHandler: [fastify.resolveTenant] }, async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const result = await loginTenantUser(fastify, request.tenant!.id, body);
    return reply.send(success(result));
  });

  fastify.post("/auth/logout", async (_request, reply) => {
    return reply.send(success({ loggedOut: true }));
  });

  fastify.post(
    "/auth/push-token",
    { preHandler: [fastify.resolveTenant, fastify.authenticateAppUser] },
    async (request, reply) => {
      const body = pushTokenSchema.parse(request.body);
      const result = await savePushToken(fastify, request.tenant!.id, request.authUser!.userId, body.push_token);
      return reply.send(success(result));
    },
  );
}
