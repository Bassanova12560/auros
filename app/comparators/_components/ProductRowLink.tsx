"use client";

import type { ReactNode } from "react";

import { track } from "@/lib/analytics";
import type { ComparatorId } from "@/lib/comparators/registry";
import type { ComparatorProductRow } from "@/lib/comparators/types";

type ProductRowLinkProps = {
  href: string;
  row: ComparatorProductRow;
  comparatorId: ComparatorId;
  ariaLabel: string;
  className?: string;
  children: ReactNode;
};

export function ProductRowLink({
  href,
  row,
  comparatorId,
  ariaLabel,
  className = "",
  children,
}: ProductRowLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onClick={() =>
        track("comparator_platform_click", {
          platform: row.id,
          comparator: comparatorId,
          affiliate: Boolean(row.affiliate_link),
        })
      }
      className={`block text-inherit no-underline ${className}`}
    >
      {children}
    </a>
  );
}
