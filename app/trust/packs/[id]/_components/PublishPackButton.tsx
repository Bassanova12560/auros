"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { publishTrustPackAction } from "@/lib/trust-packs/actions";
import { TRUST_PACKS_ROUTE } from "@/lib/trust-packs/taxonomy";

export function PublishPackButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  return (
    <div>
      <PrimaryButton
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setErr(null);
            const res = await publishTrustPackAction(id);
            if (!res.ok) {
              setErr(res.error);
              return;
            }
            router.push(`${TRUST_PACKS_ROUTE}/report/${res.slug}`);
          })
        }
      >
        {pending ? "Publication…" : "Publier le rapport"}
      </PrimaryButton>
      {err ? <p className="mt-2 text-sm text-red-400">{err}</p> : null}
    </div>
  );
}
