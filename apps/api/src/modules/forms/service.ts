import type { FastifyInstance } from "fastify";

import { assertModuleEnabled } from "../../shared/modules.js";

/**
 * Vérifie l'activation du module formulaires.
 */
export async function ensureFormsEnabled(fastify: FastifyInstance, tenantId: string) {
  const tenant = await fastify.dataRepository.getTenantById(tenantId);
  if (tenant) {
    assertModuleEnabled(tenant, "module_forms");
  }
}

export function listTenantForms(fastify: FastifyInstance, tenantId: string) {
  return fastify.dataRepository.listForms(tenantId);
}

export function getTenantForm(fastify: FastifyInstance, tenantId: string, formId: string) {
  return fastify.dataRepository.getForm(tenantId, formId);
}

export function submitFormResponse(
  fastify: FastifyInstance,
  tenantId: string,
  formId: string,
  userId: string | null,
  answers: Record<string, unknown>,
) {
  return fastify.dataRepository.createFormResponse(tenantId, formId, userId, answers);
}
