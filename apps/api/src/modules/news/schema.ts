import { z } from "zod";

export const newsSchema = z.object({
  content: z.string().min(10),
  cover_url: z.string().url().nullable().optional(),
  is_published: z.boolean().optional(),
  published_at: z.string().datetime().nullable().optional(),
  title: z.string().min(3).max(180),
});
