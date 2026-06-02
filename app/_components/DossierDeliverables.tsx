"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { useTranslations } from "./i18n/LocaleProvider";
import { SectionHeader } from "./ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/lib/motion";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-md bg-white/[0.06] ${className ?? "h-2 w-full"}`}
      aria-hidden
    />
  );
}

export function DossierDeliverables() {
  const t = useTranslations();
  const d = t.dossierPreview;

  return (
    <section id="dossier-preview" className="scroll-mt-28 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow={d.eyebrow}
          title={d.title}
          subtitle={d.subtitle}
        />

        <motion.div
          className="mt-12 grid gap-4 md:grid-cols-2"
          variants={staggerContainer(0.06, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {d.blocks.map((block, i) => (
            <motion.article
              key={block.tag}
              variants={fadeUp}
              className={`rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 ${
                i === 0 ? "md:col-span-2" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/35">
                  {block.tag}
                </span>
                {i === 0 ? (
                  <span className="font-display text-3xl font-semibold tabular-nums text-white/25">
                    —
                    <span className="text-lg text-white/20">/100</span>
                  </span>
                ) : null}
              </div>
              <h3 className="mt-3 text-sm font-medium text-white">
                {block.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                {block.description}
              </p>
              <div className="mt-4 space-y-2">
                <SkeletonBlock className="h-2 w-4/5" />
                <SkeletonBlock className="h-2 w-3/5" />
                {i === 3 ? (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <SkeletonBlock className="h-14 w-full rounded-lg" />
                    <SkeletonBlock className="h-14 w-full rounded-lg" />
                  </div>
                ) : null}
              </div>
            </motion.article>
          ))}
        </motion.div>

        <p className="mt-8 text-center text-sm leading-relaxed text-white/45">
          {d.disclaimer}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/wizard"
            className="rounded-full border border-white bg-white px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-void transition hover:bg-white/90"
          >
            {d.ctaWizard}
          </Link>
          <Link
            href="/wizard?demo=1"
            className="font-mono text-[10px] uppercase tracking-wider text-white/40 underline-offset-4 hover:text-white/65 hover:underline"
          >
            {d.ctaDemo}
          </Link>
        </div>
      </div>
    </section>
  );
}
