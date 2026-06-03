"use client";

import { useCallback, useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getGreenMessages } from "@/lib/green";
import {
  parseRegistryPdfContentHash,
  parseRegistryPdfSignature,
  verifyRegistryExportClient,
} from "@/lib/green/registry-export-verify-client";

import { GreenPanel, GreenSectionTitle } from "./green-ui";

type Props = {
  initialHash?: string;
  initialSig?: string;
};

type VerifyUiState = "idle" | "checking" | "valid" | "invalid" | "no_key" | "error";

export function GreenRegistryExportVerifyPanel({ initialHash = "", initialSig = "" }: Props) {
  const { locale } = useLocale();
  const r = getGreenMessages(locale).registry;
  const v = r.exportVerify;

  const [hash, setHash] = useState(initialHash);
  const [sig, setSig] = useState(initialSig);
  const [state, setState] = useState<VerifyUiState>("idle");

  const handleVerify = useCallback(async () => {
    setState("checking");
    const result = await verifyRegistryExportClient(hash, sig);
    if (result.status === "valid") setState("valid");
    else if (result.status === "invalid") setState("invalid");
    else if (result.status === "no_signing_key") setState("no_key");
    else setState("error");
  }, [hash, sig]);

  const handlePasteFooter = useCallback((raw: string) => {
    const parsedHash = parseRegistryPdfContentHash(raw);
    const parsedSig = parseRegistryPdfSignature(raw);
    if (parsedHash) setHash(parsedHash);
    if (parsedSig) setSig(parsedSig);
    setState("idle");
  }, []);

  const resultMessage =
    state === "valid"
      ? v.resultValid
      : state === "invalid"
        ? v.resultInvalid
        : state === "no_key"
          ? v.resultNoKey
          : state === "error"
            ? v.resultError
            : null;

  return (
    <GreenPanel className="mt-10">
      <div className="p-6 md:p-8">
        <GreenSectionTitle>{v.title}</GreenSectionTitle>
        <p className="mt-3 text-sm leading-relaxed text-neutral-400">{v.intro}</p>
        <label className="mt-4 block">
          <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-500">
            {v.hashLabel}
          </span>
          <input
            type="text"
            value={hash}
            onChange={(e) => {
              setHash(e.target.value);
              setState("idle");
            }}
            placeholder={v.hashPlaceholder}
            spellCheck={false}
            className="mt-2 w-full rounded-lg border border-emerald-500/30 bg-black px-4 py-3 font-mono text-xs text-emerald-200 outline-none focus:border-emerald-400"
          />
        </label>
        <label className="mt-4 block">
          <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-500">
            {v.sigLabel}
          </span>
          <input
            type="text"
            value={sig}
            onChange={(e) => {
              setSig(e.target.value);
              setState("idle");
            }}
            placeholder={v.sigPlaceholder}
            spellCheck={false}
            className="mt-2 w-full rounded-lg border border-emerald-500/30 bg-black px-4 py-3 font-mono text-xs text-emerald-200 outline-none focus:border-emerald-400"
          />
        </label>
        <label className="mt-4 block">
          <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-500">
            {v.pasteLabel}
          </span>
          <textarea
            rows={2}
            placeholder={v.pastePlaceholder}
            onChange={(e) => handlePasteFooter(e.target.value)}
            className="mt-2 w-full rounded-lg border border-emerald-500/30 bg-black px-4 py-3 font-mono text-xs text-emerald-200 outline-none focus:border-emerald-400"
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void handleVerify()}
            disabled={state === "checking" || !hash.trim() || !sig.trim()}
            className="rounded-lg border border-emerald-500/40 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-emerald-500 transition hover:border-emerald-400 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state === "checking" ? v.checking : v.submit}
          </button>
        </div>
        {resultMessage ? (
          <p
            className={`mt-4 text-sm ${
              state === "valid"
                ? "text-emerald-400"
                : state === "no_key"
                  ? "text-amber-400/90"
                  : "text-neutral-400"
            }`}
          >
            {resultMessage}
          </p>
        ) : null}
        <p className="mt-4 text-xs leading-relaxed text-neutral-600">{v.hint}</p>
      </div>
    </GreenPanel>
  );
}
