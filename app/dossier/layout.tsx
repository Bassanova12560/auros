import { AmbientShell } from "../_components/ui/AmbientShell";

export default function DossierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AmbientShell>{children}</AmbientShell>;
}
