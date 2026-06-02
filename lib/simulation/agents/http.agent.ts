import { JURISDICTIONS_ROUTE, JURISDICTIONS_STARTER_KIT_ROUTE } from "@/lib/jurisdictions/constants";
import { getAllSeoLandings } from "@/lib/jurisdictions/seo-landings";
import { COMPARATOR_ROUTES } from "@/lib/comparators/constants";
import { check, warnCheck, type SimCheck } from "@/lib/simulation/types";

const AGENT = "http";

type HttpProbe = {
  name: string;
  path: string;
  expectStatus?: number;
  expectBodyIncludes?: string;
  contentTypeIncludes?: string;
  allow403?: boolean;
};

export async function runHttpAgent(
  baseUrl: string,
  timeoutMs = 20_000
): Promise<SimCheck[]> {
  const base = baseUrl.replace(/\/$/, "");
  const checks: SimCheck[] = [];

  const probes: HttpProbe[] = [
    { name: "home", path: "/", expectBodyIncludes: "AUROS" },
    { name: "wizard", path: "/wizard" },
    { name: "dossier", path: "/dossier" },
    { name: "jurisdictions", path: JURISDICTIONS_ROUTE, expectBodyIncludes: "Starter Kit" },
    {
      name: "starter-kit page",
      path: JURISDICTIONS_STARTER_KIT_ROUTE,
      expectBodyIncludes: "5 000",
    },
    {
      name: "seo landing sample",
      path: `${JURISDICTIONS_ROUTE}/dubai-difc-real-estate`,
      expectBodyIncludes: "DIFC",
    },
    { name: "compare hub", path: COMPARATOR_ROUTES.compare },
    { name: "stablecoins", path: COMPARATOR_ROUTES.stablecoins },
    { name: "real-estate", path: COMPARATOR_ROUTES.realEstate },
    { name: "bonds", path: COMPARATOR_ROUTES.bonds },
    { name: "private-credit", path: COMPARATOR_ROUTES.privateCredit },
    { name: "commodities", path: COMPARATOR_ROUTES.commodities },
    { name: "sitemap", path: "/sitemap.xml", expectBodyIncludes: JURISDICTIONS_ROUTE },
    { name: "robots", path: "/robots.txt" },
    { name: "llms.txt", path: "/llms.txt", expectBodyIncludes: "AUROS", contentTypeIncludes: "text/plain" },
    {
      name: "ai-first index",
      path: "/ai-first/index.json",
      contentTypeIncludes: "application/json",
      expectBodyIncludes: "jurisdictions",
    },
    {
      name: "ai-first page",
      path: "/ai-first/page.json?path=/jurisdictions",
      contentTypeIncludes: "application/json",
      expectBodyIncludes: "intents",
    },
    {
      name: "starter overview pdf",
      path: "/api/jurisdictions/starter-kit-overview/pdf?locale=fr",
      contentTypeIncludes: "application/pdf",
    },
    { name: "api simulate", path: "/api/simulate", allow403: true },
  ];

  for (const probe of probes) {
    try {
      const res = await fetch(`${base}${probe.path}`, {
        redirect: "follow",
        signal: AbortSignal.timeout(timeoutMs),
      });

      let ok = res.ok || res.status === 307;
      const ct = res.headers.get("content-type") ?? "";

      if (probe.allow403 && res.status === 403) {
        checks.push(
          warnCheck(
            AGENT,
            probe.name,
            true,
            "HTTP 403 (enable AUROS_SIMULATION on server for prod API)"
          )
        );
        continue;
      }

      if (probe.contentTypeIncludes) {
        ok = ok && ct.includes(probe.contentTypeIncludes);
      }

      if (probe.expectBodyIncludes && ok) {
        const text = await res.text();
        ok = text.includes(probe.expectBodyIncludes);
        checks.push(
          check(
            AGENT,
            probe.name,
            ok,
            ok ? `HTTP ${res.status}` : `missing "${probe.expectBodyIncludes}"`
          )
        );
      } else {
        checks.push(
          check(AGENT, probe.name, ok, `HTTP ${res.status}${ct ? ` · ${ct.split(";")[0]}` : ""}`)
        );
      }
    } catch (e) {
      checks.push(
        check(
          AGENT,
          probe.name,
          false,
          e instanceof Error ? e.message : String(e)
        )
      );
    }
  }

  // Spot-check a few extra SEO slugs
  const sampleSlugs = getAllSeoLandings().slice(0, 3);
  for (const landing of sampleSlugs) {
    try {
      const res = await fetch(`${base}${JURISDICTIONS_ROUTE}/${landing.slug}`, {
        signal: AbortSignal.timeout(timeoutMs),
      });
      checks.push(
        check(
          AGENT,
          `seo:${landing.slug}`,
          res.ok,
          `HTTP ${res.status}`
        )
      );
    } catch (e) {
      checks.push(
        check(
          AGENT,
          `seo:${landing.slug}`,
          false,
          e instanceof Error ? e.message : String(e)
        )
      );
    }
  }

  // sitemap should list starter-kit + seo pages
  try {
    const res = await fetch(`${base}/sitemap.xml`, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    const xml = await res.text();
    const hasStarter = xml.includes("starter-kit");
    const seoCount = (xml.match(/jurisdictions\//g) ?? []).length;
    checks.push(
      check(
        AGENT,
        "sitemap starter-kit",
        hasStarter,
        hasStarter ? "present" : "missing starter-kit url"
      )
    );
    checks.push(
      check(
        AGENT,
        "sitemap seo depth",
        seoCount >= 20,
        `${seoCount} jurisdiction urls`
      )
    );
  } catch (e) {
    checks.push(
      check(
        AGENT,
        "sitemap parse",
        false,
        e instanceof Error ? e.message : String(e)
      )
    );
  }

  return checks;
}

export async function runHttpGenerateAgent(
  baseUrl: string,
  simulationMode: boolean
): Promise<SimCheck[]> {
  const checks: SimCheck[] = [];
  const base = baseUrl.replace(/\/$/, "");
  const isLocal =
    base.includes("localhost") || base.includes("127.0.0.1");

  if (!simulationMode) {
    checks.push(
      warnCheck(AGENT, "api/generate simulation", true, "skipped (AUROS_SIMULATION=false)")
    );
    return checks;
  }

  if (!isLocal) {
    checks.push(
      warnCheck(
        AGENT,
        "api/generate simulation",
        true,
        "skipped (remote base — set AUROS_SIMULATION on server)"
      )
    );
    return checks;
  }

  const { getSimulationWizardData } = await import("@/lib/simulation/sample-wizard");
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: getSimulationWizardData(), locale: "fr" }),
      signal: AbortSignal.timeout(30_000),
    });
    const json = (await res.json()) as Record<string, unknown>;
    checks.push(
      check(
        AGENT,
        "api/generate simulation",
        res.ok && json.provider === "simulation",
        String(json.provider ?? res.status)
      )
    );
  } catch (e) {
    checks.push(
      check(
        AGENT,
        "api/generate simulation",
        false,
        e instanceof Error ? e.message : String(e)
      )
    );
  }

  return checks;
}
