import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { GREEN_BLOG_ROUTE } from "@/lib/green/constants";
import { metadataFromPath } from "@/lib/seo/metadata";

import { GreenBlogIndexView } from "../_components/GreenBlogIndexView";

export const metadata = metadataFromPath(GREEN_BLOG_ROUTE);

export default function GreenBlogIndexPage() {
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_BLOG_ROUTE} />
      <GreenBlogIndexView />
    </>
  );
}
