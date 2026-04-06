import type {
  AppUser,
  BuildJob,
  Conversation,
  DocumentRecord,
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

import { AppError } from "./errors.js";
import { createDefaultConfig } from "./repository.js";
import type {
  DataRepository,
  InMemorySeed,
} from "./repository.types.js";

interface InMemoryState {
  buildJobs: BuildJob[];
  configs: TenantConfig[];
  conversationMembers: Array<{ conversation_id: string; user_id: string }>;
  conversations: Conversation[];
  documents: DocumentRecord[];
  events: EventRecord[];
  forms: FormRecord[];
  formResponses: FormResponse[];
  messages: Message[];
  news: NewsPost[];
  notifications: PushNotificationRecord[];
  tenants: Tenant[];
  users: AppUser[];
}

/**
 * Crée un dépôt de données mémoire pour les tests d'intégration.
 *
 * @param seed - Données de démarrage optionnelles
 * @returns Dépôt compatible avec toute l'API
 */
export function createInMemoryRepository(seed: InMemorySeed = {}): DataRepository {
  const tenants = (seed.tenants ?? []).map<Tenant>(({ config: _config, ...tenant }) => tenant);
  const configs = [
    ...(seed.configs ?? []),
    ...(seed.tenants ?? []).map((tenant) => tenant.config),
  ];

  const state: InMemoryState = {
    buildJobs: seed.buildJobs ?? [],
    configs,
    conversationMembers: seed.conversationMembers ?? [],
    conversations: seed.conversations ?? [],
    documents: seed.documents ?? [],
    events: seed.events ?? [],
    forms: seed.forms ?? [],
    formResponses: seed.formResponses ?? [],
    messages: seed.messages ?? [],
    news: seed.news ?? [],
    notifications: seed.notifications ?? [],
    tenants,
    users: seed.users ?? [],
  };

  const now = () => new Date().toISOString();
  const nextId = () => crypto.randomUUID();
  const bundleOf = (tenant: Tenant): TenantBundle => ({
    ...tenant,
    config:
      state.configs.find((config) => config.tenant_id === tenant.id) ??
      createDefaultConfig(tenant.id, now()),
  });
  const requireTenant = (tenantId: string) => {
    const tenant = state.tenants.find((item) => item.id === tenantId || item.slug === tenantId || item.bundle_id === tenantId);
    if (!tenant) {
      throw new AppError({
        code: "tenant_not_found",
        message: "Tenant introuvable.",
        statusCode: 404,
      });
    }
    return tenant;
  };

  return {
    async createBuildJob(input) {
      const buildJob: BuildJob = {
        android_artifact_url: null,
        app_store_url: null,
        completed_at: null,
        created_at: now(),
        eas_build_id_android: null,
        eas_build_id_ios: null,
        error_message: null,
        id: nextId(),
        ios_artifact_url: null,
        play_store_url: null,
        platform: input.platform,
        started_at: null,
        status: "queued",
        tenant_id: input.tenant_id,
      };
      state.buildJobs.unshift(buildJob);
      return buildJob;
    },
    async createConversation(tenantId, input) {
      requireTenant(tenantId);
      const conversation: Conversation = {
        created_at: now(),
        created_by: input.created_by,
        id: nextId(),
        tenant_id: tenantId,
        title: input.title ?? null,
        type: input.type ?? "group",
      };
      state.conversations.unshift(conversation);
      state.conversationMembers.push(
        ...input.member_ids.map((userId) => ({
          conversation_id: conversation.id,
          user_id: userId,
        })),
      );
      return conversation;
    },
    async createDocument(tenantId, input) {
      requireTenant(tenantId);
      const document: DocumentRecord = {
        category: input.category ?? null,
        created_at: now(),
        file_size: input.file_size ?? null,
        file_type: input.file_type ?? null,
        file_url: input.file_url,
        id: nextId(),
        name: input.name,
        tenant_id: tenantId,
        uploaded_by: input.uploaded_by,
      };
      state.documents.unshift(document);
      return document;
    },
    async createEvent(tenantId, input) {
      requireTenant(tenantId);
      const event: EventRecord = {
        color: input.color ?? null,
        created_at: now(),
        created_by: input.created_by,
        description: input.description ?? null,
        end_at: input.end_at,
        id: nextId(),
        is_all_day: input.is_all_day ?? false,
        location: input.location ?? null,
        max_attendees: input.max_attendees ?? null,
        start_at: input.start_at,
        tenant_id: tenantId,
        title: input.title,
      };
      state.events.unshift(event);
      return event;
    },
    async createFormResponse(tenantId, formId, userId, answers) {
      requireTenant(tenantId);
      const response: FormResponse = {
        answers,
        form_id: formId,
        id: nextId(),
        submitted_at: now(),
        tenant_id: tenantId,
        user_id: userId,
      };
      state.formResponses.unshift(response);
      return response;
    },
    async createMessage(tenantId, conversationId, input) {
      requireTenant(tenantId);
      const message: Message = {
        content: input.content,
        conversation_id: conversationId,
        created_at: now(),
        id: nextId(),
        media_url: input.media_url ?? null,
        read_by: [input.sender_id],
        sender_id: input.sender_id,
        tenant_id: tenantId,
        type: input.type ?? "text",
      };
      state.messages.push(message);
      return message;
    },
    async createNews(tenantId, input) {
      requireTenant(tenantId);
      const news: NewsPost = {
        author_id: input.author_id,
        content: input.content,
        cover_url: input.cover_url ?? null,
        created_at: now(),
        id: nextId(),
        is_published: input.is_published ?? false,
        published_at: input.published_at ?? null,
        tenant_id: tenantId,
        title: input.title,
      };
      state.news.unshift(news);
      return news;
    },
    async createNotification(tenantId, createdBy, payload) {
      requireTenant(tenantId);
      const notification: PushNotificationRecord = {
        body: payload.body,
        created_at: now(),
        created_by: createdBy,
        data: payload.data ?? {},
        id: nextId(),
        sent_at: now(),
        target: payload.target,
        target_user_ids: payload.target_user_ids,
        tenant_id: tenantId,
        title: payload.title,
      };
      state.notifications.unshift(notification);
      return notification;
    },
    async createTenantFromCheckout(payload) {
      const timestamp = now();
      const tenant: Tenant = {
        app_name: payload.app_name,
        bundle_id: payload.bundle_id,
        contact_email: payload.billing_email,
        created_at: timestamp,
        id: nextId(),
        plan: payload.plan,
        slug: payload.slug,
        status: "building",
        stripe_customer_id: null,
        stripe_subscription_id: null,
        updated_at: timestamp,
      };
      const config: TenantConfig = {
        created_at: timestamp,
        font: payload.tenant_config.font,
        id: nextId(),
        logo_url: payload.tenant_config.logo_url,
        max_users: payload.tenant_config.max_users,
        primary_color: payload.tenant_config.primary_color,
        secondary_color: payload.tenant_config.secondary_color,
        splash_bg_color: payload.tenant_config.splash_bg_color,
        tenant_id: tenant.id,
        updated_at: timestamp,
        module_documents: payload.tenant_config.module_documents,
        module_forms: payload.tenant_config.module_forms,
        module_map: payload.tenant_config.module_map,
        module_members: payload.tenant_config.module_members,
        module_messaging: payload.tenant_config.module_messaging,
        module_news: payload.tenant_config.module_news,
        module_notifications: payload.tenant_config.module_notifications,
        module_planning: payload.tenant_config.module_planning,
      };
      state.tenants.unshift(tenant);
      state.configs.unshift(config);
      return { ...tenant, config };
    },
    async deleteDocument(tenantId, id) {
      requireTenant(tenantId);
      state.documents = state.documents.filter((document) => !(document.id === id && document.tenant_id === tenantId));
    },
    async deleteEvent(tenantId, id) {
      requireTenant(tenantId);
      state.events = state.events.filter((event) => !(event.id === id && event.tenant_id === tenantId));
    },
    async deleteNews(tenantId, id) {
      requireTenant(tenantId);
      state.news = state.news.filter((item) => !(item.id === id && item.tenant_id === tenantId));
    },
    async getBuildJob(id) {
      return state.buildJobs.find((job) => job.id === id) ?? null;
    },
    async getConfigByTenantIdentifier(identifier) {
      const tenant = state.tenants.find((item) => item.slug === identifier || item.bundle_id === identifier);
      return tenant ? bundleOf(tenant) : null;
    },
    async getEvent(tenantId, id) {
      requireTenant(tenantId);
      return state.events.find((event) => event.id === id && event.tenant_id === tenantId) ?? null;
    },
    async getForm(tenantId, id) {
      requireTenant(tenantId);
      return state.forms.find((form) => form.id === id && form.tenant_id === tenantId) ?? null;
    },
    async getNews(tenantId, id) {
      requireTenant(tenantId);
      return state.news.find((item) => item.id === id && item.tenant_id === tenantId) ?? null;
    },
    async getTenantById(id) {
      const tenant = state.tenants.find((item) => item.id === id);
      return tenant ? bundleOf(tenant) : null;
    },
    async getTenantByIdentifier(identifier) {
      const tenant = state.tenants.find((item) => item.id === identifier || item.slug === identifier || item.bundle_id === identifier);
      return tenant ? bundleOf(tenant) : null;
    },
    async getUserByEmail(tenantId, email) {
      requireTenant(tenantId);
      return state.users.find((user) => user.tenant_id === tenantId && user.email === email) ?? null;
    },
    async getUserById(tenantId, userId) {
      requireTenant(tenantId);
      return state.users.find((user) => user.tenant_id === tenantId && user.id === userId) ?? null;
    },
    async listBuildJobs(tenantId) {
      return state.buildJobs.filter((job) => !tenantId || job.tenant_id === tenantId);
    },
    async listConversations(tenantId, userId) {
      requireTenant(tenantId);
      const allowedConversationIds = new Set(
        state.conversationMembers.filter((member) => member.user_id === userId).map((member) => member.conversation_id),
      );
      return state.conversations.filter(
        (conversation) =>
          conversation.tenant_id === tenantId &&
          (allowedConversationIds.size === 0 || allowedConversationIds.has(conversation.id)),
      );
    },
    async listDocuments(tenantId) {
      requireTenant(tenantId);
      return state.documents.filter((document) => document.tenant_id === tenantId);
    },
    async listEvents(tenantId) {
      requireTenant(tenantId);
      return state.events.filter((event) => event.tenant_id === tenantId);
    },
    async listForms(tenantId) {
      requireTenant(tenantId);
      return state.forms.filter((form) => form.tenant_id === tenantId);
    },
    async listMembers(tenantId) {
      requireTenant(tenantId);
      return state.users.filter((user) => user.tenant_id === tenantId);
    },
    async listMessages(tenantId, conversationId) {
      requireTenant(tenantId);
      return state.messages.filter((message) => message.tenant_id === tenantId && message.conversation_id === conversationId);
    },
    async listNews(tenantId) {
      requireTenant(tenantId);
      return state.news.filter((item) => item.tenant_id === tenantId);
    },
    async listTenants() {
      return state.tenants.map(bundleOf);
    },
    async registerUser(tenantId, input) {
      requireTenant(tenantId);
      const user: AppUser = {
        avatar_url: null,
        created_at: now(),
        display_name: input.display_name ?? null,
        email: input.email,
        id: nextId(),
        is_active: true,
        last_seen_at: null,
        password_hash: input.password_hash,
        password_updated_at: now(),
        push_token: null,
        role: input.role ?? "member",
        tenant_id: tenantId,
      };
      state.users.unshift(user);
      return user;
    },
    async setEventAttendance(_tenantId, eventId, userId, status) {
      return { event_id: eventId, status, user_id: userId };
    },
    async updateBuildJob(id, patch) {
      const buildJob = state.buildJobs.find((job) => job.id === id);
      if (!buildJob) {
        throw new AppError({
          code: "build_job_not_found",
          message: "Build introuvable.",
          statusCode: 404,
        });
      }
      Object.assign(buildJob, patch);
      return buildJob;
    },
    async updateEvent(tenantId, id, patch) {
      const event = await this.getEvent(tenantId, id);
      if (!event) {
        throw new AppError({
          code: "event_not_found",
          message: "Événement introuvable.",
          statusCode: 404,
        });
      }
      Object.assign(event, patch);
      return event;
    },
    async updateNews(tenantId, id, patch) {
      const item = await this.getNews(tenantId, id);
      if (!item) {
        throw new AppError({
          code: "news_not_found",
          message: "Actualité introuvable.",
          statusCode: 404,
        });
      }
      Object.assign(item, patch);
      return item;
    },
    async updateTenantStatus(id, status) {
      const tenant = state.tenants.find((item) => item.id === id);
      if (!tenant) {
        throw new AppError({
          code: "tenant_not_found",
          message: "Tenant introuvable.",
          statusCode: 404,
        });
      }
      tenant.status = status;
      tenant.updated_at = now();
      return bundleOf(tenant);
    },
    async updateUser(tenantId, userId, patch) {
      const user = await this.getUserById(tenantId, userId);
      if (!user) {
        throw new AppError({
          code: "member_not_found",
          message: "Utilisateur introuvable.",
          statusCode: 404,
        });
      }
      Object.assign(user, patch);
      return user;
    },
    async updateUserPushToken(tenantId, userId, pushToken) {
      const user = await this.getUserById(tenantId, userId);
      if (!user) {
        throw new AppError({
          code: "member_not_found",
          message: "Utilisateur introuvable.",
          statusCode: 404,
        });
      }
      user.push_token = pushToken;
      user.last_seen_at = now();
      return user;
    },
  };
}
