"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getArlUi } from "@/lib/arl/ui-i18n";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * Hero visual aligned with liquidity / Resource Layer story (locale-aware).
 */
export function ProductPreview() {
  const { locale } = useLocale();
  const p = getArlUi(locale).preview;

  return (
    <motion.div
      className="w-full lg:max-w-md lg:flex-1"
      initial="hidden"
      animate="visible"
      variants={staggerContainer(0.08, 0.06)}
    >
      <div className="bezel-outer">
        <div className="bezel-inner p-5 md:p-6">
          <motion.div variants={fadeUp} className="flex items-center justify-between">
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/45">
              {p.eyebrow}
            </p>
            <span className="rounded-full border border-white/15 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-white/50">
              {p.badge}
            </span>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-5 grid grid-cols-3 gap-2">
            {[
              { label: "EUR", value: "10,000" },
              { label: "akWh", value: "—" },
              { label: "WATT", value: "—" },
            ].map((row) => (
              <div
                key={row.label}
                className="rounded-lg border border-white/[0.08] bg-black/30 px-2.5 py-2"
              >
                <p className="font-mono text-[8px] uppercase tracking-wider text-white/35">
                  {row.label}
                </p>
                <p className="mt-1 font-display text-sm tabular-nums text-white">{row.value}</p>
              </div>
            ))}
          </motion.div>

          <motion.ol variants={fadeUp} className="mt-6 space-y-0 border border-white/[0.08]">
            {p.steps.map((step, i) => (
              <li
                key={step.n}
                className={`flex items-center gap-3 px-3 py-3 ${
                  i > 0 ? "border-t border-white/[0.06]" : ""
                } ${i === 0 ? "bg-white/[0.05]" : ""}`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] ${
                    i === 0 ? "bg-white text-black" : "bg-white/10 text-white/50"
                  }`}
                >
                  {step.n}
                </span>
                <span>
                  <span className="block font-display text-sm text-white">{step.title}</span>
                  <span className="font-mono text-[9px] text-white/35">{step.hint}</span>
                </span>
              </li>
            ))}
          </motion.ol>

          <motion.div variants={fadeUp} className="mt-4">
            <Link
              href="/lab"
              className="block w-full rounded border border-white/25 bg-white/10 py-2.5 text-center font-mono text-[10px] uppercase tracking-wider text-white hover:bg-white/15"
            >
              {p.cta}
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
