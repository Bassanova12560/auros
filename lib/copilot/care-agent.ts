import { completeAiText } from "@/lib/ai-router";
import { searchRag } from "@/lib/ai-first/rag/search";
import { siteOrigin } from "@/lib/emails/constants";
import { START_HREF, WIZARD_EXPRESS_HREF } from "@/lib/wizard-routes";

import { insertCopilotDraft } from "./drafts-store";
import type { CopilotDraft } from "./types";

function parseJsonObject(text: string): Record<string, unknown> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Client-care email drafts (RAG + optional AI) — human approve only, never auto-send.
 */
export async function runClientCareDraftAgent(options?: {
  limit?: number;
  segment?: string;
}): Promise<CopilotDraft[]> {
  const origin = siteOrigin();
  const segments = [
    {
      id: "dossier_incomplete",
      query: "dossier RWA wizard express data room 3 priorités reprise",
      audience: "Issuer with incomplete RWA dossier",
      next_step: `${origin}/dossier`,
      tip_fr:
        "Reprenez le parcours express (8 écrans) ou les 3 priorités data room — l’incomplet est normal.",
    },
    {
      id: "eau_resilience",
      query: "WELHR WETS continuité data center eau risque legal",
      audience: "Data-center / water-energy prospect",
      next_step: `${origin}/eau/risk`,
      tip_fr:
        "Commencez par un score WELHR indicatif, puis le playbook continuité — max 3 priorités.",
    },
    {
      id: "first_win",
      query: "commencer AUROS start score dossier Shield",
      audience: "Cold lead / first visit",
      next_step: `${origin}${START_HREF}`,
      tip_fr:
        "Choisissez une porte en 4 minutes : express dossier, score instantané, ou essai Shield.",
    },
  ] as const;

  const max = Math.min(options?.limit ?? 3, 5);
  const filter = options?.segment?.trim().toLowerCase();
  const picked = segments
    .filter((s) => !filter || s.id.includes(filter) || filter.includes(s.id))
    .slice(0, max);

  const drafts: CopilotDraft[] = [];

  for (const seg of picked) {
    const rag = searchRag({ query: seg.query, limit: 4 });
    const hits = rag.results ?? [];
    const context = hits
      .slice(0, 3)
      .map((h) => `- ${h.title}: ${h.canonicalUrl}`)
      .join("\n");

    let body: Record<string, unknown> = {
      channel: "email",
      segment: seg.id,
      audience: seg.audience,
      subject_fr: `AUROS — un prochain pas pour vous`,
      subject_en: `AUROS — one clear next step`,
      body_fr: `Bonjour,\n\n${seg.tip_fr}\n\nProchain pas : ${seg.next_step}\n\nIndicatif — pas un conseil juridique. Counsel requis avant émission.\n\n— AUROS`,
      body_en: `Hello,\n\nOne clear next step (indicative): ${seg.next_step}\n\nNot legal advice — counsel required before issuance.\n\n— AUROS`,
      cta_url: seg.next_step,
      express_url: `${origin}${WIZARD_EXPRESS_HREF}`,
      rag_citations: hits.slice(0, 3).map((h) => ({
        title: h.title,
        url: h.canonicalUrl,
      })),
    };

    let confidence = 0.58;
    let aiProvider: string | null = null;

    const enriched = await completeAiText({
      system: `You write short AUROS client-care emails for human review before send.
Output ONLY JSON: { "subject_fr": string, "subject_en": string, "body_fr": string, "body_en": string, "cta_url": string }
Rules: warm professional FR/EN; one next step only; no invented APY/partners/35%/sans clic; mention incomplete is OK; cite that analyses are indicative; keep under 120 words per body; use provided CTA URL.`,
      user: `segment=${seg.id}\naudience=${seg.audience}\ncta=${seg.next_step}\ntip_fr=${seg.tip_fr}\nRAG:\n${context || "(none)"}`,
      maxTokens: 500,
    });

    if (enriched) {
      const parsed = parseJsonObject(enriched.text);
      if (parsed) {
        body = { ...body, ...parsed, cta_url: seg.next_step };
        confidence = 0.74;
        aiProvider = enriched.provider;
      }
    }

    drafts.push(
      await insertCopilotDraft({
        kind: "content",
        title: `Care email: ${seg.id}`,
        rationale: aiProvider
          ? `Client-care draft via ${aiProvider} + RAG — approve then send manually (Resend/ops). Never auto-send.`
          : `Client-care draft (template+RAG) — approve then send manually. Never auto-send.`,
        confidence,
        product_id: null,
        proposed_patch: {
          content_kind: "email_care",
          segment: seg.id,
          body,
          ai_provider: aiProvider,
          merge_hint:
            "APPROVE ONLY stores status. Copy subject/body into Resend or CRM — no auto-email from Copilot.",
        },
      })
    );
  }

  return drafts;
}
