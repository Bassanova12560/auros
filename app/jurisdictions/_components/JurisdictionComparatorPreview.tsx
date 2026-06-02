"use client";

import { motion } from "framer-motion";

import { useJurisdictionPage } from "./useJurisdictionPage";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function JurisdictionComparatorPreview() {
  const { messages } = useJurisdictionPage();
  const p = messages.hero.preview;
  const s = messages.hero.social;

  return (
    <motion.div
      className="w-full lg:max-w-md lg:flex-shrink-0"
      initial="hidden"
      animate="visible"
      variants={staggerContainer(0.08, 0.12)}
    >
      <div className="bezel-outer">
        <div className="bezel-inner p-5 md:p-6">
          <motion.div variants={fadeUp} className="flex items-center justify-between gap-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/45">
              {p.label}
            </p>
            <span className="rounded-full border border-white/15 px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-wider text-white/50">
              {p.compareLabel}
            </span>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-5 grid grid-cols-2 gap-2">
            <JurisdictionChip label={p.jurisdictionA} active />
            <JurisdictionChip label={p.jurisdictionB} />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-5 space-y-2.5">
            <PreviewRow label={p.stateFees.split(" ")[0]!} value={p.stateFees.replace(/^[^\s]+\s/, "")} />
            <PreviewRow label={p.advisoryFees.split(" ")[0]!} value={p.advisoryFees.replace(/^[^\s]+\s/, "")} />
            <PreviewRow label={p.licenseDelay.split(" ")[0]!} value={p.licenseDelay.replace(/^[^\s]+\s/, "")} />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
              {messages.table.taxInvestor}
            </p>
            <p className="mt-1.5 font-display text-lg text-white">{p.taxNote}</p>
          </motion.div>

          <motion.blockquote
            variants={fadeUp}
            className="mt-5 border-t border-white/[0.06] pt-5"
          >
            <div className="flex gap-3">
              <span className="jurisdiction-social-avatar">{s.initials}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-relaxed text-white/60">&ldquo;{s.quote}&rdquo;</p>
                <footer className="mt-3">
                  <p className="text-sm font-medium text-white/80">{s.name}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-white/40">
                    {s.role} · {s.project}
                  </p>
                </footer>
              </div>
            </div>
          </motion.blockquote>
        </div>
      </div>
    </motion.div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-white/[0.05] pb-2 last:border-0">
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">
        {label}
      </span>
      <span className="font-mono text-sm tabular-nums text-white/75">{value}</span>
    </div>
  );
}

function JurisdictionChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className={`rounded-lg border px-3 py-2 text-center font-mono text-[10px] tracking-wide ${
        active
          ? "border-white/25 bg-white/[0.08] text-white"
          : "border-white/[0.08] text-white/45"
      }`}
    >
      {label}
    </span>
  );
}
