import Fastify, { type FastifyInstance } from "fastify";
import type { SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";

import { registerAuthRoutes } from "./modules/auth/routes.js";
import { registerBillingRoutes } from "./modules/billing/routes.js";
import { registerConfigRoutes } from "./modules/config/routes.js";
import { registerDocumentsRoutes } from "./modules/documents/routes.js";
import { registerFormsRoutes } from "./modules/forms/routes.js";
import { registerMembersRoutes } from "./modules/members/routes.js";
import { registerMessagingRoutes } from "./modules/messaging/routes.js";
import { registerNewsRoutes } from "./modules/news/routes.js";
import { registerNotificationsRoutes } from "./modules/notifications/routes.js";
import { registerPlanningRoutes } from "./modules/planning/routes.js";
import { registerStripeRoutes } from "./modules/stripe/routes.js";
import { registerTenantRoutes } from "./modules/tenants/routes.js";
import { authPlugin } from "./plugins/auth.js";
import { corsPlugin } from "./plugins/cors.js";
import { rateLimitPlugin } from "./plugins/rate-limit.js";
import { supabasePlugin } from "./plugins/supabase.js";
import { getApiEnv, type ApiEnv } from "./shared/env.js";
import { AppError } from "./shared/errors.js";
import { createLoggerOptions } from "./shared/logger.js";
import { failure } from "./shared/response.js";
import { createInMemoryRepository, createSupabaseRepository, type DataRepository } from "./shared/repository.js";
import { createSimulationSeed } from "./shared/simulation.js";

export interface AppDependencies {
  env: ApiEnv;
  repository: DataRepository;
  stripe: Stripe;
  supabase: SupabaseClient;
}

/**
 * Crée un client Stripe simulé pour les tests manuels locaux.
 *
 * @returns Implémentation minimale compatible avec les routes Stripe
 */
function createSimulationStripeClient() {
  return {
    checkout: {
      sessions: {
        create: async () => ({
          id: `cs_sim_${crypto.randomUUID()}`,
          url: "http://localhost:3000/success?mode=simulation",
        }),
      },
    },
    webhooks: {
      constructEvent: (rawBody: string) => JSON.parse(rawBody) as unknown,
    },
  } as unknown as Stripe;
}

/**
 * Construit l'instance Fastify de l'API Nidorali.
 *
 * @param overrides - Dépendances injectées pour les tests
 * @returns Application Fastify prête à démarrer
 */
export async function createApp(overrides: Partial<AppDependencies> = {}): Promise<FastifyInstance> {
  const env = overrides.env ?? getApiEnv();
  const simulationMode = env.NIDORALI_SIMULATION_MODE;
  const app = Fastify({
    bodyLimit: 2_000_000,
    logger: createLoggerOptions(env),
  });

  app.decorate("env", env);

  await app.register(supabasePlugin, {
    client: overrides.supabase,
  });

  app.decorate(
    "dataRepository",
    overrides.repository ??
      (simulationMode ? createInMemoryRepository(createSimulationSeed()) : createSupabaseRepository(env, overrides.supabase)),
  );
  app.decorate(
    "stripe",
    overrides.stripe ??
      (simulationMode
        ? createSimulationStripeClient()
        : new Stripe(env.STRIPE_SECRET_KEY, {
            apiVersion: "2025-08-27.basil",
          })),
  );

  await app.register(corsPlugin);
  await app.register(rateLimitPlugin);
  await app.register(authPlugin);

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send(failure(error.code, error.message, error.details));
    }

    const details = error instanceof Error ? error.message : error;
    return reply.status(500).send(failure("internal_error", "Une erreur interne est survenue.", details));
  });

  app.get("/health", async () => ({ ok: true }));

  await app.register(
    async (api) => {
      await registerConfigRoutes(api);
      await registerAuthRoutes(api);
      await registerMembersRoutes(api);
      await registerMessagingRoutes(api);
      await registerPlanningRoutes(api);
      await registerNotificationsRoutes(api);
      await registerNewsRoutes(api);
      await registerDocumentsRoutes(api);
      await registerFormsRoutes(api);
      await registerTenantRoutes(api);
      await registerBillingRoutes(api);
      await registerStripeRoutes(api);
    },
    { prefix: "/api" },
  );

  return app;
}
