"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useJurisdictionPage } from "./useJurisdictionPage";

export function JurisdictionPaymentBanner() {
  const searchParams = useSearchParams();
  const { messages } = useJurisdictionPage();
  const f = messages.forms;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("paid") === "1") {
      setVisible(true);
    }
  }, [searchParams]);

  if (!visible) return null;

  return (
    <div
      className="mb-8 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-100"
      role="status"
    >
      <p className="font-medium">{f.paymentSuccessTitle}</p>
      <p className="mt-1 text-emerald-100/75">{f.paymentSuccessBody}</p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="mt-3 text-xs text-emerald-200/60 underline-offset-2 hover:underline"
      >
        {f.dismiss}
      </button>
    </div>
  );
}
