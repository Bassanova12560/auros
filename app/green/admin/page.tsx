import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GreenAdminView } from "../_components/GreenAdminView";

export const metadata: Metadata = {
  title: "Green admin | AUROS",
  robots: { index: false, follow: false },
};

export default function GreenAdminPage() {
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_GREEN_ADMIN_UI !== "1") {
    notFound();
  }
  return <GreenAdminView />;
}
