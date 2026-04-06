import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  AppUser,
  BuildJob,
  Conversation,
  DocumentRecord,
  EventAttendee,
  EventRecord,
  FormRecord,
  FormResponse,
  Message,
  NewsPost,
  PushNotificationRecord,
  Tenant,
  TenantBundle,
  TenantConfig,
} from "@nidorali/types";

import type { ApiEnv } from "./env.js";
import { AppError } from "./errors.js";
import { createDefaultConfig } from "./repository.js";
import type { DataRepository } from "./repository.types.js";

/**
 * Crée un dépôt Supabase pour l'exécution réelle.
 *
 * @param env - Variables d'environnement validées
 * @param existingClient - Client injecté pour les tests
 * @returns Dépôt SQL compatible avec les services
 */
export function createSupabaseRepository(env: ApiEnv, existingClient?: SupabaseClient): DataRepository {
  const supabase =
    existingClient ??
    createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

  const now = () => new Date().toISOString();
  const unwrap = <TData>(data: TData | null, error: { message: string } | null, code: string, missingMessage: string) => {
    if (error) {
      throw new AppError({
        code,
        details: error.message,
        message: "Erreur de persistance Supabase.",
        statusCode: 500,
      });
    }

    if (data === null) {
      throw new AppError({
        code,
        message: missingMessage,
        statusCode: 404,
      });
    }

    return data;
  };
  const getConfigForTenant = async (tenantId: string) => {
    const { data, error } = await supabase.from("tenant_configs").select("*").eq("tenant_id", tenantId).maybeSingle();
    if (error) {
      throw new AppError({
        code: "tenant_config_fetch_failed",
        details: error.message,
        message: "Lecture de la configuration tenant impossible.",
        statusCode: 500,
      });
    }
    return (data as TenantConfig | null) ?? createDefaultConfig(tenantId, now());
  };
  const getTenantRecord = async (identifier: string) => {
    const candidates = await Promise.all([
      supabase.from("tenants").select("*").eq("id", identifier).maybeSingle(),
      supabase.from("tenants").select("*").eq("slug", identifier).maybeSingle(),
      supabase.from("tenants").select("*").eq("bundle_id", identifier).maybeSingle(),
    ]);

    return (candidates[0].data ?? candidates[1].data ?? candidates[2].data ?? null) as Tenant | null;
  };
  const getTenantBundle = async (identifier: string) => {
    const tenant = await getTenantRecord(identifier);
    if (!tenant) {
      return null;
    }

    return {
      ...tenant,
      config: await getConfigForTenant(tenant.id),
    } satisfies TenantBundle;
  };

  return {
    async createBuildJob(input) {
      const { data, error } = await supabase.from("build_jobs").insert(input).select("*").single();
      return unwrap(data as BuildJob | null, error, "build_job_create_failed", "Build introuvable.");
    },
    async createConversation(tenantId, input) {
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          created_by: input.created_by,
          tenant_id: tenantId,
          title: input.title ?? null,
          type: input.type ?? "group",
        })
        .select("*")
        .single();

      const conversation = unwrap(data as Conversation | null, error, "conversation_create_failed", "Conversation introuvable.");
      if (input.member_ids.length > 0) {
        await supabase.from("conversation_members").insert(
          input.member_ids.map((userId) => ({
            conversation_id: conversation.id,
            user_id: userId,
          })),
        );
      }
      return conversation;
    },
    async createDocument(tenantId, input) {
      const { data, error } = await supabase.from("documents").insert({ ...input, tenant_id: tenantId }).select("*").single();
      return unwrap(data as DocumentRecord | null, error, "document_create_failed", "Document introuvable.");
    },
    async createEvent(tenantId, input) {
      const { data, error } = await supabase.from("events").insert({ ...input, tenant_id: tenantId }).select("*").single();
      return unwrap(data as EventRecord | null, error, "event_create_failed", "Événement introuvable.");
    },
    async createFormResponse(tenantId, formId, userId, answers) {
      const { data, error } = await supabase
        .from("form_responses")
        .insert({ answers, form_id: formId, tenant_id: tenantId, user_id: userId })
        .select("*")
        .single();
      return unwrap(data as FormResponse | null, error, "form_response_create_failed", "Réponse introuvable.");
    },
    async createMessage(tenantId, conversationId, input) {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          content: input.content,
          conversation_id: conversationId,
          media_url: input.media_url ?? null,
          sender_id: input.sender_id,
          tenant_id: tenantId,
          type: input.type ?? "text",
        })
        .select("*")
        .single();
      return unwrap(data as Message | null, error, "message_create_failed", "Message introuvable.");
    },
    async createNews(tenantId, input) {
      const { data, error } = await supabase.from("news_posts").insert({ ...input, tenant_id: tenantId }).select("*").single();
      return unwrap(data as NewsPost | null, error, "news_create_failed", "Actualité introuvable.");
    },
    async createNotification(tenantId, createdBy, payload) {
      const { data, error } = await supabase
        .from("push_notifications")
        .insert({
          body: payload.body,
          created_by: createdBy,
          data: payload.data ?? {},
          sent_at: now(),
          target: payload.target,
          target_user_ids: payload.target_user_ids,
          tenant_id: tenantId,
          title: payload.title,
        })
        .select("*")
        .single();
      return unwrap(data as PushNotificationRecord | null, error, "notification_create_failed", "Notification introuvable.");
    },
    async createTenantFromCheckout(payload) {
      const { data: tenantData, error: tenantError } = await supabase
        .from("tenants")
        .insert({
          app_name: payload.app_name,
          bundle_id: payload.bundle_id,
          contact_email: payload.billing_email,
          plan: payload.plan,
          slug: payload.slug,
          status: "building",
        })
        .select("*")
        .single();
      const tenant = unwrap(tenantData as Tenant | null, tenantError, "tenant_create_failed", "Tenant introuvable.");

      const { data: configData, error: configError } = await supabase
        .from("tenant_configs")
        .insert({ ...payload.tenant_config, tenant_id: tenant.id })
        .select("*")
        .single();
      const config = unwrap(configData as TenantConfig | null, configError, "tenant_config_create_failed", "Configuration introuvable.");

      return {
        ...tenant,
        config,
      };
    },
    async deleteDocument(tenantId, id) {
      const { error } = await supabase.from("documents").delete().eq("tenant_id", tenantId).eq("id", id);
      if (error) {
        throw new AppError({
          code: "document_delete_failed",
          details: error.message,
          message: "Suppression du document impossible.",
          statusCode: 500,
        });
      }
    },
    async deleteEvent(tenantId, id) {
      const { error } = await supabase.from("events").delete().eq("tenant_id", tenantId).eq("id", id);
      if (error) {
        throw new AppError({
          code: "event_delete_failed",
          details: error.message,
          message: "Suppression de l'événement impossible.",
          statusCode: 500,
        });
      }
    },
    async deleteNews(tenantId, id) {
      const { error } = await supabase.from("news_posts").delete().eq("tenant_id", tenantId).eq("id", id);
      if (error) {
        throw new AppError({
          code: "news_delete_failed",
          details: error.message,
          message: "Suppression de l'actualité impossible.",
          statusCode: 500,
        });
      }
    },
    async getBuildJob(id) {
      const { data, error } = await supabase.from("build_jobs").select("*").eq("id", id).maybeSingle();
      if (error) {
        throw new AppError({
          code: "build_job_fetch_failed",
          details: error.message,
          message: "Lecture du build impossible.",
          statusCode: 500,
        });
      }
      return (data as BuildJob | null) ?? null;
    },
    async getConfigByTenantIdentifier(identifier) {
      return getTenantBundle(identifier);
    },
    async getEvent(tenantId, id) {
      const { data, error } = await supabase.from("events").select("*").eq("tenant_id", tenantId).eq("id", id).maybeSingle();
      if (error) {
        throw new AppError({
          code: "event_fetch_failed",
          details: error.message,
          message: "Lecture de l'événement impossible.",
          statusCode: 500,
        });
      }
      return (data as EventRecord | null) ?? null;
    },
    async getForm(tenantId, id) {
      const { data, error } = await supabase.from("forms").select("*").eq("tenant_id", tenantId).eq("id", id).maybeSingle();
      if (error) {
        throw new AppError({
          code: "form_fetch_failed",
          details: error.message,
          message: "Lecture du formulaire impossible.",
          statusCode: 500,
        });
      }
      return (data as FormRecord | null) ?? null;
    },
    async getNews(tenantId, id) {
      const { data, error } = await supabase.from("news_posts").select("*").eq("tenant_id", tenantId).eq("id", id).maybeSingle();
      if (error) {
        throw new AppError({
          code: "news_fetch_failed",
          details: error.message,
          message: "Lecture de l'actualité impossible.",
          statusCode: 500,
        });
      }
      return (data as NewsPost | null) ?? null;
    },
    async getTenantById(id) {
      return getTenantBundle(id);
    },
    async getTenantByIdentifier(identifier) {
      return getTenantBundle(identifier);
    },
    async getUserByEmail(tenantId, email) {
      const { data, error } = await supabase.from("app_users").select("*").eq("tenant_id", tenantId).eq("email", email).maybeSingle();
      if (error) {
        throw new AppError({
          code: "member_fetch_failed",
          details: error.message,
          message: "Lecture du membre impossible.",
          statusCode: 500,
        });
      }
      return (data as AppUser | null) ?? null;
    },
    async getUserById(tenantId, userId) {
      const { data, error } = await supabase.from("app_users").select("*").eq("tenant_id", tenantId).eq("id", userId).maybeSingle();
      if (error) {
        throw new AppError({
          code: "member_fetch_failed",
          details: error.message,
          message: "Lecture du membre impossible.",
          statusCode: 500,
        });
      }
      return (data as AppUser | null) ?? null;
    },
    async listBuildJobs(tenantId) {
      let query = supabase.from("build_jobs").select("*").order("created_at", { ascending: false });
      if (tenantId) {
        query = query.eq("tenant_id", tenantId);
      }
      const { data, error } = await query;
      return unwrap((data as BuildJob[] | null) ?? [], error, "build_jobs_list_failed", "Aucun build.");
    },
    async listConversations(tenantId) {
      const { data, error } = await supabase.from("conversations").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false });
      return unwrap((data as Conversation[] | null) ?? [], error, "conversations_list_failed", "Aucune conversation.");
    },
    async listDocuments(tenantId) {
      const { data, error } = await supabase.from("documents").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false });
      return unwrap((data as DocumentRecord[] | null) ?? [], error, "documents_list_failed", "Aucun document.");
    },
    async listEvents(tenantId) {
      const { data, error } = await supabase.from("events").select("*").eq("tenant_id", tenantId).order("start_at", { ascending: true });
      return unwrap((data as EventRecord[] | null) ?? [], error, "events_list_failed", "Aucun événement.");
    },
    async listForms(tenantId) {
      const { data, error } = await supabase.from("forms").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false });
      return unwrap((data as FormRecord[] | null) ?? [], error, "forms_list_failed", "Aucun formulaire.");
    },
    async listMembers(tenantId) {
      const { data, error } = await supabase.from("app_users").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false });
      return unwrap((data as AppUser[] | null) ?? [], error, "members_list_failed", "Aucun membre.");
    },
    async listMessages(tenantId, conversationId) {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("tenant_id", tenantId)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      return unwrap((data as Message[] | null) ?? [], error, "messages_list_failed", "Aucun message.");
    },
    async listNews(tenantId) {
      const { data, error } = await supabase.from("news_posts").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false });
      return unwrap((data as NewsPost[] | null) ?? [], error, "news_list_failed", "Aucune actualité.");
    },
    async listTenants() {
      const { data, error } = await supabase.from("tenants").select("*").order("created_at", { ascending: false });
      const tenants = unwrap((data as Tenant[] | null) ?? [], error, "tenants_list_failed", "Aucun tenant.");
      return Promise.all(tenants.map(async (tenant) => ({ ...tenant, config: await getConfigForTenant(tenant.id) })));
    },
    async registerUser(tenantId, input) {
      const { data, error } = await supabase
        .from("app_users")
        .insert({
          display_name: input.display_name ?? null,
          email: input.email,
          password_hash: input.password_hash,
          password_updated_at: now(),
          role: input.role ?? "member",
          tenant_id: tenantId,
        })
        .select("*")
        .single();
      return unwrap(data as AppUser | null, error, "member_create_failed", "Membre introuvable.");
    },
    async setEventAttendance(tenantId, eventId, userId, status) {
      await this.getEvent(tenantId, eventId);
      const { data, error } = await supabase
        .from("event_attendees")
        .upsert({ event_id: eventId, status, user_id: userId }, { onConflict: "event_id,user_id" })
        .select("*")
        .single();
      return unwrap(data as EventAttendee | null, error, "event_attendance_failed", "Réponse de présence introuvable.");
    },
    async updateBuildJob(id, patch) {
      const { data, error } = await supabase.from("build_jobs").update(patch).eq("id", id).select("*").single();
      return unwrap(data as BuildJob | null, error, "build_job_update_failed", "Build introuvable.");
    },
    async updateEvent(tenantId, id, patch) {
      const { data, error } = await supabase.from("events").update(patch).eq("tenant_id", tenantId).eq("id", id).select("*").single();
      return unwrap(data as EventRecord | null, error, "event_update_failed", "Événement introuvable.");
    },
    async updateNews(tenantId, id, patch) {
      const { data, error } = await supabase.from("news_posts").update(patch).eq("tenant_id", tenantId).eq("id", id).select("*").single();
      return unwrap(data as NewsPost | null, error, "news_update_failed", "Actualité introuvable.");
    },
    async updateTenantStatus(id, status) {
      const { data, error } = await supabase
        .from("tenants")
        .update({ status, updated_at: now() })
        .eq("id", id)
        .select("*")
        .single();
      const tenant = unwrap(data as Tenant | null, error, "tenant_update_failed", "Tenant introuvable.");

      return {
        ...tenant,
        config: await getConfigForTenant(tenant.id),
      };
    },
    async updateUser(tenantId, userId, patch) {
      const { data, error } = await supabase.from("app_users").update(patch).eq("tenant_id", tenantId).eq("id", userId).select("*").single();
      return unwrap(data as AppUser | null, error, "member_update_failed", "Membre introuvable.");
    },
    async updateUserPushToken(tenantId, userId, pushToken) {
      const { data, error } = await supabase
        .from("app_users")
        .update({ last_seen_at: now(), push_token: pushToken })
        .eq("tenant_id", tenantId)
        .eq("id", userId)
        .select("*")
        .single();
      return unwrap(data as AppUser | null, error, "member_push_token_failed", "Membre introuvable.");
    },
  };
}
