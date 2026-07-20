"use client";

import Link from "next/link";
import { useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

import { useProtocolPremiumKey } from "./useProtocolPremiumKey";

/**
 * Bank ops: public verify (free) + Premium reseal (PQC agility schedule).
 */
export function ShieldVerifyResealPanel({ className = "" }: { className?: string }) {
  const { apiKey, setApiKey } = useProtocolPremiumKey();
  const [receiptId, setReceiptId] = useState("");
  const [busy, setBusy] = useState<"verify" | "reseal" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifyOut, setVerifyOut] = useState<string | null>(null);
  const [publicVerifyUrl, setPublicVerifyUrl] = useState<string | null>(null);
  const [resealOut, setResealOut] = useState<string | null>(null);

  async function verify() {
    const id = receiptId.trim();
    if (!id) {
      setError("Collez un receipt_id Shield.");
      return;
    }
    setBusy("verify");
    setError(null);
    setVerifyOut(null);
    setPublicVerifyUrl(null);
    try {
      const res = await fetch("/api/v1/shield/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = (await res.json()) as {
        valid?: boolean;
        id?: string;
        content_hash?: string;
        payload_retained?: boolean;
        error?: { message?: string };
        freemium?: string;
      };
      if (!res.ok) {
        setError(json.error?.message ?? `HTTP ${res.status}`);
        return;
      }
      const rid = json.id ?? id;
      setPublicVerifyUrl(`/verify?id=${encodeURIComponent(rid)}`);
      setVerifyOut(
        `valid=${String(json.valid)} · ${json.content_hash?.slice(0, 16) ?? "—"}… · payload_retained=${String(json.payload_retained)} · ${json.freemium ?? "verify"}`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setBusy(null);
    }
  }

  async function reseal() {
    const id = receiptId.trim();
    const key = apiKey.trim();
    if (!id) {
      setError("Collez un receipt_id Shield.");
      return;
    }
    if (!key) {
      setError("Reseal Premium — collez une clé Bearer.");
      return;
    }
    setBusy("reseal");
    setError(null);
    setResealOut(null);
    try {
      const res = await fetch("/api/v1/shield/reseal", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receipt_id: id }),
      });
      const json = (await res.json()) as {
        receipt_id?: string;
        recommended_profile?: string;
        status?: string;
        error?: { message?: string };
      };
      if (!res.ok) {
        setError(
          json.error?.message ??
            (res.status === 403
              ? "Reseal réservé Premium."
              : `HTTP ${res.status}`)
        );
        return;
      }
      setResealOut(
        `${json.status ?? "ok"} · profile=${json.recommended_profile ?? "—"} · ${json.receipt_id ?? id}`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div
      className={`space-y-4 border border-white/[0.08] bg-black/40 p-5 md:p-6 ${className}`}
    >
      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          Verify · Reseal
        </p>
        <p className="text-sm leading-relaxed text-white/55">
          Contrepartie : vérifier un receipt (gratuit). Émetteur Premium :
          planifier reseal <code className="text-white/70">hybrid_pqc_ready</code>{" "}
          — agilité crypto, pas une clé PQC live.
        </p>
      </div>

      <label className="block space-y-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          Receipt ID
        </span>
        <input
          value={receiptId}
          onChange={(e) => setReceiptId(e.target.value)}
          placeholder="shr_…"
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/25"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          Clé Premium (reseal)
        </span>
        <input
          type="password"
          autoComplete="off"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="auros_…"
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/25"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <PrimaryButton
          type="button"
          disabled={busy !== null}
          onClick={() => void verify()}
        >
          {busy === "verify" ? "Verify…" : "Verify (gratuit)"}
        </PrimaryButton>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void reseal()}
          className="min-h-[44px] rounded-full border border-white/20 px-4 font-mono text-[11px] uppercase tracking-wider text-white/60 transition hover:border-white/40 hover:text-white disabled:opacity-40"
        >
          {busy === "reseal" ? "Reseal…" : "Reseal PQC"}
        </button>
        <Link
          href="/status"
          className="inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-wider text-white/35 hover:text-white/60"
        >
          Status →
        </Link>
      </div>

      {error ? (
        <p className="text-sm text-red-400/90" role="alert">
          {error}
        </p>
      ) : null}
      {verifyOut ? (
        <div className="space-y-2">
          <p className="break-all font-mono text-[11px] text-emerald-400/85">
            {verifyOut}
          </p>
          {publicVerifyUrl ? (
            <p className="text-xs text-white/50">
              Lien risk desk :{" "}
              <Link
                href={publicVerifyUrl}
                className="font-mono text-emerald-300/90 underline-offset-2 hover:underline"
              >
                {publicVerifyUrl}
              </Link>
              {" · "}
              <button
                type="button"
                className="font-mono text-[11px] text-white/45 underline-offset-2 hover:underline"
                onClick={() => {
                  const absolute =
                    typeof window !== "undefined"
                      ? `${window.location.origin}${publicVerifyUrl}`
                      : publicVerifyUrl;
                  void navigator.clipboard?.writeText(absolute);
                }}
              >
                Copier
              </button>
            </p>
          ) : null}
        </div>
      ) : null}
      {resealOut ? (
        <p className="break-all font-mono text-[11px] text-amber-200/80">
          {resealOut}
        </p>
      ) : null}
    </div>
  );
}
