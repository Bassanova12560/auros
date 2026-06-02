import type { ReactNode } from "react";

import { GreenPanel } from "./green-ui";

type Props = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
};

export function GreenCard({ children, className = "", innerClassName = "" }: Props) {
  return (
    <GreenPanel className={className}>
      <div className={innerClassName}>{children}</div>
    </GreenPanel>
  );
}
