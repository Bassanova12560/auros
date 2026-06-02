import type { ElementType, ReactNode } from "react";

type Width = "6xl" | "5xl" | "3xl" | "2xl" | "lg" | "full";

const WIDTH: Record<Width, string> = {
  "6xl": "page-inner--6xl",
  "5xl": "page-inner--5xl",
  "3xl": "page-inner--3xl",
  "2xl": "page-inner--2xl",
  lg: "page-inner--lg",
  full: "max-w-none",
};

type Props = {
  children: ReactNode;
  width?: Width;
  /** Extra bottom padding for fixed mobile sticky bars (comparators, jurisdictions). */
  stickyBottom?: boolean;
  className?: string;
  innerClassName?: string;
  as?: ElementType;
};

/**
 * Standard AUROS page shell — safe areas, overflow clip, responsive padding.
 */
export function MobilePageShell({
  children,
  width = "6xl",
  stickyBottom = false,
  className = "",
  innerClassName = "",
  as: Tag = "main",
}: Props) {
  const shell = [
    "page-main",
    stickyBottom ? "page-main--sticky" : "page-main--nav",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = ["page-inner", WIDTH[width], innerClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={shell}>
      <div className={inner}>{children}</div>
    </Tag>
  );
}
