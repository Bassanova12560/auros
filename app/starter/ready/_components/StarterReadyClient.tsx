"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { getStarterPortalBySessionAction } from "@/lib/actions/jurisdiction-starter";
import { getStarterKitUiMessages } from "@/lib/jurisdictions/starter-kit-i18n";

export function StarterReadyClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const ui = getStarterKitUiMessages("fr");

  const [status, setStatus] = useState<"loading" | "pending" | "failed">(
    "loading"
  );

  const poll = useCallback(async () => {
    if (!sessionId) return;
    const result = await getStarterPortalBySessionAction(sessionId);
    if (!result.ok) {
      setStatus("failed");
      return;
    }
    if (result.status === "ready") {
      router.replace(`/starter/${result.token}`);
      return;
    }
    if (result.status === "failed") {
      setStatus("failed");
      return;
    }
    setStatus("pending");
  }, [sessionId, router]);

  useEffect(() => {
    if (!sessionId) {
      setStatus("failed");
      return;
    }
    void poll();
    const id = setInterval(() => void poll(), 2500);
    return () => clearInterval(id);
  }, [sessionId, poll]);

  const title =
    status === "pending" ? ui.pendingTitle : status === "failed" ? ui.failedTitle : ui.readyTitle;
  const subtitle =
    status === "pending"
      ? ui.pendingSubtitle
      : status === "failed"
        ? ui.failedSubtitle
        : ui.readySubtitle;

  return (
    <main className="page-main page-main--center flex items-center justify-center">
      <div className="page-inner page-inner--lg w-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center sm:p-8">
        {status === "loading" || status === "pending" ? (
          <div
            className="mx-auto mb-6 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"
            aria-hidden
          />
        ) : null}
        <h1 className="font-display text-2xl text-white">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{subtitle}</p>
      </div>
    </main>
  );
}
