export const BLOG_ROUTE = "/blog";

export function blogArticlePath(slug: string): string {
  return `${BLOG_ROUTE}/${slug}`;
}
