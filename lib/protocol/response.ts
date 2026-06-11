import { NextResponse } from "next/server";

import { PROTOCOL_DISCLAIMER, PROTOCOL_VERSION } from "./constants";

export function protocolJson<T extends Record<string, unknown>>(
  body: T,
  init?: { status?: number; headers?: Record<string, string> }
): NextResponse {
  return NextResponse.json(
    { disclaimer: PROTOCOL_DISCLAIMER, ...body },
    {
      status: init?.status ?? 200,
      headers: {
        "X-AUROS-Protocol-Version": PROTOCOL_VERSION,
        ...init?.headers,
      },
    }
  );
}

export function protocolError(
  code: string,
  message: string,
  status: number
): NextResponse {
  return protocolJson({ error: { code, message } }, { status });
}
