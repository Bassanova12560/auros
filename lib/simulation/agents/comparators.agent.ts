import { COMPARATOR_ROUTES } from "@/lib/comparators/constants";
import {
  filterRwaPools,
  formatTvl,
  getComparatorMessages,
  groupPoolsByProduct,
  isComparatorPath,
  type DefiLlamaPool,
} from "@/lib/comparators";
import { check, type SimCheck } from "@/lib/simulation/types";

const AGENT = "comparators";

export function runComparatorsAgent(): SimCheck[] {
  const checks: SimCheck[] = [];

  const routes = Object.values(COMPARATOR_ROUTES);
  checks.push(
    check(AGENT, "comparator routes", routes.length >= 5, routes.join(", "))
  );

  checks.push(
    check(
      AGENT,
      "path registry",
      isComparatorPath("/stablecoins") && isComparatorPath("/compare"),
      "/compare + /stablecoins"
    )
  );

  for (const locale of ["fr", "en", "es"] as const) {
    const m = getComparatorMessages(locale);
    checks.push(
      check(
        AGENT,
        `i18n ${locale}`,
        Boolean(m.stablecoins.title && m.compareHub.title),
        locale
      )
    );
  }

  const sample: DefiLlamaPool[] = [
    {
      pool: "a",
      chain: "Ethereum",
      project: "ondo-yield-assets",
      symbol: "USDY",
      tvlUsd: 500_000,
      apy: 3.5,
    },
    {
      pool: "b",
      chain: "Ethereum",
      project: "maple",
      symbol: "USDC",
      tvlUsd: 50_000,
      apy: 5,
    },
  ];

  const filtered = filterRwaPools(sample, ["ondo-yield-assets"]);
  checks.push(
    check(AGENT, "pool filter", filtered.length === 1, `${filtered.length} row`)
  );

  const grouped = groupPoolsByProduct(filtered);
  checks.push(
    check(AGENT, "group pools", grouped.length === 1, `${grouped.length} group`)
  );

  checks.push(
    check(AGENT, "tvl format", formatTvl(12_000_000) === "$12M", formatTvl(12_000_000))
  );

  return checks;
}
