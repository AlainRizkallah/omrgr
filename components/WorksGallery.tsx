"use client";

import Link from "next/link";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PhotoItem, GalleryLayoutBlock, GalleryGridCell } from "@/lib/sanity/types";

/** Tailwind classes for layout block font (matches Sanity options) */
function layoutBlockFontClass(font?: string): string {
  return font === "sans" ? "font-sans" : "font-serif-editorial";
}

/** Tailwind text size scale for layout blocks (matches Sanity textSize) */
const SIZE_SCALE = {
  sm: { block: "text-sm", h1: "text-xl", h2: "text-lg", h3: "text-base", h4: "text-sm", blockquote: "text-sm border-l-2 border-muted-foreground/30 pl-4 italic" },
  base: { block: "text-base", h1: "text-2xl", h2: "text-xl", h3: "text-lg", h4: "text-base", blockquote: "text-base border-l-2 border-muted-foreground/30 pl-4 italic" },
  lg: { block: "text-lg", h1: "text-3xl", h2: "text-2xl", h3: "text-xl", h4: "text-lg", blockquote: "text-lg border-l-2 border-muted-foreground/30 pl-4 italic" },
} as const;

function layoutBlockTextSizeClass(textSize?: string): keyof typeof SIZE_SCALE {
  return textSize === "sm" || textSize === "lg" ? textSize : "base";
}

/** PortableText components for gallery layout blocks: proper block styles and marks so output matches Sanity Studio hierarchy and formatting. */
function galleryLayoutBlockComponents(textSize: keyof typeof SIZE_SCALE): PortableTextComponents {
  const scale = SIZE_SCALE[textSize];
  return {
    block: {
      normal: ({ children }) => <p className={`${scale.block} mb-3 last:mb-0`}>{children}</p>,
      h1: ({ children }) => <h2 className={`${scale.h1} font-semibold tracking-tight mt-6 mb-2 first:mt-0`}>{children}</h2>,
      h2: ({ children }) => <h3 className={`${scale.h2} font-semibold tracking-tight mt-5 mb-2 first:mt-0`}>{children}</h3>,
      h3: ({ children }) => <h4 className={`${scale.h3} font-semibold mt-4 mb-1 first:mt-0`}>{children}</h4>,
      h4: ({ children }) => <h5 className={`${scale.h4} font-semibold mt-3 mb-1 first:mt-0`}>{children}</h5>,
      blockquote: ({ children }) => <blockquote className={`${scale.blockquote} my-3`}>{children}</blockquote>,
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc pl-6 space-y-1 mb-3">{children}</ul>,
      number: ({ children }) => <ol className="list-decimal pl-6 space-y-1 mb-3">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li className={scale.block}>{children}</li>,
      number: ({ children }) => <li className={scale.block}>{children}</li>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      link: ({ value, children }) => (
        <a href={value?.href} className="text-[hsl(var(--foreground))] underline underline-offset-2 hover:no-underline" target={value?.blank ? "_blank" : undefined} rel={value?.blank ? "noopener noreferrer" : undefined}>
          {children}
        </a>
      ),
      code: ({ children }) => <code className="font-mono text-[0.9em] bg-muted px-1.5 py-0.5 rounded">{children}</code>,
    },
  };
}

type OtherGallery = { slug: string; title: string; seriesSlug: string };

interface WorksGalleryProps {
  title: string;
  seriesTitle: string;
  /** When true, do not show series name in the page title (e.g. single-gallery series). */
  hideSeriesInTitle?: boolean;
  layoutBlocks?: GalleryLayoutBlock[];
  photos: PhotoItem[];
  otherGalleries: OtherGallery[];
}

export default function WorksGallery({ title, seriesTitle, hideSeriesInTitle, layoutBlocks, photos, otherGalleries }: WorksGalleryProps) {
  const hasLayoutBlocks = layoutBlocks && layoutBlocks.length > 0;
  const hasPhotos = photos.length > 0;

  if (!hasLayoutBlocks && !hasPhotos) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
        <p className="text-[hsl(var(--muted-foreground))] text-sm">No images in this gallery yet.</p>
        <p className="mt-2 text-[hsl(var(--muted-foreground))] text-xs">Add images in Sanity Studio.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <section className="shrink-0 border-b border-[hsl(var(--border))] px-4 py-3 sm:px-6">
        <h1 className="font-serif-editorial text-sm font-normal tracking-wide sm:text-base">
          {hideSeriesInTitle ? title : `${seriesTitle} — ${title}`}
        </h1>
      </section>

      {/* Custom layout blocks (text and images) */}
      {hasLayoutBlocks && (
        <section className="shrink-0 border-b border-[hsl(var(--border))] px-4 py-6 sm:px-6">
          <div className="mx-auto space-y-32">
            {layoutBlocks!.map((block, i) => {
              if (block.type === "galleryLayoutBlockText" && block.body && Array.isArray(block.body) && block.body.length > 0) {
                const fontClass = layoutBlockFontClass(block.font);
                const sizeKey = layoutBlockTextSizeClass(block.textSize);
                const components = galleryLayoutBlockComponents(sizeKey);
                return (
                  <div key={i} className="mx-auto max-w-3xl">
                    <div
                      className={`${fontClass} ${SIZE_SCALE[sizeKey].block} leading-relaxed text-[hsl(var(--foreground))] max-w-none`}
                    >
                      <PortableText value={(block.body ?? []) as React.ComponentProps<typeof PortableText>["value"]} components={components} />
                    </div>
                  </div>
                );
              }
              if (block.type === "galleryLayoutBlockImage" && block.src) {
                const textBelowFontClass = layoutBlockFontClass(block.textBelow?.font);
                const textBelowSizeKey = layoutBlockTextSizeClass(block.textBelow?.textSize);
                const textBelowComponents = galleryLayoutBlockComponents(textBelowSizeKey);
                return (
                  <div key={i} className="mx-auto max-w-3xl space-y-2">
                  <figure className="space-y-2">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg sm:aspect-[3/2]">
                      <Image
                        src={block.src}
                        alt={block.alt}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 672px"
                      />
                    </div>
                    {block.caption && (
                      <figcaption className="text-center text-sm text-[hsl(var(--muted-foreground))]">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                    {block.textBelow?.body && Array.isArray(block.textBelow.body) && block.textBelow.body.length > 0 && (
                      <div
                        className={`${textBelowFontClass} ${SIZE_SCALE[textBelowSizeKey].block} leading-relaxed text-[hsl(var(--foreground))] max-w-none`}
                      >
                        <PortableText
                          value={block.textBelow.body as React.ComponentProps<typeof PortableText>["value"]}
                          components={textBelowComponents}
                        />
                      </div>
                    )}
                  </div>
                );
              }
              if (block.type === "galleryLayoutBlockRow" && block.src) {
                const fontClass = layoutBlockFontClass(block.font);
                const sizeKey = layoutBlockTextSizeClass(block.textSize);
                const components = galleryLayoutBlockComponents(sizeKey);
                const mobileOrder = block.mobileOrder ?? "textFirst";
                const textOrderClass = mobileOrder === "imageFirst" ? "order-2 md:order-none" : "order-1 md:order-none";
                const imageOrderClass = mobileOrder === "imageFirst" ? "order-1 md:order-none" : "order-2 md:order-none";
                const textCell = (
                  <div className={`${textOrderClass} min-w-0`}>
                    {block.body && Array.isArray(block.body) && block.body.length > 0 ? (
                      <div className={`${fontClass} ${SIZE_SCALE[sizeKey].block} leading-relaxed text-[hsl(var(--foreground))] max-w-none`}>
                        <PortableText value={(block.body ?? []) as React.ComponentProps<typeof PortableText>["value"]} components={components} />
                      </div>
                    ) : (
                      <p className="text-[hsl(var(--muted-foreground))] text-sm">No text.</p>
                    )}
                  </div>
                );
                const imageTextBelowFontClass = layoutBlockFontClass(block.textBelow?.font);
                const imageTextBelowSizeKey = layoutBlockTextSizeClass(block.textBelow?.textSize);
                const imageTextBelowComponents = galleryLayoutBlockComponents(imageTextBelowSizeKey);
                const imageCell = (
                  <div className={`${imageOrderClass} min-w-0 space-y-2`}>
                    <figure className="space-y-2">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg sm:aspect-[3/2]">
                        <Image
                          src={block.src}
                          alt={block.alt}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      {block.caption && (
                        <figcaption className="text-center text-sm text-[hsl(var(--muted-foreground))]">
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                    {block.textBelow?.body && Array.isArray(block.textBelow.body) && block.textBelow.body.length > 0 && (
                      <div
                        className={`${imageTextBelowFontClass} ${SIZE_SCALE[imageTextBelowSizeKey].block} leading-relaxed text-[hsl(var(--foreground))] max-w-none`}
                      >
                        <PortableText
                          value={block.textBelow.body as React.ComponentProps<typeof PortableText>["value"]}
                          components={imageTextBelowComponents}
                        />
                      </div>
                    )}
                  </div>
                );
                return (
                  <div key={i} className="mx-auto w-full max-w-5xl">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 items-start">
                      {block.layout === "imageLeft" ? (
                        <>
                          {imageCell}
                          {textCell}
                        </>
                      ) : (
                        <>
                          {textCell}
                          {imageCell}
                        </>
                      )}
                    </div>
                  </div>
                );
              }
              if (block.type === "galleryLayoutBlockGrid") {
                const lgColsClass =
                  block.columns === 3 ? "lg:grid-cols-3" : block.columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-2";
                return (
                  <div key={i} className="mx-auto w-full max-w-6xl">
                    <div
                      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 items-start ${lgColsClass}`}
                    >
                      {block.items.map((cell: GalleryGridCell, j: number) => {
                        if (cell.type === "galleryGridCellText") {
                          const fontClass = layoutBlockFontClass(cell.font);
                          const sizeKey = layoutBlockTextSizeClass(cell.textSize);
                          const components = galleryLayoutBlockComponents(sizeKey);
                          return (
                            <div key={j} className="min-w-0">
                              {cell.body && Array.isArray(cell.body) && cell.body.length > 0 ? (
                                <div
                                  className={`${fontClass} ${SIZE_SCALE[sizeKey].block} leading-relaxed text-[hsl(var(--foreground))] max-w-none`}
                                >
                                  <PortableText
                                    value={(cell.body ?? []) as React.ComponentProps<typeof PortableText>["value"]}
                                    components={components}
                                  />
                                </div>
                              ) : (
                                <p className="text-[hsl(var(--muted-foreground))] text-sm">—</p>
                              )}
                            </div>
                          );
                        }
                        if (cell.type === "galleryGridCellImage" && cell.src) {
                          const cellTextBelowFontClass = layoutBlockFontClass(cell.textBelow?.font);
                          const cellTextBelowSizeKey = layoutBlockTextSizeClass(cell.textBelow?.textSize);
                          const cellTextBelowComponents = galleryLayoutBlockComponents(cellTextBelowSizeKey);
                          return (
                            <div key={j} className="min-w-0 space-y-2">
                              <figure className="space-y-2">
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg sm:aspect-[3/2]">
                                  <Image
                                    src={cell.src}
                                    alt={cell.alt}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  />
                                </div>
                                {cell.caption && (
                                  <figcaption className="text-center text-sm text-[hsl(var(--muted-foreground))]">
                                    {cell.caption}
                                  </figcaption>
                                )}
                              </figure>
                              {cell.textBelow?.body && Array.isArray(cell.textBelow.body) && cell.textBelow.body.length > 0 && (
                                <div
                                  className={`${cellTextBelowFontClass} ${SIZE_SCALE[cellTextBelowSizeKey].block} leading-relaxed text-[hsl(var(--foreground))] max-w-none`}
                                >
                                  <PortableText
                                    value={cell.textBelow.body as React.ComponentProps<typeof PortableText>["value"]}
                                    components={cellTextBelowComponents}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </section>
      )}

      {otherGalleries.length > 0 && (
        <section className="shrink-0 border-t border-[hsl(var(--border))] px-4 py-3 sm:px-6">
          <p className="text-[hsl(var(--muted-foreground))] text-xs">
            {otherGalleries.map((g, i) => (
              <span key={`${g.seriesSlug}-${g.slug}`}>
                {i > 0 && " · "}
                <Link
                  href={`/works/${g.seriesSlug}/${g.slug}`}
                  className="hover:text-[hsl(var(--foreground))] underline underline-offset-2"
                >
                  {g.title}
                </Link>
              </span>
            ))}
          </p>
        </section>
      )}
    </div>
  );
}
