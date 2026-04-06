import jwt from "@fastify/jwt";
import fp from "fastify-plugin";

import { AppError } from "../shared/errors.js";

/**
 * Installe les mécanismes d'authentification admin et mobile.
 */
export const authPlugin = fp(async (fastify) => {
  await fastify.register(jwt, {
    secret: fastify.env.JWT_SECRET,
  });

  fastify.decorate("authenticateAdmin", async (request) => {
    const authorization = request.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
      throw new AppError({
        code: "admin_unauthorized",
        message: "Jeton administrateur manquant.",
        statusCode: 401,
      });
    }

    const token = authorization.replace("Bearer ", "");
    if (fastify.env.NIDORALI_SIMULATION_MODE && token === fastify.env.NIDORALI_ADMIN_BEARER_TOKEN) {
      request.adminUser = {
        email: "simulation@nidorali.local",
        id: "simulation-admin",
        role: "super_admin",
      };
      return;
    }

    const result = await fastify.supabase.auth.getUser(token);
    if (result.error || !result.data.user) {
      throw new AppError({
        code: "admin_invalid_token",
        details: result.error?.message,
        message: "Session administrateur invalide.",
        statusCode: 401,
      });
    }

    const role = result.data.user.app_metadata?.role;
    if (role !== "super_admin") {
      throw new AppError({
        code: "admin_forbidden",
        message: "Le rôle super_admin est requis.",
        statusCode: 403,
      });
    }

    request.adminUser = {
      email: result.data.user.email ?? "",
      id: result.data.user.id,
      role: "super_admin",
    };
  });

  fastify.decorate("authenticateAppUser", async (request) => {
    try {
      const payload = await request.jwtVerify<{ email: string; role: string; tenantId: string; userId: string }>();
      if (request.tenant && payload.tenantId !== request.tenant.id) {
        throw new AppError({
          code: "tenant_token_mismatch",
          message: "Le jeton ne correspond pas au tenant courant.",
          statusCode: 403,
        });
      }

      request.authUser = {
        email: payload.email,
        role: payload.role,
        tenantId: payload.tenantId,
        userId: payload.userId,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError({
        code: "auth_invalid_token",
        details: error,
        message: "Session mobile invalide.",
        statusCode: 401,
      });
    }
  });

  fastify.decorate("resolveTenant", async (request) => {
    const tenantIdentifier = request.headers["x-tenant-id"];
    if (typeof tenantIdentifier !== "string" || tenantIdentifier.length === 0) {
      throw new AppError({
        code: "tenant_missing",
        message: "Header X-Tenant-ID requis.",
        statusCode: 401,
      });
    }

    const tenant = await fastify.dataRepository.getTenantByIdentifier(tenantIdentifier);
    if (!tenant) {
      throw new AppError({
        code: "tenant_not_found",
        message: "Tenant introuvable.",
        statusCode: 404,
      });
    }

    if (tenant.status !== "live" && tenant.status !== "building") {
      throw new AppError({
        code: "tenant_inactive",
        message: "Tenant suspendu ou indisponible.",
        statusCode: 403,
      });
    }

    request.tenant = tenant;
  });
});
