"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { CopilotChatView } from "@/app/copilot/CopilotChatView";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { COPILOT_GREEN_BRIEF_STORAGE_KEY } from "@/lib/copilot/types";
import { GREEN_API_DOCS_ROUTE } from "@/lib/green/api/constants";
import { track } from "@/lib/analytics";

type Profile = {
  role: string;
  asset: string;
  region: string;
};

const ROLES = [
  { id: "issuer", label: "Émetteur / producteur" },
  { id: "buyer", label: "Acheteur corporate" },
  { id: "risk", label: "Risk / counsel" },
  { id: "rse", label: "RSE / reporting" },
] as const;

const ASSETS = [
  { id: "solar", label: "Solaire / PPA" },
  { id: "wind", label: "Éolien" },
  { id: "dc", label: "Data center / eau-énergie" },
  { id: "carbon", label: "Carbone / crédit" },
  { id: "other", label: "Autre RWA vert" },
] as const;

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

function buildClientBrief(p: Profile): string {
  const role = ROLES.find((r) => r.id === p.role)?.label ?? p.role;
  const asset = ASSETS.find((a) => a.id === p.asset)?.label ?? p.asset;
  const region = p.region.trim() || "non précisée";
  return [
    `Role: ${role}`,
    `Asset focus: ${asset}`,
    `Region: ${region}`,
    "Goal: one clear next step on AUROS Green (RTMS, label, compare, WELHR if water).",
  ].join("\n");
}

export function GreenAssistantView() {
  const [profile, setProfile] = useState<Profile>({
    role: "issuer",
    asset: "solar",
    region: "",
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setReady(true);
    track("green_assistant_open", { surface: "green" });
  }, []);

  useEffect(() => {
    if (!ready) return;
    sessionStorage.setItem(
      COPILOT_GREEN_BRIEF_STORAGE_KEY,
      JSON.stringify(profile)
    );
  }, [profile, ready]);

  const clientBrief = useMemo(() => buildClientBrief(profile), [profile]);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-10 md:px-6 md:pt-12">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
        Green · Assistant gratuit
      </p>
      <h1 className="mt-3 font-display text-3xl text-white md:text-4xl">
        Chatbot Green personnalisé
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
        Gratuit pour vous aider à avancer (RTMS, label, scores, eau-énergie).
        Indiquez votre profil — un prochain pas clair, pas un discours générique.
        Les entreprises qui veulent volume API / sièges / mails automatisés
        passent sur Green API Premium.
      </p>

      <section className="mt-8 grid gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] p-4 sm:grid-cols-3">
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase text-white/40">Rôle</span>
          <select
            value={profile.role}
            onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white"
          >
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase text-white/40">Actif</span>
          <select
            value={profile.asset}
            onChange={(e) => setProfile((p) => ({ ...p, asset: e.target.value }))}
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white"
          >
            {ASSETS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase text-white/40">
            Région (opt.)
          </span>
          <input
            value={profile.region}
            onChange={(e) =>
              setProfile((p) => ({ ...p, region: e.target.value.slice(0, 80) }))
            }
            placeholder="ex. France, Texas…"
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white placeholder:text-white/25"
          />
        </label>
      </section>

      <div className="mt-8">
        <Suspense
          fallback={
            <p className="font-mono text-sm text-white/40">Chargement chat…</p>
          }
        >
          {ready ? (
            <CopilotChatView
              forcedSurface="green"
              hideHeader
              clientBrief={clientBrief}
              eyebrow="Green AI"
              title="Assistant Green"
            />
          ) : null}
        </Suspense>
      </div>

      <section className="mt-12 border-t border-white/[0.08] pt-8">
        <h2 className="font-display text-lg text-white">
          Gratuit pour aider · Premium pour scaler
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-white/55">
          <li>— Chat personnalisé, RAG AUROS, care emails en draft (revue humaine)</li>
          <li>— Entreprises : quotas API, webhooks, sièges équipe, SLA</li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <PrimaryButton href={GREEN_API_DOCS_ROUTE}>Green API</PrimaryButton>
          <Link
            href="/pricing"
            className="inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
          >
            Tarifs →
          </Link>
        </div>
      </section>
    </div>
  );
}
