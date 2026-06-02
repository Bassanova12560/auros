"use client";



import Link from "next/link";

import { useEffect, useState } from "react";



import { BezelCard } from "@/app/_components/ui/BezelCard";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";

import { ACADEMY_REGISTRY_ROUTE, ACADEMY_ROUTE } from "@/lib/academy";

import { getAcademyMessages } from "@/lib/academy/i18n";



type PurchaseInfo = {

  id: string;

  productType: "individual" | "institution";

  organizationName: string | null;

  priceLabel: string;

};



export function DiplomaSuccessView({ sessionId }: { sessionId: string }) {

  const { locale } = useLocale();

  const m = getAcademyMessages(locale);

  const d = m.diplomaSuccess;



  const [purchase, setPurchase] = useState<PurchaseInfo | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [polling, setPolling] = useState(false);



  useEffect(() => {

    let cancelled = false;

    let attempts = 0;



    async function load() {

      try {

        const res = await fetch(

          `/api/academy/diploma/status?session_id=${encodeURIComponent(sessionId)}`

        );

        const data = (await res.json()) as {

          ok?: boolean;

          purchase?: PurchaseInfo;

          error?: string;

        };

        if (cancelled) return;

        if (data.ok && data.purchase) {

          setPurchase(data.purchase);

          setError(null);

          setPolling(false);

          return;

        }

        if (data.error === "payment_pending" && attempts < 8) {

          setPolling(true);

          setError(d.paymentPending);

          attempts += 1;

          window.setTimeout(() => void load(), 2000);

          return;

        }

        setPolling(false);

        setError(data.error === "payment_pending" ? d.paymentPending : d.confirmFailed);

      } catch {

        if (!cancelled) {

          setPolling(false);

          setError(m.errors.network);

        }

      }

    }



    void load();

    return () => {

      cancelled = true;

    };

  }, [sessionId, d.paymentPending, d.confirmFailed, m.errors.network]);



  const downloadHref = purchase ? `/api/academy/diploma/${purchase.id}/pdf` : null;



  return (

    <BezelCard innerClassName="p-6 md:p-10" animate>

      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">

        {d.eyebrow}

      </p>

      <h1 className="mt-4 font-display text-3xl font-semibold text-white">

        {purchase ? d.titleReady : polling ? d.titlePending : d.titlePending}

      </h1>

      {purchase && (

        <p className="mt-4 text-sm text-white/55">

          {purchase.productType === "institution"

            ? d.bodyInstitution(purchase.organizationName ?? "", purchase.priceLabel)

            : d.bodyIndividual(purchase.priceLabel)}

        </p>

      )}

      {purchase?.productType === "individual" && (

        <p className="mt-3 text-xs leading-relaxed text-white/40">{d.verifyNote}</p>

      )}

      {error && (

        <p className="mt-4 text-sm text-white/70" role="alert">

          {error}

        </p>

      )}

      {downloadHref && (

        <div className="mt-8">

          <PrimaryButton href={downloadHref}>{d.downloadPdf}</PrimaryButton>

        </div>

      )}

      {purchase?.productType === "institution" && (

        <p className="mt-6">

          <Link href={ACADEMY_REGISTRY_ROUTE} className="text-sm text-white/55 hover:text-white/80">

            {d.registryLink}

          </Link>

        </p>

      )}

      <Link href={ACADEMY_ROUTE} className="mt-8 inline-block text-sm text-white/50 hover:text-white">

        {d.backLink}

      </Link>

    </BezelCard>

  );

}



export function DiplomaSuccessMissing() {

  const { locale } = useLocale();

  const d = getAcademyMessages(locale).diplomaSuccess;

  return <p className="text-sm text-white/55">{d.missingSession}</p>;

}

