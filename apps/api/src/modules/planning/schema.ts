import { z } from "zod";

export const eventSchema = z.object({
  color: z.string().min(4).max(20).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  end_at: z.string().datetime(),
  is_all_day: z.boolean().optional(),
  location: z.string().max(160).nullable().optional(),
  max_attendees: z.number().int().positive().nullable().optional(),
  start_at: z.string().datetime(),
  title: z.string().min(2).max(160),
});

export const eventAttendanceSchema = z.object({
  status: z.enum(["going", "maybe", "not_going"]),
});
