import { Footer } from "@/app/_components/Footer";

import { GreenHeader } from "./_components/GreenHeader";

export default function GreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-void font-sans font-light text-white">
      <GreenHeader />
      <main className="page-main">{children}</main>
      <Footer />
    </div>
  );
}
