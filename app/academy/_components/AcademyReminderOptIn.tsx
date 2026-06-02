"use client";

import { useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getAcademyMessages } from "@/lib/academy/i18n";

type Props = {
  certToken: string;
  compact?: boolean;
};

export function AcademyReminderOptIn({ certToken, compact }: Props) {
  const { locale } = useLocale();
  const m = getAcademyMessages(locale);
  const r = m.reminder;

  const [email, setEmail] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function subscribe() {
    if (!optIn) {
      setError(r.errorOptIn);
      return;
    }
    if (!email.trim().includes("@")) {
      setError(r.errorEmail);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/academy/reminders/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, certToken, locale }),
      });
      const data = (await res.json()) as { ok?: boolean; reason?: string };
      if (data.ok) {
        setDone(true);
      } else {
        setError(data.reason === "invalid_email" ? r.errorInvalidEmail : r.errorGeneric);
      }
    } catch {
      setError(r.errorNetwork);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm text-white/65">
        {r.done}
      </p>
    );
  }

  return (
    <div
      className={
        compact
          ? "mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
          : "mt-10 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 md:p-6"
      }
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
        {r.optionalEyebrow}
      </p>
      <p className="mt-2 text-sm text-white/60">{r.optionalBody}</p>
      <label className="mt-4 block">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">
          {r.emailLabel}
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full max-w-md rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-white/25"
          placeholder={r.emailPlaceholder}
          autoComplete="email"
        />
      </label>
      <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-white/50">
        <input
          type="checkbox"
          checked={optIn}
          onChange={(e) => setOptIn(e.target.checked)}
          className="mt-1"
        />
        <span>{r.consent}</span>
      </label>
      {error && (
        <p className="mt-3 text-sm text-white/70" role="alert">
          {error}
        </p>
      )}
      <div className="mt-4">
        <PrimaryButton type="button" disabled={loading} onClick={() => void subscribe()}>
          {loading ? r.activating : r.activate}
        </PrimaryButton>
      </div>
    </div>
  );
}
