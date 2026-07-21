"use client";

type Props = {
  assetDnaId: string;
  label?: string;
};

/** Compact Asset DNA link + monospace id. */
export function AssetDnaBadge({ assetDnaId, label = "Asset DNA" }: Props) {
  const href = `/api/v1/asset-dna/${encodeURIComponent(assetDnaId)}`;
  return (
    <div className="mt-4 border border-emerald-500/25 bg-emerald-500/[0.04] px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-500/90">
        {label}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 block break-all font-mono text-[11px] leading-relaxed text-emerald-300/90 hover:text-emerald-200"
      >
        {assetDnaId}
      </a>
      <a
        href={`/api/v1/asset-dna/${encodeURIComponent(assetDnaId)}/stream`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block font-mono text-[10px] uppercase tracking-wider text-white/40 hover:text-white/65"
      >
        Proof Stream →
      </a>
    </div>
  );
}
