import { z } from "zod";

const tenantConfigSchema = z.object({
  font: z.string().min(2).max(40),
  logo_url: z.string().url().nullable(),
  max_users: z.number().int().positive(),
  module_documents: z.boolean(),
  module_forms: z.boolean(),
  module_map: z.boolean(),
  module_members: z.boolean(),
  module_messaging: z.boolean(),
  module_news: z.boolean(),
  module_notifications: z.boolean(),
  module_planning: z.boolean(),
  primary_color: z.string().min(4).max(20),
  secondary_color: z.string().min(4).max(20),
  splash_bg_color: z.string().min(4).max(20),
});

export const checkoutSchema = z.object({
  app_name: z.string().min(2).max(120),
  billing_email: z.string().email(),
  bundle_id: z.string().min(6).max(120),
  plan: z.enum(["starter", "pro", "enterprise"]),
  slug: z.string().min(2).max(80),
  tenant_config: tenantConfigSchema,
});
