import Link from "next/link";
import type { ReactNode } from "react";

import type { GreenMarketListingTier } from "@/lib/green/market/types";

/** Vert royal AUROS Green — accent unique, plus profond qu’emerald. */
export const greenAccentClass = "text-green-royal";
export const greenAccentHoverClass = "hover:text-green-royal-bright";

/** Primary CTA — white on black, AUROS editorial. */
export const greenBtnClass =
  "green-btn-primary !border !border-white !bg-white !text-black hover:!bg-[#fafaf8] hover:!border-green-royal/30";

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
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={`green-form-panel border bg-black ${className}`} {...rest}>
      {children}
    </div>
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
    <header className="max-w-3xl">
      <p className="font-mono text-[11px] tracking-wide text-white/45">{eyebrow}</p>
      <h1
        className={`mt-4 font-display font-semibold tracking-[-0.02em] text-white ${
          compact ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"
        }`}
      >
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-white/55 md:text-lg">
        {intro}
      </p>
    </header>
  );
}

export function GreenSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-mono text-[11px] tracking-wide text-white/45">{children}</h2>
  );
}

export function GreenFieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">{children}</p>
  );
}

export function GreenFormStepBar({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label: string;
}) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="mb-6" aria-label={label}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/45">{label}</p>
        <p className="font-mono text-[10px] tabular-nums text-green-royal-bright">
          {current}/{total}
        </p>
      </div>
      <div
        className="mt-2 h-0.5 w-full bg-white/[0.08]"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        <div
          className="h-full bg-green-royal transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
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
      className="green-hub-card-hover group flex min-h-[88px] items-center justify-between border border-white/[0.08] bg-black px-5 py-4 hover:bg-white/[0.02]"
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
