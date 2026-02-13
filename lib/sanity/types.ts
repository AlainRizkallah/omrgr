/** Image for grid/lightbox (derived from Sanity gallery image) */
export interface PhotoItem {
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  collection?: string;
}

export interface GalleryLink {
  slug: string;
  title: string;
  seriesSlug: string;
  imageCount?: number;
}

export interface SeriesLink {
  slug: string;
  title: string;
  galleries: GalleryLink[];
}

/** Layout block for gallery page (custom content above All Media grid) */
export type GalleryLayoutBlock =
  | { type: "galleryLayoutBlockText"; body: unknown }
  | { type: "galleryLayoutBlockImage"; src: string; alt: string; caption?: string; width?: number; height?: number };

export interface GalleryData {
  title: string;
  seriesSlug: string;
  seriesTitle: string;
  slug: string;
  layoutBlocks?: GalleryLayoutBlock[];
  photos: PhotoItem[];
  otherGalleries: GalleryLink[];
}

export interface InfoPageData {
  slug: string;
  title: string;
  body: unknown;
}

export interface ContactData {
  body: unknown;
}

export type HeroImageMargin = "none" | "small" | "medium" | "large";

export interface HomeData {
  heroImageUrl: string | null;
  heroImageMargin: HeroImageMargin;
  intro: unknown;
  siteTitle: string;
}
