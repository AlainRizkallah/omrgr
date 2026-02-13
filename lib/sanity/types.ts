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

export interface GalleryData {
  title: string;
  seriesSlug: string;
  seriesTitle: string;
  slug: string;
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

export interface HomeData {
  heroImageUrl: string | null;
  intro: unknown;
  siteTitle: string;
}
