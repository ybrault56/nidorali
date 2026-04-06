import { Queue, Worker } from "bullmq";

import type { BuildServiceEnv } from "../config/index.js";
import { runBuildJob } from "../jobs/build.job.js";

export interface BuildQueuePayload {
  build_job_id: string;
  platform?: "android" | "ios" | "both";
  source?: string;
  tenant_id: string;
}

export interface BuildQueueHandle {
  add: (name: "tenant-build", payload: BuildQueuePayload) => Promise<unknown>;
}

export interface BuildWorkerHandle {
  waitUntilReady: () => Promise<unknown>;
}

function getRedisConnection(env: BuildServiceEnv) {
  const redisUrl = new URL(env.REDIS_URL);

  return {
    db: redisUrl.pathname.length > 1 ? Number(redisUrl.pathname.slice(1)) : 0,
    host: redisUrl.hostname,
    maxRetriesPerRequest: null,
    password: redisUrl.password || undefined,
    port: Number(redisUrl.port || 6379),
    username: redisUrl.username || undefined,
  };
}

/**
 * Suspend l'exécution pendant un délai donné.
 *
 * @param delayMs - Délai en millisecondes
 * @returns Promise résolue après temporisation
 */
function wait(delayMs: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

/**
 * Pousse une mise à jour de build vers l'API simulée.
 *
 * @param env - Environnement du build-service
 * @param payload - Build ciblé
 * @param patch - Mise à jour à appliquer
 */
async function postSimulationBuildUpdate(
  env: BuildServiceEnv,
  payload: BuildQueuePayload,
  patch: {
    android_artifact_url?: string | null;
    app_store_url?: string | null;
    completed_at?: string | null;
    eas_build_id_android?: string | null;
    eas_build_id_ios?: string | null;
    error_message?: string | null;
    ios_artifact_url?: string | null;
    play_store_url?: string | null;
    started_at?: string | null;
    status: "queued" | "processing" | "building" | "submitting" | "done" | "failed";
  },
) {
  const response = await fetch(`${env.NIDORALI_API_URL}/api/internal/simulation/build-jobs/${payload.build_job_id}`, {
    body: JSON.stringify({
      ...patch,
      tenant_id: payload.tenant_id,
    }),
    headers: {
      "content-type": "application/json",
      "x-build-service-secret": env.BUILD_SERVICE_SECRET,
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Simulation build update failed with status ${response.status}.`);
  }
}

/**
 * Simule le cycle de vie complet d'un build local.
 *
 * @param env - Environnement du build-service
 * @param payload - Demande de build à rejouer
 */
async function runSimulationBuild(env: BuildServiceEnv, payload: BuildQueuePayload) {
  const now = new Date().toISOString();

  await postSimulationBuildUpdate(env, payload, {
    started_at: now,
    status: "processing",
  });
  await wait(env.SIMULATION_BUILD_DELAY_MS);

  await postSimulationBuildUpdate(env, payload, {
    started_at: now,
    status: "building",
  });
  await wait(env.SIMULATION_BUILD_DELAY_MS);

  await postSimulationBuildUpdate(env, payload, {
    started_at: now,
    status: "submitting",
  });
  await wait(env.SIMULATION_BUILD_DELAY_MS);

  await postSimulationBuildUpdate(env, payload, {
    android_artifact_url: `https://local.nidorali.test/artifacts/${payload.tenant_id}-android.apk`,
    app_store_url: `https://local.nidorali.test/stores/${payload.tenant_id}-ios`,
    completed_at: new Date().toISOString(),
    eas_build_id_android: `sim-android-${payload.build_job_id}`,
    eas_build_id_ios: `sim-ios-${payload.build_job_id}`,
    ios_artifact_url: `https://local.nidorali.test/artifacts/${payload.tenant_id}-ios.ipa`,
    play_store_url: `https://local.nidorali.test/stores/${payload.tenant_id}-android`,
    started_at: now,
    status: "done",
  });
}

/**
 * Crée la queue BullMQ du service.
 */
export function createBuildQueue(env: BuildServiceEnv): BuildQueueHandle {
  if (env.BUILD_SERVICE_SIMULATION_MODE) {
    return {
      add: async (_name, payload) => {
        void runSimulationBuild(env, payload);
      },
    };
  }

  return new Queue<BuildQueuePayload, void, "tenant-build">("nidorali-builds", {
    connection: getRedisConnection(env),
  });
}

/**
 * Crée un worker BullMQ branché sur le pipeline.
 */
export function createBuildWorker(env: BuildServiceEnv): BuildWorkerHandle {
  if (env.BUILD_SERVICE_SIMULATION_MODE) {
    return {
      waitUntilReady: async () => undefined,
    };
  }

  return new Worker<BuildQueuePayload, void, "tenant-build">(
    "nidorali-builds",
    async (job) => {
      await runBuildJob(env, job.data);
    },
    { connection: getRedisConnection(env) },
  );
}
