import { Eyebrow } from "./ui/Eyebrow";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
};

/** SSR-safe section header — no framer-motion opacity:0 on first paint. */
export function StaticSectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: Props) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <header className={`max-w-3xl ${alignCls}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
