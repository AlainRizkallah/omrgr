"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "react-photo-album/styles.css";
import "yet-another-react-lightbox/styles.css";
import type { PhotoItem } from "@/lib/sanity/types";

type OtherGallery = { slug: string; title: string; seriesSlug: string };

interface WorksGalleryProps {
  title: string;
  seriesTitle: string;
  photos: PhotoItem[];
  otherGalleries: OtherGallery[];
}

export default function WorksGallery({ title, seriesTitle, photos, otherGalleries }: WorksGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const slides = photos.map((p) => ({ src: p.src, width: p.width, height: p.height, alt: p.alt }));

  if (photos.length === 0) {
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

      <section className="min-h-0 flex-1 overflow-auto px-2 py-4 sm:px-4">
        <div className="mx-auto max-w-7xl">
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
              photo: ({ imageProps: { src, alt, ...rest }, wrapperStyle }, { photo }) => {
                const p = photo as PhotoItem;
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
