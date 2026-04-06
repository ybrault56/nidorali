import { z } from "zod";

export const updateMeSchema = z.object({
  avatar_url: z.string().url().nullable().optional(),
  display_name: z.string().min(2).max(80).nullable().optional(),
});
