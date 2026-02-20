"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PhotoItem, GalleryLayoutBlock, GalleryGridCell } from "@/lib/sanity/types";

/** Tiny gray image used as skeleton (scaled + blurred while loading). Commented out with skeleton.
const BLUR_DATA_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgdmlld0JveD0iMCAwIDEwIDEwIj48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNlNWU3ZWIiLz48L3N2Zz4=";
*/

function GalleryImage({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {/* Loading skeleton (commented out; may re-enable later)
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 ${loaded ? "opacity-0" : "opacity-100"}`}
        style={{ backgroundImage: `url(${BLUR_DATA_URL})`, filter: "blur(12px)" }}
        aria-hidden
      />
      */}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={`object-contain transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}

/** Tailwind classes for layout block font (matches Sanity options) */
function layoutBlockFontClass(font?: string): string {
  switch (font) {
    case "sans":
      return "font-sans";
    case "eczar":
      return "font-eczar";
    case "hal-timezone":
      return "font-hal-timezone";
    default:
      return "font-serif-editorial";
  }
}

/** Tailwind text size scale for layout blocks (matches Sanity textSize) */
const SIZE_SCALE = {
  xs: { block: "text-xs", h1: "text-lg", h2: "text-base", h3: "text-sm", h4: "text-xs", blockquote: "text-xs border-l-2 border-muted-foreground/30 pl-4 italic" },
  sm: { block: "text-sm", h1: "text-xl", h2: "text-lg", h3: "text-base", h4: "text-sm", blockquote: "text-sm border-l-2 border-muted-foreground/30 pl-4 italic" },
  base: { block: "text-base", h1: "text-2xl", h2: "text-xl", h3: "text-lg", h4: "text-base", blockquote: "text-base border-l-2 border-muted-foreground/30 pl-4 italic" },
  lg: { block: "text-lg", h1: "text-3xl", h2: "text-2xl", h3: "text-xl", h4: "text-lg", blockquote: "text-lg border-l-2 border-muted-foreground/30 pl-4 italic" },
} as const;

function layoutBlockTextSizeClass(textSize?: string): keyof typeof SIZE_SCALE {
  if (textSize === "sm" || textSize === "lg" || textSize === "xs") return textSize;
  return "base";
}

/** One step smaller for text inside Text+Image blocks (row, grid, image+textBelow) */
function smallerSizeForTextImageBlock(sizeKey: keyof typeof SIZE_SCALE): keyof typeof SIZE_SCALE {
  if (sizeKey === "lg") return "base";
  if (sizeKey === "base") return "sm";
  return "xs"; // sm -> xs
}

/** PortableText components for gallery layout blocks: proper block styles and marks so output matches Sanity Studio hierarchy and formatting. */
function galleryLayoutBlockComponents(textSize: keyof typeof SIZE_SCALE, options?: { justify?: boolean }): PortableTextComponents {
  const scale = SIZE_SCALE[textSize];
  const justifyClass = options?.justify !== false ? " text-justify" : "";
  return {
    block: {
      normal: ({ children }: { children?: React.ReactNode }) => <p className={`${scale.block} mb-3 last:mb-0${justifyClass}`}>{children}</p>,
      h1: ({ children }: { children?: React.ReactNode }) => <h2 className={`${scale.h1} font-semibold tracking-tight mt-6 mb-2 first:mt-0`}>{children}</h2>,
      h2: ({ children }: { children?: React.ReactNode }) => <h3 className={`${scale.h2} font-semibold tracking-tight mt-5 mb-2 first:mt-0`}>{children}</h3>,
      h3: ({ children }: { children?: React.ReactNode }) => <h4 className={`${scale.h3} font-semibold mt-4 mb-1 first:mt-0`}>{children}</h4>,
      h4: ({ children }: { children?: React.ReactNode }) => <h5 className={`${scale.h4} font-semibold mt-3 mb-1 first:mt-0`}>{children}</h5>,
      blockquote: ({ children }: { children?: React.ReactNode }) => <blockquote className={`${scale.blockquote} my-3`}>{children}</blockquote>,
    },
    list: {
      bullet: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc pl-6 space-y-1 mb-3">{children}</ul>,
      number: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal pl-6 space-y-1 mb-3">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }: { children?: React.ReactNode }) => <li className={scale.block}>{children}</li>,
      number: ({ children }: { children?: React.ReactNode }) => <li className={scale.block}>{children}</li>,
    },
    marks: {
      strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }: { children?: React.ReactNode }) => <em>{children}</em>,
      link: ({ value, children }: { value?: { href?: string; blank?: boolean }; children?: React.ReactNode }) => (
        <a href={value?.href} className="text-[hsl(var(--foreground))] underline underline-offset-2 hover:no-underline" target={value?.blank ? "_blank" : undefined} rel={value?.blank ? "noopener noreferrer" : undefined}>
          {children}
        </a>
      ),
      code: ({ children }: { children?: React.ReactNode }) => <code className="font-mono text-[0.9em] bg-muted px-1.5 py-0.5 rounded">{children}</code>,
    },
  };
}

interface WorksGalleryProps {
  title: string;
  seriesTitle: string;
  /** When true, do not show series name in the page title (e.g. single-gallery series). */
  hideSeriesInTitle?: boolean;
  layoutBlocks?: GalleryLayoutBlock[];
  photos: PhotoItem[];
}

export default function WorksGallery({ title, seriesTitle, hideSeriesInTitle, layoutBlocks, photos }: WorksGalleryProps) {
  const blocks = layoutBlocks ?? [];
  const hasLayoutBlocks = blocks.length > 0;
  const hasPhotos = photos.length > 0;
  const firstImagePriorityRef = useRef(true);
  const getPriority = () => {
    const p = firstImagePriorityRef.current;
    firstImagePriorityRef.current = false;
    return p;
  };

  if (!hasLayoutBlocks && !hasPhotos) {
    return (
      <div className="mt-0 sm:mt-12 flex min-h-[50vh] flex-col items-center justify-center px-4">
        <p className="text-[hsl(var(--muted-foreground))] text-sm">No content in this gallery yet.</p>
        <p className="mt-2 text-[hsl(var(--muted-foreground))] text-xs">Add layout blocks or images in Sanity Studio.</p>
      </div>
    );
  }

  return (
    <div className="mt-0 sm:mt-12 flex min-h-full flex-1 flex-col">
      {/* Custom layout blocks (text and images) */}
      {hasLayoutBlocks && (
        <section className="shrink-0 overflow-x-hidden px-4 py-6 sm:px-6">
          <div className="mx-auto space-y-32">
            {blocks.map((block, i) => {
              if (block.type === "galleryLayoutBlockText" && block.body && Array.isArray(block.body) && block.body.length > 0) {
                const fontClass = layoutBlockFontClass(block.font);
                const sizeKey = layoutBlockTextSizeClass(block.textSize);
                const components = galleryLayoutBlockComponents(sizeKey);
                return (
                  <div key={i} className="mx-auto max-w-6xl px-10 sm:px-16 md:px-24">
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
                const textBelowSizeKeySmall = smallerSizeForTextImageBlock(textBelowSizeKey);
                const textBelowComponents = galleryLayoutBlockComponents(textBelowSizeKeySmall, { justify: false });
                return (
                  <div key={i} className="-mx-4 w-[100vw] max-w-none space-y-2 px-4 sm:px-0 sm:mx-auto sm:w-full sm:max-w-[1536px]">
                  <figure className="space-y-2">
                    <div className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-[3/2]">
                      <GalleryImage
                        src={block.src}
                        alt={block.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1536px"
                        priority={getPriority()}
                      />
                    </div>
                    {block.caption && (
                      <figcaption className="px-4 text-center text-xs text-[hsl(var(--muted-foreground))] sm:px-0">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                    {block.textBelow?.body && Array.isArray(block.textBelow.body) && block.textBelow.body.length > 0 ? (
                      <div
                        className={`px-4 sm:px-0 ${textBelowFontClass} ${SIZE_SCALE[textBelowSizeKeySmall].block} leading-relaxed text-[hsl(var(--foreground))] max-w-none`}
                      >
                        <PortableText
                          value={block.textBelow.body as React.ComponentProps<typeof PortableText>["value"]}
                          components={textBelowComponents}
                        />
                      </div>
                    ) : null}
                  </div>
                );
              }
              if (block.type === "galleryLayoutBlockRow" && block.src) {
                const fontClass = layoutBlockFontClass(block.font);
                const sizeKey = layoutBlockTextSizeClass(block.textSize);
                const sizeKeySmall = smallerSizeForTextImageBlock(sizeKey);
                const components = galleryLayoutBlockComponents(sizeKeySmall, { justify: false });
                const mobileOrder = block.mobileOrder ?? "textFirst";
                const textOrderClass = mobileOrder === "imageFirst" ? "order-2 md:order-none" : "order-1 md:order-none";
                const imageOrderClass = mobileOrder === "imageFirst" ? "order-1 md:order-none" : "order-2 md:order-none";
                const textCell = (
                  <div className={`${textOrderClass} min-w-0 px-4 sm:px-0`}>
                    {block.body && Array.isArray(block.body) && block.body.length > 0 ? (
                      <div className={`${fontClass} ${SIZE_SCALE[sizeKeySmall].block} leading-relaxed text-[hsl(var(--foreground))] max-w-none`}>
                        <PortableText value={(block.body ?? []) as React.ComponentProps<typeof PortableText>["value"]} components={components} />
                      </div>
                    ) : (
                      <p className="text-[hsl(var(--muted-foreground))] text-sm">No text.</p>
                    )}
                  </div>
                );
                const imageTextBelowFontClass = layoutBlockFontClass(block.textBelow?.font);
                const imageTextBelowSizeKey = layoutBlockTextSizeClass(block.textBelow?.textSize);
                const imageTextBelowSizeKeySmall = smallerSizeForTextImageBlock(imageTextBelowSizeKey);
                const imageTextBelowComponents = galleryLayoutBlockComponents(imageTextBelowSizeKeySmall, { justify: false });
                const imageCell = (
                  <div className={`${imageOrderClass} min-w-0 space-y-2 px-4 sm:px-0`}>
                    <figure className="space-y-2">
                      <div className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-[3/2]">
                        <GalleryImage
                          src={block.src}
                          alt={block.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1536px) 66vw, 1600px"
                          priority={getPriority()}
                        />
                      </div>
                      {block.caption && (
                        <figcaption className="px-4 text-center text-xs text-[hsl(var(--muted-foreground))] sm:px-0">
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                    {block.textBelow?.body && Array.isArray(block.textBelow.body) && block.textBelow.body.length > 0 ? (
                      <div
                        className={`px-4 sm:px-0 ${imageTextBelowFontClass} ${SIZE_SCALE[imageTextBelowSizeKeySmall].block} leading-relaxed text-[hsl(var(--foreground))] max-w-none`}
                      >
                        <PortableText
                          value={block.textBelow.body as React.ComponentProps<typeof PortableText>["value"]}
                          components={imageTextBelowComponents}
                        />
                      </div>
                    ) : null}
                  </div>
                );
                return (
                  <div key={i} className="-mx-4 w-[100vw] max-w-none sm:mx-auto sm:w-full sm:max-w-[2400px]">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_2fr] md:gap-10 items-start">
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
                  <div key={i} className="-mx-4 w-[100vw] max-w-none sm:mx-auto sm:w-full sm:max-w-[2304px]">
                    <div
                      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 items-start ${lgColsClass}`}
                    >
                      {block.items.map((cell: GalleryGridCell, j: number) => {
                        if (cell.type === "galleryGridCellText") {
                          const fontClass = layoutBlockFontClass(cell.font);
                          const sizeKey = layoutBlockTextSizeClass(cell.textSize);
                          const sizeKeySmall = smallerSizeForTextImageBlock(sizeKey);
                          const components = galleryLayoutBlockComponents(sizeKeySmall, { justify: false });
                          return (
                            <div key={j} className="min-w-0 px-4 sm:px-0">
                              {cell.body && Array.isArray(cell.body) && cell.body.length > 0 ? (
                                <div
                                  className={`${fontClass} ${SIZE_SCALE[sizeKeySmall].block} leading-relaxed text-[hsl(var(--foreground))] max-w-none`}
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
                          const cellTextBelowSizeKeySmall = smallerSizeForTextImageBlock(cellTextBelowSizeKey);
                          const cellTextBelowComponents = galleryLayoutBlockComponents(cellTextBelowSizeKeySmall, { justify: false });
                          return (
                            <div key={j} className="min-w-0 space-y-2 px-4 sm:px-0">
                              <figure className="space-y-2">
                                <div className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-[3/2]">
                                  <GalleryImage
                                    src={cell.src}
                                    alt={cell.alt}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 1152px"
                                    priority={getPriority()}
                                  />
                                </div>
                                {cell.caption && (
                                  <figcaption className="px-4 text-center text-xs text-[hsl(var(--muted-foreground))] sm:px-0">
                                    {cell.caption}
                                  </figcaption>
                                )}
                              </figure>
                              {cell.textBelow?.body && Array.isArray(cell.textBelow.body) && cell.textBelow.body.length > 0 ? (
                                <div
                                  className={`px-4 sm:px-0 ${cellTextBelowFontClass} ${SIZE_SCALE[cellTextBelowSizeKeySmall].block} leading-relaxed text-[hsl(var(--foreground))] max-w-none`}
                                >
                                  <PortableText
                                    value={cell.textBelow.body as React.ComponentProps<typeof PortableText>["value"]}
                                    components={cellTextBelowComponents}
                                  />
                                </div>
                              ) : null}
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
    </div>
  );
}
