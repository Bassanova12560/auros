import { AmbientShell } from "@/app/_components/ui/AmbientShell";
import { Footer } from "@/app/_components/Footer";

import { AcademyHeader } from "./_components/AcademyHeader";

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AmbientShell>
      <AcademyHeader />
      <main className="page-main text-white">{children}</main>
      <Footer />
    </AmbientShell>
  );
}
