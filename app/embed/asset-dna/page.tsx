"use client";

import { use, useEffect, useState } from "react";

type ResolvePayload = {
  ok?: boolean;
  resolved?: boolean;
  risk?: string;
  dna?: {
    id: string;
    displayName: string;
    assetClass: string;
    jurisdiction?: { country?: string };
  };
  trust?: { overall: number; band: string; summary: string };
};

export default function EmbedAssetDnaPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; q?: string; theme?: string }>;
}) {
  const sp = use(searchParams);
  const q = (sp.id?.trim() || sp.q?.trim() || "").trim();
  const theme = sp.theme === "light" ? "light" : "dark";
  const [data, setData] = useState<ResolvePayload | null>(null);
  const [loading, setLoading] = useState(Boolean(q));

  useEffect(() => {
    if (!q) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/v1/toll/resolve?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((json: ResolvePayload) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [q]);

  const bg = theme === "light" ? "#f4f7f5" : "#0a1210";
  const fg = theme === "light" ? "#0a1210" : "#e8f0ec";
  const muted = theme === "light" ? "#5a6b63" : "#8aa396";

  return (
    <main
      style={{
        margin: 0,
        minHeight: "100%",
        background: bg,
        color: fg,
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        padding: 16,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: muted,
        }}
      >
        AUROS Resolve
      </p>
      {loading ? (
        <p style={{ marginTop: 12, fontSize: 13, color: muted }}>Loading…</p>
      ) : !q ? (
        <p style={{ marginTop: 12, fontSize: 13, color: muted }}>
          Pass ?id= or ?q= Asset DNA
        </p>
      ) : data?.resolved && data.dna ? (
        <div style={{ marginTop: 12 }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
            {data.dna.displayName}
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: muted }}>
            {data.dna.assetClass} · {data.dna.jurisdiction?.country || "—"}
          </p>
          {data.trust ? (
            <p style={{ margin: "10px 0 0", fontSize: 13 }}>
              Trust {data.trust.overall}/100 ({data.trust.band})
            </p>
          ) : null}
          <p
            style={{
              margin: "10px 0 0",
              fontSize: 11,
              wordBreak: "break-all",
              color: muted,
            }}
          >
            {data.dna.id}
          </p>
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
            Unknown asset risk
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: muted }}>
            Not AUROS-resolved — elevated / incomplete.
          </p>
        </div>
      )}
      <a
        href="https://getauros.com"
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-block",
          marginTop: 16,
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: muted,
          textDecoration: "none",
        }}
      >
        Powered by AUROS
      </a>
    </main>
  );
}
