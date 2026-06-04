import type { ReactNode } from "react";

import { AiFirstPageJsonLd } from "./ai-first/AiFirstPageJsonLd";
import { AmbientShell } from "./ui/AmbientShell";
import { Footer } from "./Footer";
import { Nav } from "./Nav";

type Props = {
  path: string;
  children: ReactNode;
  /** Narrow content column (score, trust) vs wide (discover) */
  width?: "2xl" | "3xl" | "6xl";
  className?: string;
};

const WIDTH_CLASS = {
  "2xl": "page-inner--2xl",
  "3xl": "page-inner--3xl",
  "6xl": "page-inner--6xl",
} as const;

export function FocusPageShell({
  path,
  children,
  width = "3xl",
  className = "",
}: Props) {
  return (
    <AmbientShell>
      <AiFirstPageJsonLd path={path} />
      <Nav />
      <main
        className={`page-main page-main--nav text-white ${className}`}
      >
        <div className={`page-inner ${WIDTH_CLASS[width]} mx-auto px-4 pb-20 md:px-6`}>
          {children}
        </div>
      </main>
      <Footer />
    </AmbientShell>
  );
}
