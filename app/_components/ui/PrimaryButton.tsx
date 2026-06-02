"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type PrimaryButtonProps = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function PrimaryButton({
  href,
  onClick,
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled,
}: PrimaryButtonProps) {
  const base =
    "group inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-medium tracking-wide transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40";

  const variants = {
    primary: "bg-accent text-void hover:bg-white",
    ghost:
      "border border-white/20 bg-transparent text-white hover:border-white/50 hover:bg-white/[0.04]",
  };

  const inner = (
    <>
      <span>{children}</span>
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-void/10 transition-transform duration-500 group-hover:translate-x-0.5"
        aria-hidden
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 11L11 3M11 3H5M11 3V9"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </>
  );

  const cls = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
        <Link href={href} className={cls} onClick={onClick}>
          {inner}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cls}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {inner}
    </motion.button>
  );
}
