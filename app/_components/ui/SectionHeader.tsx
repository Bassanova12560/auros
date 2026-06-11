import { StaticSectionHeader } from "@/app/_components/StaticSectionHeader";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
};

/** SSR-safe section header — delegates to StaticSectionHeader (no framer-motion). */
export function SectionHeader(props: SectionHeaderProps) {
  return <StaticSectionHeader {...props} />;
}
