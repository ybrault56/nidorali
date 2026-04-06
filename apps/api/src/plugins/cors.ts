import cors from "@fastify/cors";
import fp from "fastify-plugin";

/**
 * Active CORS à partir de la liste d'origines autorisées.
 */
export const corsPlugin = fp(async (fastify) => {
  const allowList = fastify.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim());

  await fastify.register(cors, {
    credentials: true,
    origin(origin, callback) {
      if (!origin || allowList.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed"), false);
    },
  });
});
