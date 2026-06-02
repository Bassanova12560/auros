"use client";

import Link from "next/link";
import { useCallback, useState, type FormEvent } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { saveGreenLabelAction } from "@/lib/actions/green-label";
import type { GreenProjectType } from "@/lib/green";
import { GREEN_REGISTRY_ROUTE, GREEN_STANDARDS_ROUTE } from "@/lib/green/constants";
import { getGreenMessages } from "@/lib/green/i18n";

const PROJECT_TYPES: GreenProjectType[] = [
  "solar",
  "wind",
  "rec",
  "carbon",
  "ppa",
  "other",
];

const inputClass =
  "w-full rounded-lg border border-emerald-500 bg-black px-4 py-3 text-sm text-emerald-400 placeholder:text-neutral-600 outline-none focus:border-emerald-400";

export function GreenLabelForm() {
  const { locale } = useLocale();
  const m = getGreenMessages(locale);
  const f = m.label.form;

  const [submitted, setSubmitted] = useState<{ projectName: string } | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState<GreenProjectType | "">("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!projectType) return;

      setSubmitting(true);
      setError(false);
      const result = await saveGreenLabelAction({
        projectName: projectName.trim(),
        projectType,
        contactName: contactName.trim(),
        email: email.trim(),
        website: website.trim(),
        country: country.trim(),
        description: description.trim(),
      });
      setSubmitting(false);

      if (result.ok) {
        setSubmitted({ projectName: projectName.trim() });
      } else {
        setError(true);
      }
    },
    [projectName, projectType, contactName, email, website, country, description]
  );

  if (submitted) {
    const nextCopy = {
      fr: {
        hint: "Consultez les standards RTMS pendant la revue documentaire (5 jours ouvrés).",
        standards: "Standards RTMS",
        registry: "Registre public",
        market: "Place de marché",
      },
      en: {
        hint: "Review RTMS standards while we assess your dossier (5 business days).",
        standards: "RTMS standards",
        registry: "Public registry",
        market: "Marketplace",
      },
      es: {
        hint: "Consulte los estándares RTMS durante la revisión (5 días hábiles).",
        standards: "Estándares RTMS",
        registry: "Registro público",
        market: "Marketplace",
      },
    }[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

    return (
      <div
        className="rounded-xl border border-emerald-500 bg-black p-8 text-center"
        role="status"
      >
        <p className="text-lg text-emerald-400">{f.success}</p>
        <p className="mt-2 text-sm text-neutral-400">{submitted.projectName}</p>
        <p className="mt-4 text-xs text-neutral-500">{nextCopy.hint}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={GREEN_STANDARDS_ROUTE}
            className="rounded-full border border-emerald-500/50 px-4 py-2 text-xs text-emerald-400 hover:bg-emerald-500/10"
          >
            {nextCopy.standards}
          </Link>
          <Link
            href={GREEN_REGISTRY_ROUTE}
            className="rounded-full border border-emerald-500/50 px-4 py-2 text-xs text-emerald-400 hover:bg-emerald-500/10"
          >
            {nextCopy.registry}
          </Link>
          <Link
            href="/green/market"
            className="rounded-full border border-emerald-500/50 px-4 py-2 text-xs text-emerald-400 hover:bg-emerald-500/10"
          >
            {nextCopy.market}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-emerald-500 bg-black p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-xs uppercase tracking-wider text-emerald-500/50">{f.projectName}</span>
          <input
            required
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className={`${inputClass} mt-2`}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs uppercase tracking-wider text-emerald-500/50">{f.projectType}</span>
          <select
            required
            value={projectType}
            onChange={(e) => setProjectType(e.target.value as GreenProjectType)}
            className={`${inputClass} mt-2`}
          >
            <option value="" disabled>
              —
            </option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {f.projectTypes[t]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-emerald-500/50">{f.contactName}</span>
          <input
            required
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className={`${inputClass} mt-2`}
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-emerald-500/50">{f.email}</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputClass} mt-2`}
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-emerald-500/50">{f.website}</span>
          <input
            required
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className={`${inputClass} mt-2`}
            placeholder="https://"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-emerald-500/50">{f.country}</span>
          <input
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={`${inputClass} mt-2`}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs uppercase tracking-wider text-emerald-500/50">{f.description}</span>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} mt-2 resize-y`}
          />
        </label>
      </div>
      {error ? (
        <p className="mt-4 text-xs text-red-400/80" role="alert">
          —
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex items-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-medium text-emerald-950 hover:bg-emerald-400 disabled:opacity-50"
      >
        {submitting ? f.submitting : f.submit}
      </button>
    </form>
  );
}
