"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "react-photo-album/styles.css";
import "yet-another-react-lightbox/styles.css";
import type { PhotoItem, GalleryLayoutBlock } from "@/lib/sanity/types";

type OtherGallery = { slug: string; title: string; seriesSlug: string };

interface WorksGalleryProps {
  title: string;
  seriesTitle: string;
  layoutBlocks?: GalleryLayoutBlock[];
  photos: PhotoItem[];
  otherGalleries: OtherGallery[];
}

export default function WorksGallery({ title, seriesTitle, layoutBlocks, photos, otherGalleries }: WorksGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const slides = photos.map((p) => ({ src: p.src, width: p.width, height: p.height, alt: p.alt }));
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
          {seriesTitle} — {title}
        </h1>
      </section>

      {/* Custom layout blocks (text and images) */}
      {hasLayoutBlocks && (
        <section className="shrink-0 border-b border-[hsl(var(--border))] px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-3xl space-y-8">
            {layoutBlocks!.map((block, i) => {
              if (block.type === "galleryLayoutBlockText" && block.body && Array.isArray(block.body) && block.body.length > 0) {
                return (
                  <div
                    key={i}
                    className="font-serif-editorial text-[15px] leading-relaxed text-[hsl(var(--foreground))] prose prose-p:mb-3 max-w-none"
                  >
                    <PortableText value={block.body as object} />
                  </div>
                );
              }
              if (block.type === "galleryLayoutBlockImage" && block.src) {
                return (
                  <figure key={i} className="space-y-2">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[hsl(var(--muted))] sm:aspect-[3/2]">
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
                );
              }
              return null;
            })}
          </div>
        </section>
      )}

      {/* All Media grid */}
      <section className="min-h-0 flex-1 overflow-auto px-2 py-4 sm:px-4">
        <div className="mx-auto max-w-7xl">
          {hasPhotos ? (
            <>
              <h2 className="mb-4 font-serif-editorial text-sm font-normal tracking-wide text-[hsl(var(--muted-foreground))] sm:mb-6">
                All Media
              </h2>
              <PhotoAlbum
            photos={photos}
            layout="masonry"
            columns={(w) => (w < 480 ? 2 : w < 768 ? 3 : w < 1024 ? 4 : w < 1280 ? 5 : 6)}
            spacing={8}
            padding={4}
            defaultContainerWidth={1280}
            breakpoints={[3840, 1920, 1280, 960, 640, 384]}
            onClick={({ index }) => setLightboxIndex(index)}
            render={{
              photo: ({ wrapperStyle }, { photo }) => {
                const p = photo as PhotoItem | undefined;
                if (!p?.src) return <div style={wrapperStyle} />;
                return (
                  <div
                    className="overflow-hidden rounded-lg"
                    style={{ ...wrapperStyle }}
                  >
                    <div
                      className="relative block h-full w-full cursor-pointer overflow-hidden rounded-lg"
                      role="button"
                      tabIndex={0}
                      onClick={() => setLightboxIndex(photos.indexOf(p))}
                      onKeyDown={(e) => e.key === "Enter" && setLightboxIndex(photos.indexOf(p))}
                    >
                      <Image
                        src={p.src}
                        alt={p.alt}
                        width={p.width}
                        height={p.height}
                        className="object-cover transition hover:scale-[1.02]"
                        style={{ width: "100%", height: "100%" }}
                        sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity hover:opacity-100 flex items-end p-2 pointer-events-none">
                        <span className="text-white text-xs truncate">{p.title}</span>
                      </div>
                    </div>
                  </div>
                );
              },
            }}
          />
            </>
          ) : (
            <>
              <h2 className="mb-4 font-serif-editorial text-sm font-normal tracking-wide text-[hsl(var(--muted-foreground))] sm:mb-6">
                All Media
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] text-sm">No images in this gallery yet. Add images in Sanity Studio.</p>
            </>
          )}
        </div>
      </section>

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

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        plugins={[Zoom]}
      />
    </div>
  );
}
