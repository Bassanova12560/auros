import { getSupabaseServerClient } from "@/lib/supabase/server";

import { deliverStarterKitForLead } from "./starter-kit-deliver-core";

export async function deliverStarterKit(
  leadId: string
): Promise<{ ok: true; token: string } | { ok: false; error: string }> {
  return deliverStarterKitForLead(getSupabaseServerClient(), leadId);
}

export { deliverStarterKitForLead } from "./starter-kit-deliver-core";
