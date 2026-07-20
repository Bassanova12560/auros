import { redirect } from "next/navigation";

import { WATTS_HUB_ROUTE } from "@/lib/watts";

export default function ChargeflowWattsRedirect() {
  redirect(WATTS_HUB_ROUTE);
}
