import type {
  APP_USER_ROLES,
  BUILD_JOB_PLATFORMS,
  BUILD_JOB_STATUSES,
  CONVERSATION_TYPES,
  EVENT_ATTENDEE_STATUSES,
  MESSAGE_TYPES,
  TENANT_PLANS,
  TENANT_STATUSES,
} from "./constants.js";

export type TenantStatus = (typeof TENANT_STATUSES)[number];
export type TenantPlan = (typeof TENANT_PLANS)[number];
export type AppUserRole = (typeof APP_USER_ROLES)[number];
export type ConversationType = (typeof CONVERSATION_TYPES)[number];
export type MessageType = (typeof MESSAGE_TYPES)[number];
export type EventAttendeeStatus = (typeof EVENT_ATTENDEE_STATUSES)[number];
export type BuildJobStatus = (typeof BUILD_JOB_STATUSES)[number];
export type BuildJobPlatform = (typeof BUILD_JOB_PLATFORMS)[number];

export interface ModuleFlags {
  module_documents: boolean;
  module_forms: boolean;
  module_map: boolean;
  module_members: boolean;
  module_messaging: boolean;
  module_news: boolean;
  module_notifications: boolean;
  module_planning: boolean;
}

export interface Tenant {
  app_name: string;
  bundle_id: string;
  contact_email: string | null;
  created_at: string;
  id: string;
  plan: TenantPlan;
  slug: string;
  status: TenantStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  updated_at: string;
}

export interface TenantConfig extends ModuleFlags {
  created_at: string;
  font: string;
  id: string;
  logo_url: string | null;
  max_users: number;
  primary_color: string;
  secondary_color: string;
  splash_bg_color: string;
  tenant_id: string;
  updated_at: string;
}

export interface TenantBundle extends Tenant {
  config: TenantConfig;
}

export interface AppUser {
  avatar_url: string | null;
  created_at: string;
  display_name: string | null;
  email: string;
  id: string;
  is_active: boolean;
  last_seen_at: string | null;
  password_hash?: string;
  password_updated_at?: string | null;
  push_token: string | null;
  role: AppUserRole;
  tenant_id: string;
}

export interface Conversation {
  created_at: string;
  created_by: string | null;
  id: string;
  tenant_id: string;
  title: string | null;
  type: ConversationType;
}

export interface Message {
  content: string;
  conversation_id: string;
  created_at: string;
  id: string;
  media_url: string | null;
  read_by: string[];
  sender_id: string | null;
  tenant_id: string;
  type: MessageType;
}

export interface EventRecord {
  color: string | null;
  created_at: string;
  created_by: string | null;
  description: string | null;
  end_at: string;
  id: string;
  is_all_day: boolean;
  location: string | null;
  max_attendees: number | null;
  start_at: string;
  tenant_id: string;
  title: string;
}

export interface EventAttendee {
  event_id: string;
  status: EventAttendeeStatus;
  user_id: string;
}

export interface NewsPost {
  author_id: string | null;
  content: string;
  cover_url: string | null;
  created_at: string;
  id: string;
  is_published: boolean;
  published_at: string | null;
  tenant_id: string;
  title: string;
}

export interface PushNotificationPayload {
  body: string;
  data?: Record<string, unknown>;
  target: "all" | "admins" | "specific";
  target_user_ids?: string[];
  title: string;
}

export interface PushNotificationRecord extends PushNotificationPayload {
  created_at: string;
  created_by: string | null;
  id: string;
  sent_at: string | null;
  tenant_id: string;
}

export interface DocumentRecord {
  category: string | null;
  created_at: string;
  file_size: number | null;
  file_type: string | null;
  file_url: string;
  id: string;
  name: string;
  tenant_id: string;
  uploaded_by: string | null;
}

export interface FormField {
  id: string;
  label: string;
  options?: string[];
  placeholder?: string;
  required: boolean;
  type: "checkbox" | "date" | "email" | "number" | "radio" | "select" | "text" | "textarea";
}

export interface FormRecord {
  created_at: string;
  description: string | null;
  fields: FormField[];
  id: string;
  is_active: boolean;
  tenant_id: string;
  title: string;
}

export interface FormResponse {
  answers: Record<string, unknown>;
  form_id: string;
  id: string;
  submitted_at: string;
  tenant_id: string;
  user_id: string | null;
}

export interface BuildJob {
  android_artifact_url: string | null;
  app_store_url: string | null;
  completed_at: string | null;
  created_at: string;
  eas_build_id_android: string | null;
  eas_build_id_ios: string | null;
  error_message: string | null;
  id: string;
  ios_artifact_url: string | null;
  play_store_url: string | null;
  platform: BuildJobPlatform;
  started_at: string | null;
  status: BuildJobStatus;
  tenant_id: string;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: string;
}

export interface StripeCheckoutPayload {
  app_name: string;
  billing_email: string;
  bundle_id: string;
  plan: TenantPlan;
  slug: string;
  tenant_config: Pick<
    TenantConfig,
    | "font"
    | "logo_url"
    | "max_users"
    | "module_documents"
    | "module_forms"
    | "module_map"
    | "module_members"
    | "module_messaging"
    | "module_news"
    | "module_notifications"
    | "module_planning"
    | "primary_color"
    | "secondary_color"
    | "splash_bg_color"
  >;
}

export interface PaginatedMeta {
  page: number;
  per_page: number;
  total: number;
}

export interface ApiSuccess<TData> {
  data: TData;
  meta?: PaginatedMeta;
  success: true;
}

export interface ApiErrorDetail {
  code: string;
  details?: unknown;
  message: string;
}

export interface ApiFailure {
  error: ApiErrorDetail;
  success: false;
}
