import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import fp from "fastify-plugin";

/**
 * Crée un client Supabase simulé pour les tests manuels locaux.
 *
 * @returns Client minimal couvrant auth admin et storage
 */
function createSimulationSupabaseClient() {
  return {
    auth: {
      getUser: async () => ({
        data: { user: null },
        error: { message: "simulation mode" },
      }),
    },
    storage: {
      from: (bucket: string) => ({
        createSignedUploadUrl: async (objectPath: string) => ({
          data: {
            path: objectPath,
            signedUrl: `http://localhost:3001/simulation/storage/${bucket}/${objectPath}`,
            token: "simulation-upload-token",
          },
          error: null,
        }),
        getPublicUrl: (objectPath: string) => ({
          data: {
            publicUrl: `http://localhost:3001/simulation/storage/${bucket}/${objectPath}`,
          },
        }),
      }),
    },
  } as unknown as SupabaseClient;
}

/**
 * Installe le client Supabase administrateur sur Fastify.
 */
export const supabasePlugin = fp<{ client?: SupabaseClient }>(async (fastify, options) => {
  const client =
    options.client ??
    (fastify.env.NIDORALI_SIMULATION_MODE
      ? createSimulationSupabaseClient()
      : createClient(fastify.env.SUPABASE_URL, fastify.env.SUPABASE_SERVICE_ROLE_KEY, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }));

  fastify.decorate("supabase", client);
});
