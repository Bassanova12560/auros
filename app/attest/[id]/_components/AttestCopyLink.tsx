"use client";

import { useState } from "react";

export function AttestCopyLink({ attestId }: { attestId: string }) {
  const [copied, setCopied] = useState(false);
  const path = `/verify?id=${encodeURIComponent(attestId)}`;

  return (
    <button
      type="button"
      onClick={() => {
        const url =
          typeof window !== "undefined"
            ? `${window.location.origin}${path}`
            : path;
        void navigator.clipboard?.writeText(url).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        });
      }}
      className="font-mono text-xs uppercase tracking-wider text-white/55 underline-offset-4 hover:text-white hover:underline"
    >
      {copied ? "Copied" : "Copy verify link"}
    </button>
  );
}
