"use client";

import { isFormConfigured } from "@/lib/jurisdictions";

type GoogleFormEmbedProps = {
  url: string;
  placeholder: string;
  title: string;
};

export function GoogleFormEmbed({ url, placeholder, title }: GoogleFormEmbedProps) {
  if (!isFormConfigured(url)) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
        <p className="font-mono text-[11px] leading-relaxed text-white/40">
          {placeholder}
        </p>
      </div>
    );
  }

  return (
    <iframe
      src={url}
      title={title}
      className="h-[520px] w-full rounded-2xl border border-white/[0.08] bg-white"
      loading="lazy"
    />
  );
}
