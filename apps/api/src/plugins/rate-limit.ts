import rateLimit from "@fastify/rate-limit";
import fp from "fastify-plugin";

/**
 * Protège les endpoints publics contre les rafales triviales.
 */
export const rateLimitPlugin = fp(async (fastify) => {
  await fastify.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: "1 minute",
  });
});
