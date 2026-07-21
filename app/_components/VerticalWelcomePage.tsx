import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import type { VerticalWelcomeConfig } from "@/lib/vertical-welcome/config";

type Props = {
  config: VerticalWelcomeConfig;
};

export function VerticalWelcomePage({ config }: Props) {
  const features = config.features.slice(0, 3);
  const primary = config.ctas.filter((c) => c.primary);
  const secondaryCtas = config.ctas.filter((c) => !c.primary);

  return (
    <FocusPageShell path={config.path} width="3xl">
      <ContentPageLayout
        product={config.product}
        eyebrow={config.eyebrow}
        title={config.title}
        intro={config.intro}
      >
        <section aria-label="Fonctionnalités" className="space-y-0">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="border-t border-white/[0.08] py-6 first:border-t-0 first:pt-0"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-2 font-display text-xl text-white">{f.title}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
                {f.body}
              </p>
            </div>
          ))}
        </section>

        {config.secondaryLinks?.length ? (
          <section className="mt-10">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Voir aussi
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {config.secondaryLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-mono text-[11px] text-white/45 hover:text-white/75"
                  >
                    {l.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section
          aria-label="Accès outils"
          className="mt-14 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-6 md:px-8"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/60">
            Accéder aux outils
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {primary.map((c) => (
              <PrimaryButton key={c.href} href={c.href}>
                {c.label}
              </PrimaryButton>
            ))}
            {secondaryCtas.map((c) => (
              <PrimaryButton key={c.href} href={c.href} variant="ghost">
                {c.label}
              </PrimaryButton>
            ))}
          </div>
        </section>

        {config.disclaimer ? (
          <p className="mt-10 text-xs leading-relaxed text-white/35">
            {config.disclaimer}
          </p>
        ) : (
          <p className="mt-10 text-xs leading-relaxed text-white/35">
            Indicatif uniquement — pas un conseil juridique, fiscal ou
            d&apos;investissement. Counsel requis.
          </p>
        )}
      </ContentPageLayout>
    </FocusPageShell>
  );
}
