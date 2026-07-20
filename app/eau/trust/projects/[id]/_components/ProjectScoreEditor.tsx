"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  publishWetsReportAction,
  saveWetsCriteriaAction,
} from "@/lib/wets/actions";
import {
  WETS_CRITERION_HINTS,
  WETS_CRITERION_LABELS,
  computeFinalScore,
  gradeFromFinalScore,
  type WetsCriterionScore,
} from "@/lib/wets/constants";

import { WetsGradeBadge } from "@/app/eau/trust/_components/WetsUi";

export function ProjectScoreEditor({
  projectId,
  initial,
}: {
  projectId: string;
  initial: WetsCriterionScore[];
}) {
  const router = useRouter();
  const [criteria, setCriteria] = useState(initial);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const final = useMemo(() => computeFinalScore(criteria), [criteria]);
  const grade = useMemo(() => gradeFromFinalScore(final), [final]);

  function update(idx: number, patch: Partial<WetsCriterionScore>) {
    setCriteria((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, ...patch } : c))
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <WetsGradeBadge grade={grade} score={final} size="lg" />
        <p className="text-sm text-white/45">
          Éditez puis enregistrez — publiez pour ouvrir le rapport public.
        </p>
      </div>

      <ul className="space-y-6">
        {criteria.map((c, idx) => (
          <li
            key={c.category}
            className="border-t border-white/[0.08] pt-5"
          >
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {WETS_CRITERION_LABELS[c.category]} · poids {c.weight}
            </p>
            <p className="mt-1 text-xs text-white/40">
              {WETS_CRITERION_HINTS[c.category]}
            </p>
            <label className="mt-2 block max-w-[8rem] space-y-1">
              <span className="text-xs text-white/40">Score /10</span>
              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={c.score}
                onChange={(e) =>
                  update(idx, { score: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 font-mono text-white"
              />
            </label>
            <textarea
              value={c.justification}
              onChange={(e) => update(idx, { justification: e.target.value })}
              rows={3}
              className="mt-3 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white"
            />
            <input
              value={c.sources.join(", ")}
              onChange={(e) =>
                update(idx, {
                  sources: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Sources (URLs, séparées par virgule)"
              className="mt-2 w-full rounded-lg border border-white/10 bg-black px-3 py-2 font-mono text-[11px] text-white/70"
            />
          </li>
        ))}
      </ul>

      {msg ? <p className="text-sm text-emerald-300/90">{msg}</p> : null}

      <div className="flex flex-wrap gap-3">
        <PrimaryButton
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const res = await saveWetsCriteriaAction(projectId, criteria);
              setMsg(res.ok ? "Enregistré." : res.error);
              if (res.ok) router.refresh();
            })
          }
        >
          Enregistrer
        </PrimaryButton>
        <PrimaryButton
          type="button"
          variant="ghost"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const res = await publishWetsReportAction(projectId);
              if (!res.ok) {
                setMsg(res.error);
                return;
              }
              setMsg(`Publié — /report/${res.slug}`);
              router.push(`/report/${res.slug}`);
            })
          }
        >
          Générer rapport public
        </PrimaryButton>
      </div>
    </div>
  );
}
