/** Shown on ARL surfaces — lab ledger is live; chain settlement is not. */
export function DemoDisclaimer() {
  return (
    <p className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 font-mono text-[11px] leading-relaxed text-amber-200/80">
      Lab ledger is live on this site (mint akWh, wrap WATT 1:1, settle spot). Not mainnet, not a
      public sale — withdrawals and production settlement still require human approval (HITL).
    </p>
  );
}
