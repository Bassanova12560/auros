import type { Metadata } from "next";

import { GreenAdminView } from "../_components/GreenAdminView";

export const metadata: Metadata = {
  title: "Green admin | AUROS",
  robots: { index: false, follow: false },
};

export default function GreenAdminPage() {
  return <GreenAdminView />;
}
