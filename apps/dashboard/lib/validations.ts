import { z } from "zod";

export const organizationStepSchema = z.object({
  billing_email: z.string().email(),
  organization_type: z.enum(["association", "autre", "collectivite", "entreprise"]),
});

export const identityStepSchema = z.object({
  app_name: z.string().min(2).max(120),
  logo_url: z.string().url().nullable(),
  primary_color: z.string().regex(/^#([A-Fa-f0-9]{6})$/),
  secondary_color: z.string().regex(/^#([A-Fa-f0-9]{6})$/),
  splash_bg_color: z.string().regex(/^#([A-Fa-f0-9]{6})$/),
});

export const modulesStepSchema = z.object({
  module_documents: z.boolean(),
  module_forms: z.boolean(),
  module_map: z.boolean(),
  module_members: z.boolean(),
  module_messaging: z.boolean(),
  module_news: z.boolean(),
  module_notifications: z.boolean(),
  module_planning: z.boolean(),
});

export const usersStepSchema = z.object({
  max_users: z.number().int().positive().max(50000),
});

export const checkoutPayloadSchema = organizationStepSchema.merge(identityStepSchema).merge(modulesStepSchema).merge(usersStepSchema).extend({
  plan: z.enum(["starter", "pro", "enterprise"]),
});

export const customerAuthSchema = z.object({
  display_name: z.string().min(2).max(80).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(120),
});
