import type { FastifyInstance } from "fastify";

import { success } from "../../shared/response.js";
import { getCurrentMember, listTenantMembers, updateCurrentMember } from "./service.js";
import { updateMeSchema } from "./schema.js";

/**
 * Enregistre les routes du module membres.
 *
 * @param fastify - Instance Fastify
 */
export async function registerMembersRoutes(fastify: FastifyInstance) {
  const protectedHandlers = [fastify.resolveTenant, fastify.authenticateAppUser];

  fastify.get("/members", { preHandler: protectedHandlers }, async (request, reply) => {
    const members = await listTenantMembers(fastify, request.tenant!.id);
    return reply.send(success(members));
  });

  fastify.get("/members/me", { preHandler: protectedHandlers }, async (request, reply) => {
    const member = await getCurrentMember(fastify, request.tenant!.id, request.authUser!.userId);
    return reply.send(success(member));
  });

  fastify.patch("/members/me", { preHandler: protectedHandlers }, async (request, reply) => {
    const body = updateMeSchema.parse(request.body);
    const member = await updateCurrentMember(fastify, request.tenant!.id, request.authUser!.userId, body);
    return reply.send(success(member));
  });
}
