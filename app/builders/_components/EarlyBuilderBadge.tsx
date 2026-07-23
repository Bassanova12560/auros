"use client";

import { useEffect, useMemo, useState } from "react";

type Claim = {
  handle: string;
  email?: string;
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

function looksLikeEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Lab Early Resource Builder badge — realtime validation + clear success path.
 */
export function EarlyBuilderBadge() {
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [claim, setClaim] = useState<Claim | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setClaim(JSON.parse(raw) as Claim);
    } catch {
      /* ignore */
    }
  }, []);

  const preview = useMemo(() => (handle.trim().length >= 2 ? makeCode(handle.trim()) : null), [handle]);
  const emailLive =
    email.trim().length === 0 ? null : looksLikeEmail(email) ? "ok" : "Enter a valid email (name@domain.tld)";
  const walletLive =
    wallet.trim().length === 0
      ? null
      : looksLikeEth(wallet)
        ? "ok"
        : "Wallet must be 0x + 40 hex characters";

  function onClaim() {
    const h = handle.trim();
    if (!h || h.length < 2) {
      setError("Handle must be at least 2 characters");
      return;
    }
    const e = email.trim();
    if (e && !looksLikeEmail(e)) {
      setError("Email format invalid — use name@domain.tld");
      return;
    }
    const w = wallet.trim();
    if (w && !looksLikeEth(w)) {
      setError("Optional wallet must be a 0x… address (40 hex chars)");
      return;
    }
    setError(null);
    const next: Claim = {
      handle: h,
      email: e || undefined,
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
        <div className="mt-5 space-y-3 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-200/70">
            Claimed · next steps
          </p>
          <p className="font-display text-2xl tracking-wide text-white">{claim.code}</p>
          <p className="font-mono text-[11px] text-white/45">
            @{claim.handle}
            {claim.email ? ` · ${claim.email}` : null}
            {claim.wallet ? ` · ${claim.wallet.slice(0, 6)}…${claim.wallet.slice(-4)}` : null}
            {" · "}
            {new Date(claim.claimedAt).toLocaleDateString()}
          </p>
          <ol className="list-decimal space-y-1 pl-4 text-xs text-white/55">
            <li>Email your code to the waitlist (button below)</li>
            <li>
              Open{" "}
              <a href="/lab" className="underline hover:text-white">
                /lab
              </a>{" "}
              and mint into your lab wallet
            </li>
            <li>Read protocol notes on GitHub after access approval</li>
          </ol>
          <a
            href={`mailto:resources@getauros.com?subject=Early%20Builder%20${encodeURIComponent(claim.code)}&body=Handle%3A%20${encodeURIComponent(claim.handle)}%0AEmail%3A%20${encodeURIComponent(claim.email ?? "")}%0ACode%3A%20${encodeURIComponent(claim.code)}%0AWallet%3A%20${encodeURIComponent(claim.wallet ?? "")}%0A`}
            className="inline-flex font-mono text-[11px] text-emerald-100/80 underline-offset-2 hover:text-white hover:underline"
          >
            Register code for waitlist →
          </a>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          <label className="block space-y-1">
            <span className="font-mono text-[10px] uppercase text-white/40">GitHub / handle</span>
            <input
              value={handle}
              onChange={(e) => {
                setHandle(e.target.value.slice(0, 64));
                setError(null);
              }}
              placeholder="your-handle"
              className="w-full border border-white/15 bg-black/40 px-3 py-2 font-mono text-sm text-white outline-none placeholder:text-white/25 focus:border-white/40"
            />
          </label>
          <label className="block space-y-1">
            <span className="font-mono text-[10px] uppercase text-white/40">Email (optional)</span>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.slice(0, 120));
                setError(null);
              }}
              placeholder="you@company.com"
              className="w-full border border-white/15 bg-black/40 px-3 py-2 font-mono text-sm text-white outline-none placeholder:text-white/25 focus:border-white/40"
            />
            {emailLive && emailLive !== "ok" ? (
              <p className="text-[11px] text-amber-200/80">{emailLive}</p>
            ) : null}
          </label>
          <label className="block space-y-1">
            <span className="font-mono text-[10px] uppercase text-white/40">
              Ethereum address (optional · testnet rewards)
            </span>
            <input
              value={wallet}
              onChange={(e) => {
                setWallet(e.target.value.slice(0, 42));
                setError(null);
              }}
              placeholder="0x…"
              className="w-full border border-white/15 bg-black/40 px-3 py-2 font-mono text-sm text-white outline-none placeholder:text-white/25 focus:border-white/40"
            />
            {walletLive && walletLive !== "ok" ? (
              <p className="text-[11px] text-amber-200/80">{walletLive}</p>
            ) : null}
          </label>
          {error ? <p className="text-xs text-rose-300/90">{error}</p> : null}
          <button
            type="button"
            onClick={onClaim}
            disabled={!preview || (emailLive != null && emailLive !== "ok") || (walletLive != null && walletLive !== "ok")}
            className="auros-btn auros-btn--ghost disabled:opacity-40"
          >
            Claim lab badge
          </button>
          {preview ? (
            <p className="font-mono text-[10px] text-white/30">Preview · {preview}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
