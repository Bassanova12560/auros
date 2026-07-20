"use client";

import { useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

const SAMPLE = `{
  "export": "chargeflow-demo",
  "units": 3,
  "note": "Collez n’importe quel export — on hashe, on jette, on rend une preuve."
}`;

type Receipt = {
  id?: string;
  content_hash?: string;
  cloud_signature?: string;
  verify_url?: string;
  payload_retained?: boolean;
  error?: { message?: string };
};

export function ShieldTryPanel() {
  const [text, setText] = useState(SAMPLE);
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [verifyOk, setVerifyOk] = useState<boolean | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function runTap() {
    setBusy(true);
    setErr(null);
    setVerifyOk(null);
    setReceipt(null);
    try {
      const res = await fetch("/api/v1/shield/demo", {
        method: "POST",
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: text,
      });
      const json = (await res.json()) as Receipt & {
        error?: { message?: string };
      };
      if (!res.ok) {
        setErr(json.error?.message ?? `Erreur ${res.status}`);
        return;
      }
      setReceipt(json);

      if (json.id) {
        const v = await fetch("/api/v1/shield/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: json.id }),
        });
        const vj = (await v.json()) as { valid?: boolean };
        setVerifyOk(Boolean(vj.valid));
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error");
    } finally {
      setBusy(false);
    }
  }

  function copy(value: string) {
    void navigator.clipboard.writeText(value);
  }

  return (
    <section className="space-y-4 border border-emerald-500/30 bg-emerald-500/[0.07] px-5 py-6 md:px-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400/85">
          Essayer maintenant — 0 compte
        </p>
        <h2 className="mt-2 font-display text-xl text-white">
          Collez un export → preuve en 1 clic
        </h2>
        <p className="mt-2 text-sm text-white/50">
          Pas de clé, pas de schéma JSON. Le texte est hashé puis jeté — seul le
          reçu est gardé.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={7}
        className="w-full border border-white/[0.1] bg-black/50 px-3 py-2.5 font-mono text-[11px] text-white/80 outline-none focus:border-emerald-500/40"
        spellCheck={false}
      />

      <div className="flex flex-wrap items-center gap-3">
        <PrimaryButton type="button" onClick={() => void runTap()} disabled={busy}>
          {busy ? "Scellement…" : "Obtenir la preuve"}
        </PrimaryButton>
        <button
          type="button"
          className="font-mono text-[10px] uppercase tracking-wider text-white/40 hover:text-white/70"
          onClick={() => setText(SAMPLE)}
        >
          Reset exemple
        </button>
      </div>

      {err ? (
        <p className="text-sm text-red-400/90" role="alert">
          {err}
        </p>
      ) : null}

      {receipt?.id ? (
        <div className="space-y-3 border-t border-white/[0.08] pt-4 text-sm">
          <p className="text-emerald-300/90">
            Preuve créée
            {verifyOk === true ? " · verify OK" : verifyOk === false ? " · verify fail" : ""}
          </p>
          <dl className="space-y-2 font-mono text-[10px] text-white/45">
            <div className="flex flex-wrap items-center gap-2">
              <dt>id</dt>
              <dd className="text-white/70">{receipt.id}</dd>
              <button
                type="button"
                className="underline-offset-2 hover:underline"
                onClick={() => copy(receipt.id!)}
              >
                copier
              </button>
            </div>
            <div>
              <dt className="inline">hash </dt>
              <dd className="inline break-all text-white/60">
                {receipt.content_hash}
              </dd>
            </div>
            <div>
              <dt className="inline">payload_retained </dt>
              <dd className="inline text-white/70">
                {String(receipt.payload_retained ?? false)}
              </dd>
            </div>
          </dl>
          <p className="text-xs text-white/40">
            Prod : même geste avec votre clé →{" "}
            <code className="text-white/55">POST /api/v1/shield/ingest</code>
            {" · "}
            Pack banque →{" "}
            <code className="text-white/55">POST /api/v1/shield/pack</code>
          </p>
        </div>
      ) : null}
    </section>
  );
}
