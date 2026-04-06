import { createValidatedEnv } from "@nidorali/config";
import { z } from "zod";

const booleanFromEnv = z
  .enum(["true", "false"])
  .optional()
  .transform((value) => value === "true");

export const buildServiceEnvSchema = z.object({
  BUILD_SERVICE_SIMULATION_MODE: booleanFromEnv,
  BUILD_SERVICE_SECRET: z.string().min(1),
  EAS_TOKEN: z.string().min(1),
  EXPO_PROJECT_ID: z.string().min(1),
  MOBILE_APP_PATH: z.string().min(1),
  NIDORALI_API_URL: z.string().url().default("http://localhost:3001"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3002),
  REDIS_URL: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  SIMULATION_BUILD_DELAY_MS: z.coerce.number().int().positive().default(1200),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_URL: z.string().url(),
});

export type BuildServiceEnv = z.infer<typeof buildServiceEnvSchema>;

/**
 * Charge et valide l'environnement du build-service.
 */
export function getBuildServiceEnv(source?: Record<string, string | undefined>) {
  return createValidatedEnv(buildServiceEnvSchema, source);
}
