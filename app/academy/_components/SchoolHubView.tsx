"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { ACADEMY_ROUTE } from "@/lib/academy";
import {
  getAcademyHubMessages,
  type AcademyTrackId,
  type ModuleProgress,
  type ResolvedSchool,
} from "@/lib/academy/curriculum";

type TrackOption = {
  id: AcademyTrackId;
  name: string;
  blurb: string;
  recommended: string[];
};

type SchoolHubViewProps = {
  school: ResolvedSchool;
  tracks: TrackOption[];
  initialProgress?: ModuleProgress[];
};

export function SchoolHubView({
  school,
  tracks,
  initialProgress = [],
}: SchoolHubViewProps) {
  const { locale } = useLocale();
  const m = getAcademyHubMessages(locale);
  const { isSignedIn } = useAuth();
  const [trackId, setTrackId] = useState<AcademyTrackId | "all">("all");
  const [progress] = useState(initialProgress);

  const progressByModule = useMemo(() => {
    const map = new Map<string, ModuleProgress>();
    for (const row of progress) {
      if (row.schoolId === school.id) map.set(row.moduleId, row);
    }
    return map;
  }, [progress, school.id]);

  const activeRecommended = useMemo(() => {
    if (trackId === "all") return null;
    return new Set(tracks.find((t) => t.id === trackId)?.recommended ?? []);
  }, [trackId, tracks]);

  return (
    <div className="page-inner page-inner--6xl mx-auto px-4 pb-16 pt-10 md:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
        AUROS Academy · {school.shortName}
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
        {school.name}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/55">
        {school.tagline}
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/45">
        {school.description}
      </p>
      <p className="mt-4 text-xs text-white/35">
        <span className="font-mono uppercase tracking-wider text-white/30">
          {m.fellowNoteLabel}
        </span>{" "}
        — {school.fellowNote}
      </p>

      <div className="mt-10">
        <label className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          {m.filterByTrack}
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTrackId("all")}
            className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${
              trackId === "all"
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                : "border-white/[0.08] text-white/45 hover:text-white/70"
            }`}
          >
            {m.tracksAll}
          </button>
          {tracks.map((track) => (
            <button
              key={track.id}
              type="button"
              onClick={() => setTrackId(track.id)}
              className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${
                trackId === track.id
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                  : "border-white/[0.08] text-white/45 hover:text-white/70"
              }`}
            >
              {track.name}
            </button>
          ))}
        </div>
        {trackId !== "all" && (
          <p className="mt-3 max-w-xl text-sm text-white/45">
            {tracks.find((t) => t.id === trackId)?.blurb}
          </p>
        )}
      </div>

      {!isSignedIn && (
        <p className="mt-8 text-sm text-white/40">{m.progressSignedOut}</p>
      )}

      <h2 className="mt-12 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        {m.modulesTitle}
      </h2>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {school.modules.map((mod) => {
          const key = `${school.id}:${mod.slug}`;
          const recommended =
            !activeRecommended || activeRecommended.has(key);
          const row = progressByModule.get(mod.id);
          return (
            <BezelCard
              key={mod.id}
              className={recommended ? undefined : "opacity-55"}
              innerClassName="flex h-full flex-col p-6 md:p-7"
              animate
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  {m.levelLabel(mod.level)}
                </p>
                {recommended && trackId !== "all" && (
                  <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400/70">
                    {m.recommended}
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-white">
                {mod.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/45">
                {mod.summary}
              </p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-white/30">
                {m.moduleMinutes(mod.estimatedMinutes)} ·{" "}
                {m.lessonsCount(mod.lessons.length)}
                {row?.quizPassed ? ` · ${m.quizPassedBadge}` : ""}
              </p>
              <Link
                href={`/academy/${school.slug}/${mod.slug}`}
                className="mt-6 font-mono text-[11px] tracking-wide text-white/50 transition hover:text-white/80"
              >
                {m.openModule} →
              </Link>
            </BezelCard>
          );
        })}
      </div>

      <p className="mt-12">
        <Link
          href={ACADEMY_ROUTE}
          className="font-mono text-[11px] text-white/40 hover:text-white/70"
        >
          {m.backHub}
        </Link>
      </p>
      <p className="mt-6 max-w-2xl text-xs leading-relaxed text-white/30">
        {m.educationalDisclaimer}
      </p>
    </div>
  );
}
