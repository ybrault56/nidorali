import type { FastifyInstance } from "fastify";

import { assertModuleEnabled } from "../../shared/modules.js";

/**
 * Vérifie l'activation du module planning.
 */
export async function ensurePlanningEnabled(fastify: FastifyInstance, tenantId: string) {
  const tenant = await fastify.dataRepository.getTenantById(tenantId);
  if (tenant) {
    assertModuleEnabled(tenant, "module_planning");
  }
}

export function listTenantEvents(fastify: FastifyInstance, tenantId: string) {
  return fastify.dataRepository.listEvents(tenantId);
}

export function getTenantEvent(fastify: FastifyInstance, tenantId: string, eventId: string) {
  return fastify.dataRepository.getEvent(tenantId, eventId);
}

export function createTenantEvent(
  fastify: FastifyInstance,
  tenantId: string,
  input: {
    color?: string | null;
    created_by: string;
    description?: string | null;
    end_at: string;
    is_all_day?: boolean;
    location?: string | null;
    max_attendees?: number | null;
    start_at: string;
    title: string;
  },
) {
  return fastify.dataRepository.createEvent(tenantId, input);
}

export function updateTenantEvent(
  fastify: FastifyInstance,
  tenantId: string,
  eventId: string,
  patch: {
    color?: string | null;
    description?: string | null;
    end_at?: string;
    is_all_day?: boolean;
    location?: string | null;
    max_attendees?: number | null;
    start_at?: string;
    title?: string;
  },
) {
  return fastify.dataRepository.updateEvent(tenantId, eventId, patch);
}

export function deleteTenantEvent(fastify: FastifyInstance, tenantId: string, eventId: string) {
  return fastify.dataRepository.deleteEvent(tenantId, eventId);
}

export function attendTenantEvent(
  fastify: FastifyInstance,
  tenantId: string,
  eventId: string,
  userId: string,
  status: "going" | "maybe" | "not_going",
) {
  return fastify.dataRepository.setEventAttendance(tenantId, eventId, userId, status);
}
