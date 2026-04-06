import type { FastifyInstance } from "fastify";
import type Stripe from "stripe";

import { success } from "../../shared/response.js";
import { handleStripeEvent } from "./service.js";

/**
 * Enregistre le webhook Stripe.
 *
 * @param fastify - Instance Fastify
 */
export async function registerStripeRoutes(fastify: FastifyInstance) {
  fastify.post("/webhooks/stripe", async (request, reply) => {
    const stripe = fastify.stripe as Stripe;
    const signature = request.headers["stripe-signature"];
    const rawBody = typeof request.body === "string" ? request.body : JSON.stringify(request.body);
    const event = stripe.webhooks.constructEvent(rawBody, String(signature), fastify.env.STRIPE_WEBHOOK_SECRET);
    const result = await handleStripeEvent(fastify, event);
    return reply.send(success(result));
  });
}
