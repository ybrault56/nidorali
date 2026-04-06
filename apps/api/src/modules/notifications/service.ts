import { Expo } from "expo-server-sdk";
import type { FastifyInstance } from "fastify";

import { assertTenantAdmin } from "../../shared/authorization.js";
import { assertModuleEnabled } from "../../shared/modules.js";

/**
 * Envoie une notification push sur le tenant courant.
 */
export async function sendTenantNotification(
  fastify: FastifyInstance,
  tenantId: string,
  actorId: string,
  actorRole: string,
  payload: {
    body: string;
    data?: Record<string, unknown>;
    target: "all" | "admins" | "specific";
    target_user_ids?: string[];
    title: string;
  },
) {
  assertTenantAdmin(actorRole);
  const tenant = await fastify.dataRepository.getTenantById(tenantId);
  if (tenant) {
    assertModuleEnabled(tenant, "module_notifications");
  }

  const members = await fastify.dataRepository.listMembers(tenantId);
  const targets = members.filter((member) => {
    if (!member.push_token) {
      return false;
    }

    if (payload.target === "all") {
      return true;
    }

    if (payload.target === "admins") {
      return member.role === "admin" || member.role === "moderator";
    }

    return payload.target_user_ids?.includes(member.id) ?? false;
  });

  const expo = new Expo();
  const notifications = targets
    .map((member) => member.push_token)
    .filter((pushToken): pushToken is string => Boolean(pushToken))
    .filter((pushToken) => Expo.isExpoPushToken(pushToken))
    .map((pushToken) => ({
      body: payload.body,
      data: payload.data ?? {},
      sound: "default" as const,
      title: payload.title,
      to: pushToken,
    }));

  for (const chunk of expo.chunkPushNotifications(notifications)) {
    if (chunk.length > 0) {
      await expo.sendPushNotificationsAsync(chunk);
    }
  }

  return fastify.dataRepository.createNotification(tenantId, actorId, payload);
}
