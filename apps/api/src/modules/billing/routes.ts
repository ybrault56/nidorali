import type { FastifyInstance } from "fastify";

import { success } from "../../shared/response.js";
import { checkoutSchema } from "./schema.js";
import { createCheckoutSession } from "./service.js";

/**
 * Enregistre la route de création de session Checkout.
 *
 * @param fastify - Instance Fastify
 */
export async function registerBillingRoutes(fastify: FastifyInstance) {
  fastify.post("/billing/checkout-session", { preHandler: [fastify.authenticateCustomer] }, async (request, reply) => {
    const body = checkoutSchema.parse(request.body);
    const origin =
      typeof request.headers.origin === "string" && request.headers.origin.length > 0
        ? request.headers.origin
        : "http://localhost:3000";

    return reply.send(success(await createCheckoutSession(fastify, origin, body, request.customerUser!.accountId)));
  });
}
