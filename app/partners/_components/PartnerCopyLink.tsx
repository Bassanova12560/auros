"use client";

import { useState } from "react";

type Props = {
  value: string;
  copyLabel: string;
  copiedLabel: string;
};

export function PartnerCopyLink({ value, copyLabel, copiedLabel }: Props) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <code className="flex-1 break-all rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-xs text-white/80">
        {value}
      </code>
      <button
        type="button"
        onClick={() => void onCopy()}
        className="shrink-0 rounded-lg border border-white/15 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-white/70 hover:border-white/30 hover:text-white"
      >
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}
