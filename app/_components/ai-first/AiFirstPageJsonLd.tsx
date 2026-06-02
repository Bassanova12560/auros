import { getAiFirstPageByPath, buildPageJsonLd } from "@/lib/ai-first";

type Props = { path: string };

/** Inject page-specific JSON-LD from the AI-first catalog when defined. */
export function AiFirstPageJsonLd({ path }: Props) {
  const page = getAiFirstPageByPath(path);
  if (!page) return null;

  const blocks = buildPageJsonLd(page);
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={`${page.id}-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
