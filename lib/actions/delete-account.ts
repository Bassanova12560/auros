"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export type DeleteAccountResult =
  | { ok: true }
  | { ok: false; error: "unauthenticated" }
  | { ok: false; error: "database"; message: string }
  | { ok: false; error: "clerk"; message: string };

export async function deleteAccountAction(): Promise<DeleteAccountResult> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, error: "unauthenticated" };
  }

  const supabase = getSupabaseServerClient();
  const client = await clerkClient();

  let primaryEmail: string | null = null;
  try {
    const user = await client.users.getUser(userId);
    const primaryId = user.primaryEmailAddressId;
    primaryEmail =
      user.emailAddresses.find((e) => e.id === primaryId)?.emailAddress ??
      user.emailAddresses[0]?.emailAddress ??
      null;
  } catch (err) {
    console.error("[deleteAccountAction] clerk lookup", err);
  }

  if (primaryEmail) {
    const tables = ["leads", "concierge_requests", "partner_requests"] as const;
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("email", primaryEmail);
      if (error) {
        console.error(`[deleteAccountAction] ${table}`, error);
      }
    }
  }

  const { error: dbError } = await supabase
    .from("dossiers")
    .delete()
    .eq("user_id", userId);

  if (dbError) {
    console.error("[deleteAccountAction] dossiers", dbError);
    return {
      ok: false,
      error: "database",
      message: dbError.message,
    };
  }

  try {
    await client.users.deleteUser(userId);
  } catch (err) {
    console.error("[deleteAccountAction] clerk", err);
    return {
      ok: false,
      error: "clerk",
      message: err instanceof Error ? err.message : "Account deletion failed",
    };
  }

  return { ok: true };
}
