import type { FastifyInstance } from "fastify";

import { assertModuleEnabled } from "../../shared/modules.js";

/**
 * Vérifie l'activation du module documents.
 */
export async function ensureDocumentsEnabled(fastify: FastifyInstance, tenantId: string) {
  const tenant = await fastify.dataRepository.getTenantById(tenantId);
  if (tenant) {
    assertModuleEnabled(tenant, "module_documents");
  }
}

export function listTenantDocuments(fastify: FastifyInstance, tenantId: string) {
  return fastify.dataRepository.listDocuments(tenantId);
}

export function createTenantDocument(
  fastify: FastifyInstance,
  tenantId: string,
  input: {
    category?: string | null;
    file_size?: number | null;
    file_type?: string | null;
    file_url: string;
    name: string;
    uploaded_by: string;
  },
) {
  return fastify.dataRepository.createDocument(tenantId, input);
}

export function deleteTenantDocument(fastify: FastifyInstance, tenantId: string, documentId: string) {
  return fastify.dataRepository.deleteDocument(tenantId, documentId);
}
