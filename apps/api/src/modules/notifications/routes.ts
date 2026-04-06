import type { FastifyInstance } from "fastify";

import { success } from "../../shared/response.js";
import { notificationSchema } from "./schema.js";
import { sendTenantNotification } from "./service.js";

/**
 * Enregistre les routes du module notifications.
 *
 * @param fastify - Instance Fastify
 */
export async function registerNotificationsRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/notifications/send",
    { preHandler: [fastify.resolveTenant, fastify.authenticateAppUser] },
    async (request, reply) => {
      const body = notificationSchema.parse(request.body);
      const result = await sendTenantNotification(
        fastify,
        request.tenant!.id,
        request.authUser!.userId,
        request.authUser!.role,
        body,
      );
      return reply.send(success(result));
    },
  );
}
