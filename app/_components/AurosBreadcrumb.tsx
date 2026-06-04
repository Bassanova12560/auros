"use client";

import Link from "next/link";

import { useTranslations } from "./i18n/LocaleProvider";

export function AurosBreadcrumb({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "default" | "green";
}) {
  const t = useTranslations();
  const surface =
    tone === "green"
      ? "border-white/[0.08] bg-green-page/95"
      : "border-white/[0.06] bg-void/90";

  return (
    <nav
      aria-label={t.breadcrumb.ariaLabel}
      className={`border-b ${surface} px-4 py-2 backdrop-blur-md md:px-6`}
    >
      <ol className="mx-auto flex max-w-6xl items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-white/35">
        <li>
          <Link
            href="/"
            className="transition hover:text-white/70"
          >
            AUROS
          </Link>
        </li>
        <li aria-hidden className="text-white/20">
          ›
        </li>
        <li className="text-white/55">{label}</li>
      </ol>
    </nav>
  );
}
