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
 * Wordmark-only AUROS lockup — typography is the brand signal.
 */
export function AurosBrandLockup({
  product,
  href = "/",
  className = "",
  size = "sm",
}: Props) {
  const word =
    size === "md"
      ? "text-sm tracking-[0.4em] md:text-base"
      : "text-xs tracking-[0.35em]";

  return (
    <Link
      href={href}
      className={`group inline-flex items-center ${className}`}
      aria-label={product ? `AUROS ${product}` : "AUROS"}
    >
      <span className="flex flex-col gap-0.5">
        <span className={`font-display font-semibold text-white ${word}`}>
          AUROS
        </span>
        {product ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
            {product}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
