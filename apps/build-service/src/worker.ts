import { getBuildServiceEnv } from "./config/index.js";
import { createBuildWorker } from "./services/queue.service.js";

/**
 * Lance le worker BullMQ.
 */
async function startWorker() {
  const env = getBuildServiceEnv();
  const worker = createBuildWorker(env);
  await worker.waitUntilReady();
}

void startWorker();
