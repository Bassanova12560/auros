"use client";

import { useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  GREEN_MARKET_VERIFIED_EUR,
  GREEN_MARKET_INTRO_EUR,
} from "@/lib/green/market-cash-pricing";
import { GREEN_REGISTER_ROUTE, GREEN_RTMS_ASSISTANT_ROUTE } from "@/lib/green";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

const COPY: Record<
  Locale,
  {
    title: string;
    freeTitle: string;
    freeBody: string;
    verifiedTitle: string;
    verifiedBody: string;
    email: string;
    company: string;
    cta: string;
    disclaimer: string;
    freeCta: string;
    rtms: string;
  }
> = {
  fr: {
    title: "Listing Free vs Verified",
    freeTitle: "Free",
    freeBody: "1 annonce, pas de mise en avant. Revue sous 48 h ouvrées.",
    verifiedTitle: `Verified — ${GREEN_MARKET_VERIFIED_EUR} €`,
    verifiedBody:
      "Badge Verified + priorité liste + parcours RTMS. Revue humaine ops.",
    email: "E-mail",
    company: "Société (opt.)",
    cta: `Passer en Verified — ${GREEN_MARKET_VERIFIED_EUR} €`,
    disclaimer:
      "Paiement = demande de mise en avant. Pas de certification automatique.",
    freeCta: "Publier gratuitement",
    rtms: "Pré-diag RTMS",
  },
  en: {
    title: "Free vs Verified listing",
    freeTitle: "Free",
    freeBody: "1 listing, no featured placement. Review within 48 business hours.",
    verifiedTitle: `Verified — ${GREEN_MARKET_VERIFIED_EUR} €`,
    verifiedBody: "Verified badge + list priority + RTMS path. Human ops review.",
    email: "Email",
    company: "Company (opt.)",
    cta: `Go Verified — ${GREEN_MARKET_VERIFIED_EUR} €`,
    disclaimer: "Payment = featured request. No automatic certification.",
    freeCta: "List for free",
    rtms: "RTMS pre-check",
  },
  es: {
    title: "Listing Free vs Verified",
    freeTitle: "Free",
    freeBody: "1 anuncio, sin destacado. Revisión en 48 h laborables.",
    verifiedTitle: `Verified — ${GREEN_MARKET_VERIFIED_EUR} €`,
    verifiedBody: "Badge Verified + prioridad + ruta RTMS. Revisión humana.",
    email: "Email",
    company: "Empresa (opc.)",
    cta: `Pasar a Verified — ${GREEN_MARKET_VERIFIED_EUR} €`,
    disclaimer: "Pago = solicitud de destacado. Sin certificación automática.",
    freeCta: "Publicar gratis",
    rtms: "Pre-diag RTMS",
  },
  ar: {
    title: "إدراج Free مقابل Verified",
    freeTitle: "Free",
    freeBody: "إعلان واحد، بلا تمييز. مراجعة خلال 48 ساعة عمل.",
    verifiedTitle: `Verified — ${GREEN_MARKET_VERIFIED_EUR} €`,
    verifiedBody: "شارة Verified + أولوية + مسار RTMS. مراجعة بشرية.",
    email: "البريد",
    company: "الشركة (اختياري)",
    cta: `الترقية إلى Verified — ${GREEN_MARKET_VERIFIED_EUR} €`,
    disclaimer: "الدفع = طلب تمييز. لا اعتماد تلقائي.",
    freeCta: "نشر مجاناً",
    rtms: "فحص RTMS أولي",
  },
  zh: {
    title: "Free 与 Verified 上架",
    freeTitle: "Free",
    freeBody: "1 条公告，无置顶。48 个工作小时内审核。",
    verifiedTitle: `Verified — ${GREEN_MARKET_VERIFIED_EUR} €`,
    verifiedBody: "Verified 徽章 + 列表优先 + RTMS 路径。人工审核。",
    email: "邮箱",
    company: "公司（可选）",
    cta: `升级 Verified — ${GREEN_MARKET_VERIFIED_EUR} €`,
    disclaimer: "付款 = 置顶申请。非自动认证。",
    freeCta: "免费上架",
    rtms: "RTMS 预检",
  },
};

export function GreenMarketListingPlans() {
  const { locale } = useLocale();
  const c = COPY[locale] ?? COPY.fr;
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/green/market/verified-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, locale }),
      });
      const json = (await res.json()) as {
        url?: string;
        error?: string;
      };
      if (!res.ok || !json.url) {
        setError(json.error ?? "Checkout unavailable");
        setLoading(false);
        return;
      }
      window.location.href = json.url;
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <section
      id="listing-plans"
      className="mt-12 scroll-mt-24 rounded-xl border border-white/[0.08] bg-black/30 p-5 md:p-6"
    >
      <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        {c.title}
      </h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-white/[0.08] p-4">
          <p className="font-display text-lg text-white">{c.freeTitle}</p>
          <p className="mt-2 text-sm text-white/50">{c.freeBody}</p>
          <Link
            href={GREEN_REGISTER_ROUTE}
            className="mt-4 inline-block font-mono text-[11px] uppercase tracking-wider text-emerald-400/80 hover:text-emerald-300"
          >
            {c.freeCta} →
          </Link>
        </div>
        <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/[0.05] p-4">
          <p className="font-display text-lg text-white">{c.verifiedTitle}</p>
          <p className="mt-2 text-sm text-white/55">{c.verifiedBody}</p>
          <p className="mt-2 text-xs text-white/35">{c.disclaimer}</p>
          <label className="mt-4 block">
            <span className="font-mono text-[10px] uppercase text-white/40">
              {c.email}
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="mt-3 block">
            <span className="font-mono text-[10px] uppercase text-white/40">
              {c.company}
            </span>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value.slice(0, 160))}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white"
            />
          </label>
          {error ? (
            <p className="mt-2 text-xs text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          <PrimaryButton
            type="button"
            className="mt-4 !w-full"
            disabled={loading || !email.includes("@")}
            onClick={() => void checkout()}
          >
            {loading ? "…" : c.cta}
          </PrimaryButton>
          <Link
            href={GREEN_RTMS_ASSISTANT_ROUTE}
            className="mt-3 inline-block font-mono text-[10px] uppercase tracking-wider text-white/40 hover:text-white/65"
          >
            {c.rtms} →
          </Link>
          <p className="mt-3 font-mono text-[10px] text-white/30">
            Intro fee {GREEN_MARKET_INTRO_EUR} € on offer pages
          </p>
        </div>
      </div>
    </section>
  );
}
