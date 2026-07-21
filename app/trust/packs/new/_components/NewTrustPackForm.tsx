"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { createTrustPackAction } from "@/lib/trust-packs/actions";
import { questionsForPack } from "@/lib/trust-packs/definitions";
import {
  TRUST_PACK_IDS,
  TRUST_PACK_META,
  TRUST_PACKS_ROUTE,
  type TrustPackId,
} from "@/lib/trust-packs/taxonomy";

export function NewTrustPackForm({
  defaultPack = "real_estate",
}: {
  defaultPack?: TrustPackId;
}) {
  const router = useRouter();
  const [packId, setPackId] = useState<TrustPackId>(defaultPack);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const questions = useMemo(() => questionsForPack(packId), [packId]);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        start(async () => {
          setError(null);
          const res = await createTrustPackAction(fd);
          if (!res.ok) {
            setError(res.error);
            return;
          }
          router.push(`${TRUST_PACKS_ROUTE}/${res.id}`);
        });
      }}
    >
      <label className="block space-y-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          Pack
        </span>
        <select
          name="pack_id"
          value={packId}
          onChange={(e) => setPackId(e.target.value as TrustPackId)}
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
        >
          {TRUST_PACK_IDS.map((id) => (
            <option key={id} value={id}>
              {TRUST_PACK_META[id].label}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1.5">
        <span className="font-mono text-[10px] uppercase text-white/40">
          Nom de l’actif / projet
        </span>
        <input
          name="name"
          required
          placeholder="SPV Tour Lyon · Yacht #12 · Capacity ERCOT…"
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="font-mono text-[10px] uppercase text-white/40">
          Juridiction
        </span>
        <input
          name="jurisdiction"
          placeholder="Luxembourg · DIFC · Delaware…"
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="font-mono text-[10px] uppercase text-white/40">
          Site
        </span>
        <input
          name="website_url"
          placeholder="https://…"
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="font-mono text-[10px] uppercase text-white/40">
          Description
        </span>
        <textarea
          name="description"
          rows={4}
          required
          minLength={20}
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
        />
      </label>

      <fieldset className="space-y-4 rounded-xl border border-white/10 p-4">
        <legend className="px-1 font-mono text-[10px] uppercase tracking-wider text-sky-300/80">
          Questions — preuve obligatoire
        </legend>
        <p className="text-xs text-white/40">
          Cocher sans URL / extrait = ignoré au score (anti-washing).
        </p>
        {questions.map((q) => (
          <div
            key={q.id}
            className="space-y-2 border-t border-white/[0.06] pt-3"
          >
            <label className="flex items-start gap-2 text-sm text-white/65">
              <input type="checkbox" name={`q_${q.id}`} className="mt-1 rounded" />
              <span>
                {q.q}{" "}
                <span className="font-mono text-[10px] text-white/30">
                  w{q.weight}
                </span>
              </span>
            </label>
            <input
              name={`ev_url_${q.id}`}
              placeholder="URL preuve"
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 font-mono text-[11px] text-white/70"
            />
            <input
              name={`ev_excerpt_${q.id}`}
              placeholder="Extrait clause (optionnel)"
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-[11px] text-white/70"
            />
          </div>
        ))}
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase text-white/40">
            Shield receipt id
          </span>
          <input
            name="shield_receipt_id"
            placeholder="optionnel"
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 font-mono text-[11px] text-white/70"
          />
        </label>
      </fieldset>

      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <PrimaryButton type="submit" disabled={pending}>
        {pending ? "Scoring…" : "Créer l’assessment"}
      </PrimaryButton>
    </form>
  );
}
