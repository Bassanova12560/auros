"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { createWetsProjectAction } from "@/lib/wets/actions";
import {
  WETS_CATEGORIES,
  WETS_CATEGORY_LABELS,
  WETS_CONSOLE_ROUTE,
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
      <p className="text-xs text-white/40">
        Inclut raccordement réseau + recours post-quantique. Éditables avant
        publication. Anthropic si{" "}
        <code className="text-white/60">ANTHROPIC_API_KEY</code>, sinon Groq,
        sinon heuristique.
      </p>
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
