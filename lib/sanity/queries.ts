/** GROQ: all series with galleries (for nav and home) */
export const seriesListQuery = `*[_type == "series"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  order,
  "galleries": galleries[]->{
    _id,
    title,
    "slug": slug.current
  }
}`;

/** GROQ: single gallery by series slug + gallery slug with layout blocks */
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
      "_type": _type,
      "body": body,
      textSize,
      textAlign
    },
    _type == "galleryLayoutBlockImage" => {
      "_type": _type,
      "imageRef": image.asset._ref,
      "imageAsset": image.asset->,
      caption,
      textBelowTextSize,
      "textBelowBody": textBelowBody
    },
    _type == "galleryLayoutBlockRow" => {
      "_type": _type,
      layout,
      mobileOrder,
      "body": body,
      textSize,
      "imageRef": image.asset._ref,
      "imageAsset": image.asset->,
      caption,
      textBelowTextSize,
      "textBelowBody": textBelowBody
    },
    _type == "galleryLayoutBlockGrid" => {
      "_type": _type,
      columns,
      "items": items[]{
        _type,
        _key,
        _type == "galleryGridCellText" => {
          "body": body,
          textSize
        },
        _type == "galleryGridCellImage" => {
          "imageRef": image.asset._ref,
          "imageAsset": image.asset->,
          caption,
          textBelowTextSize,
          "textBelowBody": textBelowBody
        }
      }
    }
  }
}`;

/** GROQ: all series for footer/other galleries (same as list, used for "other" links) */
export const allSeriesForNavQuery = seriesListQuery;

/** GROQ: info page by slug */
export const infoPageBySlugQuery = `*[_type == "infoPage" && slug == $slug][0] {
  slug,
  title,
  body,
  "imageRef": image.asset._ref,
  "imageAsset": image.asset->{ _id, "metadata": metadata.dimensions }
}`;

/** GROQ: all info page slugs */
export const infoPageSlugsQuery = `*[_type == "infoPage"].slug`;

/** GROQ: contact singleton */
export const contactQuery = `*[_type == "contact"][0] {
  body,
  "imageRef": image.asset._ref,
  "imageAsset": image.asset->{ _id, "metadata": metadata.dimensions }
}`;

/** GROQ: home document */
export const homeQuery = `*[_type == "home"][0] {
  "heroImageRef": heroImage.asset._ref,
  heroImageMargin,
  intro
}`;

/** GROQ: site settings */
export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  title,
  fontFamily
}`;

