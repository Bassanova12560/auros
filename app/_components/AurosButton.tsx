"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export type AurosButtonVariant = "primary" | "ghost" | "link";

type AurosButtonProps = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: AurosButtonVariant;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  showArrow?: boolean;
};

const VARIANT_CLASS: Record<AurosButtonVariant, string> = {
  primary: "auros-btn auros-btn--primary",
  ghost: "auros-btn auros-btn--ghost",
  link: "auros-btn auros-btn--link",
};

function ArrowIcon() {
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-void/10 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
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
  );
}

export function AurosButton({
  href,
  onClick,
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled,
  showArrow = variant === "primary",
}: AurosButtonProps) {
  const cls = `${VARIANT_CLASS[variant]} group ${className}`.trim();

  const inner = (
    <>
      <span>{children}</span>
      {showArrow && variant === "primary" ? <ArrowIcon /> : null}
    </>
  );

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
