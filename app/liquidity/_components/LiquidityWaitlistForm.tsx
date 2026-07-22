"use client";

import { useState, type FormEvent } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";

export function LiquidityWaitlistForm() {
  const { locale } = useLocale();
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle"
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/liquidity-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"),
          role: fd.get("role"),
          chain: fd.get("chain"),
          message: fd.get("message"),
          locale,
        }),
      });
      if (!res.ok) {
        setStatus("err");
        return;
      }
      setStatus("ok");
      e.currentTarget.reset();
    } catch {
      setStatus("err");
    }
  }

  const field =
    "mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/40";

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-md space-y-4">
      <p className="text-xs text-white/45">
        Liste d’attente uniquement — pas d’exécution MM, pas de garantie de
        liquidité.
      </p>
      <label className="block text-sm">
        <span className="text-white/50">E-mail</span>
        <input name="email" type="email" required className={field} />
      </label>
      <label className="block text-sm">
        <span className="text-white/50">Rôle</span>
        <select name="role" className={field} defaultValue="issuer">
          <option value="issuer">Issuer</option>
          <option value="mm">Market maker</option>
          <option value="platform">Plateforme</option>
          <option value="other">Autre</option>
        </select>
      </label>
      <label className="block text-sm">
        <span className="text-white/50">Chaîne (optionnel)</span>
        <input name="chain" className={field} placeholder="ex. ethereum" />
      </label>
      <label className="block text-sm">
        <span className="text-white/50">Message (optionnel)</span>
        <textarea name="message" rows={2} className={field} />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full border border-white/20 px-5 py-2 text-sm text-white/85 hover:border-white/40 disabled:opacity-50"
      >
        Rejoindre la waitlist
      </button>
      {status === "ok" ? (
        <p className="text-sm text-emerald-300/80">Inscription reçue.</p>
      ) : null}
      {status === "err" ? (
        <p className="text-sm text-red-300/80">Échec — réessayez plus tard.</p>
      ) : null}
    </form>
  );
}
