import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { BLOG_ROUTE } from "@/lib/blog";
import { metadataFromPath } from "@/lib/seo/metadata";

import { BlogIndexView } from "./_components/BlogIndexView";

export const metadata = metadataFromPath(BLOG_ROUTE);

export default function BlogIndexPage() {
  return (
    <FocusPageShell path={BLOG_ROUTE} width="3xl">
      <BlogIndexView />
    </FocusPageShell>
  );
}
