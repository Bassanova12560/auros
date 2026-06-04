import "leaflet/dist/leaflet.css";

import { Footer } from "@/app/_components/Footer";

import { GreenHeader } from "./_components/GreenHeader";

export default function GreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="green-zone min-h-screen bg-green-page font-sans font-light text-white">
      <GreenHeader />
      <main className="page-main">{children}</main>
      <Footer />
    </div>
  );
}
