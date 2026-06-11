"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { getWizardUnlockBySessionAction } from "@/lib/actions/wizard-purchase";

const PRO_UNLOCK_KEY = "auros_wizard_pro_session";

export function WizardReadyClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "pending" | "failed">(
    "loading"
  );

  const poll = useCallback(async () => {
    if (!sessionId) return;
    const result = await getWizardUnlockBySessionAction(sessionId);
    if (!result.ok) {
      setStatus("failed");
      return;
    }
    if (result.unlocked) {
      sessionStorage.setItem(PRO_UNLOCK_KEY, sessionId);
      sessionStorage.setItem("auros_wizard_paid_tier", result.tier);
      router.replace(
        `/wizard?mode=pro&session_id=${encodeURIComponent(sessionId)}`
      );
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
    status === "pending"
      ? "Activation en cours…"
      : status === "failed"
        ? "Activation impossible"
        : "Préparation…";
  const subtitle =
    status === "pending"
      ? "Votre paiement est confirmé — le wizard Pro se débloque sous quelques secondes."
      : status === "failed"
        ? "Contactez-nous à hello@auros.app si le problème persiste."
        : "Vérification du paiement…";

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
