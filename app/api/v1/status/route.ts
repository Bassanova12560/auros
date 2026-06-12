import { getProtocolStatus, protocolJson, protocolRoute } from "@/lib/protocol";

export const GET = protocolRoute(async () => {
  const payload = await getProtocolStatus();
  return protocolJson(payload);
});
