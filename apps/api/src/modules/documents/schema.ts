import { z } from "zod";

export const documentSchema = z.object({
  category: z.string().max(80).nullable().optional(),
  file_size: z.number().int().positive().nullable().optional(),
  file_type: z.string().max(80).nullable().optional(),
  file_url: z.string().url(),
  name: z.string().min(2).max(160),
});
