export type DiplomaCheckoutPayload = {
  diplomaType: "individual" | "institution";
  contactEmail: string;
  certToken?: string;
  organizationName?: string;
  contactName?: string;
};

export type DiplomaCheckoutResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function startDiplomaCheckout(
  payload: DiplomaCheckoutPayload
): Promise<DiplomaCheckoutResult> {
  let res: Response;
  try {
    res = await fetch("/api/academy/diploma/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, error: "network" };
  }

  let data: { ok?: boolean; url?: string; error?: string };
  try {
    data = (await res.json()) as typeof data;
  } catch {
    return { ok: false, error: res.ok ? "invalid_response" : "server_error" };
  }

  if (data.ok && data.url) {
    return { ok: true, url: data.url };
  }

  return { ok: false, error: data.error ?? (res.ok ? "checkout_failed" : "server_error") };
}
