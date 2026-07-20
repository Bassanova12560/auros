import Image from "next/image";
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
 * Signature AUROS mark — every exceptional sub-page should open with this.
 * Brand test: without nav, the first viewport still reads as AUROS.
 */
export function AurosBrandLockup({
  product,
  href = "/",
  className = "",
  size = "sm",
}: Props) {
  const mark = size === "md" ? "h-9 w-9" : "h-7 w-7";
  const word =
    size === "md"
      ? "text-sm tracking-[0.4em]"
      : "text-xs tracking-[0.35em]";

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 ${className}`}
      aria-label={product ? `AUROS ${product}` : "AUROS"}
    >
      <Image
        src="/auros-logo.svg"
        alt=""
        width={size === "md" ? 36 : 28}
        height={size === "md" ? 36 : 28}
        className={`${mark} rounded-sm ring-1 ring-white/10 transition group-hover:ring-white/25`}
        priority={size === "md"}
      />
      <span className="flex flex-col gap-0.5">
        <span
          className={`font-display font-semibold text-white ${word}`}
        >
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
