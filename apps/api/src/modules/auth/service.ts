import bcrypt from "bcryptjs";
import type { FastifyInstance } from "fastify";

import { AppError } from "../../shared/errors.js";
import { sanitizeAppUser } from "../../shared/users.js";

/**
 * Inscrit un nouvel utilisateur final sur le tenant courant.
 *
 * @param fastify - Instance Fastify
 * @param tenantId - Identifiant du tenant
 * @param input - Payload d'inscription
 * @returns Profil public et jeton JWT
 */
export async function registerTenantUser(
  fastify: FastifyInstance,
  tenantId: string,
  input: { display_name?: string; email: string; password: string },
) {
  const existingUser = await fastify.dataRepository.getUserByEmail(tenantId, input.email);
  if (existingUser) {
    throw new AppError({
      code: "auth_email_exists",
      message: "Un compte existe déjà avec cet email.",
      statusCode: 409,
    });
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await fastify.dataRepository.registerUser(tenantId, {
    display_name: input.display_name,
    email: input.email,
    password_hash: passwordHash,
  });

  const accessToken = await fastify.jwt.sign(
    {
      email: user.email,
      role: user.role,
      tenantId,
      userId: user.id,
    },
    {
      expiresIn: fastify.env.JWT_EXPIRES_IN,
    },
  );

  return {
    token: {
      accessToken,
      expiresIn: fastify.env.JWT_EXPIRES_IN,
    },
    user: sanitizeAppUser(user),
  };
}

/**
 * Connecte un utilisateur final existant.
 *
 * @param fastify - Instance Fastify
 * @param tenantId - Identifiant du tenant
 * @param input - Email et mot de passe
 * @returns Profil public et jeton JWT
 */
export async function loginTenantUser(
  fastify: FastifyInstance,
  tenantId: string,
  input: { email: string; password: string },
) {
  const user = await fastify.dataRepository.getUserByEmail(tenantId, input.email);
  if (!user?.password_hash) {
    throw new AppError({
      code: "auth_invalid_credentials",
      message: "Identifiants invalides.",
      statusCode: 401,
    });
  }

  const isValidPassword = await bcrypt.compare(input.password, user.password_hash);
  if (!isValidPassword) {
    throw new AppError({
      code: "auth_invalid_credentials",
      message: "Identifiants invalides.",
      statusCode: 401,
    });
  }

  const accessToken = await fastify.jwt.sign(
    {
      email: user.email,
      role: user.role,
      tenantId,
      userId: user.id,
    },
    {
      expiresIn: fastify.env.JWT_EXPIRES_IN,
    },
  );

  return {
    token: {
      accessToken,
      expiresIn: fastify.env.JWT_EXPIRES_IN,
    },
    user: sanitizeAppUser(user),
  };
}

/**
 * Enregistre le push token Expo du membre connecté.
 *
 * @param fastify - Instance Fastify
 * @param tenantId - Identifiant du tenant
 * @param userId - Identifiant du membre
 * @param pushToken - Token Expo
 * @returns Utilisateur mis à jour
 */
export async function savePushToken(
  fastify: FastifyInstance,
  tenantId: string,
  userId: string,
  pushToken: string,
) {
  const user = await fastify.dataRepository.updateUserPushToken(tenantId, userId, pushToken);
  return sanitizeAppUser(user);
}
