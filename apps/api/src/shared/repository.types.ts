import type {
  AppUser,
  BuildJob,
  BuildJobPlatform,
  BuildJobStatus,
  Conversation,
  DocumentRecord,
  EventAttendee,
  EventAttendeeStatus,
  EventRecord,
  FormRecord,
  FormResponse,
  Message,
  NewsPost,
  PushNotificationPayload,
  PushNotificationRecord,
  StripeCheckoutPayload,
  TenantBundle,
  TenantConfig,
  TenantStatus,
} from "@nidorali/types";

export interface RegisterUserInput {
  display_name?: string;
  email: string;
  password_hash: string;
  role?: AppUser["role"];
}

export interface UpdateUserInput {
  avatar_url?: string | null;
  display_name?: string | null;
}

export interface CreateConversationInput {
  created_by: string;
  member_ids: string[];
  title?: string | null;
  type?: Conversation["type"];
}

export interface CreateMessageInput {
  content: string;
  media_url?: string | null;
  sender_id: string;
  type?: Message["type"];
}

export interface CreateEventInput {
  color?: string | null;
  created_by: string;
  description?: string | null;
  end_at: string;
  is_all_day?: boolean;
  location?: string | null;
  max_attendees?: number | null;
  start_at: string;
  title: string;
}

export interface CreateNewsInput {
  author_id: string;
  content: string;
  cover_url?: string | null;
  is_published?: boolean;
  published_at?: string | null;
  title: string;
}

export interface CreateDocumentInput {
  category?: string | null;
  file_size?: number | null;
  file_type?: string | null;
  file_url: string;
  name: string;
  uploaded_by: string;
}

export interface CreateBuildJobInput {
  platform: BuildJobPlatform;
  tenant_id: string;
}

export interface UpdateBuildJobInput {
  android_artifact_url?: string | null;
  app_store_url?: string | null;
  completed_at?: string | null;
  eas_build_id_android?: string | null;
  eas_build_id_ios?: string | null;
  error_message?: string | null;
  ios_artifact_url?: string | null;
  play_store_url?: string | null;
  started_at?: string | null;
  status?: BuildJobStatus;
}

export interface DataRepository {
  createBuildJob(input: CreateBuildJobInput): Promise<BuildJob>;
  createConversation(tenantId: string, input: CreateConversationInput): Promise<Conversation>;
  createDocument(tenantId: string, input: CreateDocumentInput): Promise<DocumentRecord>;
  createEvent(tenantId: string, input: CreateEventInput): Promise<EventRecord>;
  createFormResponse(tenantId: string, formId: string, userId: string | null, answers: Record<string, unknown>): Promise<FormResponse>;
  createMessage(tenantId: string, conversationId: string, input: CreateMessageInput): Promise<Message>;
  createNews(tenantId: string, input: CreateNewsInput): Promise<NewsPost>;
  createNotification(tenantId: string, createdBy: string, payload: PushNotificationPayload): Promise<PushNotificationRecord>;
  createTenantFromCheckout(payload: StripeCheckoutPayload): Promise<TenantBundle>;
  deleteDocument(tenantId: string, id: string): Promise<void>;
  deleteEvent(tenantId: string, id: string): Promise<void>;
  deleteNews(tenantId: string, id: string): Promise<void>;
  getBuildJob(id: string): Promise<BuildJob | null>;
  getConfigByTenantIdentifier(identifier: string): Promise<TenantBundle | null>;
  getEvent(tenantId: string, id: string): Promise<EventRecord | null>;
  getForm(tenantId: string, id: string): Promise<FormRecord | null>;
  getNews(tenantId: string, id: string): Promise<NewsPost | null>;
  getTenantById(id: string): Promise<TenantBundle | null>;
  getTenantByIdentifier(identifier: string): Promise<TenantBundle | null>;
  getUserByEmail(tenantId: string, email: string): Promise<AppUser | null>;
  getUserById(tenantId: string, userId: string): Promise<AppUser | null>;
  listBuildJobs(tenantId?: string): Promise<BuildJob[]>;
  listConversations(tenantId: string, userId: string): Promise<Conversation[]>;
  listDocuments(tenantId: string): Promise<DocumentRecord[]>;
  listEvents(tenantId: string): Promise<EventRecord[]>;
  listForms(tenantId: string): Promise<FormRecord[]>;
  listMembers(tenantId: string): Promise<AppUser[]>;
  listMessages(tenantId: string, conversationId: string): Promise<Message[]>;
  listNews(tenantId: string): Promise<NewsPost[]>;
  listTenants(): Promise<TenantBundle[]>;
  registerUser(tenantId: string, input: RegisterUserInput): Promise<AppUser>;
  setEventAttendance(tenantId: string, eventId: string, userId: string, status: EventAttendeeStatus): Promise<EventAttendee>;
  updateBuildJob(id: string, patch: UpdateBuildJobInput): Promise<BuildJob>;
  updateEvent(tenantId: string, id: string, patch: Partial<CreateEventInput>): Promise<EventRecord>;
  updateNews(tenantId: string, id: string, patch: Partial<CreateNewsInput>): Promise<NewsPost>;
  updateTenantStatus(id: string, status: TenantStatus): Promise<TenantBundle>;
  updateUser(tenantId: string, userId: string, patch: UpdateUserInput): Promise<AppUser>;
  updateUserPushToken(tenantId: string, userId: string, pushToken: string): Promise<AppUser>;
}

export interface InMemorySeed {
  buildJobs?: BuildJob[];
  configs?: TenantConfig[];
  conversations?: Conversation[];
  conversationMembers?: Array<{ conversation_id: string; user_id: string }>;
  documents?: DocumentRecord[];
  events?: EventRecord[];
  forms?: FormRecord[];
  formResponses?: FormResponse[];
  messages?: Message[];
  news?: NewsPost[];
  notifications?: PushNotificationRecord[];
  tenants?: TenantBundle[];
  users?: AppUser[];
}
