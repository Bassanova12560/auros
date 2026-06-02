import type { SupabaseClient } from "@supabase/supabase-js";

export async function upsertByExternalId(
  supabase: SupabaseClient,
  table: "green_market_assets" | "green_market_offers",
  externalId: string,
  row: Record<string, unknown>
): Promise<void> {
  const { data: existing, error: selectError } = await supabase
    .from(table)
    .select("id")
    .eq("external_id", externalId)
    .maybeSingle();

  if (selectError) {
    throw new Error(`${table} select ${externalId}: ${selectError.message}`);
  }

  if (existing?.id) {
    const { error } = await supabase.from(table).update(row).eq("external_id", externalId);
    if (error) throw new Error(`${table} update ${externalId}: ${error.message}`);
    return;
  }

  const { error } = await supabase.from(table).insert({ external_id: externalId, ...row });
  if (error) {
    if (error.code === "23505" || error.message.includes("duplicate key")) {
      const { error: updateError } = await supabase
        .from(table)
        .update(row)
        .eq("external_id", externalId);
      if (updateError) {
        throw new Error(`${table} update ${externalId}: ${updateError.message}`);
      }
      return;
    }
    throw new Error(`${table} insert ${externalId}: ${error.message}`);
  }
}
