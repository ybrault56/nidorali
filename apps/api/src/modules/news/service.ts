import type { FastifyInstance } from "fastify";

import { assertModuleEnabled } from "../../shared/modules.js";

/**
 * Vérifie l'activation du module actualités.
 */
export async function ensureNewsEnabled(fastify: FastifyInstance, tenantId: string) {
  const tenant = await fastify.dataRepository.getTenantById(tenantId);
  if (tenant) {
    assertModuleEnabled(tenant, "module_news");
  }
}

export function listTenantNews(fastify: FastifyInstance, tenantId: string) {
  return fastify.dataRepository.listNews(tenantId);
}

export function getTenantNewsPost(fastify: FastifyInstance, tenantId: string, newsId: string) {
  return fastify.dataRepository.getNews(tenantId, newsId);
}

export function createTenantNews(
  fastify: FastifyInstance,
  tenantId: string,
  input: {
    author_id: string;
    content: string;
    cover_url?: string | null;
    is_published?: boolean;
    published_at?: string | null;
    title: string;
  },
) {
  return fastify.dataRepository.createNews(tenantId, input);
}

export function updateTenantNews(
  fastify: FastifyInstance,
  tenantId: string,
  newsId: string,
  patch: {
    content?: string;
    cover_url?: string | null;
    is_published?: boolean;
    published_at?: string | null;
    title?: string;
  },
) {
  return fastify.dataRepository.updateNews(tenantId, newsId, patch);
}

export function deleteTenantNews(fastify: FastifyInstance, tenantId: string, newsId: string) {
  return fastify.dataRepository.deleteNews(tenantId, newsId);
}
