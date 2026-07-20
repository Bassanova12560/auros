"use client";

import { useEffect, useState } from "react";

import { VerifyConsole } from "@/app/verify/_components/VerifyConsole";

/**
 * Compact iframe badge — platforms embed:
 * <iframe src="https://getauros.com/embed/verify?id=shr_…" width="340" height="160" />
 */
export default function EmbedVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const [id, setId] = useState("");

  useEffect(() => {
    void searchParams.then((sp) => {
      if (sp.id) setId(sp.id.trim());
    });
  }, [searchParams]);

  return (
    <div className="rounded-xl border border-white/15 bg-[#0a0a0a] p-4 font-sans text-white shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
          AUROS verified
        </p>
        <a
          href={id ? `/verify?id=${encodeURIComponent(id)}` : "/verify"}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] text-white/35 hover:text-white/60"
        >
          getauros.com
        </a>
      </div>
      {id ? (
        <div className="mt-3">
          <VerifyConsole initialId={id} compact />
        </div>
      ) : (
        <p className="mt-3 text-xs text-white/45">
          Ajoutez <code className="text-white/60">?id=shr_…</code> ou{" "}
          <code className="text-white/60">att_…</code>
        </p>
      )}
    </div>
  );
}
