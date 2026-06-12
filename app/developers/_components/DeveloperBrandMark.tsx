import Image from "next/image";
import Link from "next/link";

export function DeveloperBrandMark() {
  return (
    <Link
      href="/developers"
      className="interactive-subtle mb-6 inline-flex items-center gap-3"
      aria-label="AUROS Protocol — developer hub"
    >
      <Image
        src="/auros-logo.svg"
        alt=""
        width={32}
        height={32}
        className="h-8 w-8"
        priority
      />
      <span className="font-mono text-[11px] tracking-wide text-white/45">
        AUROS Protocol
      </span>
    </Link>
  );
}
