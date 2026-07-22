"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  KEY_PREFIX_LIVE,
  KEY_PREFIX_TEST,
} from "@/lib/protocol/constants";
import type { TollCashProduct } from "@/lib/toll/lifecycle-pricing";
import {
  capturePartnerFromSearchParams,
  getPartnerCode,
} from "@/lib/partner-attribution";

type Props = {
  product: TollCashProduct;
  cta: string;
  priceLabel: string;
};

function looksLikeAurosApiKey(raw: string): boolean {
  return raw.startsWith(KEY_PREFIX_LIVE) || raw.startsWith(KEY_PREFIX_TEST);
}

function TollCheckoutFormInner({ product, cta, priceLabel }: Props) {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "err" | "key_err">(
    "idle"
  );

  useEffect(() => {
    capturePartnerFromSearchParams(new URLSearchParams(searchParams.toString()));
  }, [searchParams]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const apiKey = String(fd.get("apiKey") ?? "").trim();
    if (apiKey && !looksLikeAurosApiKey(apiKey)) {
      setStatus("key_err");
      return;
    }
    try {
      // Server hashes apiKey → credit_subject key:{hash}; raw key never in Stripe metadata.
      const res = await fetch("/api/green/toll/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          email,
          company: fd.get("company"),
          locale,
          partnerCode: getPartnerCode(),
          apiKey: apiKey || undefined,
        }),
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (res.status === 400 && json.error === "invalid_api_key") {
        setStatus("key_err");
        return;
      }
      if (!res.ok || !json.url) {
        setStatus("err");
        return;
      }
      window.location.href = json.url;
    } catch {
      setStatus("err");
    }
  }

  const field =
    "mt-1.5 w-full border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50";

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <p className="font-mono text-[11px] uppercase tracking-wider text-emerald-400/80">
        {priceLabel}
      </p>
      <label className="block text-sm">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          E-mail
        </span>
        <input name="email" type="email" required className={field} />
      </label>
      <label className="block text-sm">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          Société
        </span>
        <input name="company" className={field} />
      </label>
      <label className="block text-sm">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          Clé API AUROS (recommandé)
        </span>
        <input
          name="apiKey"
          type="password"
          autoComplete="off"
          placeholder="auros_pk_live_…"
          className={field}
        />
        <span className="mt-1 block text-[11px] text-white/40">
          Si renseignée, les crédits s’attachent à la clé (jamais stockée en
          clair). Sinon : e-mail, puis lien self-serve.
        </span>
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-emerald-200/90 hover:bg-emerald-500/20 disabled:opacity-50"
      >
        {cta}
      </button>
      {status === "key_err" ? (
        <p className="text-sm text-red-300/80">Clé API invalide.</p>
      ) : null}
      {status === "err" ? (
        <p className="text-sm text-red-300/80">
          Paiement indisponible. Réessayez ou contactez hello@getauros.com.
        </p>
      ) : null}
    </form>
  );
}

export function TollCheckoutForm(props: Props) {
  return (
    <Suspense fallback={null}>
      <TollCheckoutFormInner {...props} />
    </Suspense>
  );
}
