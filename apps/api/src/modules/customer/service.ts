import bcrypt from "bcryptjs";
import type { CustomerAccount, CustomerSession } from "@nidorali/types";
import type { FastifyInstance } from "fastify";

import { AppError } from "../../shared/errors.js";

/**
 * Nettoie le compte client avant exposition publique.
 *
 * @param account - Compte persistant
 * @returns Compte public sans secret
 */
function sanitizeCustomerAccount(account: CustomerAccount): CustomerAccount {
  return {
    ...account,
    password_hash: undefined,
  };
}

/**
 * Signe un jeton client exploitable par le portail de suivi.
 *
 * @param fastify - Instance Fastify
 * @param account - Compte client authentifié
 * @returns Session client sérialisable
 */
async function buildCustomerSession(fastify: FastifyInstance, account: CustomerAccount): Promise<CustomerSession> {
  const accessToken = await fastify.jwt.sign(
    {
      accountId: account.id,
      email: account.email,
      scope: "customer",
    },
    {
      expiresIn: fastify.env.JWT_EXPIRES_IN,
    },
  );

  return {
    account: sanitizeCustomerAccount(account),
    token: {
      accessToken,
      expiresIn: fastify.env.JWT_EXPIRES_IN,
    },
  };
}

/**
 * Crée un nouveau compte client pour le portail commande.
 *
 * @param fastify - Instance Fastify
 * @param input - Email, nom affiché et mot de passe
 * @returns Session client prête à l'emploi
 */
export async function registerCustomerAccount(
  fastify: FastifyInstance,
  input: { display_name?: string; email: string; password: string },
) {
  const existingAccount = await fastify.dataRepository.getCustomerAccountByEmail(input.email);
  if (existingAccount) {
    throw new AppError({
      code: "customer_email_exists",
      message: "Un compte client existe déjà avec cet email.",
      statusCode: 409,
    });
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const account = await fastify.dataRepository.createCustomerAccount({
    display_name: input.display_name,
    email: input.email,
    password_hash: passwordHash,
  });

  return buildCustomerSession(fastify, account);
}

/**
 * Connecte un compte client existant.
 *
 * @param fastify - Instance Fastify
 * @param input - Email et mot de passe
 * @returns Session client prête à l'emploi
 */
export async function loginCustomerAccount(
  fastify: FastifyInstance,
  input: { email: string; password: string },
) {
  const account = await fastify.dataRepository.getCustomerAccountByEmail(input.email);
  if (!account?.password_hash) {
    throw new AppError({
      code: "customer_invalid_credentials",
      message: "Identifiants invalides.",
      statusCode: 401,
    });
  }

  const isValidPassword = await bcrypt.compare(input.password, account.password_hash);
  if (!isValidPassword) {
    throw new AppError({
      code: "customer_invalid_credentials",
      message: "Identifiants invalides.",
      statusCode: 401,
    });
  }

  return buildCustomerSession(fastify, sanitizeCustomerAccount(account));
}

/**
 * Liste les commandes visibles par le compte client courant.
 *
 * @param fastify - Instance Fastify
 * @param accountId - Identifiant du compte client
 * @returns Commandes enrichies avec leur dernier build
 */
export function listCustomerOrders(fastify: FastifyInstance, accountId: string) {
  return fastify.dataRepository.listCustomerOrders(accountId);
}
