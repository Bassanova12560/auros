"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { AmbientShell } from "@/app/_components/ui/AmbientShell";
import { BezelCard } from "@/app/_components/ui/BezelCard";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { Footer } from "@/app/_components/Footer";
import { Nav } from "@/app/_components/Nav";
import { getPartnersMessages } from "@/lib/partners-i18n";

import { PartnerContactForm } from "./PartnerContactForm";

export function PartnersPageContent() {
  const { locale } = useLocale();
  const m = getPartnersMessages(locale);

  return (
    <AmbientShell>
      <Nav />
      <main className="page-main page-main--nav min-h-dvh pt-24 text-white">
        <section className="border-b border-white/[0.06] px-4 py-16 md:px-6 md:py-28 lg:py-36">
          <div className="page-inner page-inner--6xl mx-auto">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white">
              {m.eyebrow}
            </p>
            <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-6xl">
              {m.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">{m.subtitle}</p>
            <div className="mt-10">
              <PrimaryButton href="#contact">{m.cta}</PrimaryButton>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 px-4 py-16 md:px-6 md:py-24">
          <div className="page-inner page-inner--5xl mx-auto">
            <h2 className="text-xs uppercase tracking-[0.2em] text-secondary">
              {m.howTitle}
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {m.steps.map((step) => (
                <article
                  key={step.number}
                  className="border-l-2 border-white/30 pl-6"
                >
                  <span className="text-xs font-bold text-white">
                    {step.number}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-secondary">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 px-4 py-16 md:px-6 md:py-24">
          <div className="page-inner page-inner--5xl mx-auto">
            <h2 className="text-xs uppercase tracking-[0.2em] text-secondary">
              {m.receiveTitle}
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {m.receiveItems.map((item) => (
                <BezelCard key={item.title} animate innerClassName="p-6">
                  <h3 className="font-display text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{item.description}</p>
                </BezelCard>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 px-4 py-12 text-center md:px-6 md:py-16">
          <div className="page-inner page-inner--5xl mx-auto">
            <h2 className="text-xs uppercase tracking-[0.2em] text-secondary">
              {m.integrationsTitle}
            </h2>
            <p className="mt-6 text-lg text-white/90">{m.integrationsBody}</p>
            <p className="mt-3 text-xs text-secondary">{m.integrationsNote}</p>
          </div>
        </section>

        <section className="border-b border-white/10 px-4 py-16 md:px-6 md:py-24">
          <div className="page-inner page-inner--5xl mx-auto">
            <h2 className="text-xs uppercase tracking-[0.2em] text-secondary">
              {m.pricingTitle}
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {m.tiers.map((tier) => (
                <article
                  key={tier.name}
                  className={`flex flex-col rounded-3xl border p-6 backdrop-blur-xl ${
                    tier.highlight
                      ? "border-white/25 bg-white/[0.04]"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <h3 className="font-semibold">{tier.name}</h3>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {tier.price}
                  </p>
                  <ul className="mt-4 flex-1 space-y-2 text-sm text-secondary">
                    {tier.features.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <Link
                    href="#contact"
                    className="mt-6 text-sm text-white hover:underline"
                  >
                    {tier.cta} →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-28 px-4 py-16 md:px-6 md:py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-xs uppercase tracking-[0.2em] text-secondary">
              {m.contactTitle}
            </h2>
            <div className="mt-10">
              <PartnerContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </AmbientShell>
  );
}
