"use client";

import { motion } from "framer-motion";

import { useJurisdictionPage } from "./useJurisdictionPage";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function JurisdictionTrustStrip() {
  const { messages } = useJurisdictionPage();

  return (
    <motion.section
      className="border-y border-white/[0.06] py-5"
      aria-label="Trust"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeUp}
    >
      <p className="text-center font-mono text-[10px] leading-relaxed tracking-wide text-white/35">
        {messages.trust.badges.join("  ·  ")}
      </p>
    </motion.section>
  );
}
