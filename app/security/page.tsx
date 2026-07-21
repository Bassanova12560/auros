import type { Metadata } from "next";
import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...metadataFromPath("/security"),
  title: "Sécurité & données utilisateurs | AUROS",
  description:
    "Posture sécurité AUROS : chiffrement en transit, auth Clerk, RLS Supabase, rate limits, headers HSTS/CSP — les données utilisateurs d’abord.",
};

const PILLARS = [
  {
    title: "Vos données d’abord",
    body: "Dossiers, leads et clés API vivent derrière RLS Supabase et un accès serveur (secret key). Pas d’exposition anon directe sur les tables métier.",
  },
  {
    title: "Accès & sessions",
    body: "Clerk protège dashboards et espaces ops. Les APIs sensibles exigent Bearer (clé API ou CRON_SECRET) avec quotas et anti-burst.",
  },
  {
    title: "Transport & navigateur",
    body: "HSTS preload, CSP, COOP, nosniff, Permissions-Policy. Les embeds partenaires restent frameables sans affaiblir le site principal.",
  },
] as const;

const CONTROLS = [
  "TLS partout (Vercel) + Strict-Transport-Security",
  "Content-Security-Policy (Clerk, Stripe, Supabase allowlistés)",
  "Rate limiting Upstash / mémoire sur Green API et routes ops",
  "Blocage des chemins scanners (.env, wp-admin, .git…)",
  "Corps JSON plafonnés sur les routes sensibles",
  "Verify / Evidence Pack : hashes publics, pas de data room ouverte",
] as const;

export default function SecurityPage() {
  return (
    <FocusPageShell path="/security" width="3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
        Trust · Sécurité
      </p>
      <h1 className="mt-3 font-display text-3xl text-white md:text-4xl">
        Sécurité AUROS
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55">
        La base, ce sont les utilisateurs : comptes, dossiers, preuves et clés.
        Voici comment la plateforme est durcie — sans jargon marketing.
      </p>

      <div className="mt-10 grid gap-6">
        {PILLARS.map((p) => (
          <section key={p.title}>
            <h2 className="font-display text-lg text-white">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{p.body}</p>
          </section>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="font-display text-lg text-white">Contrôles actifs</h2>
        <ul className="mt-4 space-y-2 text-sm text-white/55">
          {CONTROLS.map((c) => (
            <li key={c} className="flex gap-2">
              <span className="text-white/30" aria-hidden>
                —
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-lg text-white">Signaler une faille</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          Contact responsable :{" "}
          <a
            href="mailto:security@getauros.com"
            className="text-white underline-offset-2 hover:underline"
          >
            security@getauros.com
          </a>
          . Politique publique :{" "}
          <Link
            href="/.well-known/security.txt"
            className="text-white underline-offset-2 hover:underline"
          >
            /.well-known/security.txt
          </Link>
          .
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <PrimaryButton href="/privacy">Confidentialité</PrimaryButton>
        <PrimaryButton href="/status" variant="ghost">
          Status
        </PrimaryButton>
        <PrimaryButton href="/verify" variant="ghost">
          Verify
        </PrimaryButton>
      </div>
    </FocusPageShell>
  );
}
