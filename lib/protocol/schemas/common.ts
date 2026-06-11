import { z } from "zod";

export const protocolMetaSchema = z.object({
  version: z.literal("1.0"),
  computed_at: z.string(),
  request_id: z.string().optional(),
});

export type ProtocolMeta = z.infer<typeof protocolMetaSchema>;
