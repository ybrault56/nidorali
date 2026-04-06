import { z } from "zod";

export const customerRegisterSchema = z.object({
  display_name: z.string().min(2).max(80).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(120),
});

export const customerLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(120),
});
