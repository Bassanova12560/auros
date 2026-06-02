"use client";

import { motion } from "framer-motion";

import { Eyebrow } from "./Eyebrow";
import { fadeUp, staggerContainer } from "@/lib/motion";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeaderProps) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <motion.header
      className={`max-w-3xl ${alignCls}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer(0.12)}
    >
      <motion.div variants={fadeUp}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </motion.div>
      <motion.h2
        variants={fadeUp}
        className="mt-5 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl"
      >
        {title}
      </motion.h2>
      {subtitle ? (
        <motion.p
          variants={fadeUp}
          className="mt-4 text-base leading-relaxed text-muted md:text-lg"
        >
          {subtitle}
        </motion.p>
      ) : null}
    </motion.header>
  );
}
