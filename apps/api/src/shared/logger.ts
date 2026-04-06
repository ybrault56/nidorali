import type { ApiEnv } from "./env.js";

/**
 * Crée la configuration Pino adaptée à l'environnement.
 *
 * @param env - Environnement validé
 * @returns Configuration logger Fastify
 */
export function createLoggerOptions(env: ApiEnv) {
  return {
    level: env.LOG_LEVEL,
  };
}
