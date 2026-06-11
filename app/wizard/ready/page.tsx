"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getWizardUnlockBySessionAction } from "@/lib/actions/wizard-purchase";

const PRO_UNLOCK_KEY = "auros_wizard_pro_session";

function WizardReadyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      return;
    }

    void getWizardUnlockBySessionAction(sessionId).then((r) => {
      if (r.ok && r.unlocked) {
        sessionStorage.setItem(PRO_UNLOCK_KEY, sessionId);
        router.replace(
          `/wizard?mode=pro&session_id=${encodeURIComponent(sessionId)}`
        );
        setStatus("ok");
        return;
      }
      setStatus("error");
    });
  }, [searchParams, router]);

  const copy =
    locale === "fr"
      ? {
          loading: "Validation du paiement…",
          ok: "Déblocage du wizard Pro…",
          error: "Paiement introuvable — contactez support@auros.app",
        }
      : {
          loading: "Validating payment…",
          ok: "Unlocking Pro wizard…",
          error: "Payment not found — contact support@auros.app",
        };

  return (
    <main className="page-main page-main--nav mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
        Wizard Pro
      </p>
      <p className="mt-6 text-sm text-white/60">
        {status === "loading" || status === "ok" ? copy.loading : copy.error}
      </p>
    </main>
  );
}

export default function WizardReadyPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-white/60">Chargement…</p>
        </main>
      }
    >
      <WizardReadyContent />
    </Suspense>
  );
}
