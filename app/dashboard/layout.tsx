import { AmbientShell } from "../_components/ui/AmbientShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AmbientShell>{children}</AmbientShell>;
}
