import { z } from "zod";

export const createConversationSchema = z.object({
  member_ids: z.array(z.string().uuid()).default([]),
  title: z.string().min(2).max(120).nullable().optional(),
  type: z.enum(["direct", "group", "broadcast"]).optional(),
});

export const createMessageSchema = z.object({
  content: z.string().min(1).max(5000),
  media_url: z.string().url().nullable().optional(),
  type: z.enum(["text", "image", "file"]).optional(),
});
