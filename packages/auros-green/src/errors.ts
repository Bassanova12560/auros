import type { GreenApiErrorBody } from "./types";

export class AurosGreenError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "AurosGreenError";
    this.code = code;
    this.status = status;
  }

  static fromResponse(status: number, body: GreenApiErrorBody): AurosGreenError {
    const code = body.error?.code ?? "unknown_error";
    const message = body.error?.message ?? "Request failed";
    return new AurosGreenError(code, message, status);
  }
}
