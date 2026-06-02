"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import { useLocale } from "./i18n/LocaleProvider";
import { scorePresentation } from "@/lib/score-presentation";
import { SPRING_GENTLE } from "@/lib/motion";

type Props = {
  score: number;
  show: boolean;
  compact?: boolean;
  /** Affiche le score final sans compteur 0→N (évite la confusion 60 vs 78). */
  instant?: boolean;
};

export function ScoreReveal({
  score,
  show,
  compact = false,
  instant = false,
}: Props) {
  const { locale } = useLocale();
  const presentation = scorePresentation(score, locale);
  const spring = useSpring(instant ? score : 0, SPRING_GENTLE);
  const [displayNum, setDisplayNum] = useState(instant ? score : 0);
  const barWidth = useTransform(spring, (v) => `${Math.min(100, v)}%`);

  useMotionValueEvent(spring, "change", (v) => {
    setDisplayNum(Math.round(v));
  });

  useEffect(() => {
    if (!show) {
      spring.set(0);
      setDisplayNum(0);
      return;
    }
    if (instant) {
      spring.jump(score);
      setDisplayNum(score);
    } else {
      spring.set(score);
    }
  }, [show, score, spring, instant]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex w-full flex-col items-center"
        >
          <motion.span
            className={`font-display font-semibold tabular-nums text-white ${
              compact ? "text-6xl" : "text-7xl md:text-8xl"
            }`}
          >
            {displayNum}
          </motion.span>

          <motion.div
            className="mt-4 h-0.5 w-full max-w-xs overflow-hidden rounded-full bg-white/[0.08]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <motion.div
              className="h-full rounded-full bg-[#9F2F2D]"
              style={{ width: barWidth }}
            />
          </motion.div>

          <motion.p
            className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#9F2F2D]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.35 }}
          >
            {presentation.tierLabel}
          </motion.p>

          <motion.p
            className="mt-3 max-w-sm text-center text-sm font-light text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.35 }}
          >
            {presentation.microCopy}
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
