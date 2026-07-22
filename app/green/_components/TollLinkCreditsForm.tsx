"use client";

import { useState, type FormEvent } from "react";

import {
  KEY_PREFIX_LIVE,
  KEY_PREFIX_TEST,
} from "@/lib/protocol/constants";

type Props = {
  defaultFromEmail: string;
};

export function TollLinkCreditsForm({ defaultFromEmail }: Props) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "ok" | "err" | "key_err"
  >("idle");
  const [detail, setDetail] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setDetail("");
    const fd = new FormData(e.currentTarget);
    const fromEmail = String(fd.get("fromEmail") ?? "").trim().toLowerCase();
    const apiKey = String(fd.get("apiKey") ?? "").trim();
    if (
      !apiKey.startsWith(KEY_PREFIX_LIVE) &&
      !apiKey.startsWith(KEY_PREFIX_TEST)
    ) {
      setStatus("key_err");
      return;
    }
    try {
      const res = await fetch("/api/green/toll/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ fromEmail }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        transferred?: { lookups: number; events: number };
      };
      if (!res.ok || !json.ok) {
        setStatus("err");
        setDetail(json.error ?? "link_failed");
        return;
      }
      setStatus("ok");
      const t = json.transferred;
      setDetail(
        t
          ? `${t.lookups} lookups · ${t.events} events transférés`
          : "Crédits liés à la clé"
      );
    } catch {
      setStatus("err");
      setDetail("network");
    }
  }

  const field =
    "mt-1.5 w-full border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50";

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
        Lier les crédits à une clé API
      </p>
      <label className="block text-sm">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          E-mail du checkout
        </span>
        <input
          name="fromEmail"
          type="email"
          required
          defaultValue={defaultFromEmail}
          className={field}
        />
      </label>
      <label className="block text-sm">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          Clé API AUROS
        </span>
        <input
          name="apiKey"
          type="password"
          required
          autoComplete="off"
          placeholder="auros_pk_live_…"
          className={field}
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-emerald-200/90 hover:bg-emerald-500/20 disabled:opacity-50"
      >
        Transférer vers la clé
      </button>
      {status === "ok" ? (
        <p className="text-sm text-emerald-300/90">{detail}</p>
      ) : null}
      {status === "key_err" ? (
        <p className="text-sm text-red-300/80">Clé API invalide.</p>
      ) : null}
      {status === "err" ? (
        <p className="text-sm text-red-300/80">
          Transfert impossible ({detail || "erreur"}). Vérifiez la clé et
          l’e-mail, ou contactez hello@getauros.com.
        </p>
      ) : null}
    </form>
  );
}
