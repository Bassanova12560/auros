import Link from "next/link";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

export type NextLink = {
  href: string;
  label: string;
  hint?: string;
};

type Props = {
  /** Exactly one primary action — Apple/Ondo discipline */
  primary: NextLink;
  /** Soft text links only (0–2) */
  secondary?: NextLink[];
  /** Horizontal neighbor rail — no pills */
  neighbors?: NextLink[];
  className?: string;
};

/**
 * Morpho/Apple-style continue strip: one primary + soft neighbors.
 * Use instead of stacking PrimaryButton farms.
 */
export function NextStepStrip({ primary, secondary = [], neighbors = [], className = "" }: Props) {
  return (
    <section
      className={`space-y-4 border-t border-white/[0.08] pt-8 ${className}`}
      aria-label="Next steps"
    >
      <div className="flex flex-wrap items-center gap-4">
        <PrimaryButton href={primary.href}>{primary.label}</PrimaryButton>
        {secondary.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="font-mono text-[11px] text-white/50 underline-offset-4 transition hover:text-white hover:underline"
          >
            {s.label}
            {s.hint ? <span className="text-white/30"> · {s.hint}</span> : null}
          </Link>
        ))}
      </div>
      {neighbors.length > 0 ? (
        <p className="font-mono text-[10px] leading-relaxed text-white/35">
          Also nearby{" "}
          {neighbors.map((n, i) => (
            <span key={n.href}>
              {i > 0 ? " · " : null}
              <Link href={n.href} className="text-white/50 underline-offset-2 hover:text-white hover:underline">
                {n.label}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
    </section>
  );
}
