"use client";

import { motion } from "framer-motion";

import { useTranslations } from "./i18n/LocaleProvider";
import { fadeUp } from "@/lib/motion";

type Act = 1 | 2 | 3;

export function LandingStory({ act }: { act: Act }) {
  const t = useTranslations();
  const content =
    act === 1
      ? { title: t.story.act1Title, body: t.story.act1Body }
      : act === 2
        ? { title: t.story.act2Title, body: t.story.act2Body }
        : { title: t.story.act3Title, body: t.story.act3Body };

  return (
    <section
      className={`px-6 py-14 md:py-20 ${
        act === 2 ? "border-y border-white/[0.06] bg-white/[0.015]" : ""
      }`}
    >
      <motion.div
        className="mx-auto max-w-3xl text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={fadeUp}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
          {String(act).padStart(2, "0")}
        </p>
        <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
          {content.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
          {content.body}
        </p>
      </motion.div>
    </section>
  );
}
