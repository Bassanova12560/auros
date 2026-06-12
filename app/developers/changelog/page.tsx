import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { DeveloperBrandMark } from "@/app/developers/_components/DeveloperBrandMark";
import {
  getReleasedChangelogEntries,
  getUpcomingChangelogEntries,
  PROTOCOL_CHANGELOG_ROUTE,
  type ProtocolChangelogEntry,
} from "@/lib/protocol/changelog";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata = metadataFromPath(PROTOCOL_CHANGELOG_ROUTE);

function ChangelogEntryCard({
  entry,
  upcoming,
}: {
  entry: ProtocolChangelogEntry;
  upcoming?: boolean;
}) {
  return (
    <article className="card-flat px-5 py-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <time
          dateTime={entry.date}
          className="font-mono text-[10px] tracking-wide text-white/40"
        >
          {entry.date}
        </time>
        {entry.commit ? (
          <span className="font-mono text-[10px] text-emerald-400/70">{entry.commit}</span>
        ) : null}
      </div>
      <h2 className="mt-3 text-sm font-medium text-white">{entry.title}</h2>
      <p className="mt-2 text-sm font-light leading-relaxed text-white/50">{entry.summary}</p>
      {entry.details?.length ? (
        <ul className="mt-4 space-y-2 text-sm font-light text-white/45">
          {entry.details.map((detail) => (
            <li key={detail} className="flex gap-2">
              <span className="text-white/25" aria-hidden>
                ·
              </span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {entry.tags?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-white/35"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      {entry.links?.length ? (
        <ul className="mt-4 space-y-2">
          {entry.links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-xs text-white/60 hover:text-white">
                {link.label} →
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {upcoming ? (
        <p className="mt-4 font-mono text-[10px] tracking-wide text-amber-400/70">
          Roadmap #{entry.roadmapItem} · à venir
        </p>
      ) : entry.roadmapItem ? (
        <p className="mt-4 font-mono text-[10px] tracking-wide text-white/30">
          Roadmap #{entry.roadmapItem}
        </p>
      ) : null}
    </article>
  );
}

export default function ProtocolChangelogPage() {
  const released = getReleasedChangelogEntries();
  const upcoming = getUpcomingChangelogEntries();

  return (
    <FocusPageShell path={PROTOCOL_CHANGELOG_ROUTE} width="3xl">
      <DeveloperBrandMark />
      <ContentPageLayout
        eyebrow="AUROS Protocol · Changelog"
        title="Changelog API"
        intro="Historique des releases AUROS Protocol v1 — status, tooling, endpoints et headers. Feed machine : GET /api/v1/changelog (public, sans auth)."
        cta={{ href: "/developers", label: "Retour développeurs" }}
      >
        <section>
          <h2 className="font-mono text-[11px] tracking-wide text-white/45">Releases</h2>
          <div className="mt-4 space-y-4">
            {released.map((entry) => (
              <ChangelogEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </section>

        {upcoming.length > 0 ? (
          <section className="mt-12 border-t border-white/[0.06] pt-10">
            <h2 className="font-mono text-[11px] tracking-wide text-amber-400/70">À venir</h2>
            <div className="mt-4 space-y-4">
              {upcoming.map((entry) => (
                <ChangelogEntryCard key={entry.id} entry={entry} upcoming />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-12 border-t border-white/[0.06] pt-8">
          <h2 className="font-mono text-[11px] tracking-wide text-white/45">Ressources</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>
              <Link href="/api/v1/changelog" className="hover:text-white">
                JSON feed /api/v1/changelog →
              </Link>
            </li>
            <li>
              <Link href="/developers/docs" className="hover:text-white">
                Documentation API →
              </Link>
            </li>
            <li>
              <Link href="/status" className="hover:text-white">
                Statut API →
              </Link>
            </li>
          </ul>
        </section>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
