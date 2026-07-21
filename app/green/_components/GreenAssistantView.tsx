"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { CopilotChatView } from "@/app/copilot/CopilotChatView";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { getCopilotUi } from "@/lib/copilot/ui-i18n";
import { COPILOT_GREEN_BRIEF_STORAGE_KEY } from "@/lib/copilot/types";
import { getGreenAssistantUi } from "@/lib/green/assistant-i18n";
import {
  greenAssistantMailDraft,
  greenAssistantNextSteps,
  greenAssistantRoleAssetLabels,
  greenAssistantSuggestions,
} from "@/lib/green/assistant-playbook";
import { GREEN_API_DOCS_ROUTE } from "@/lib/green/api/constants";
import { isRtlLocale } from "@/lib/i18n";
import { track } from "@/lib/analytics";

type Profile = {
  role: string;
  asset: string;
  region: string;
};

function loadProfile(): Profile {
  if (typeof window === "undefined") {
    return { role: "issuer", asset: "solar", region: "" };
  }
  try {
    const raw = sessionStorage.getItem(COPILOT_GREEN_BRIEF_STORAGE_KEY);
    if (!raw) return { role: "issuer", asset: "solar", region: "" };
    const p = JSON.parse(raw) as Profile;
    return {
      role: p.role || "issuer",
      asset: p.asset || "solar",
      region: p.region || "",
    };
  } catch {
    return { role: "issuer", asset: "solar", region: "" };
  }
}

function buildClientBrief(p: Profile, locale: Parameters<typeof getGreenAssistantUi>[0]): string {
  const labels = greenAssistantRoleAssetLabels(p, locale);
  const region = p.region.trim() || "n/a";
  const steps = greenAssistantNextSteps(p, locale)
    .map((s) => `${s.label} (${s.href})`)
    .join(" · ");
  return [
    `Role: ${labels.role}`,
    `Asset focus: ${labels.asset}`,
    `Region: ${region}`,
    `Preferred AUROS next steps (suggest from these when relevant): ${steps}`,
    "Goal: one clear next step; max 3 priorities; indicative only.",
  ].join("\n");
}

export function GreenAssistantView() {
  const { locale } = useLocale();
  const ui = getGreenAssistantUi(locale);
  const copilotUi = getCopilotUi(locale);
  const [profile, setProfile] = useState<Profile>({
    role: "issuer",
    asset: "solar",
    region: "",
  });
  const [ready, setReady] = useState(false);
  const [mailCopied, setMailCopied] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setReady(true);
    track("green_assistant_open", { surface: "green", locale });
  }, [locale]);

  useEffect(() => {
    if (!ready) return;
    sessionStorage.setItem(
      COPILOT_GREEN_BRIEF_STORAGE_KEY,
      JSON.stringify(profile)
    );
  }, [profile, ready]);

  const clientBrief = useMemo(
    () => buildClientBrief(profile, locale),
    [profile, locale]
  );
  const suggestions = useMemo(
    () => greenAssistantSuggestions(profile, locale),
    [profile, locale]
  );
  const nextSteps = useMemo(
    () => greenAssistantNextSteps(profile, locale),
    [profile, locale]
  );

  const roles = [
    { id: "issuer", label: ui.roles.issuer },
    { id: "buyer", label: ui.roles.buyer },
    { id: "risk", label: ui.roles.risk },
    { id: "rse", label: ui.roles.rse },
  ] as const;
  const assets = [
    { id: "solar", label: ui.assets.solar },
    { id: "wind", label: ui.assets.wind },
    { id: "dc", label: ui.assets.dc },
    { id: "carbon", label: ui.assets.carbon },
    { id: "other", label: ui.assets.other },
  ] as const;

  async function copyMailDraft() {
    const draft = greenAssistantMailDraft(profile, locale);
    try {
      await navigator.clipboard.writeText(draft);
      setMailCopied(true);
      track("green_assistant_mail_copy", {
        role: profile.role,
        asset: profile.asset,
        locale,
      });
      window.setTimeout(() => setMailCopied(false), 2500);
    } catch {
      setMailCopied(false);
    }
  }

  return (
    <div
      className="mx-auto max-w-3xl px-4 pb-20 pt-10 md:px-6 md:pt-12"
      dir={isRtlLocale(locale) ? "rtl" : undefined}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
        {ui.eyebrow}
      </p>
      <h1 className="mt-3 font-display text-3xl text-white md:text-4xl">
        {ui.title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
        {ui.intro}
      </p>

      <section className="mt-8 grid gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] p-4 sm:grid-cols-3">
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase text-white/40">
            {ui.roleLabel}
          </span>
          <select
            value={profile.role}
            onChange={(e) =>
              setProfile((p) => ({ ...p, role: e.target.value }))
            }
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase text-white/40">
            {ui.assetLabel}
          </span>
          <select
            value={profile.asset}
            onChange={(e) =>
              setProfile((p) => ({ ...p, asset: e.target.value }))
            }
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white"
          >
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase text-white/40">
            {ui.regionLabel}
          </span>
          <input
            value={profile.region}
            onChange={(e) =>
              setProfile((p) => ({ ...p, region: e.target.value.slice(0, 80) }))
            }
            placeholder={ui.regionPlaceholder}
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white placeholder:text-white/25"
          />
        </label>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {ui.nextStepsTitle}
        </h2>
        <ul className="grid gap-2 sm:grid-cols-3">
          {nextSteps.map((step) => (
            <li key={step.href}>
              <Link
                href={step.href}
                onClick={() =>
                  track("green_assistant_next_step", {
                    href: step.href,
                    role: profile.role,
                    asset: profile.asset,
                    locale,
                  })
                }
                className="block h-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-3 transition hover:border-emerald-400/35"
              >
                <span className="font-display text-sm text-white">
                  {step.label}
                </span>
                <span className="mt-1 block text-xs leading-snug text-white/45">
                  {step.why}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => void copyMailDraft()}
          className="font-mono text-[11px] uppercase tracking-wider text-emerald-400/80 transition hover:text-emerald-300"
        >
          {mailCopied ? ui.mailCopied : ui.copyMail}
        </button>
      </section>

      <div className="mt-8">
        <Suspense
          fallback={
            <p className="font-mono text-sm text-white/40">{copilotUi.loading}</p>
          }
        >
          {ready ? (
            <CopilotChatView
              key={`${locale}-${profile.role}-${profile.asset}-${profile.region}`}
              forcedSurface="green"
              hideHeader
              clientBrief={clientBrief}
              suggestionOverrides={suggestions}
              eyebrow="Green AI"
              title="Assistant Green"
            />
          ) : null}
        </Suspense>
      </div>

      <section className="mt-12 border-t border-white/[0.08] pt-8">
        <h2 className="font-display text-lg text-white">{ui.freemiumTitle}</h2>
        <ul className="mt-3 space-y-2 text-sm text-white/55">
          <li>{ui.freemiumBullets[0]}</li>
          <li>{ui.freemiumBullets[1]}</li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <PrimaryButton href={GREEN_API_DOCS_ROUTE}>{ui.apiCta}</PrimaryButton>
          <Link
            href="/pricing"
            className="inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
          >
            {ui.pricingLink}
          </Link>
        </div>
      </section>
    </div>
  );
}
