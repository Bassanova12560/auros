"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  MAX_LEVERAGE,
  SPOT_MARKETS,
  tradeEngine,
  type MarketId,
  type OptionKind,
  type PerpSide,
  type SpotSide,
} from "@/lib/arl/trade-engine";
import {
  ARL_LEDGER_EVENT,
  fetchArlAccount,
  getOrCreateArlAccountId,
  postArlSpot,
  type ArlClientSnapshot,
} from "@/lib/arl/client";
import { ArlLabWallet } from "@/app/_components/arl/ArlLabWallet";

type Tab = "spot" | "perps" | "options";

type LogLine = { id: string; text: string; ok: boolean };

function fmt(n: number, digits = 4): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}

/**
 * Hardened trading terminal — spot settles on shared ARL lab ledger;
 * perps/options remain session-local with caps.
 */
export function TradeTerminal() {
  const [tab, setTab] = useState<Tab>("spot");
  const [marketId, setMarketId] = useState<MarketId>("kwh-france");
  const [perpSide, setPerpSide] = useState<PerpSide>("long");
  const [spotSide, setSpotSide] = useState<SpotSide>("buy");
  const [margin, setMargin] = useState("1000");
  const [leverage, setLeverage] = useState("5");
  const [spotAmount, setSpotAmount] = useState("100");
  const [optKind, setOptKind] = useState<OptionKind>("call");
  const [strike, setStrike] = useState("0.12");
  const [premium, setPremium] = useState("50");
  const [optSize, setOptSize] = useState("1000");
  const [optMargin, setOptMargin] = useState("500");
  const [days, setDays] = useState("7");
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<LogLine[]>([]);
  const [tick, setTick] = useState(0);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [snap, setSnap] = useState<ArlClientSnapshot | null>(null);
  const [spotBusy, setSpotBusy] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const market = useMemo(() => tradeEngine.getMarket(marketId), [marketId, tick]);
  const position = useMemo(() => tradeEngine.getPosition(marketId), [marketId, tick]);
  const options = useMemo(() => tradeEngine.listOptions(), [tick]);
  const chartBars = useMemo(() => tradeEngine.sparkline(marketId), [marketId, tick]);
  const maxBar = Math.max(...chartBars, 1e-9);

  const refreshBalances = useCallback(async (id: string) => {
    const next = await fetchArlAccount(id);
    setSnap(next);
  }, []);

  useEffect(() => {
    const id = getOrCreateArlAccountId();
    setAccountId(id);
    refreshBalances(id).catch((e) =>
      setError(e instanceof Error ? e.message : "Balance load failed"),
    );
    const onUpdate = () => void refreshBalances(id).catch(() => undefined);
    window.addEventListener(ARL_LEDGER_EVENT, onUpdate);

    const marketParam = new URLSearchParams(window.location.search).get("market");
    if (marketParam && SPOT_MARKETS.some((m) => m.id === marketParam)) {
      setMarketId(marketParam as MarketId);
      setTab("spot");
    }

    return () => window.removeEventListener(ARL_LEDGER_EVENT, onUpdate);
  }, [refreshBalances]);

  useEffect(() => {
    setError(null);
  }, [tab, marketId]);

  useEffect(() => {
    if (!showAdvanced && tab !== "spot") setTab("spot");
  }, [showAdvanced, tab]);

  function pushLog(text: string, ok = true) {
    setLog((prev) => [{ id: `${Date.now()}-${Math.random()}`, text, ok }, ...prev].slice(0, 12));
    setTick((t) => t + 1);
  }

  function run(action: () => string) {
    try {
      setError(null);
      pushLog(action(), true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Order rejected";
      setError(msg);
      pushLog(`[reject] ${msg}`, false);
    }
  }

  function onOpenPerp() {
    run(() => {
      const m = Number(margin);
      const lev = Number(leverage);
      const res = tradeEngine.openPerp({
        marketId,
        side: perpSide,
        margin: m,
        leverage: lev,
      });
      return `[perps] open ${perpSide} margin=${m} lev=${lev}x size=${res.position.size} fee=${fmt(res.fee, 2)} @ ${fmt(res.markPrice)}`;
    });
  }

  function onClosePerp() {
    run(() => {
      const res = tradeEngine.closePerp(marketId);
      return `[perps] close pnl=${fmt(res.pnl, 2)} fee=${fmt(res.fee, 2)} payout=${fmt(res.payout, 2)}`;
    });
  }

  async function onSpot() {
    if (!accountId) return;
    setSpotBusy(true);
    setError(null);
    try {
      const amount = Number(spotAmount);
      const res = await postArlSpot({
        accountId,
        marketId,
        side: spotSide,
        amount,
        markOverride: market.markPrice,
      });
      setSnap(res);
      const fillPrice = res.fill?.executionPrice ?? market.markPrice;
      const fillFee = res.fill?.fee ?? 0;
      pushLog(
        `[spot·ledger] ${spotSide} ${amount} @ ${fmt(fillPrice)} fee=${fmt(fillFee, 4)} EUR`,
        true,
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Spot rejected";
      setError(msg);
      pushLog(`[reject] ${msg}`, false);
    } finally {
      setSpotBusy(false);
    }
  }

  function onWriteOption() {
    run(() => {
      const expiry = Math.floor(Date.now() / 1000) + Number(days) * 86400;
      const res = tradeEngine.writeOption({
        kind: optKind,
        strike: Number(strike),
        expiry,
        premium: Number(premium),
        margin: Number(optMargin),
        size: Number(optSize),
        seller: "demo-seller",
      });
      return `[options] wrote ${res.id} ${optKind} strike=${strike} premium=${premium}`;
    });
  }

  function onBuyOption(id: string) {
    run(() => {
      const res = tradeEngine.buyOption(id, "demo-buyer");
      return `[options] bought ${id} fee=${fmt(res.fee, 2)}`;
    });
  }

  function nudgeMark(pct: number) {
    run(() => {
      const next = market.markPrice * (1 + pct);
      const p = tradeEngine.setMarkPrice(marketId, next);
      return `[mark] ${market.symbol} → ${fmt(p)} (${pct > 0 ? "+" : ""}${(pct * 100).toFixed(1)}%)`;
    });
  }

  const needsInventory =
    snap != null &&
    snap.account.balances.akWh <= 0 &&
    snap.account.balances.WATT <= 0 &&
    snap.account.balances.H2O <= 0 &&
    snap.account.balances.FLOP <= 0;

  return (
    <div className="space-y-8">
      <ArlLabWallet step="sell" />

      {needsInventory ? (
        <div className="rounded-lg border border-amber-500/25 bg-amber-500/[0.07] px-4 py-3 font-mono text-[11px] leading-relaxed text-amber-100/85">
          Lab wallet has no resource inventory yet.{" "}
          <Link href="/lab" className="underline underline-offset-2 hover:text-white">
            Mint on /lab first
          </Link>
          {" · "}
          <Link href="/producer" className="underline underline-offset-2 hover:text-white">
            or wrap on /producer
          </Link>
          . You still have seeded EUR for buys.
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wide">
          <button
            type="button"
            onClick={() => setTab("spot")}
            className={`rounded border px-3 py-1.5 ${
              tab === "spot"
                ? "border-white/40 bg-white/10 text-white"
                : "border-white/10 text-white/45 hover:border-white/25"
            }`}
          >
            spot
          </button>
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="rounded border border-white/10 px-3 py-1.5 text-white/40 hover:border-white/25 hover:text-white/70"
          >
            {showAdvanced ? "Hide advanced" : "Advanced (session-local)"}
          </button>
          {showAdvanced ? (
            <>
              {(["perps", "options"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`rounded border px-3 py-1.5 ${
                    tab === t
                      ? "border-white/40 bg-white/10 text-white"
                      : "border-white/10 text-white/45 hover:border-white/25"
                  }`}
                >
                  {t}
                </button>
              ))}
            </>
          ) : null}
        </div>
        <label className="flex items-center gap-2 font-mono text-[11px] text-white/45">
          Market
          <select
            value={marketId}
            onChange={(e) => setMarketId(e.target.value as MarketId)}
            className="rounded border border-white/15 bg-black/40 px-2 py-1.5 text-white"
          >
            {SPOT_MARKETS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.symbol}
              </option>
            ))}
          </select>
        </label>
      </div>

      {showAdvanced && tab !== "spot" ? (
        <p className="font-mono text-[10px] text-amber-200/70">
          Advanced · session-local only — does not move lab wallet balances. Spot does.
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-4 font-mono text-[11px]">
        <div className="border border-white/[0.08] px-3 py-2">
          <p className="text-white/35">Mark</p>
          <p className="mt-1 text-white tabular-nums">{fmt(market.markPrice)}</p>
        </div>
        <div className="border border-white/[0.08] px-3 py-2">
          <p className="text-white/35">Long OI</p>
          <p className="mt-1 text-white tabular-nums">{fmt(market.longOi, 0)}</p>
        </div>
        <div className="border border-white/[0.08] px-3 py-2">
          <p className="text-white/35">Short OI</p>
          <p className="mt-1 text-white tabular-nums">{fmt(market.shortOi, 0)}</p>
        </div>
        <div className="border border-white/[0.08] px-3 py-2">
          <p className="text-white/35">LP / fees</p>
          <p className="mt-1 text-white tabular-nums">
            {fmt(market.lpLiquidity, 0)} · {fmt(market.protocolFees, 2)}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] text-white/40">Index · mock sparkline</p>
            <div className="flex gap-2 font-mono text-[10px]">
              <button
                type="button"
                onClick={() => nudgeMark(-0.05)}
                className="border border-white/15 px-2 py-1 text-white/50 hover:text-white"
              >
                −5%
              </button>
              <button
                type="button"
                onClick={() => nudgeMark(0.05)}
                className="border border-white/15 px-2 py-1 text-white/50 hover:text-white"
              >
                +5%
              </button>
            </div>
          </div>
          <div className="flex h-40 items-end gap-1 border border-white/10 bg-white/[0.02] px-3 py-3">
            {chartBars.map((v, i) => (
              <div
                key={`${marketId}-${i}`}
                className="flex-1 rounded-sm bg-white/35"
                style={{ height: `${(v / maxBar) * 100}%` }}
              />
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/60">
              <thead className="font-mono text-[10px] uppercase text-white/35">
                <tr>
                  <th className="py-2">Market</th>
                  <th>Last</th>
                  <th>24h</th>
                  <th>Vol</th>
                </tr>
              </thead>
              <tbody>
                {SPOT_MARKETS.map((r) => (
                  <tr
                    key={r.id}
                    className={`cursor-pointer border-t border-white/8 ${
                      r.id === marketId ? "bg-white/[0.04] text-white" : ""
                    }`}
                    onClick={() => setMarketId(r.id)}
                  >
                    <td className="py-2 font-mono text-white/80">{r.symbol}</td>
                    <td className="tabular-nums">{fmt(r.id === marketId ? market.markPrice : r.last)}</td>
                    <td>
                      {r.changeBps >= 0 ? "+" : ""}
                      {(r.changeBps / 10).toFixed(1)}%
                    </td>
                    <td>{r.volLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4 border border-white/10 bg-white/[0.03] p-4">
          <p className="font-display text-base text-white">Order ticket · demo engine</p>

          {tab === "perps" ? (
            <>
              <div className="flex gap-2">
                {(["long", "short"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPerpSide(s)}
                    className={`flex-1 rounded border py-2 text-sm capitalize ${
                      perpSide === s
                        ? "border-white/40 bg-white/10 text-white"
                        : "border-white/10 text-white/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <label className="block text-xs text-white/45">
                Margin (quote)
                <input
                  value={margin}
                  onChange={(e) => setMargin(e.target.value)}
                  inputMode="decimal"
                  className="mt-1 w-full rounded border border-white/15 bg-black/30 px-3 py-2 text-sm text-white"
                />
              </label>
              <label className="block text-xs text-white/45">
                Leverage (1–{MAX_LEVERAGE}, integer)
                <input
                  value={leverage}
                  onChange={(e) => setLeverage(e.target.value)}
                  inputMode="numeric"
                  className="mt-1 w-full rounded border border-white/15 bg-black/30 px-3 py-2 text-sm text-white"
                />
              </label>
              {position ? (
                <div className="rounded border border-white/10 bg-black/30 px-3 py-2 font-mono text-[11px] text-white/60">
                  <p>
                    Open {position.side} · size {fmt(position.size, 2)} · entry{" "}
                    {fmt(position.entryPrice)}
                  </p>
                  <p className="mt-1">
                    uPnL {fmt(position.upnl, 2)} · equity {fmt(position.equity, 2)}
                  </p>
                  <button
                    type="button"
                    onClick={onClosePerp}
                    className="mt-3 w-full rounded border border-white/25 py-2 text-white hover:bg-white/10"
                  >
                    Close position
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenPerp}
                  className="w-full rounded border border-white/25 bg-white/10 py-2.5 text-sm text-white hover:bg-white/15"
                >
                  Open {perpSide}
                </button>
              )}
            </>
          ) : null}

          {tab === "spot" ? (
            <>
              <div className="flex gap-2">
                {(["buy", "sell"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpotSide(s)}
                    className={`flex-1 rounded border py-2 text-sm capitalize ${
                      spotSide === s
                        ? "border-white/40 bg-white/10 text-white"
                        : "border-white/10 text-white/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <label className="block text-xs text-white/45">
                Amount (resource units)
                <input
                  value={spotAmount}
                  onChange={(e) => setSpotAmount(e.target.value)}
                  inputMode="decimal"
                  className="mt-1 w-full rounded border border-white/15 bg-black/30 px-3 py-2 text-sm text-white"
                />
              </label>
              <button
                type="button"
                onClick={() => void onSpot()}
                disabled={spotBusy}
                className="w-full rounded border border-white/25 bg-white/10 py-2.5 text-sm text-white hover:bg-white/15 disabled:opacity-40"
              >
                {spotBusy ? "Settling…" : `Settle ${spotSide} on ledger`}
              </button>
              <p className="font-mono text-[10px] text-white/35">
                Spot credits/debits your shared lab balances (EUR ↔ resource).
              </p>
            </>
          ) : null}

          {tab === "options" ? (
            <>
              <div className="flex gap-2">
                {(["call", "put"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setOptKind(k)}
                    className={`flex-1 rounded border py-2 text-sm uppercase ${
                      optKind === k
                        ? "border-white/40 bg-white/10 text-white"
                        : "border-white/10 text-white/50"
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="block text-xs text-white/45">
                  Strike
                  <input
                    value={strike}
                    onChange={(e) => setStrike(e.target.value)}
                    className="mt-1 w-full rounded border border-white/15 bg-black/30 px-2 py-2 text-sm text-white"
                  />
                </label>
                <label className="block text-xs text-white/45">
                  Days to expiry
                  <input
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="mt-1 w-full rounded border border-white/15 bg-black/30 px-2 py-2 text-sm text-white"
                  />
                </label>
                <label className="block text-xs text-white/45">
                  Premium
                  <input
                    value={premium}
                    onChange={(e) => setPremium(e.target.value)}
                    className="mt-1 w-full rounded border border-white/15 bg-black/30 px-2 py-2 text-sm text-white"
                  />
                </label>
                <label className="block text-xs text-white/45">
                  Size
                  <input
                    value={optSize}
                    onChange={(e) => setOptSize(e.target.value)}
                    className="mt-1 w-full rounded border border-white/15 bg-black/30 px-2 py-2 text-sm text-white"
                  />
                </label>
              </div>
              <label className="block text-xs text-white/45">
                Seller margin
                <input
                  value={optMargin}
                  onChange={(e) => setOptMargin(e.target.value)}
                  className="mt-1 w-full rounded border border-white/15 bg-black/30 px-3 py-2 text-sm text-white"
                />
              </label>
              <button
                type="button"
                onClick={onWriteOption}
                className="w-full rounded border border-white/25 bg-white/10 py-2.5 text-sm text-white hover:bg-white/15"
              >
                Write option
              </button>
              {options.length > 0 ? (
                <ul className="space-y-2 border-t border-white/10 pt-3">
                  {options.map((o) => (
                    <li
                      key={o.id}
                      className="flex items-center justify-between gap-2 font-mono text-[10px] text-white/50"
                    >
                      <span>
                        {o.id} {o.kind} K={fmt(o.strike)} P={fmt(o.premium, 2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onBuyOption(o.id)}
                        className="border border-white/20 px-2 py-1 text-white/70 hover:text-white"
                      >
                        Buy
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-mono text-[10px] text-white/35">No open listings yet.</p>
              )}
            </>
          ) : null}

          {error ? (
            <p className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-[11px] text-red-200/90">
              {error}
            </p>
          ) : null}

          <p className="font-mono text-[10px] text-white/35">
            Spot = shared ledger · Perps/options = session engine · lev≤{MAX_LEVERAGE} · HITL —{" "}
            <Link href="/builders" className="underline hover:text-white/60">
              builders
            </Link>
          </p>
          <ul className="max-h-40 space-y-1 overflow-y-auto font-mono text-[10px]">
            {log.map((l) => (
              <li key={l.id} className={l.ok ? "text-white/40" : "text-red-300/70"}>
                {l.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
