"use client";

import { motion } from "framer-motion";

import { fadeUp, staggerContainer } from "@/lib/motion";

/** Aperçu statique du dossier tokenisation (hero). */
export function ProductPreview() {
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
              Dossier AUROS
            </p>
            <span className="rounded-full border border-white/15 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-white/50">
              Preview
            </span>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-5 space-y-3">
            <PreviewRow label="Actif" value="Immobilier · Bordeaux" />
            <PreviewRow label="Valeur" value="1 200 000 €" />
            <PreviewRow label="Maturité" value="72% · dossier prêt" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
              Score tokenisation
            </p>
            <p className="mt-2 font-display text-4xl font-semibold tabular-nums text-white">
              78
            </p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full w-[78%] rounded-full bg-white/70" />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-4 grid grid-cols-2 gap-2">
            {["Legal", "KYC", "MiCA", "Data room"].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-white/[0.06] px-2.5 py-2 font-mono text-[9px] uppercase tracking-wider text-white/45"
              >
                {item}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.05] pb-2">
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">
        {label}
      </span>
      <span className="text-right text-sm text-white/75">{value}</span>
    </div>
  );
}
