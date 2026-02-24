/** Canonical base URL for the site (SEO, sitemap, robots, OG). */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://omrgr.co";
}
