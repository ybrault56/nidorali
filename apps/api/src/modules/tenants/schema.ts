import { z } from "zod";

export const buildTriggerSchema = z.object({
  platform: z.enum(["android", "ios", "both"]).default("both"),
});

export const uploadLogoSchema = z.object({
  content_type: z.string().min(3).max(80).default("image/png"),
  tenant_id: z.string().uuid().optional(),
});

export const simulationBuildUpdateSchema = z.object({
  android_artifact_url: z.string().url().nullable().optional(),
  app_store_url: z.string().url().nullable().optional(),
  completed_at: z.string().datetime().nullable().optional(),
  eas_build_id_android: z.string().nullable().optional(),
  eas_build_id_ios: z.string().nullable().optional(),
  error_message: z.string().nullable().optional(),
  ios_artifact_url: z.string().url().nullable().optional(),
  play_store_url: z.string().url().nullable().optional(),
  started_at: z.string().datetime().nullable().optional(),
  status: z.enum(["queued", "processing", "building", "submitting", "done", "failed"]),
  tenant_id: z.string().uuid(),
});
