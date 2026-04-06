export const TENANT_STATUSES = [
  "pending",
  "building",
  "live",
  "suspended",
  "cancelled",
] as const;

export const TENANT_PLANS = ["starter", "pro", "enterprise"] as const;

export const APP_USER_ROLES = ["member", "admin", "moderator"] as const;

export const CONVERSATION_TYPES = ["direct", "group", "broadcast"] as const;

export const MESSAGE_TYPES = ["text", "image", "file"] as const;

export const EVENT_ATTENDEE_STATUSES = ["going", "maybe", "not_going"] as const;

export const BUILD_JOB_STATUSES = [
  "queued",
  "processing",
  "building",
  "submitting",
  "done",
  "failed",
] as const;

export const BUILD_JOB_PLATFORMS = ["android", "ios", "both"] as const;

export const MODULE_KEYS = [
  "module_members",
  "module_messaging",
  "module_planning",
  "module_notifications",
  "module_news",
  "module_documents",
  "module_map",
  "module_forms",
] as const;

export const MODULE_DEFINITIONS = [
  {
    description: "Annuaire et profils privés",
    included: true,
    key: "module_members",
    label: "Espace membre",
  },
  {
    description: "Messages directs et groupes",
    included: false,
    key: "module_messaging",
    label: "Messagerie",
  },
  {
    description: "Agenda, événements et présence",
    included: false,
    key: "module_planning",
    label: "Planning",
  },
  {
    description: "Push Expo segmentés",
    included: true,
    key: "module_notifications",
    label: "Notifications",
  },
  {
    description: "Fil d'actualités éditorial",
    included: false,
    key: "module_news",
    label: "Actualités",
  },
  {
    description: "Bibliothèque de documents",
    included: false,
    key: "module_documents",
    label: "Documents",
  },
  {
    description: "Carte et points d'intérêt",
    included: false,
    key: "module_map",
    label: "Carte",
  },
  {
    description: "Formulaires configurables",
    included: false,
    key: "module_forms",
    label: "Formulaires",
  },
] as const;

export const DEFAULT_THEME = {
  background: "#FFFFFF",
  brand: "#0F62FE",
  muted: "#8890B5",
  primary: "#0F62FE",
  secondary: "#A7D8FF",
  splash: "#FFFFFF",
  text: "#182033",
} as const;
