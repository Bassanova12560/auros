"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

import { useTranslations } from "./i18n/LocaleProvider";
import { SPRING_GENTLE } from "@/lib/motion";

type StatItem = {
  value: string;
  label: string;
};

export function Stats() {
  const t = useTranslations();
  const stats = useMemo<StatItem[]>(
    () => [
      { value: "100", label: t.stats.scoreMax },
      { value: "40+", label: t.stats.jurisdictions },
      { value: "5", label: t.stats.sections },
      { value: "~12 min", label: t.stats.avgTime },
    ],
    [t]
  );

  return (
    <section className="px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 border-t border-white/[0.06] pt-16 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_GENTLE, delay: i * 0.05 }}
          >
            <p className="font-display text-4xl font-semibold text-white md:text-5xl">
              {stat.value}
            </p>
            <p className="mt-2 font-mono text-[10px] text-white/35">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
