"use client";

import { motion } from "framer-motion";

import { useTranslations } from "./i18n/LocaleProvider";
import type { ReadinessSnapshot } from "@/lib/tokenization-readiness";
import { fadeUp } from "@/lib/motion";

type Props = {
  snapshot: ReadinessSnapshot;
};

export function TokenizationProgress({ snapshot }: Props) {
  const t = useTranslations();

  return (
    <motion.div
      className="mt-8 w-full max-w-md rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 text-left"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.95, duration: 0.4 }}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            {t.progress.title}
          </p>
          <p className="mt-1 text-sm text-muted">{t.progress.subtitle}</p>
        </div>
        <p className="font-display text-2xl font-semibold tabular-nums text-white">
          {snapshot.percent}%
        </p>
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full bg-white/70"
          initial={{ width: 0 }}
          animate={{ width: `${snapshot.percent}%` }}
          transition={{ delay: 1.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <ul className="mt-5 space-y-2">
        {snapshot.items.map((item, i) => (
          <motion.li
            key={item.id}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.1 + i * 0.06 }}
            className="flex items-center gap-3 font-mono text-[11px] text-white/55"
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                item.done
                  ? "border-white/50 bg-white/90 text-void"
                  : "border-white/20 bg-transparent"
              }`}
              aria-hidden
            >
              {item.done ? (
                <span className="text-[9px] font-bold">+</span>
              ) : null}
            </span>
            <span className={item.done ? "text-white/80" : ""}>{item.label}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
