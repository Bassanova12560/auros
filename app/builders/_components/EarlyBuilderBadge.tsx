"use client";

import { useEffect, useMemo, useState } from "react";

type Claim = {
  handle: string;
  wallet?: string;
  claimedAt: string;
  code: string;
};

const STORAGE_KEY = "auros_early_builder_v1";

function makeCode(handle: string): string {
  const base = handle.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase() || "BUILDER";
  const n = Math.abs(
    Array.from(handle).reduce((acc, c) => acc + c.charCodeAt(0), 0) * 7919,
  );
  return `ERB-${base}-${(n % 9000) + 1000}`;
}

function looksLikeEth(addr: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(addr.trim());
}

/**
 * Lab “Early Resource Builder” badge — local claim + optional wallet for future testnet rewards.
 * Not an on-chain NFT yet.
 */
export function EarlyBuilderBadge() {
  const [handle, setHandle] = useState("");
  const [wallet, setWallet] = useState("");
  const [claim, setClaim] = useState<Claim | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setClaim(JSON.parse(raw) as Claim);
    } catch {
      /* ignore */
    }
  }, []);

  const preview = useMemo(() => (handle.trim() ? makeCode(handle.trim()) : null), [handle]);

  function onClaim() {
    const h = handle.trim();
    if (!h || h.length < 2) return;
    const w = wallet.trim();
    if (w && !looksLikeEth(w)) {
      setWalletError("Optional wallet must be a 0x… address (40 hex chars)");
      return;
    }
    setWalletError(null);
    const next: Claim = {
      handle: h,
      wallet: w || undefined,
      claimedAt: new Date().toISOString(),
      code: makeCode(h),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setClaim(next);
  }

  return (
    <div className="border border-white/[0.08] bg-white/[0.02] p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        Early Resource Builder · lab badge
      </p>
      <p className="mt-2 text-sm text-white/60">
        Claim a local builder code now. On-chain NFT mint is a later testnet step — this is not a
        Verified certificate and has no financial value.
      </p>

      {claim ? (
        <div className="mt-5 space-y-2">
          <p className="font-display text-2xl tracking-wide text-white">{claim.code}</p>
          <p className="font-mono text-[11px] text-white/40">
            @{claim.handle} · claimed {new Date(claim.claimedAt).toLocaleDateString()}
            {claim.wallet ? ` · ${claim.wallet.slice(0, 6)}…${claim.wallet.slice(-4)}` : null}
          </p>
          <a
            href={`mailto:resources@getauros.com?subject=Early%20Builder%20${encodeURIComponent(claim.code)}&body=Handle%3A%20${encodeURIComponent(claim.handle)}%0ACode%3A%20${encodeURIComponent(claim.code)}%0AWallet%3A%20${encodeURIComponent(claim.wallet ?? "")}%0A`}
            className="inline-flex font-mono text-[11px] text-white/55 underline-offset-2 hover:text-white hover:underline"
          >
            Register code for waitlist →
          </a>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex-1 space-y-1">
              <span className="font-mono text-[10px] uppercase text-white/40">GitHub / handle</span>
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value.slice(0, 64))}
                placeholder="your-handle"
                className="w-full border border-white/15 bg-black/40 px-3 py-2 font-mono text-sm text-white outline-none placeholder:text-white/25 focus:border-white/40"
              />
            </label>
            <button
              type="button"
              onClick={onClaim}
              disabled={!preview}
              className="auros-btn auros-btn--ghost disabled:opacity-40"
            >
              Claim lab badge
            </button>
          </div>
          <label className="block space-y-1">
            <span className="font-mono text-[10px] uppercase text-white/40">
              Ethereum address (optional · testnet rewards)
            </span>
            <input
              value={wallet}
              onChange={(e) => {
                setWallet(e.target.value.slice(0, 42));
                setWalletError(null);
              }}
              placeholder="0x…"
              className="w-full border border-white/15 bg-black/40 px-3 py-2 font-mono text-sm text-white outline-none placeholder:text-white/25 focus:border-white/40"
            />
          </label>
          {walletError ? <p className="text-xs text-rose-300/90">{walletError}</p> : null}
        </div>
      )}
      {preview && !claim ? (
        <p className="mt-2 font-mono text-[10px] text-white/30">Preview · {preview}</p>
      ) : null}
    </div>
  );
}
