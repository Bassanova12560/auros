"use client";



import { useState, type FormEvent } from "react";

import Link from "next/link";



import {

  GreenBackLink,

  GreenDisclaimer,

  GreenPageHeader,

  GreenPanel,

} from "@/app/green/_components/green-ui";



type ApiResult = {

  ok?: boolean;

  stub?: boolean;

  claim?: unknown;

  error?: string;

  message?: string;

  meter?: { remaining?: number; cost?: number };

};



export default function TollZkDisclosurePage() {

  const [apiKey, setApiKey] = useState("");

  const [claimType, setClaimType] = useState<

    "eligibility" | "ratio" | "policy_match"

  >("eligibility");

  const [publicInputsJson, setPublicInputsJson] = useState(

    '{\n  "assetDnaId": "auros:dna:v1:demo",\n  "eligible": true\n}'

  );

  const [privateHintsJson, setPrivateHintsJson] = useState(

    '{\n  "wallet": "0x…",\n  "pep": false\n}'

  );

  const [salt, setSalt] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "err">("idle");

  const [result, setResult] = useState<ApiResult | null>(null);



  const field =

    "mt-1.5 w-full border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50";



  async function onSubmit(e: FormEvent) {

    e.preventDefault();

    setStatus("loading");

    setResult(null);

    try {

      let publicInputs: Record<string, unknown>;

      let privateHints: Record<string, unknown> | undefined;

      try {

        publicInputs = JSON.parse(publicInputsJson) as Record<string, unknown>;

        if (!publicInputs || typeof publicInputs !== "object" || Array.isArray(publicInputs)) {

          throw new Error("publicInputs");

        }

      } catch {

        setStatus("err");

        setResult({ error: "invalid_public_inputs_json" });

        return;

      }

      if (privateHintsJson.trim()) {

        try {

          privateHints = JSON.parse(privateHintsJson) as Record<string, unknown>;

          if (

            !privateHints ||

            typeof privateHints !== "object" ||

            Array.isArray(privateHints)

          ) {

            throw new Error("privateHints");

          }

        } catch {

          setStatus("err");

          setResult({ error: "invalid_private_hints_json" });

          return;

        }

      }



      const res = await fetch("/api/v1/toll/zk-disclosure", {

        method: "POST",

        headers: {

          Authorization: `Bearer ${apiKey.trim()}`,

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          claimType,

          publicInputs,

          privateHints,

          salt: salt.trim() || undefined,

        }),

      });

      const json = (await res.json()) as ApiResult;

      if (!res.ok) {

        setStatus("err");

        setResult(json);

        return;

      }

      setResult(json);

      setStatus("idle");

    } catch {

      setStatus("err");

      setResult({ error: "network_error" });

    }

  }



  return (

    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6">

      <GreenPageHeader

        eyebrow="ZK · stub v0 · Horizon 3"

        title="Confidential Compute / Selective Disclosure"

        intro="Prouver éligibilité, ratio ou policy match sans exposer le payload complet — forme produit H3, stub SHA-256 aujourd’hui. Pas de circuits ZK."

        compact

      />



      <GreenPanel className="mt-8">

        <div className="p-5 md:p-6 space-y-2 text-sm text-white/65">

          <p className="font-mono text-[10px] uppercase tracking-wider text-amber-200/70">

            Demo stub — not production crypto

          </p>

          <p>

            <code className="text-emerald-200/80">

              POST /api/v1/toll/zk-disclosure

            </code>{" "}

            — Bearer + research credits

          </p>

          <p>

            Retourne <code className="text-white/60">claim</code> + commitment

            SHA-256 + recipe HITL. <code className="text-white/60">verified</code>{" "}

            reste toujours <code className="text-white/60">false</code>.

          </p>

          <p className="text-white/45">

            Doc : <code className="text-white/60">docs/TOLL-ZK-DISCLOSURE.md</code>{" "}

            ·{" "}

            <Link

              href="/green/toll/tower"

              className="underline underline-offset-4"

            >

              Control Tower

            </Link>

          </p>

        </div>

      </GreenPanel>



      <GreenPanel className="mt-6">

        <form onSubmit={(e) => void onSubmit(e)} className="p-5 md:p-6 space-y-4">

          <label className="block text-sm">

            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">

              API key (Bearer)

            </span>

            <input

              value={apiKey}

              onChange={(e) => setApiKey(e.target.value)}

              required

              className={field}

              placeholder="auros_pk_…"

              autoComplete="off"

            />

          </label>

          <label className="block text-sm">

            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">

              claimType

            </span>

            <select

              value={claimType}

              onChange={(e) =>

                setClaimType(

                  e.target.value as "eligibility" | "ratio" | "policy_match"

                )

              }

              className={field}

            >

              <option value="eligibility">eligibility</option>

              <option value="ratio">ratio</option>

              <option value="policy_match">policy_match</option>

            </select>

          </label>

          <label className="block text-sm">

            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">

              publicInputs (JSON)

            </span>

            <textarea

              value={publicInputsJson}

              onChange={(e) => setPublicInputsJson(e.target.value)}

              required

              rows={5}

              className={`${field} font-mono text-xs`}

            />

          </label>

          <label className="block text-sm">

            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">

              privateHints (JSON, never returned)

            </span>

            <textarea

              value={privateHintsJson}

              onChange={(e) => setPrivateHintsJson(e.target.value)}

              rows={4}

              className={`${field} font-mono text-xs`}

            />

          </label>

          <label className="block text-sm">

            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">

              salt (optional)

            </span>

            <input

              value={salt}

              onChange={(e) => setSalt(e.target.value)}

              className={field}

              placeholder="auto-generated if empty"

            />

          </label>

          <button

            type="submit"

            disabled={status === "loading"}

            className="border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-emerald-200/90 disabled:opacity-50"

          >

            Build claim stub

          </button>

        </form>

      </GreenPanel>



      {result && (

        <GreenPanel className="mt-6">

          <pre className="overflow-x-auto p-5 text-xs text-white/70">

            {JSON.stringify(result, null, 2)}

          </pre>

        </GreenPanel>

      )}



      <GreenDisclaimer>

        Stub / demo — SHA-256 commitment only. Pas de preuve ZK, pas de TEE.

        HITL obligatoire.

      </GreenDisclaimer>

      <GreenBackLink href="/green/toll">← Toll</GreenBackLink>

    </div>

  );

}


