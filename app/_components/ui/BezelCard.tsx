"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { fadeUp } from "@/lib/motion";

type BezelCardProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  animate?: boolean;
};

export function BezelCard({
  children,
  className = "",
  innerClassName = "",
  animate = false,
}: BezelCardProps) {
  const shell = (
    <div className={`bezel-outer ${className}`}>
      <div className={`bezel-inner ${innerClassName}`}>{children}</div>
    </div>
  );

  if (!animate) return shell;

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="bezel-outer h-full min-w-0">
        <div className={`bezel-inner ${innerClassName}`}>{children}</div>
      </div>
    </motion.div>
  );
}
