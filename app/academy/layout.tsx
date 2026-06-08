import { AmbientShell } from "@/app/_components/ui/AmbientShell";
import { Footer } from "@/app/_components/Footer";

import { AcademySiteHeader } from "./_components/AcademySiteHeader";

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AmbientShell>
      <AcademySiteHeader />
      <main className="page-main page-main--nav text-white">{children}</main>
      <Footer />
    </AmbientShell>
  );
}
