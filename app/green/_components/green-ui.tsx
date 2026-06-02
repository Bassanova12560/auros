import Link from "next/link";
import type { ReactNode } from "react";

import type { GreenMarketListingTier } from "@/lib/green/market/types";

/** Vert royal AUROS Green — accent unique, plus profond qu’emerald. */
export const greenAccentClass = "text-green-royal";
export const greenAccentHoverClass = "hover:text-green-royal-bright";

/** Primary CTA — white on black, AUROS editorial. */
export const greenBtnClass =
  "!border !border-white !bg-white !text-black hover:!bg-neutral-200";

/** Mot Green rempli de la photo forêt vue du dessus. */
export function GreenForestWord({
  children = "Green",
  className = "",
  size = "hero",
}: {
  children?: ReactNode;
  className?: string;
  size?: "hero" | "sm" | "metric";
}) {
  return (
    <span
      className={`green-forest-text ${size === "sm" ? "green-forest-text-sm" : ""} ${size === "metric" ? "green-forest-text-metric" : ""} ${className}`}
    >
      {children}
    </span>
  );
}

export function GreenListingBadge({
  tier,
  labels,
}: {
  tier: GreenMarketListingTier;
  labels: { demo: string; referenced: string; verified: string };
}) {
  const styles: Record<GreenMarketListingTier, string> = {
    demo: "border-white/15 text-white/40",
    referenced: "border-white/25 text-white/60",
    verified: "border-green-royal text-green-royal",
  };
  return (
    <span
      className={`inline-block border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide ${styles[tier]}`}
    >
      {labels[tier]}
    </span>
  );
}

export function GreenPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-white/[0.08] bg-black ${className}`}>
      {children}
    </div>
  );
}

export function GreenHubHero({ tagline }: { tagline: string }) {
  return (
    <header className="max-w-3xl">
      <h1 className="font-display text-[clamp(2.5rem,7vw,4.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
        AUROS{" "}
        <GreenForestWord />
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
        {tagline}
      </p>
    </header>
  );
}

export function GreenPageHeader({
  eyebrow,
  title,
  intro,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  compact?: boolean;
}) {
  return (
    <header className="max-w-3xl border-l border-white/[0.08] pl-6 md:pl-8">
      <p className="font-mono text-[11px] tracking-wide text-accent-muted">{eyebrow}</p>
      <h1
        className={`mt-3 font-display font-semibold tracking-[-0.02em] text-white ${
          compact ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"
        }`}
      >
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{intro}</p>
    </header>
  );
}

export function GreenSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-mono text-[11px] tracking-wide text-accent-muted">{children}</h2>
  );
}

export function GreenFieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">{children}</p>
  );
}

export function GreenBackLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`mt-8 inline-flex items-center font-mono text-[11px] uppercase tracking-wider text-white/40 ${greenAccentHoverClass} hover:text-white`}
    >
      {children}
    </Link>
  );
}

export function GreenDisclaimer({ children }: { children: ReactNode }) {
  return (
    <p className="mt-16 max-w-2xl text-[11px] leading-relaxed text-white/35">{children}</p>
  );
}

export function GreenTierBadge({
  tier,
  verifiedLabel,
  pilotLabel,
}: {
  tier: "verified" | "pilot";
  verifiedLabel: string;
  pilotLabel: string;
}) {
  const verified = tier === "verified";
  return (
    <span
      className={`inline-block border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide ${
        verified
          ? "border-green-royal text-green-royal"
          : "border-white/15 text-white/40"
      }`}
    >
      {verified ? verifiedLabel : pilotLabel}
    </span>
  );
}

export function GreenNavTile({
  href,
  title,
  index,
}: {
  href: string;
  title: string;
  index: number;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-[88px] items-center justify-between border border-white/[0.08] bg-black px-5 py-4 transition-colors hover:border-white/20 hover:bg-white/[0.02]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <span className="font-display text-base font-semibold tracking-[-0.01em] text-white group-hover:text-accent">
        {title}
      </span>
      <span className="font-mono text-sm text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-white">
        →
      </span>
    </Link>
  );
}
