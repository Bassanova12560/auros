import { AmbientShell } from "@/app/_components/ui/AmbientShell";
import { Footer } from "@/app/_components/Footer";

import { GreenAssistantFab } from "./_components/GreenAssistantFab";
import { GreenSiteHeader } from "./_components/GreenSiteHeader";

import "leaflet/dist/leaflet.css";

export default function GreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AmbientShell>
      <div className="green-zone min-h-dvh font-sans font-light text-white">
        <GreenSiteHeader />
        <main className="page-main">{children}</main>
        <GreenAssistantFab />
        <Footer />
      </div>
    </AmbientShell>
  );
}
