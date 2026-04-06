import { createValidatedEnv } from "@nidorali/config";
import { z } from "zod";

const booleanFromEnv = z
  .enum(["true", "false"])
  .optional()
  .transform((value) => value === "true");

export const apiEnvSchema = z.object({
  ALLOWED_ORIGINS: z.string().default("http://localhost:3000,http://localhost:8081"),
  BUILD_SERVICE_SECRET: z.string().min(1),
  BUILD_SERVICE_URL: z.string().url(),
  JWT_EXPIRES_IN: z.string().default("7d"),
  JWT_SECRET: z.string().min(8),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  NIDORALI_ADMIN_BEARER_TOKEN: z.string().default("nidorali-local-admin"),
  NIDORALI_SIMULATION_MODE: booleanFromEnv,
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  RESEND_API_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_URL: z.string().url(),
});

export type ApiEnv = z.infer<typeof apiEnvSchema>;

/**
 * Charge et valide l'environnement de l'API.
 *
 * @param source - Source d'environnement à valider
 * @returns Configuration API validée
 */
export function getApiEnv(source?: Record<string, string | undefined>): ApiEnv {
  return createValidatedEnv(apiEnvSchema, source);
}
