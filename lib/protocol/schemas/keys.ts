import { z } from "zod";

export const createKeyRequestSchema = z.object({
  email: z.string().email().max(254),
});

export const createKeyResponseSchema = z.object({
  disclaimer: z.string(),
  ok: z.boolean(),
  api_key: z.string().optional(),
  tier: z.enum(["free"]).optional(),
  monthly_limit: z.number().optional(),
  message: z.string().optional(),
});

export type CreateKeyRequest = z.infer<typeof createKeyRequestSchema>;
