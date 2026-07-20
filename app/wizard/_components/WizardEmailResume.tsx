"use client";

import { useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";

/**
 * Visible anti-exit: email → lien de reprise wizard (local + e-mail).
 */
export function WizardEmailResume({
  hasContactEmail,
}: {
  hasContactEmail?: string | null;
}) {
  const { locale } = useLocale();
  const [email, setEmail] = useState(hasContactEmail?.trim() ?? "");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle"
  );

  const copy =
    locale === "en"
      ? {
          title: "Get a resume link by email",
          hint: "So you never lose this draft — even without an account yet.",
          placeholder: "you@company.com",
          send: "Send link",
          ok: "Check your inbox — link sent.",
          err: "Could not send. Try again.",
        }
      : locale === "es"
        ? {
            title: "Recibir enlace de reanudación",
            hint: "Para no perder este borrador — incluso sin cuenta.",
            placeholder: "usted@empresa.com",
            send: "Enviar enlace",
            ok: "Revise su correo — enlace enviado.",
            err: "No se pudo enviar. Reintente.",
          }
        : {
            title: "Recevoir un lien de reprise",
            hint: "Pour ne jamais perdre ce brouillon — même sans compte.",
            placeholder: "vous@entreprise.com",
            send: "Envoyer le lien",
            ok: "Vérifiez votre boîte — lien envoyé.",
            err: "Envoi impossible. Réessayez.",
          };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.includes("@")) {
      setStatus("err");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/wizard/resume-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, locale }),
      });
      setStatus(res.ok ? "ok" : "err");
    } catch {
      setStatus("err");
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3">
      <p className="text-xs font-medium text-white/70">{copy.title}</p>
      <p className="mt-1 text-[11px] text-white/40">{copy.hint}</p>
      <form
        onSubmit={(e) => void onSubmit(e)}
        className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center"
      >
        <input
          type="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder={copy.placeholder}
          className="min-h-[40px] flex-1 rounded-lg border border-white/10 bg-black/30 px-3 font-mono text-xs text-white outline-none focus:border-white/30"
          autoComplete="email"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="min-h-[40px] rounded-lg border border-white/20 px-4 font-mono text-[10px] uppercase tracking-wider text-white/80 hover:border-white/40 disabled:opacity-50"
        >
          {status === "sending" ? "…" : copy.send}
        </button>
      </form>
      {status === "ok" ? (
        <p className="mt-2 text-[11px] text-emerald-400/90">{copy.ok}</p>
      ) : null}
      {status === "err" ? (
        <p className="mt-2 text-[11px] text-amber-400/90">{copy.err}</p>
      ) : null}
    </div>
  );
}
