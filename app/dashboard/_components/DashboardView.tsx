"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import type { ReactNode } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { AmbientShell } from "@/app/_components/ui/AmbientShell";
import { Footer } from "@/app/_components/Footer";
import { Nav } from "@/app/_components/Nav";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { AurosLogo } from "@/app/_components/ui/AurosLogo";
import { getDashboardMessages } from "@/lib/dashboard-i18n";

import { DeleteAccountSection } from "./DeleteAccountSection";
import { DossierList, type DossierRow } from "./DossierList";

export function DashboardGuest({ preview }: { preview?: ReactNode }) {
  const { locale } = useLocale();
  const m = getDashboardMessages(locale).guest;

  return (
    <AmbientShell>
      <Nav />
      <main className="page-main page-main--nav text-white">
        <div className="page-inner page-inner--lg mx-auto min-w-0 px-4 pb-16 pt-4 md:px-6 md:pt-8">
          <div className="flex flex-col gap-8 sm:gap-10 lg:flex-row lg:items-start lg:gap-12">
            <div className="min-w-0 flex-1 text-center lg:text-left">
              {preview ? (
                <div className="mb-6 flex justify-center sm:mb-8 lg:justify-start">
                  {preview}
                </div>
              ) : null}
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
                {m.eyebrow}
              </p>
              <h1 className="mt-4 font-display text-2xl font-semibold sm:text-3xl md:text-4xl">
                {m.title}
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted lg:mx-0">
                {m.socialProof}
              </p>
              <Link
                href="/wizard"
                className="mt-6 inline-flex min-h-[44px] w-full max-w-xs items-center justify-center rounded-xl border border-white bg-white px-5 py-3 font-mono text-xs uppercase tracking-wider text-void transition hover:bg-white/90 sm:w-auto"
                data-dashboard-teaser-cta=""
              >
                {m.continueWizard}
              </Link>
            </div>

            <div className="w-full min-w-0 max-w-sm shrink-0 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 md:p-8 lg:mx-0 lg:ml-auto">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                {m.eyebrow}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{m.body}</p>
              <div className="mt-6 flex flex-col gap-3">
                <PrimaryButton href="/sign-up?redirect_url=/dashboard">
                  {m.signUp}
                </PrimaryButton>
                <Link
                  href="/sign-in?redirect_url=/dashboard"
                  className="min-h-[44px] rounded-xl border border-white/15 px-4 py-3 text-center font-mono text-xs uppercase tracking-wider text-white/70 transition hover:border-white/30 hover:text-white"
                >
                  {m.signIn}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </AmbientShell>
  );
}

type AuthProps = {
  dossiers: DossierRow[];
  errorMessage: string | null;
};

export function DashboardAuthenticated({ dossiers, errorMessage }: AuthProps) {
  const { locale } = useLocale();
  const m = getDashboardMessages(locale).auth;

  const subheading =
    dossiers.length === 0
      ? m.emptySub
      : dossiers.length === 1
        ? m.countOne
        : `${dossiers.length} ${m.countMany}`;

  return (
    <AmbientShell>
      <Nav />
      <main className="page-main page-main--nav min-h-dvh text-white">
        <div className="page-inner page-inner--3xl mx-auto">
          <header className="flex items-center justify-between border-b border-white/[0.06] pb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
              aria-label="AUROS home"
            >
              <AurosLogo />
              <span className="font-mono text-xs tracking-[0.22em]">AUROS</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                {m.label}
              </span>
              <UserButton />
            </div>
          </header>

          <section className="flex flex-wrap items-end justify-between gap-6 py-12">
            <div>
              <h1 className="font-display text-4xl font-semibold italic tracking-tight">
                {m.title}
              </h1>
              <p className="mt-3 font-mono text-xs text-white/50">{subheading}</p>
            </div>
            <Link
              href="/wizard"
              className="rounded-xl border border-white/20 px-4 py-3 font-mono text-xs uppercase tracking-wider transition hover:border-white/40"
              data-dashboard-cta=""
            >
              {m.newDossier}
            </Link>
          </section>

          {errorMessage ? (
            <div
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4"
              role="alert"
            >
              <p className="font-mono text-sm text-red-300">{m.errorTitle}</p>
              <p className="mt-2 text-xs text-white/60">{errorMessage}</p>
            </div>
          ) : dossiers.length === 0 ? (
            <div className="border border-white/10 px-8 py-16 text-center">
              <p className="font-display text-2xl italic">{m.emptyTitle}</p>
              <Link
                href="/wizard"
                className="mt-4 inline-block font-mono text-sm text-accent hover:underline"
              >
                {m.emptyLink}
              </Link>
            </div>
          ) : (
            <DossierList dossiers={dossiers} />
          )}

          <DeleteAccountSection />
        </div>
      </main>
      <Footer />
    </AmbientShell>
  );
}
