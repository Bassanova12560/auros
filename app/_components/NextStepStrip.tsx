"use client";

import Link from "next/link";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  getArlUi,
  getEcosystemPreset,
  type EcosystemPreset,
  type NextLink,
} from "@/lib/arl/ui-i18n";

export type { NextLink };

type Props = {
  primary?: NextLink;
  secondary?: NextLink[];
  neighbors?: NextLink[];
  /** Localized preset from ecosystem neighbors catalog */
  preset?: EcosystemPreset;
  className?: string;
};

/**
 * Morpho/Apple-style continue strip: one primary + soft neighbors.
 */
export function NextStepStrip({
  primary,
  secondary,
  neighbors,
  preset,
  className = "",
}: Props) {
  const { locale } = useLocale();
  const ui = getArlUi(locale);
  const fromPreset = preset ? getEcosystemPreset(locale, preset) : null;
  const p = fromPreset?.primary ?? primary;
  const s = fromPreset?.secondary ?? secondary ?? [];
  const n = fromPreset?.neighbors ?? neighbors ?? [];

  if (!p) return null;

  return (
    <section
      className={`space-y-4 border-t border-white/[0.08] pt-8 ${className}`}
      aria-label={ui.strip.nextStepsAria}
    >
      <div className="flex flex-wrap items-center gap-4">
        <PrimaryButton href={p.href}>{p.label}</PrimaryButton>
        {s.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-mono text-[11px] text-white/50 underline-offset-4 transition hover:text-white hover:underline"
          >
            {item.label}
            {item.hint ? <span className="text-white/30"> · {item.hint}</span> : null}
          </Link>
        ))}
      </div>
      {n.length > 0 ? (
        <p className="font-mono text-[10px] leading-relaxed text-white/35">
          {ui.strip.alsoNearby}{" "}
          {n.map((item, i) => (
            <span key={item.href}>
              {i > 0 ? " · " : null}
              <Link
                href={item.href}
                className="text-white/50 underline-offset-2 hover:text-white hover:underline"
              >
                {item.label}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
    </section>
  );
}
