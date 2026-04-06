import { z } from "zod";

export const registerSchema = z.object({
  display_name: z.string().min(2).max(80).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(120),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(120),
});

export const pushTokenSchema = z.object({
  push_token: z.string().min(10),
});
