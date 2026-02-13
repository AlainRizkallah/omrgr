/** GROQ: all series with galleries (for nav and home) */
export const seriesListQuery = `*[_type == "series"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  order,
  "galleries": galleries[]->{
    _id,
    title,
    "slug": slug.current,
    "imageCount": count(images)
  }
}`;

/** GROQ: single gallery by series slug + gallery slug with images and layout blocks */
export const galleryBySlugsQuery = `*[_type == "gallery" && slug.current == $gallerySlug && series->slug.current == $seriesSlug][0] {
  _id,
  title,
  "slug": slug.current,
  "seriesSlug": series->slug.current,
  "seriesTitle": series->title,
  "layoutBlocks": layoutBlocks[]{
    _type,
    _key,
    _type == "galleryLayoutBlockText" => {
      "body": body
    },
    _type == "galleryLayoutBlockImage" => {
      "imageRef": image.asset._ref,
      "imageAsset": image.asset->,
      "caption": caption
    }
  },
  "photos": images[]{
    "asset": asset->,
    "dimensions": asset->.metadata.dimensions,
    alt,
    caption
  }
}`;

/** GROQ: all series for footer/other galleries (same as list, used for "other" links) */
export const allSeriesForNavQuery = seriesListQuery;

/** GROQ: info page by slug */
export const infoPageBySlugQuery = `*[_type == "infoPage" && slug == $slug][0] {
  slug,
  title,
  body
}`;

/** GROQ: all info page slugs */
export const infoPageSlugsQuery = `*[_type == "infoPage"].slug`;

/** GROQ: contact singleton */
export const contactQuery = `*[_type == "contact"][0] {
  body
}`;

/** GROQ: home document */
export const homeQuery = `*[_type == "home"][0] {
  "heroImageRef": heroImage.asset._ref,
  intro
}`;

/** GROQ: site settings */
export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  title
}`;

