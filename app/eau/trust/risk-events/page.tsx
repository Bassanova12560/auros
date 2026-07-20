import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { createWetsRiskEventAction } from "@/lib/wets/actions";
import { WETS_CONSOLE_ROUTE } from "@/lib/wets/constants";
import { listWetsRiskEvents } from "@/lib/wets/store";

import { WetsNav } from "@/app/eau/trust/_components/WetsUi";

export const metadata: Metadata = {
  title: "Risk events WETS | AUROS",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function WetsRiskEventsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { events, error } = await listWetsRiskEvents();

  return (
    <FocusPageShell path={`${WETS_CONSOLE_ROUTE}/risk-events`} width="3xl">
      <ContentPageLayout
        product="Eau · Trust"
        eyebrow="Base factuelle"
        title="Litiges, moratoriums, protests"
        intro="Alimentez le critère social_litigation_risk. Données publiques éparpillées — ici centralisées pour le scoring."
      >
        <WetsNav />
        {error ? (
          <p className="mb-4 text-sm text-red-400">{error}</p>
        ) : null}

        <form action={createWetsRiskEventAction} className="mb-10 grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1.5 sm:col-span-1">
            <span className="font-mono text-[10px] uppercase text-white/40">
              Région
            </span>
            <input
              name="region"
              required
              placeholder="Michigan"
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase text-white/40">
              Type
            </span>
            <select
              name="event_type"
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
              defaultValue="moratorium"
            >
              <option value="lawsuit">lawsuit</option>
              <option value="moratorium">moratorium</option>
              <option value="rezoning_dispute">rezoning_dispute</option>
              <option value="settlement">settlement</option>
              <option value="protest">protest</option>
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase text-white/40">
              Sévérité
            </span>
            <select
              name="severity"
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
              defaultValue="medium"
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase text-white/40">
              Date
            </span>
            <input
              type="date"
              name="event_date"
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
            />
          </label>
          <label className="block space-y-1.5 sm:col-span-2">
            <span className="font-mono text-[10px] uppercase text-white/40">
              Description
            </span>
            <textarea
              name="description"
              rows={2}
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
            />
          </label>
          <label className="block space-y-1.5 sm:col-span-2">
            <span className="font-mono text-[10px] uppercase text-white/40">
              Source URL
            </span>
            <input
              name="source_url"
              placeholder="https://…"
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
            />
          </label>
          <div className="sm:col-span-2">
            <PrimaryButton type="submit">Ajouter</PrimaryButton>
          </div>
        </form>

        <ul className="space-y-3">
          {events.map((e) => (
            <li
              key={e.id}
              className="rounded-lg border border-white/8 px-4 py-3 text-sm text-white/65"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-amber-400/80">
                {e.severity} · {e.event_type}
                {e.event_date ? ` · ${e.event_date}` : ""}
              </p>
              <p className="mt-1 text-white/80">{e.region}</p>
              <p className="mt-1 text-white/50">{e.description}</p>
              {e.source_url ? (
                <a
                  href={e.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block font-mono text-[10px] text-sky-300/70 hover:underline"
                >
                  source
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
