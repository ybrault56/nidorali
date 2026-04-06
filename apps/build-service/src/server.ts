import Fastify from "fastify";

import { getBuildServiceEnv } from "./config/index.js";
import { createBuildQueue } from "./services/queue.service.js";

const env = getBuildServiceEnv();
const app = Fastify({ logger: true });
const queue = createBuildQueue(env);

app.post("/internal/builds", async (request, reply) => {
  if (request.headers["x-build-service-secret"] !== env.BUILD_SERVICE_SECRET) {
    return reply.status(401).send({ success: false });
  }

  const payload = request.body as { build_job_id: string; platform?: "android" | "ios" | "both"; source?: string; tenant_id: string };
  await queue.add("tenant-build", payload);
  return reply.send({ success: true, data: payload });
});

app.get("/health", async () => ({ ok: true }));

/**
 * Démarre l'API interne du build-service.
 */
async function startServer() {
  await app.listen({ host: "0.0.0.0", port: env.PORT });
}

void startServer();
