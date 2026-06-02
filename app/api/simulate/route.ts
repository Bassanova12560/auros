import { isSimulateApiAllowed } from "@/lib/simulation/mode";
import {
  formatEcosystemReport,
  runEcosystemSimulation,
} from "@/lib/simulation/ecosystem";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  process.env.BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export async function GET(req: Request) {
  if (!isSimulateApiAllowed()) {
    return Response.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const withHttp = url.searchParams.get("http") === "1";
  const withIntegrations = url.searchParams.get("integrations") !== "0";
  const format = url.searchParams.get("format");

  const report = await runEcosystemSimulation({
    baseUrl: BASE,
    withHttp,
    withIntegrations,
  });

  if (format === "text") {
    return new Response(formatEcosystemReport(report), {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return Response.json({
    ...report,
    demoWizardUrl: `${BASE}/wizard?demo=1`,
    hint: "Add ?http=1 for smoke tests. ?integrations=0 to skip DB/env probes. ?format=text for plain report.",
  });
}
