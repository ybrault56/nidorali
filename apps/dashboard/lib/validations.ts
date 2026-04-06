import { z } from "zod";

export const brandingStepSchema = z.object({
  app_name: z.string().min(2).max(120),
  billing_email: z.string().email(),
  bundle_id: z.string().min(6).max(120),
  font: z.string().min(2).max(40),
  logo_url: z.string().url().nullable(),
  primary_color: z.string().regex(/^#([A-Fa-f0-9]{6})$/),
  secondary_color: z.string().regex(/^#([A-Fa-f0-9]{6})$/),
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
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

export const checkoutPayloadSchema = brandingStepSchema.merge(modulesStepSchema).merge(usersStepSchema).extend({
  plan: z.enum(["starter", "pro", "enterprise"]),
});
