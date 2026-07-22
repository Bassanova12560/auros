"use client";

import { useState, type FormEvent } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { resolveCatalogLocale } from "@/lib/i18n";

const COPY = {
  fr: {
    brandTitle: "Branding white-label",
    brandIntro:
      "Demande d’activation — revue ops HITL. Preview embed possible après soumission (partner id).",
    idpTitle: "Métadonnées IdP (SAML / OIDC)",
    idpIntro:
      "Envoyez l’URL de metadata ou un extrait XML — configuration Clerk Enterprise manuelle.",
    email: "E-mail",
    company: "Société",
    partnerId: "Partner id (slug)",
    color: "Couleur primaire (#hex)",
    logo: "Logo URL (https)",
    hideAuros: "Masquer la marque AUROS",
    protocol: "Protocole",
    metaUrl: "Metadata URL (https)",
    metaXml: "Extrait XML (optionnel)",
    notes: "Notes",
    submitBrand: "Demander le branding",
    submitIdp: "Envoyer les métadonnées",
    ok: "Demande enregistrée — en revue ops.",
    err: "Impossible d’envoyer. Vérifiez les champs.",
  },
  en: {
    brandTitle: "White-label branding",
    brandIntro:
      "Activation request — ops HITL review. Embed preview available after submit (partner id).",
    idpTitle: "IdP metadata (SAML / OIDC)",
    idpIntro:
      "Send metadata URL or XML snippet — Clerk Enterprise configured manually.",
    email: "Email",
    company: "Company",
    partnerId: "Partner id (slug)",
    color: "Primary color (#hex)",
    logo: "Logo URL (https)",
    hideAuros: "Hide AUROS wordmark",
    protocol: "Protocol",
    metaUrl: "Metadata URL (https)",
    metaXml: "XML snippet (optional)",
    notes: "Notes",
    submitBrand: "Request branding",
    submitIdp: "Submit metadata",
    ok: "Request saved — pending ops review.",
    err: "Could not send. Check the fields.",
  },
  es: {
    brandTitle: "Branding white-label",
    brandIntro:
      "Solicitud de activación — revisión ops HITL.",
    idpTitle: "Metadatos IdP (SAML / OIDC)",
    idpIntro: "Envíe URL de metadata o XML — Clerk Enterprise manual.",
    email: "E-mail",
    company: "Empresa",
    partnerId: "Partner id (slug)",
    color: "Color primario (#hex)",
    logo: "Logo URL (https)",
    hideAuros: "Ocultar marca AUROS",
    protocol: "Protocolo",
    metaUrl: "Metadata URL (https)",
    metaXml: "XML (opcional)",
    notes: "Notas",
    submitBrand: "Solicitar branding",
    submitIdp: "Enviar metadatos",
    ok: "Solicitud guardada — en revisión.",
    err: "No se pudo enviar. Revise los campos.",
  },
} as const;

const inputClass =
  "mt-1.5 w-full border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-emerald-500/50";

export function InstitutionalTenantForms() {
  const { locale } = useLocale();
  const c = COPY[resolveCatalogLocale(locale)] ?? COPY.fr;

  const [brandStatus, setBrandStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle"
  );
  const [idpStatus, setIdpStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle"
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function onBrand(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBrandStatus("loading");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/v1/green/institutional/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "branding",
          email: fd.get("email"),
          companyName: fd.get("company"),
          partnerId: fd.get("partnerId"),
          primaryColor: fd.get("primaryColor"),
          logoUrl: fd.get("logoUrl") || undefined,
          hideAurosBranding: fd.get("hideAuros") === "on",
          notes: fd.get("notes") || undefined,
        }),
      });
      const json = (await res.json()) as { previewUrl?: string };
      if (res.ok) {
        setPreviewUrl(json.previewUrl ?? null);
        setBrandStatus("ok");
      } else setBrandStatus("err");
    } catch {
      setBrandStatus("err");
    }
  }

  async function onIdp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIdpStatus("loading");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/v1/green/institutional/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "idp",
          email: fd.get("email"),
          companyName: fd.get("company"),
          idpProtocol: fd.get("protocol"),
          metadataUrl: fd.get("metadataUrl") || undefined,
          metadataXmlSnippet: fd.get("metadataXml") || undefined,
          notes: fd.get("notes") || undefined,
        }),
      });
      setIdpStatus(res.ok ? "ok" : "err");
    } catch {
      setIdpStatus("err");
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onBrand} className="space-y-4 p-5 md:p-6">
        <h3 className="font-display text-lg text-white">{c.brandTitle}</h3>
        <p className="text-sm text-neutral-400">{c.brandIntro}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {c.email}
            </span>
            <input name="email" type="email" required className={inputClass} />
          </label>
          <label className="text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {c.company}
            </span>
            <input name="company" required className={inputClass} />
          </label>
          <label className="text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {c.partnerId}
            </span>
            <input name="partnerId" placeholder="acme" className={inputClass} />
          </label>
          <label className="text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {c.color}
            </span>
            <input
              name="primaryColor"
              defaultValue="#059669"
              pattern="#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})"
              required
              className={inputClass}
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {c.logo}
            </span>
            <input name="logoUrl" type="url" className={inputClass} />
          </label>
          <label className="flex items-center gap-2 text-sm text-white/70 sm:col-span-2">
            <input name="hideAuros" type="checkbox" className="accent-emerald-500" />
            {c.hideAuros}
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {c.notes}
            </span>
            <textarea name="notes" rows={2} className={inputClass} />
          </label>
        </div>
        <button
          type="submit"
          disabled={brandStatus === "loading"}
          className="border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-emerald-200/90 hover:bg-emerald-500/20 disabled:opacity-50"
        >
          {c.submitBrand}
        </button>
        {brandStatus === "ok" ? (
          <p className="text-sm text-emerald-300/80">
            {c.ok}
            {previewUrl ? (
              <>
                {" "}
                <a
                  href={previewUrl}
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  preview →
                </a>
              </>
            ) : null}
          </p>
        ) : null}
        {brandStatus === "err" ? (
          <p className="text-sm text-red-300/80">{c.err}</p>
        ) : null}
      </form>

      <form
        onSubmit={onIdp}
        className="space-y-4 border-t border-white/[0.08] p-5 md:p-6"
      >
        <h3 className="font-display text-lg text-white">{c.idpTitle}</h3>
        <p className="text-sm text-neutral-400">{c.idpIntro}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {c.email}
            </span>
            <input name="email" type="email" required className={inputClass} />
          </label>
          <label className="text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {c.company}
            </span>
            <input name="company" required className={inputClass} />
          </label>
          <label className="text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {c.protocol}
            </span>
            <select name="protocol" className={inputClass} defaultValue="saml">
              <option value="saml">SAML</option>
              <option value="oidc">OIDC</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {c.metaUrl}
            </span>
            <input name="metadataUrl" type="url" className={inputClass} />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {c.metaXml}
            </span>
            <textarea name="metadataXml" rows={4} className={inputClass} />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {c.notes}
            </span>
            <textarea name="notes" rows={2} className={inputClass} />
          </label>
        </div>
        <button
          type="submit"
          disabled={idpStatus === "loading"}
          className="border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-emerald-200/90 hover:bg-emerald-500/20 disabled:opacity-50"
        >
          {c.submitIdp}
        </button>
        {idpStatus === "ok" ? (
          <p className="text-sm text-emerald-300/80">{c.ok}</p>
        ) : null}
        {idpStatus === "err" ? (
          <p className="text-sm text-red-300/80">{c.err}</p>
        ) : null}
      </form>
    </div>
  );
}
