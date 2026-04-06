import type { TenantConfig } from "@nidorali/types";

export type {
  CreateCustomerAccountInput,
  CreateBuildJobInput,
  CreateConversationInput,
  CreateDocumentInput,
  CreateEventInput,
  CreateMessageInput,
  CreateNewsInput,
  DataRepository,
  InMemorySeed,
  RegisterUserInput,
  UpdateBuildJobInput,
  UpdateUserInput,
} from "./repository.types.js";

export { createInMemoryRepository } from "./repository.memory.js";
export { createSupabaseRepository } from "./repository.supabase.js";

/**
 * Crée une configuration tenant par défaut.
 *
 * @param tenantId - Identifiant du tenant
 * @param timestamp - Horodatage de création
 * @returns Configuration neutre exploitable
 */
export function createDefaultConfig(tenantId: string, timestamp: string): TenantConfig {
  return {
    created_at: timestamp,
    font: "Inter",
    id: crypto.randomUUID(),
    logo_url: null,
    max_users: 100,
    primary_color: "#0F62FE",
    secondary_color: "#A7D8FF",
    splash_bg_color: "#FFFFFF",
    tenant_id: tenantId,
    updated_at: timestamp,
    module_documents: false,
    module_forms: false,
    module_map: false,
    module_members: true,
    module_messaging: false,
    module_news: false,
    module_notifications: true,
    module_planning: false,
  };
}
