import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { getProtocolStatus } from "@/lib/protocol/status";
import { metadataFromPath } from "@/lib/seo/metadata";

import { StatusDashboard } from "./_components/StatusDashboard";

export const STATUS_ROUTE = "/status";

export const metadata = metadataFromPath(STATUS_ROUTE);

export default async function StatusPage() {
  const initial = await getProtocolStatus();

  return (
    <FocusPageShell path={STATUS_ROUTE} width="2xl">
      <StatusDashboard initial={initial} />
    </FocusPageShell>
  );
}
