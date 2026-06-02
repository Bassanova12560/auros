import { AmbientShell } from "../_components/ui/AmbientShell";

export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AmbientShell>{children}</AmbientShell>;
}
