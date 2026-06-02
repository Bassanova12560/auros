import { NextResponse } from "next/server";

import { computeAdmissionReadiness } from "@/lib/admission-scoring";
import { detectAssetTypeFromText, calculateScoreFromText } from "@/lib/score";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";

/** Local scoring + admission estimate (no LLM). */
export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const { allowed } = checkRateLimit(`score:${ip}`, 20, 3_600_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again in 1 hour." },
      { status: 429 }
    );
  }

  try {
    const body = (await req.json()) as { query?: string };
    const query = body.query?.trim();
    if (!query) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    const score = calculateScoreFromText(query);
    const assetType = detectAssetTypeFromText(query);
    const readiness = computeAdmissionReadiness({
      assetType,
      description: query,
      estimatedValue: 250_000,
      currency: "EUR",
      country: "",
      city: "",
      documents: [],
      goals: [],
      timeline: "",
      platform: "",
      legalStructure: "",
      incomeType: "",
      incomeAmountYear: 0,
      incomeDescription: "",
      legalStatus: [],
      investorProfile: "",
      additionalNotes: "",
    });

    return NextResponse.json({
      score,
      yield: score >= 75 ? "6.5%" : score >= 51 ? "5.8%" : "4.5%",
      admissionPercent: readiness.overallAdmission,
      reasoning: `Admission readiness ${readiness.overallAdmission}% (heuristic, complete the wizard for accuracy).`,
    });
  } catch (err) {
    console.error("[api/score]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Score failed" },
      { status: 500 }
    );
  }
}
