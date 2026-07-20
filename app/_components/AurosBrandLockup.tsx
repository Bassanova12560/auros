import Link from "next/link";

type Props = {
  /** Product line under AUROS — e.g. "Shield", "Green", "Protocol" */
  product?: string;
  href?: string;
  className?: string;
  /** Larger lockup for page heroes */
  size?: "sm" | "md";
};

/**
 * Signature AUROS wordmark — typography first, mark secondary.
 */
export function AurosBrandLockup({
  product,
  href = "/",
  className = "",
  size = "sm",
}: Props) {
  const word =
    size === "md"
      ? "text-base tracking-[0.28em] md:text-lg"
      : "text-sm tracking-[0.28em]";

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label={product ? `AUROS ${product}` : "AUROS"}
    >
      <AurosMark className={size === "md" ? "h-6 w-6" : "h-5 w-5"} />
      <span className="flex flex-col gap-0.5">
        <span className={`font-display font-semibold text-white ${word}`}>
          AUROS
        </span>
        {product ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            {product}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

/** Inline mark — currentColor stroke, green corner. No black tile. */
export function AurosMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 text-white/90 ${className}`}
      aria-hidden
    >
      <path d="M5.5 5.5h21v21h-21v-21Z" stroke="currentColor" strokeWidth="1.5" />
      <rect
        x="19.5"
        y="5.5"
        width="7"
        height="7"
        fill="var(--auros-green-warm, #0F5A47)"
      />
    </svg>
  );
}
