"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { createWetsProjectAction } from "@/lib/wets/actions";
import {
  WETS_CATEGORIES,
  WETS_CATEGORY_LABELS,
  WETS_CONSOLE_ROUTE,
  WETS_PQC_QUESTIONS,
} from "@/lib/wets/constants";

export function NewWetsProjectForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        start(async () => {
          setError(null);
          const res = await createWetsProjectAction(fd);
          if (!res.ok) {
            setError(res.error);
            return;
          }
          router.push(`${WETS_CONSOLE_ROUTE}/projects/${res.id}`);
        });
      }}
    >
      <Field name="name" label="Nom du projet" required placeholder="Water150" />
      <Field name="ticker" label="Ticker" placeholder="W150" />
      <label className="block space-y-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          Catégorie
        </span>
        <select
          name="category"
          required
          defaultValue="water_rights"
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
        >
          {WETS_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {WETS_CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </label>
      <Field name="website_url" label="Site web" placeholder="https://…" />
      <Field name="jurisdiction" label="Juridiction" placeholder="US / Michigan" />
      <Field
        name="legal_structure"
        label="Structure légale"
        placeholder="SPV Delaware / concession…"
      />

      <fieldset className="space-y-3 rounded-xl border border-white/10 p-4">
        <legend className="px-1 font-mono text-[10px] uppercase tracking-wider text-sky-400/80">
          Énergie / raccordement
        </legend>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" name="behind_the_meter" className="rounded" />
          Behind-the-meter / microgrid on-site
        </label>
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase text-white/40">
            Statut permis
          </span>
          <select
            name="permits_status"
            defaultValue="unknown"
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
          >
            <option value="unknown">unknown</option>
            <option value="none">none</option>
            <option value="filed">filed (demandés)</option>
            <option value="obtained">obtained (obtenus)</option>
          </select>
        </label>
        <Field
          name="interconnection_queue_position"
          label="Position file d’interconnexion"
          placeholder="ex. PJM queue #412 · ~4 ans · ou N/A si BTM"
        />
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-white/10 p-4">
        <legend className="px-1 font-mono text-[10px] uppercase tracking-wider text-violet-300/80">
          Checklist PQC — preuve obligatoire
        </legend>
        <p className="text-xs text-white/40">
          Cocher sans URL / extrait / receipt Shield = score plafonné. Voir{" "}
          <a href="/trust/quantum/playbook" className="text-sky-300/70 hover:underline">
            playbook clauses
          </a>
          .
        </p>
        {WETS_PQC_QUESTIONS.map((q) => (
          <div key={q.id} className="space-y-2 border-t border-white/[0.06] pt-3">
            <label className="flex items-start gap-2 text-sm text-white/65">
              <input
                type="checkbox"
                name={
                  q.id === "offchain_register"
                    ? "pqc_offchain_register"
                    : q.id === "key_compromise_remedy"
                      ? "pqc_key_compromise_remedy"
                      : q.id === "token_vs_title"
                        ? "pqc_token_vs_title"
                        : "pqc_crypto_agility"
                }
                className="mt-1 rounded"
              />
              <span>{q.q}</span>
            </label>
            <input
              name={`pqc_evidence_url_${q.id}`}
              placeholder="URL preuve (doc / clause / filing)"
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 font-mono text-[11px] text-white/70 placeholder:text-white/25"
            />
            <input
              name={`pqc_evidence_excerpt_${q.id}`}
              placeholder="Extrait de clause (optionnel, ≤500 car.)"
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-[11px] text-white/70 placeholder:text-white/25"
            />
          </div>
        ))}
        <Field
          name="shield_receipt_id"
          label="Shield receipt id (crypto_agility)"
          placeholder="srt_… ou id receipt public"
        />
      </fieldset>

      <label className="block space-y-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          Description
        </span>
        <textarea
          name="description"
          rows={5}
          required
          minLength={20}
          placeholder="Contexte public du projet, droits d’eau, data center, token…"
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white placeholder:text-white/25"
        />
      </label>
      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <PrimaryButton type="submit" disabled={pending}>
        {pending
          ? "Scoring assisté…"
          : "Créer + pré-score (7 critères · Claude / Groq / WELHR)"}
      </PrimaryButton>
    </form>
  );
}

function Field({
  name,
  label,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
        {label}
      </span>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white placeholder:text-white/25"
      />
    </label>
  );
}
