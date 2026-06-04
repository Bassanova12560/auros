"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import { useTranslations } from "./i18n/LocaleProvider";
import { SPRING_GENTLE } from "@/lib/motion";

type StatItem = {
  value: number;
  suffix: string;
  prefix: string;
  label: string;
};

export function Stats() {
  const t = useTranslations();
  const stats = useMemo<StatItem[]>(
    () => [
      { value: 100, suffix: "/100", prefix: "", label: t.stats.scoreMax },
      { value: 40, suffix: "+", prefix: "", label: t.stats.jurisdictions },
      { value: 5, suffix: "", prefix: "", label: t.stats.sections },
      { value: 12, suffix: " min", prefix: "~", label: t.stats.avgTime },
    ],
    [t]
  );

  const ref = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const activate = () => setTriggered(true);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          activate();
          io.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "120px 0px" }
    );
    io.observe(node);

    requestAnimationFrame(() => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) activate();
    });

    const fallback = window.setTimeout(activate, 2000);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <section ref={ref} className="px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 border-t border-white/[0.06] pt-16 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCell key={stat.label} stat={stat} index={i} triggered={triggered} />
        ))}
      </div>
    </section>
  );
}

function StatCell({
  stat,
  index,
  triggered,
}: {
  stat: StatItem;
  index: number;
  triggered: boolean;
}) {
  const [display, setDisplay] = useState(stat.value);

  useEffect(() => {
    if (!triggered) {
      setDisplay(stat.value);
      return;
    }

    setDisplay(0);
    const delay = index * 100;
    const duration = 1400;
    let start: number | null = null;
    let raf = 0;

    const timeout = window.setTimeout(() => {
      const step = (ts: number) => {
        if (start === null) start = ts;
        const elapsed = Math.min(1, (ts - start) / duration);
        const next = Math.round(stat.value * (1 - Math.pow(1 - elapsed, 3)));
        setDisplay(next);
        if (elapsed < 1) {
          raf = requestAnimationFrame(step);
        } else {
          setDisplay(stat.value);
        }
      };
      raf = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [triggered, stat.value, index]);

  return (
    <motion.div
      className="text-center lg:text-left"
      initial={{ opacity: 0, y: 8 }}
      animate={triggered ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ ...SPRING_GENTLE, delay: index * 0.05 }}
    >
      <p className="font-display text-4xl font-semibold text-white md:text-5xl">
        {stat.prefix}
        {display}
        <span className="text-xl text-white/30">{stat.suffix}</span>
      </p>
      <p className="mt-2 font-mono text-[10px] text-white/35">{stat.label}</p>
    </motion.div>
  );
}
