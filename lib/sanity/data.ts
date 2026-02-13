import { client } from "./client";
import { urlFor } from "./image-url";
import {
  seriesListQuery,
  galleryBySlugsQuery,
  infoPageBySlugQuery,
  infoPageSlugsQuery,
  contactQuery,
  homeQuery,
  siteSettingsQuery,
} from "./queries";
import type { SeriesLink, GalleryData, InfoPageData, ContactData, HomeData, PhotoItem } from "./types";

interface GalleryFetchResult {
  title: string
  slug: string
  seriesSlug: string
  seriesTitle: string
  photos: Array<{ asset: { _ref?: string; _id?: string } | null; alt?: string; caption?: string }>
}

const DEFAULT_W = 1200;
const DEFAULT_H = 800;

const isSanityConfigured = () =>
  typeof process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === "string" &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "placeholder";

function photoFromSanity(asset: { _ref?: string; _id?: string } | null, alt: string, title: string): PhotoItem {
  // GROQ with asset-> returns expanded doc with _id; reference has _ref. urlFor accepts both.
  const source = asset?._ref ? { _ref: asset._ref } : asset?._id ? { _ref: asset._id } : null;
  if (!source) {
    return { src: "", width: DEFAULT_W, height: DEFAULT_H, alt, title };
  }
  const src = urlFor(source).width(DEFAULT_W).height(DEFAULT_H).url();
  return { src, width: DEFAULT_W, height: DEFAULT_H, alt: alt || title, title: title || alt };
}

export async function getSeriesList(): Promise<SeriesLink[]> {
  if (!isSanityConfigured()) return [];
  const data = await client.fetch<Array<{
    title: string
    slug: string
    galleries: Array<{ slug: string; title: string; imageCount: number }>
  }>>(seriesListQuery);
  if (!data) return [];
  return data.map((s) => ({
    slug: s.slug,
    title: s.title,
    galleries: (s.galleries || []).map((g) => ({
      slug: g.slug,
      title: g.title,
      seriesSlug: s.slug,
      imageCount: g.imageCount ?? 0,
    })),
  }));
}

export async function getGalleryBySlugs(seriesSlug: string, gallerySlug: string): Promise<GalleryData | null> {
  if (!isSanityConfigured()) return null;
  const g = await client.fetch<GalleryFetchResult | null>(galleryBySlugsQuery, { seriesSlug, gallerySlug });
  if (!g) return null;
  const photos: PhotoItem[] = (g.photos || [])
    .map((p) => photoFromSanity(p.asset, p.alt || "", p.caption || p.alt || g.title))
    .filter((p) => p.src !== "");
  const seriesList = await getSeriesList();
  const otherGalleries: GalleryData["otherGalleries"] = [];
  for (const series of seriesList) {
    for (const gal of series.galleries) {
      if (gal.seriesSlug !== g.seriesSlug || gal.slug !== g.slug) {
        otherGalleries.push({ slug: gal.slug, title: gal.title, seriesSlug: gal.seriesSlug, imageCount: gal.imageCount });
      }
    }
  }
  return {
    title: g.title,
    seriesSlug: g.seriesSlug,
    seriesTitle: g.seriesTitle,
    slug: g.slug,
    photos,
    otherGalleries,
  };
}

export async function getInfoPageBySlug(slug: string): Promise<InfoPageData | null> {
  if (!isSanityConfigured()) return null;
  const doc = await client.fetch<{ slug: string; title: string; body: unknown } | null>(
    infoPageBySlugQuery,
    { slug }
  );
  return doc;
}

export async function getInfoPageSlugs(): Promise<string[]> {
  if (!isSanityConfigured()) return [];
  const slugs = await client.fetch<string[]>(infoPageSlugsQuery);
  return slugs || [];
}

export async function getContact(): Promise<ContactData | null> {
  if (!isSanityConfigured()) return null;
  const doc = await client.fetch<{ body: unknown } | null>(contactQuery);
  return doc;
}

export async function getHome(): Promise<HomeData> {
  if (!isSanityConfigured()) {
    return { heroImageUrl: null, intro: null, siteTitle: "Showcase" };
  }
  const [home, settings] = await Promise.all([
    client.fetch<{ heroImageRef?: string; intro?: unknown } | null>(homeQuery),
    client.fetch<{ title?: string } | null>(siteSettingsQuery),
  ]);
  const siteTitle = settings?.title || "Showcase";
  let heroImageUrl: string | null = null;
  if (home?.heroImageRef) {
    heroImageUrl = urlFor({ _ref: home.heroImageRef }).width(1920).height(1080).url();
  }
  return {
    heroImageUrl,
    intro: home?.intro ?? null,
    siteTitle,
  };
}
