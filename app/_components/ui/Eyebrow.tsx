type EyebrowProps = {
  children: React.ReactNode;
  className?: string;
};

export function Eyebrow({ children, className = "" }: EyebrowProps) {
  return (
    <span
      className={`inline-block font-mono text-[11px] tracking-wide text-accent-muted ${className}`}
    >
      {children}
    </span>
  );
}
