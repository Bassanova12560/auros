import { ContentFaqList } from "@/app/_components/ContentPageLayout";
import { DEFAULT_LOCALE, getMessages } from "@/lib/i18n";

/** SSR-friendly trust enrichment — badges, infrastructure, native FAQ accordion. */
export function TrustEnrichment() {
  const te = getMessages(DEFAULT_LOCALE).trustPage;

  return (
    <section className="border-t border-white/[0.06] px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap gap-3">
          {te.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-white/[0.12] px-3 py-1.5 text-sm font-medium text-white/80"
            >
              {"\u2713"} {badge}
            </span>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="font-display text-xl font-semibold text-white">
            {te.infrastructureTitle}
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
            {te.infrastructureItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-12 border-t border-white/[0.06] pt-12">
          <h2 className="font-display text-xl font-semibold text-white">{te.faqTitle}</h2>
          <div className="mt-8">
            <ContentFaqList items={[...te.faq]} />
          </div>
        </div>
      </div>
    </section>
  );
}
