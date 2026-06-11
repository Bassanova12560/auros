import { checkAiDailyBudget, consumeAiDailyBudget } from "@/lib/ai-budget";
import {
  dossierCacheKey,
  getCachedDossier,
  setCachedDossier,
} from "@/lib/ai-cache";
import { generateDossierContent } from "@/lib/ai-router";
import { generateTemplateDossier } from "@/lib/ai-template-fallback";
import { isSimulationMode } from "@/lib/simulation/mode";
import { isLocale, type Locale } from "@/lib/i18n";
import { isValidCaptureEmail } from "@/lib/email-capture";
import { siteOrigin } from "@/lib/emails/constants";
import { sendWizardComplete } from "@/lib/emails/send";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { tierFromScore } from "@/lib/score";
import { isWizardTier } from "@/lib/wizard-modes";
import { computeWizardScore } from "@/lib/wizard-scoring";
import { normalizeWizardData } from "@/lib/wizard-types";

export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const { allowed } = checkRateLimit(`generate:${ip}`, 10, 3_600_000);
  if (!allowed) {
    return Response.json(
      { ok: false, error: "Rate limit exceeded. Try again in 1 hour." },
      { status: 429 }
    );
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const raw =
      body.data && typeof body.data === "object"
        ? (body.data as Record<string, unknown>)
        : body;
    const wizardData = normalizeWizardData(raw);

    const wizardMode =
      typeof body.wizardMode === "string"
        ? body.wizardMode
        : typeof raw.wizardMode === "string"
          ? raw.wizardMode
          : undefined;
    const paidTier =
      typeof body.paidTier === "string"
        ? body.paidTier
        : typeof raw.paidTier === "string"
          ? raw.paidTier
          : undefined;

    const isLegacyDossier = wizardMode === undefined && paidTier === undefined;
    const templateOnly =
      !isLegacyDossier &&
      (wizardMode === "explore" ||
        !paidTier ||
        !isWizardTier(paidTier));

    if (!wizardData.assetType?.trim()) {
      return Response.json(
        { ok: false, error: "assetType is required" },
        { status: 400 }
      );
    }

    const rawLocale = body.locale;
    const locale: Locale =
      typeof rawLocale === "string" && isLocale(rawLocale) ? rawLocale : "fr";

    if (isSimulationMode() || templateOnly) {
      const sections = generateTemplateDossier(wizardData, locale);
      return Response.json({
        ok: true,
        provider: isSimulationMode() ? "simulation" : "template",
        cached: false,
        templateOnly: templateOnly && !isSimulationMode(),
        generatedAt: new Date().toISOString(),
        ...sections,
      });
    }

    const cacheKey = dossierCacheKey(wizardData, locale);
    const cached = getCachedDossier(cacheKey);
    if (cached) {
      return Response.json({
        ok: true,
        provider: cached.provider,
        cached: true,
        generatedAt: new Date().toISOString(),
        ...cached.content,
      });
    }

    const budget = checkAiDailyBudget();
    const budgetExhausted = !budget.allowed;

    if (!budgetExhausted) {
      consumeAiDailyBudget();
    }

    const result = await generateDossierContent(wizardData, locale, {
      providersOnly: budgetExhausted ? ["gemini"] : undefined,
    });

    const { provider, ...sections } = result;
    setCachedDossier(cacheKey, sections, provider);

    const email = wizardData.email?.trim();
    if (email && isValidCaptureEmail(email)) {
      const { score } = computeWizardScore(wizardData);
      const tier = tierFromScore(score);
      void sendWizardComplete(email, {
        firstName: wizardData.firstName?.trim() || "there",
        score,
        tierLabel: tier.label,
        assetType: wizardData.assetType,
        city: wizardData.city,
        country: wizardData.country,
        dossierUrl: `${siteOrigin()}/dossier`,
        locale,
      });
    }

    return Response.json({
      ok: true,
      provider,
      cached: false,
      budgetExhausted,
      qualityMode: !process.env.AI_ECONOMY_MODE,
      generatedAt: new Date().toISOString(),
      ...sections,
    });
  } catch (err) {
    console.error("[api/generate]", err);
    return Response.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Generation failed",
      },
      { status: 500 }
    );
  }
}
