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
import type { SeriesLink, GalleryData, InfoPageData, ContactData, HomeData, PhotoItem, GalleryLayoutBlock } from "./types";

interface GalleryFetchResult {
  title: string
  slug: string
  seriesSlug: string
  seriesTitle: string
  layoutBlocks?: Array<{
    _type: string
    _key?: string
    body?: unknown
    imageRef?: string
    imageAsset?: { _id?: string; metadata?: { dimensions?: { width: number; height: number } } }
    caption?: string
  }>
  photos: Array<{
    asset: { _ref?: string; _id?: string } | null
    dimensions?: { width: number; height: number } | null
    alt?: string
    caption?: string
  }>
}

const DEFAULT_W = 1200;
const DEFAULT_H = 800;

const isSanityConfigured = () =>
  typeof process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === "string" &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "placeholder";

function photoFromSanity(
  asset: { _ref?: string; _id?: string } | null,
  dimensions: { width: number; height: number } | null | undefined,
  alt: string,
  title: string
): PhotoItem {
  const source = asset?._ref ? { _ref: asset._ref } : asset?._id ? { _ref: asset._id } : null;
  if (!source) {
    return { src: "", width: DEFAULT_W, height: DEFAULT_H, alt, title };
  }
  const w = dimensions?.width ?? DEFAULT_W;
  const h = dimensions?.height ?? DEFAULT_H;
  const src = urlFor(source).width(w).height(h).url();
  return { src, width: w, height: h, alt: alt || title, title: title || alt };
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
    .map((p) => photoFromSanity(p.asset, p.dimensions, p.alt || "", p.caption || p.alt || g.title))
    .filter((p) => p.src !== "");

  const layoutBlocks: GalleryLayoutBlock[] = (g.layoutBlocks || [])
    .filter((b): b is NonNullable<typeof b> => b != null && b._type != null)
    .map((b) => {
      if (b._type === "galleryLayoutBlockText") {
        return { type: "galleryLayoutBlockText", body: b.body ?? [] };
      }
      if (b._type === "galleryLayoutBlockImage" && (b.imageRef || b.imageAsset?._id)) {
        const refId = b.imageRef ?? b.imageAsset?._id ?? "";
        const dims = b.imageAsset?.metadata?.dimensions;
        const w = dims?.width ?? DEFAULT_W;
        const h = dims?.height ?? DEFAULT_H;
        const src = refId ? urlFor({ _ref: refId }).width(w).height(h).url() : "";
        return {
          type: "galleryLayoutBlockImage",
          src,
          alt: b.caption ?? "",
          caption: b.caption,
          width: w,
          height: h,
        };
      }
      return null;
    })
    .filter((b): b is GalleryLayoutBlock => b != null);

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
    layoutBlocks: layoutBlocks.length > 0 ? layoutBlocks : undefined,
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
    return { heroImageUrl: null, heroImageMargin: "medium", intro: null, siteTitle: "OMRGR" };
  }
  const [home, settings] = await Promise.all([
    client.fetch<{ heroImageRef?: string; heroImageMargin?: string; intro?: unknown } | null>(homeQuery),
    client.fetch<{ title?: string } | null>(siteSettingsQuery),
  ]);
  const raw = settings?.title?.trim();
  const siteTitle = raw && raw !== "Showcase" ? raw : "OMRGR";
  let heroImageUrl: string | null = null;
  if (home?.heroImageRef) {
    heroImageUrl = urlFor({ _ref: home.heroImageRef }).width(1920).height(1080).url();
  }
  const marginRaw = home?.heroImageMargin?.toString().trim().toLowerCase();
  const heroImageMargin = (marginRaw === "none" || marginRaw === "small" || marginRaw === "large"
    ? marginRaw
    : "medium") as HomeData["heroImageMargin"];
  return {
    heroImageUrl,
    heroImageMargin,
    intro: home?.intro ?? null,
    siteTitle,
  };
}
