"use client";

import Image from "next/image";
import { useState } from "react";

type PlatformLogoProps = {
  name: string;
  logo?: string;
  size?: number;
};

export function PlatformLogo({ name, logo, size = 28 }: PlatformLogoProps) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const dim = { width: size, height: size };

  if (!logo || failed) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] font-mono text-[10px] font-medium text-white/60"
        style={dim}
        aria-hidden
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={logo}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-md border border-white/10 bg-white/[0.04] object-contain p-0.5"
      style={dim}
      onError={() => setFailed(true)}
    />
  );
}
