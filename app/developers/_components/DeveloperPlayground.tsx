"use client";

import { useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { DEMO_API_KEY } from "@/lib/protocol/constants";

const EXAMPLE_BODY = {
  description:
    "Tokenize a retail warehouse in Luxembourg, €2.5M valuation, SPV structure, professional investors, whitepaper draft ready.",
};

export function DeveloperPlayground() {
  const [description, setDescription] = useState(EXAMPLE_BODY.description);
  const [apiKey, setApiKey] = useState(DEMO_API_KEY);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runScore() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/v1/score", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Request failed");
      } else {
        setResult(JSON.stringify(json, null, 2));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  async function requestKey() {
    setLoading(true);
    setError(null);
    setNewKey(null);
    try {
      const res = await fetch("/api/v1/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Key request failed");
      } else if (json.api_key) {
        setNewKey(json.api_key);
        setApiKey(json.api_key);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="card-flat px-5 py-5">
        <h3 className="font-display text-base font-medium text-white">
          Obtenir une clé API
        </h3>
        <p className="mt-2 text-sm font-light text-white/45">
          E-mail professionnel → clé instantanée. Tier gratuit : 100 requêtes/mois.
          Clé démo playground : <code className="text-white/60">{DEMO_API_KEY}</code>
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@entreprise.com"
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30"
          />
          <PrimaryButton type="button" onClick={requestKey} disabled={loading || !email}>
            Générer ma clé
          </PrimaryButton>
        </div>
        {newKey ? (
          <p className="mt-3 font-mono text-xs text-emerald-400/90 break-all">
            {newKey}
          </p>
        ) : null}
      </section>

      <section className="card-flat px-5 py-5">
        <h3 className="font-display text-base font-medium text-white">
          Playground — POST /api/v1/score
        </h3>
        <label className="mt-4 block text-xs font-mono text-white/40">API key</label>
        <input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-xs text-white"
        />
        <label className="mt-4 block text-xs font-mono text-white/40">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white"
        />
        <PrimaryButton
          type="button"
          className="mt-4"
          onClick={runScore}
          disabled={loading || description.length < 10}
        >
          {loading ? "Calcul…" : "Tester le score"}
        </PrimaryButton>
        {error ? (
          <p className="mt-3 text-sm text-red-400/90">{error}</p>
        ) : null}
        {result ? (
          <pre className="mt-4 max-h-96 overflow-auto rounded-lg bg-black/40 p-4 font-mono text-[11px] text-white/70">
            {result}
          </pre>
        ) : null}
      </section>
    </div>
  );
}
