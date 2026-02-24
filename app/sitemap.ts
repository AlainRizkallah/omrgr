import type { MetadataRoute } from "next";
import { getSeriesList, getInfoPageSlugs } from "@/lib/sanity/data";
import { getBaseUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  try {
    const [infoSlugs, seriesList] = await Promise.all([
      getInfoPageSlugs(),
      getSeriesList(),
    ]);

    for (const slug of infoSlugs) {
      entries.push({
        url: `${base}/info/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    for (const series of seriesList) {
      for (const gallery of series.galleries || []) {
        entries.push({
          url: `${base}/works/${series.slug}/${gallery.slug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  } catch {
    // Sanity not configured or fetch failed; static entries only
  }

  return entries;
}
