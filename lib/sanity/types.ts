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
}

export interface SeriesLink {
  slug: string;
  title: string;
  galleries: GalleryLink[];
}

/** Optional rich text block below an image (same formatting as text blocks) */
export interface ImageTextBelow {
  textSize?: string;
  body: unknown;
}

/** Cell inside a Grid layout block */
export type GalleryGridCell =
  | { type: "galleryGridCellText"; body: unknown; textSize?: string }
  | {
      type: "galleryGridCellImage";
      src: string;
      alt: string;
      caption?: string;
      textBelow?: ImageTextBelow;
      width?: number;
      height?: number;
    };

/** Layout block for gallery page (custom content above All Media grid) */
export type GalleryLayoutBlock =
  | { type: "galleryLayoutBlockText"; body: unknown; textSize?: string }
  | {
      type: "galleryLayoutBlockImage";
      src: string;
      alt: string;
      caption?: string;
      textBelow?: ImageTextBelow;
      width?: number;
      height?: number;
    }
  | {
      type: "galleryLayoutBlockRow";
      layout: "textLeft" | "imageLeft";
      mobileOrder?: "textFirst" | "imageFirst";
      body: unknown;
      textSize?: string;
      src: string;
      alt: string;
      caption?: string;
      textBelow?: ImageTextBelow;
      width?: number;
      height?: number;
    }
  | { type: "galleryLayoutBlockGrid"; columns: number; items: GalleryGridCell[] };

export interface GalleryData {
  title: string;
  seriesSlug: string;
  seriesTitle: string;
  /** True when this series has only one gallery; use to hide series name in titles/breadcrumbs. */
  isSingleGalleryInSeries?: boolean;
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
  siteFont: string;
}
