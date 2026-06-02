"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { deleteAccountAction } from "@/lib/actions/delete-account";
import { getDashboardMessages } from "@/lib/dashboard-i18n";

export function DeleteAccountSection() {
  const { locale } = useLocale();
  const am = getDashboardMessages(locale).account;
  const router = useRouter();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    setLoading(true);
    setError(null);
    const result = await deleteAccountAction();
    setLoading(false);

    if (!result.ok) {
      setError(
        result.error === "unauthenticated"
          ? am.errorUnauth
          : "message" in result
            ? result.message
            : am.errorGeneric
      );
      return;
    }

    setOpen(false);
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <section className="mt-16 border-t border-white/[0.06] pt-10 text-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 underline-offset-4 transition hover:text-white/70 hover:underline"
        >
          {am.deleteLink}
        </button>
      </section>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6 text-white">
            <h2
              id="delete-account-title"
              className="font-display text-xl font-semibold"
            >
              {am.modalTitle}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {am.modalBody}
            </p>
            {error ? (
              <p className="mt-3 text-sm text-red-400" role="alert">
                {error}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-full border border-white/20 px-5 py-2 text-sm text-white/80 transition hover:border-white/40"
              >
                {am.cancel}
              </button>
              <button
                type="button"
                onClick={() => void confirm()}
                disabled={loading}
                className="rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-60"
              >
                {loading ? am.deleting : am.confirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
