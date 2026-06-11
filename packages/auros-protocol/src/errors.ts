import type { ProtocolErrorBody } from "./types";

export class AurosProtocolError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "AurosProtocolError";
    this.code = code;
    this.status = status;
  }

  static fromResponse(status: number, body: ProtocolErrorBody): AurosProtocolError {
    const code = body.error?.code ?? "unknown_error";
    const message = body.error?.message ?? "Request failed";
    return new AurosProtocolError(code, message, status);
  }
}
