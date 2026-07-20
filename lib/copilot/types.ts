export const COPILOT_ROUTE = "/copilot";
export const COPILOT_OPS_ROUTE = "/ops/copilot";
export const COPILOT_RTMS_STORAGE_KEY = "auros_copilot_rtms_brief";
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

export type CopilotSurface =
  | "compare"
  | "jurisdiction"
  | "chargeflow"
  | "green"
  | "rtms"
  | "watts"
  | "generic";

export type CopilotPageContext = {
  surface: CopilotSurface;
  product_ids?: string[];
  jurisdiction_id?: string;
  /** Short RTMS project brief (from assistant bridge; not inventable). */
  rtms_brief?: string;
};

export type CopilotChatRequest = {
  message: string;
  locale?: "fr" | "en" | "es" | "ar" | "zh";
  history?: CopilotChatMessage[];
  context?: CopilotPageContext;
};

export type CopilotChatResponse = {
  reply: string;
  provider: string;
  citations: CopilotCitation[];
  disclaimer: string;
  tools_used: string[];
  /** Product IDs the assistant proposes to add to /compare (read-only suggestion). */
  suggested_product_ids: string[];
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

/** Build /copilot?context=…&ids=…&jid=… for page deep-links. */
export function buildCopilotHref(ctx?: Partial<CopilotPageContext>): string {
  if (!ctx?.surface || ctx.surface === "generic") {
    if (!ctx?.product_ids?.length && !ctx?.jurisdiction_id) return COPILOT_ROUTE;
  }
  const params = new URLSearchParams();
  const surface = ctx.surface ?? "generic";
  if (surface !== "generic") params.set("context", surface);
  if (ctx.product_ids?.length) {
    params.set("ids", ctx.product_ids.slice(0, 4).join(","));
  }
  if (ctx.jurisdiction_id) params.set("jid", ctx.jurisdiction_id);
  const q = params.toString();
  return q ? `${COPILOT_ROUTE}?${q}` : COPILOT_ROUTE;
}

export function parseCopilotSearchParams(params: {
  context?: string | null;
  ids?: string | null;
  jid?: string | null;
}): CopilotPageContext {
  const raw = (params.context ?? "").toLowerCase();
  const surface: CopilotSurface =
    raw === "compare" ||
    raw === "jurisdiction" ||
    raw === "chargeflow" ||
    raw === "green" ||
    raw === "rtms" ||
    raw === "watts"
      ? raw
      : params.ids
        ? "compare"
        : params.jid
          ? "jurisdiction"
          : "generic";
  const product_ids = (params.ids ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);
  const jurisdiction_id = params.jid?.trim() || undefined;
  return {
    surface,
    product_ids: product_ids.length ? product_ids : undefined,
    jurisdiction_id,
  };
}

export function suggestionsForContext(ctx: CopilotPageContext): string[] {
  if (ctx.surface === "watts") {
    return [
      "Qu’est-ce qu’AUROS Watts ?",
      "Différence firm vs flex (CFU-E / CFU-F) ?",
      "Comment passer de réservation à listing secondaire ?",
    ];
  }
  if (ctx.surface === "chargeflow") {
    return [
      "Qu’est-ce que ChargeFlow CFU-E ?",
      "Différence CFU-E / CFU-W / CFU-F ?",
      "Comment fonctionne la console opérateurs ?",
    ];
  }
  if (ctx.surface === "green") {
    return [
      "Explique CQS et Watt Score",
      "Comment préparer un dossier RTMS ?",
      "Différence label Green et marketplace",
    ];
  }
  if (ctx.surface === "rtms") {
    return [
      "Que manque-t-il pour le label Green Verified ?",
      "Priorise 3 écarts RTMS sur mon brief",
      "Prochaines étapes standards + label",
    ];
  }
  if (ctx.surface === "jurisdiction" && ctx.jurisdiction_id) {
    return [
      `Pourquoi considérer ${ctx.jurisdiction_id} pour un RWA ?`,
      `Coûts et délais indicatifs pour ${ctx.jurisdiction_id}`,
      "Comparer les top juridictions AUROS",
    ];
  }
  if (ctx.surface === "compare" && ctx.product_ids && ctx.product_ids.length >= 2) {
    return [
      `Compare ${ctx.product_ids.slice(0, 2).join(" et ")}`,
      "Propose 1–2 RWA à ajouter à la comparaison",
      "Quels risques / liquidité pour cette sélection ?",
    ];
  }
  if (ctx.surface === "compare") {
    return [
      "Propose des RWA à comparer (stablecoins)",
      "Top stablecoins APY sur le comparateur",
      "Comment lire TVL et liquidité ?",
    ];
  }
  return [
    "Propose des RWA à comparer",
    "Explique ChargeFlow CFU-E",
    "Explique CQS et Watt Score",
  ];
}
