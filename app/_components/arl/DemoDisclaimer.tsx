/** Shown on mock ARL dashboards — no production claims. */
export function DemoDisclaimer() {
  return (
    <p className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 font-mono text-[11px] leading-relaxed text-amber-200/80">
      Demo UI with mock data. Withdrawals, trades, and hedges require human approval (HITL) and
      on-chain settlement — not executed from this preview.
    </p>
  );
}
