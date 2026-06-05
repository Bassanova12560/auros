import "leaflet/dist/leaflet.css";

import { Footer } from "@/app/_components/Footer";

/** Site header: GreenSiteHeader → AurosHeader (not inline in page.tsx). */
import { GreenSiteHeader } from "./_components/GreenSiteHeader";

export default function GreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="green-zone min-h-screen bg-green-page font-sans font-light text-white">
      <GreenSiteHeader />
      <main className="page-main">{children}</main>
      <Footer />
    </div>
  );
}
