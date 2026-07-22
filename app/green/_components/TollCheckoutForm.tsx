"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
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

function TollCheckoutFormInner({ product, cta, priceLabel }: Props) {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "err">("idle");

  useEffect(() => {
    capturePartnerFromSearchParams(new URLSearchParams(searchParams.toString()));
  }, [searchParams]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    try {
      const res = await fetch("/api/green/toll/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          email,
          company: fd.get("company"),
          locale,
          partnerCode: getPartnerCode(),
          creditSubject: `email:${email.trim().toLowerCase()}`,
        }),
      });
      const json = (await res.json()) as { url?: string };
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
      <button
        type="submit"
        disabled={status === "loading"}
        className="border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-emerald-200/90 hover:bg-emerald-500/20 disabled:opacity-50"
      >
        {cta}
      </button>
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
