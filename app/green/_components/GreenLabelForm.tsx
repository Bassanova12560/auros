"use client";



import Link from "next/link";

import { useCallback, useState, type FormEvent } from "react";



import { useLocale } from "@/app/_components/i18n/LocaleProvider";

import { saveGreenLabelAction } from "@/lib/actions/green-label";

import { uploadGreenLabelDocumentAction } from "@/lib/actions/green-label-document";

import type { GreenProjectType } from "@/lib/green";

import {

  GREEN_MARKET_ROUTE,

  GREEN_REGISTRY_ROUTE,

  GREEN_STANDARDS_ROUTE,

} from "@/lib/green/constants";

import { getGreenMessages } from "@/lib/green/i18n";



import { GreenFormStepBar } from "./green-ui";



const PROJECT_TYPES: GreenProjectType[] = [

  "solar",

  "wind",

  "rec",

  "carbon",

  "ppa",

  "other",

];



const TOTAL_STEPS = 2;



const inputClass =

  "w-full rounded-lg border border-emerald-500 bg-black px-4 py-3 text-sm text-emerald-400 placeholder:text-neutral-600 outline-none focus:border-emerald-400";



export function GreenLabelForm() {

  const { locale } = useLocale();

  const m = getGreenMessages(locale);

  const f = m.label.form;



  const [step, setStep] = useState(1);

  const [submitted, setSubmitted] = useState<{ projectName: string } | null>(null);

  const [projectName, setProjectName] = useState("");

  const [projectType, setProjectType] = useState<GreenProjectType | "">("");

  const [contactName, setContactName] = useState("");

  const [email, setEmail] = useState("");

  const [website, setWebsite] = useState("");

  const [country, setCountry] = useState("");

  const [description, setDescription] = useState("");

  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<

    "invalid" | "rate_limit" | "document_type" | "document_size" | "document_upload" | null

  >(null);



  const stepLabel = f.stepOf(step, TOTAL_STEPS);



  const handleSubmit = useCallback(

    async (e: FormEvent) => {

      e.preventDefault();

      if (!projectType) return;



      setSubmitting(true);

      setError(null);

      const result = await saveGreenLabelAction({

        projectName: projectName.trim(),

        projectType,

        contactName: contactName.trim(),

        email: email.trim(),

        website: website.trim(),

        country: country.trim(),

        description: description.trim(),

      });

      if (!result.ok) {

        setSubmitting(false);

        if (result.error === "rate_limit") setError("rate_limit");

        else setError("invalid");

        return;

      }



      if (documentFile) {

        const fd = new FormData();

        fd.set("applicationId", result.id);

        fd.set("file", documentFile);

        const upload = await uploadGreenLabelDocumentAction(fd);

        if (!upload.ok) {

          setSubmitting(false);

          if (upload.error === "file_type") setError("document_type");

          else if (upload.error === "file_size") setError("document_size");

          else setError("document_upload");

          return;

        }

      }



      setSubmitting(false);

      setSubmitted({ projectName: projectName.trim() });

    },

    [projectName, projectType, contactName, email, website, country, description, documentFile]

  );



  function goToStep2(e: FormEvent) {

    e.preventDefault();

    if (

      !projectName.trim() ||

      !projectType ||

      !contactName.trim() ||

      !email.trim() ||

      !website.trim() ||

      !country.trim()

    ) {

      setError("invalid");

      return;

    }

    setError(null);

    setStep(2);

  }



  if (submitted) {

    return (

      <div

        className="rounded-xl border border-emerald-500 bg-black p-8 text-center"

        role="status"

      >

        <p className="text-lg text-emerald-400">{f.success}</p>

        <p className="mt-2 text-sm text-neutral-400">{submitted.projectName}</p>

        <p className="mt-4 text-xs text-neutral-500">{f.successHint}</p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">

          <Link

            href="/green/my"

            className="rounded-full border border-emerald-500/50 px-4 py-2 text-xs text-emerald-400 hover:bg-emerald-500/10"

          >

            {f.successMy} →

          </Link>

          <Link

            href={GREEN_STANDARDS_ROUTE}

            className="rounded-full border border-emerald-500/50 px-4 py-2 text-xs text-emerald-400 hover:bg-emerald-500/10"

          >

            {f.successStandards} →

          </Link>

          <Link

            href={GREEN_REGISTRY_ROUTE}

            className="rounded-full border border-emerald-500/50 px-4 py-2 text-xs text-emerald-400 hover:bg-emerald-500/10"

          >

            {f.successRegistry} →

          </Link>

          <Link

            href={GREEN_MARKET_ROUTE}

            className="rounded-full border border-emerald-500/50 px-4 py-2 text-xs text-emerald-400 hover:bg-emerald-500/10"

          >

            {f.successMarket} →

          </Link>

        </div>

      </div>

    );

  }



  return (

    <div className="rounded-xl border border-emerald-500 bg-black p-8">

      <GreenFormStepBar current={step} total={TOTAL_STEPS} label={stepLabel} />



      {step === 1 ? (

        <form onSubmit={goToStep2} className="grid gap-4 sm:grid-cols-2">

          <p className="sm:col-span-2 font-mono text-[10px] uppercase tracking-wider text-emerald-500/60">

            {f.step1Title}

          </p>

          <label className="block sm:col-span-2">

            <span className="text-xs uppercase tracking-wider text-emerald-500/50">{f.projectName}</span>

            <input

              required

              value={projectName}

              onChange={(e) => setProjectName(e.target.value)}

              className={`${inputClass} mt-2`}

            />

          </label>

          <label className="block sm:col-span-2">

            <span className="text-xs uppercase tracking-wider text-emerald-500/50">{f.projectType}</span>

            <select

              required

              value={projectType}

              onChange={(e) => setProjectType(e.target.value as GreenProjectType)}

              className={`${inputClass} mt-2`}

            >

              <option value="" disabled>

                —

              </option>

              {PROJECT_TYPES.map((t) => (

                <option key={t} value={t}>

                  {f.projectTypes[t]}

                </option>

              ))}

            </select>

          </label>

          <label className="block">

            <span className="text-xs uppercase tracking-wider text-emerald-500/50">{f.contactName}</span>

            <input

              required

              value={contactName}

              onChange={(e) => setContactName(e.target.value)}

              className={`${inputClass} mt-2`}

            />

          </label>

          <label className="block">

            <span className="text-xs uppercase tracking-wider text-emerald-500/50">{f.email}</span>

            <input

              required

              type="email"

              value={email}

              onChange={(e) => setEmail(e.target.value)}

              className={`${inputClass} mt-2`}

            />

          </label>

          <label className="block">

            <span className="text-xs uppercase tracking-wider text-emerald-500/50">{f.website}</span>

            <input

              required

              type="url"

              value={website}

              onChange={(e) => setWebsite(e.target.value)}

              className={`${inputClass} mt-2`}

              placeholder={f.websitePlaceholder}

            />

          </label>

          <label className="block">

            <span className="text-xs uppercase tracking-wider text-emerald-500/50">{f.country}</span>

            <input

              required

              value={country}

              onChange={(e) => setCountry(e.target.value)}

              className={`${inputClass} mt-2`}

            />

          </label>

          {error ? (

            <p className="sm:col-span-2 text-xs text-red-400/80" role="alert">

              {f.errorInvalid}

            </p>

          ) : null}

          <div className="sm:col-span-2">

            <button

              type="submit"

              className="inline-flex items-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-medium text-emerald-950 hover:bg-emerald-400"

            >

              {f.next}

            </button>

          </div>

        </form>

      ) : (

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">

          <p className="sm:col-span-2 font-mono text-[10px] uppercase tracking-wider text-emerald-500/60">

            {f.step2Title}

          </p>

          <label className="block sm:col-span-2">

            <span className="text-xs uppercase tracking-wider text-emerald-500/50">{f.description}</span>

            <textarea

              required

              rows={4}

              value={description}

              onChange={(e) => setDescription(e.target.value)}

              className={`${inputClass} mt-2 resize-y`}

            />

          </label>

          <label className="block sm:col-span-2">

            <span className="text-xs uppercase tracking-wider text-emerald-500/50">{f.document}</span>

            <input

              type="file"

              accept="application/pdf"

              className="mt-2 w-full text-sm text-emerald-400/80 file:mr-3 file:rounded-lg file:border file:border-emerald-500/40 file:bg-black file:px-3 file:py-2 file:text-xs file:uppercase file:tracking-wider file:text-emerald-400"

              onChange={(e) => setDocumentFile(e.target.files?.[0] ?? null)}

            />

            <p className="mt-1 text-[11px] text-neutral-500">{f.documentHint}</p>

          </label>

          {error ? (

            <p className="sm:col-span-2 text-xs text-red-400/80" role="alert">

              {error === "rate_limit"

                ? f.errorRateLimit

                : error === "document_type"

                  ? f.documentErrorType

                  : error === "document_size"

                    ? f.documentErrorSize

                    : error === "document_upload"

                      ? f.documentErrorUpload

                      : f.errorInvalid}

            </p>

          ) : null}

          <div className="flex flex-wrap gap-3 sm:col-span-2">

            <button

              type="button"

              onClick={() => setStep(1)}

              disabled={submitting}

              className="rounded-full border border-emerald-500/40 px-5 py-2.5 text-sm text-emerald-400/80 hover:bg-emerald-500/10 disabled:opacity-50"

            >

              {f.back}

            </button>

            <button

              type="submit"

              disabled={submitting}

              className="inline-flex items-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-medium text-emerald-950 hover:bg-emerald-400 disabled:opacity-50"

            >

              {submitting ? f.submitting : f.submit}

            </button>

          </div>

        </form>

      )}

    </div>

  );

}

