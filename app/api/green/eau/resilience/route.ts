import {
  authenticateGreenPublicRequest,
  greenApiJson,
  greenApiOptions,
} from "@/lib/green/api";

export const revalidate = 3600;

export function OPTIONS() {
  return greenApiOptions();
}

/**
 * Discovery catalog for eau / resilience machine APIs.
 * GET /api/green/eau/resilience
 */
export async function GET(req: Request) {
  const authResult = await authenticateGreenPublicRequest(req);
  if (!authResult.ok) return authResult.response;

  return greenApiJson(
    {
      ok: true,
      product: "eau_resilience_api",
      chain: ["detect_welhr", "decide_playbook", "prove_wets_verify"],
      endpoints: [
        {
          method: "POST",
          path: "/api/green/eau/legal-risk",
          role: "detect",
          summary: "WELHR — stress hydrique & legal local",
        },
        {
          method: "POST",
          path: "/api/green/eau/continuity-playbook",
          role: "decide",
          summary: "Playbook continuité 3 scénarios chiffrés",
        },
        {
          method: "POST",
          path: "/api/green/eau/roi",
          role: "decide",
          summary: "Simulateur ROI eau / OPEX indicatif",
        },
        {
          method: "POST",
          path: "/api/green/eau/resilience-brief",
          role: "cockpit",
          summary: "Score résilience + max 3 priorités",
        },
        {
          method: "POST",
          path: "/api/green/eau/supplier-screen",
          role: "esg",
          summary: "Hygiène claims fournisseurs (anti-washing)",
        },
        {
          method: "GET",
          path: "/api/green/eau/resource-signals",
          role: "monitor",
          summary: "Bandes indicatives spot / minerais / stress",
        },
        {
          method: "GET",
          path: "/api/green/eau/connectors",
          role: "integrate",
          summary: "Contrats export BIM/ERP",
        },
        {
          method: "POST",
          path: "/api/resilience/continuity-playbook/pdf",
          role: "export",
          summary: "PDF one-pager (body: { playbook })",
        },
      ],
      pages: {
        resilience: "/resilience",
        h2o_rwa: "/h2o-rwa",
        welhr: "/eau/risk",
        playbook: "/eau/continuity/playbook",
        compass: "/compass",
        demo_100mw: "/demos/data-center-100mw",
        suppliers: "/eau/suppliers",
        integrations: "/integrations",
        resource_signals: "/data/resource-signals",
        wets: "/eau/trust",
        openapi: "/api/green/openapi",
        social_ops: "/ops/copilot",
      },
      disclaimer:
        "Indicatif — pas un conseil juridique, d’ingénierie ou d’investissement. Counsel / EPC requis.",
      generated_at: new Date().toISOString(),
      tier: authResult.auth.tier,
    },
    { auth: authResult.auth }
  );
}
