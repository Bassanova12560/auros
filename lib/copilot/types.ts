export const COPILOT_ROUTE = "/copilot";
export const COPILOT_OPS_ROUTE = "/ops/copilot";
export const COPILOT_DISCLAIMER =
  "AUROS Copilot is indicative only — not legal, investment, or regulatory advice. Scores, attestations, and ChargeFlow units are never modified by this assistant.";

export type CopilotDraftKind = "catalog" | "content";
export type CopilotDraftStatus = "pending" | "approved" | "rejected";

export type CopilotCitation = {
  title: string;
  url: string;
};

export type CopilotChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type CopilotChatRequest = {
  message: string;
  locale?: "fr" | "en" | "es";
  history?: CopilotChatMessage[];
};

export type CopilotChatResponse = {
  reply: string;
  provider: string;
  citations: CopilotCitation[];
  disclaimer: string;
  tools_used: string[];
};

export type CopilotDraft = {
  id: string;
  kind: CopilotDraftKind;
  status: CopilotDraftStatus;
  title: string;
  rationale: string;
  proposed_patch: Record<string, unknown>;
  confidence: number;
  product_id: string | null;
  apply_result: string | null;
  created_at: string;
  reviewed_at: string | null;
  review_note: string | null;
};
