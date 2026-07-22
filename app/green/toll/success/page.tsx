"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import {
  GreenBackLink,
  GreenPageHeader,
  GreenPanel,
} from "@/app/green/_components/green-ui";

export default function GreenTollSuccessPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle"
  );
  const [msg, setMsg] = useState("");

  async function onLink(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    const apiKey = String(fd.get("apiKey") ?? "").trim();
    const fromEmail = String(fd.get("fromEmail") ?? "")
      .trim()
      .toLowerCase();
    try {
      const res = await fetch("/api/green/toll/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ fromEmail }),
      });
      const json = (await res.json()) as { error?: string; transferred?: unknown };
      if (!res.ok) {
        setStatus("err");
        setMsg(json.error ?? "link_failed");
        return;
      }
      setStatus("ok");
      setMsg("Crédits transférés sur la clé API.");
    } catch {
      setStatus("err");
      setMsg("network");
    }
  }

  const field =
    "mt-1.5 w-full border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50";

  return (
    <div className="page-inner page-inner--2xl mx-auto px-4 pb-20 pt-12 md:px-6">
      <GreenPageHeader
        eyebrow="Toll"
        title="Paiement reçu"
        intro="Si vous avez collé une clé API au checkout, les crédits sont déjà sur key:{hash}. Sinon, liez-les ci-dessous."
        compact
      />
      <GreenPanel className="mt-8">
        <div className="p-5 md:p-6 space-y-4 text-sm text-white/70">
          <p>
            Packs Lookup / Lifecycle · HITL notify ops. Pas de badge auto.
          </p>
          <form onSubmit={onLink} className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Lier e-mail → clé API
            </p>
            <input
              name="fromEmail"
              type="email"
              required
              placeholder="e-mail du checkout"
              className={field}
            />
            <input
              name="apiKey"
              type="password"
              required
              autoComplete="off"
              placeholder="auros_pk_live_…"
              className={field}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-emerald-200/90 disabled:opacity-50"
            >
              Transférer les crédits
            </button>
            {status === "ok" ? (
              <p className="text-emerald-300/80">{msg}</p>
            ) : null}
            {status === "err" ? (
              <p className="text-red-300/80">{msg}</p>
            ) : null}
          </form>
          <p>
            <Link href="/green/toll" className="underline underline-offset-4">
              Retour Toll
            </Link>
            {" · "}
            <Link
              href="/green/toll/tower"
              className="underline underline-offset-4"
            >
              Control Tower
            </Link>
          </p>
        </div>
      </GreenPanel>
      <GreenBackLink href="/green/toll">← Toll</GreenBackLink>
    </div>
  );
}
