import type { FastifyInstance } from "fastify";

import { assertModuleEnabled } from "../../shared/modules.js";

/**
 * Liste les conversations accessibles au membre courant.
 */
export async function listTenantConversations(fastify: FastifyInstance, tenantId: string, userId: string) {
  return fastify.dataRepository.listConversations(tenantId, userId);
}

/**
 * Crée une conversation sur le tenant courant.
 */
export async function createTenantConversation(
  fastify: FastifyInstance,
  tenantId: string,
  input: { created_by: string; member_ids: string[]; title?: string | null; type?: "direct" | "group" | "broadcast" },
) {
  return fastify.dataRepository.createConversation(tenantId, input);
}

/**
 * Retourne les messages d'une conversation.
 */
export async function listConversationMessages(fastify: FastifyInstance, tenantId: string, conversationId: string) {
  return fastify.dataRepository.listMessages(tenantId, conversationId);
}

/**
 * Ajoute un message à une conversation.
 */
export async function createConversationMessage(
  fastify: FastifyInstance,
  tenantId: string,
  conversationId: string,
  input: { content: string; media_url?: string | null; sender_id: string; type?: "text" | "image" | "file" },
) {
  return fastify.dataRepository.createMessage(tenantId, conversationId, input);
}

/**
 * Valide que la messagerie est active.
 */
export function ensureMessagingEnabled(fastify: FastifyInstance, tenantId: string) {
  return fastify.dataRepository.getTenantById(tenantId).then((tenant) => {
    if (!tenant) {
      return;
    }

    assertModuleEnabled(tenant, "module_messaging");
  });
}
