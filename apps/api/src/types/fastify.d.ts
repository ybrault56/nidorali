import type { SupabaseClient } from "@supabase/supabase-js";
import type { TenantBundle } from "@nidorali/types";
import type { FastifyReply } from "fastify";
import type { FastifyRequest } from "fastify";

import type { ApiEnv } from "../shared/env.js";
import type { DataRepository } from "../shared/repository.js";

type FastifyAuthHandler = (request: FastifyRequest, reply: FastifyReply) => Promise<void>;

declare module "fastify" {
  interface FastifyInstance {
    authenticateAdmin: FastifyAuthHandler;
    authenticateAppUser: FastifyAuthHandler;
    dataRepository: DataRepository;
    env: ApiEnv;
    resolveTenant: FastifyAuthHandler;
    stripe: unknown;
    supabase: SupabaseClient;
  }

  interface FastifyRequest {
    adminUser?: {
      email: string;
      id: string;
      role: "super_admin";
    };
    authUser?: {
      email: string;
      role: string;
      tenantId: string;
      userId: string;
    };
    tenant?: TenantBundle;
  }
}

export {};
