import Link from "next/link";

import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_PORTFOLIO_ROUTE } from "@/lib/green";
import {
  brandCssVars,
  resolveInstitutionalBrand,
} from "@/lib/green/institutional-branding";
import { getGreenPortfolioSnapshot } from "@/lib/green/portfolio-snapshot";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "AUROS Portfolio embed",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ theme?: string; partner?: string }>;
};

/** White-label KPI strip — iframe-safe via /embed/* headers. */
export default async function EmbedPortfolioPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const theme = sp.theme === "light" ? "light" : "dark";
  const partner = sp.partner?.trim().slice(0, 40) || null;
  const brand = resolveInstitutionalBrand(partner);
  const snapshot = await getGreenPortfolioSnapshot(20);
  const dark = theme === "dark";

  const primary = brand?.primaryColor ?? (dark ? "#34d399" : "#047857");
  const accent = brand?.accentColor ?? primary;
  const label = brand
    ? `${brand.hideAurosBranding ? "" : "AUROS · "}${brand.companyName} · ${brand.productLabel ?? "Portfolio"}`
    : `AUROS · Portfolio${partner ? ` · ${partner}` : ""}`;

  const shell = dark
    ? "min-h-[140px] border p-4 font-sans text-white"
    : "min-h-[140px] border p-4 font-sans text-slate-900";
  const muted = dark ? "text-white/45" : "text-slate-500";

  return (
    <div
      className={shell}
      style={{
        ...brandCssVars(
          brand ?? {
            partnerId: "default",
            companyName: "AUROS",
            primaryColor: primary,
            accentColor: accent,
          }
        ),
        borderColor: `${primary}55`,
        backgroundColor: dark ? "#0a0f0d" : "#f7faf8",
      }}
    >
      <div className="flex items-center gap-2">
        {brand?.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.logoUrl}
            alt=""
            width={72}
            height={24}
            className="h-6 w-auto object-contain"
          />
        ) : null}
        <p
          className="font-mono text-[10px] uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          {label}
        </p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div>
          <p className={`font-mono text-[9px] uppercase tracking-wider ${muted}`}>
            DNA
          </p>
          <p className="mt-1 text-xl tabular-nums">{snapshot.totalDna}</p>
        </div>
        <div>
          <p className={`font-mono text-[9px] uppercase tracking-wider ${muted}`}>
            Live
          </p>
          <p className="mt-1 text-xl tabular-nums">{snapshot.withRecentEvents}</p>
        </div>
        <div>
          <p className={`font-mono text-[9px] uppercase tracking-wider ${muted}`}>
            Alertes
          </p>
          <p className="mt-1 text-xl tabular-nums">{snapshot.alertCount}</p>
        </div>
      </div>
      <p className={`mt-3 text-[11px] leading-relaxed ${muted}`}>
        Indicatif — pas un portefeuille réglementé.
      </p>
      <Link
        href={absoluteUrl(GREEN_PORTFOLIO_ROUTE)}
        className="mt-2 inline-block font-mono text-[10px] uppercase tracking-wider hover:underline"
        style={{ color: accent }}
        target="_blank"
        rel="noopener noreferrer"
      >
        Console →
      </Link>
    </div>
  );
}
