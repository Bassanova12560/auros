"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GREEN_API_DOCS_ROUTE } from "@/lib/green/api/constants";
import {
  GREEN_MARKET_ROUTE,
  GREEN_REGISTER_ROUTE,
  GREEN_REGISTRY_ROUTE,
} from "@/lib/green";
import { WIZARD_EXPRESS_HREF } from "@/lib/wizard-routes";
import type { Locale } from "@/lib/i18n";

const COPY: Record<
  Locale,
  {
    title: string;
    producer: { title: string; body: string; cta: string };
    investor: { title: string; body: string; cta: string };
    builder: { title: string; body: string; cta: string };
  }
> = {
  fr: {
    title: "Par où commencer ?",
    producer: {
      title: "Producteur / opérateur",
      body: "Publier un actif, prouver (RTMS), être mis en avant Verified.",
      cta: "Publier mon actif",
    },
    investor: {
      title: "Investisseur / fonds",
      body: "Sourcer sur le marché, vérifier le registre, structurer un dossier.",
      cta: "Explorer le marché",
    },
    builder: {
      title: "Builder / plateforme",
      body: "Brancher scores, registre et preuves via Green API.",
      cta: "Green API",
    },
  },
  en: {
    title: "Where to start?",
    producer: {
      title: "Producer / operator",
      body: "List an asset, prove (RTMS), get Verified featured.",
      cta: "List my asset",
    },
    investor: {
      title: "Investor / fund",
      body: "Source on the market, check the registry, structure a file.",
      cta: "Explore market",
    },
    builder: {
      title: "Builder / platform",
      body: "Wire scores, registry and proofs via Green API.",
      cta: "Green API",
    },
  },
  es: {
    title: "¿Por dónde empezar?",
    producer: {
      title: "Productor / operador",
      body: "Publicar un activo, probar (RTMS), destacar Verified.",
      cta: "Publicar mi activo",
    },
    investor: {
      title: "Inversor / fondo",
      body: "Sourcing en el mercado, verificar registro, estructurar dossier.",
      cta: "Explorar mercado",
    },
    builder: {
      title: "Builder / plataforma",
      body: "Conectar scores, registro y pruebas vía Green API.",
      cta: "Green API",
    },
  },
  ar: {
    title: "من أين تبدأ؟",
    producer: {
      title: "منتج / مشغّل",
      body: "انشر أصلاً، أثبت (RTMS)، واحصل على تمييز Verified.",
      cta: "نشر أصلي",
    },
    investor: {
      title: "مستثمر / صندوق",
      body: "استكشف السوق، تحقق من السجل، وهيكل ملفاً.",
      cta: "استكشاف السوق",
    },
    builder: {
      title: "مطوّر / منصة",
      body: "اربط الدرجات والسجل والأدلة عبر Green API.",
      cta: "Green API",
    },
  },
  zh: {
    title: "从哪里开始？",
    producer: {
      title: "生产商 / 运营商",
      body: "上架资产、RTMS 证明、获得 Verified 曝光。",
      cta: "上架我的资产",
    },
    investor: {
      title: "投资者 / 基金",
      body: "在市场上寻源、核验登记、结构化材料。",
      cta: "探索市场",
    },
    builder: {
      title: "开发者 / 平台",
      body: "通过 Green API 接入分数、登记与证明。",
      cta: "Green API",
    },
  },
};

type Props = {
  /** Compact for market page under header. */
  compact?: boolean;
};

export function GreenJobsDoors({ compact = false }: Props) {
  const { locale } = useLocale();
  const c = COPY[locale] ?? COPY.fr;

  const doors = [
    {
      ...c.producer,
      href: GREEN_REGISTER_ROUTE,
      secondaryHref: WIZARD_EXPRESS_HREF,
    },
    {
      ...c.investor,
      href: GREEN_MARKET_ROUTE,
      secondaryHref: GREEN_REGISTRY_ROUTE,
    },
    {
      ...c.builder,
      href: GREEN_API_DOCS_ROUTE,
      secondaryHref: "/data/terminal",
    },
  ];

  return (
    <section
      className={
        compact
          ? "mt-6"
          : "mt-8 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.03] p-5"
      }
      aria-label={c.title}
    >
      <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        {c.title}
      </h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-3">
        {doors.map((d) => (
          <li key={d.href}>
            <Link
              href={d.href}
              className="block h-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-3 transition hover:border-emerald-400/40"
            >
              <span className="font-display text-sm text-white">{d.title}</span>
              <span className="mt-1 block text-xs leading-snug text-white/45">
                {d.body}
              </span>
              <span className="mt-2 inline-block font-mono text-[10px] uppercase tracking-wider text-emerald-400/80">
                {d.cta} →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
