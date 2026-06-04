import Link from "next/link";
import type { ReactNode } from "react";

import { AurosButton } from "@/app/_components/AurosButton";

type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
  cta?: { href: string; label: string };
};

export function ContentPageLayout({ eyebrow, title, intro, children, cta }: Props) {
  return (
    <article className="section-y page-inner page-inner--3xl mx-auto px-4 md:px-6">
      {eyebrow ? <p className="page-eyebrow">{eyebrow}</p> : null}
      <h1 className="page-title">{title}</h1>
      {intro ? <p className="page-intro">{intro}</p> : null}
      <div className="mt-10 md:mt-12">{children}</div>
      {cta ? (
        <p className="mt-12">
          <AurosButton href={cta.href}>{cta.label}</AurosButton>
        </p>
      ) : null}
    </article>
  );
}

type FaqProps = {
  items: { question: string; answer: string }[];
};

export function ContentFaqList({ items }: FaqProps) {
  return (
    <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="interactive-subtle cursor-pointer list-none px-0 py-4 font-display text-base font-medium text-white [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-start gap-3">
              <span
                className="mt-0.5 font-mono text-sm text-white/30 transition group-open:rotate-90"
                aria-hidden
              >
                +
              </span>
              {item.question}
            </span>
          </summary>
          <div className="pb-5 pl-7 text-sm leading-relaxed text-white/55">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
