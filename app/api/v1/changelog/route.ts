import { getProtocolChangelogPayload, protocolJson, protocolRoute } from "@/lib/protocol";

export const GET = protocolRoute(async () => {
  const payload = getProtocolChangelogPayload();
  return protocolJson(payload);
});
