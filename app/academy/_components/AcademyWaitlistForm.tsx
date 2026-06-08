"use client";

import { useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getAcademyMessages } from "@/lib/academy/i18n";

type AcademyWaitlistFormProps = {
  track?: string;
  tallyUrl?: string | null;
  compact?: boolean;
  ctaLabel?: string;
};

export function AcademyWaitlistForm({
  track = "praticien",
  tallyUrl,
  compact = false,
  ctaLabel,
}: AcademyWaitlistFormProps) {
  const { locale } = useLocale();
  const m = getAcademyMessages(locale);
  const copy = m.waitlist;
  const label = ctaLabel ?? copy.submit;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorCode, setErrorCode] = useState<string | null>(null);

  if (tallyUrl) {
    return (
      <a
        href={tallyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={
          compact
            ? "font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white/70"
            : "text-sm text-white/60 hover:text-white/80"
        }
      >
        {label}
        {!compact ? null : " →"}
      </a>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setErrorCode(null);

    try {
      const res = await fetch("/api/academy-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, track, locale }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setErrorCode(data.error ?? "unknown");
        setStatus("error");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setErrorCode("network");
      setStatus("error");
    }
  }

  const errorMessage =
    errorCode === "rate_limit"
      ? copy.rateLimit
      : errorCode === "invalid_email"
        ? copy.invalidEmail
        : errorCode
          ? copy.error
          : null;

  if (status === "success") {
    return (
      <p
        className={
          compact
            ? "font-mono text-[11px] text-emerald-400/90"
            : "text-sm text-emerald-400/90"
        }
      >
        {copy.success}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? "space-y-2" : "mt-2 space-y-3"}
      noValidate
    >
      <div className={compact ? "flex flex-col gap-2 sm:flex-row sm:items-center" : "space-y-2"}>
        <label htmlFor={`waitlist-email-${track}`} className="sr-only">
          {copy.emailLabel}
        </label>
        <input
          id={`waitlist-email-${track}`}
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={copy.emailPlaceholder}
          className={
            compact
              ? "min-h-[36px] flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[11px] text-white placeholder:text-white/30 focus:border-white/25 focus:outline-none"
              : "w-full min-h-[44px] rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/25 focus:outline-none"
          }
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={
            compact
              ? "shrink-0 font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white/70 disabled:opacity-50"
              : "min-h-[44px] rounded-xl border border-white/15 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-50"
          }
        >
          {status === "loading" ? copy.submitting : label}
          {compact && status !== "loading" ? " →" : null}
        </button>
      </div>
      {errorMessage ? (
        <p className="font-mono text-[10px] text-red-400/90">{errorMessage}</p>
      ) : null}
    </form>
  );
}
