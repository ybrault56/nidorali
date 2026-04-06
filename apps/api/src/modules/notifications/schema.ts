import { z } from "zod";

export const notificationSchema = z.object({
  body: z.string().min(3).max(500),
  data: z.record(z.unknown()).optional(),
  target: z.enum(["all", "admins", "specific"]),
  target_user_ids: z.array(z.string().uuid()).optional(),
  title: z.string().min(2).max(140),
});
