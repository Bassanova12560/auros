import type { ReactNode } from "react";

type BezelCardProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  animate?: boolean;
};

export function BezelCard({
  children,
  className = "",
  innerClassName = "",
  animate = false,
}: BezelCardProps) {
  const fadeCls = animate ? "green-hub-fade-in" : "";

  return (
    <div className={`${fadeCls} ${className}`.trim()}>
      <div className="bezel-outer h-full min-w-0">
        <div className={`bezel-inner ${innerClassName}`}>{children}</div>
      </div>
    </div>
  );
}
