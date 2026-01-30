"use client";

/**
 * Collection page content: thin title bar, full-page masonry grid, thin footer with other collections, and lightbox on photo click.
 */

import { useState } from "react";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import PhotoGrid from "@/components/photo-grid";
import type { PhotoItem } from "@/lib/photos";

type Slide = { src: string; width: number; height: number; alt: string };

type OtherCollection = { slug: string; title: string };

/**
 * Renders a single collection: title, photo mosaic (with lightbox), and links to other collections.
 */
export default function CollectionGallery({
  title,
  photos,
  otherCollections = [],
}: {
  title: string;
  photos: PhotoItem[];
  otherCollections?: OtherCollection[];
}) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const slides: Slide[] = photos.map((p) => ({
    src: p.src,
    width: p.width,
    height: p.height,
    alt: p.alt,
  }));

  return (
    <div className="flex min-h-full flex-1 flex-col w-full">
      {/* Thin title bar */}
      <section className="shrink-0 border-b border-border/40 bg-background px-2 py-1 sm:px-3">
        <h1 className="font-serif text-sm font-normal tracking-wide text-foreground sm:text-base">
          {title}
        </h1>
      </section>

      {/* Mosaic: full page (X100 urban-portraits style), photos have rounded corners */}
      <section className="min-h-0 flex-1 overflow-hidden px-1 py-1 sm:px-2 sm:py-2">
        <PhotoGrid
          photos={photos}
          compact
          fillHeight
          onPhotoClick={(index) => setLightboxIndex(index)}
        />
      </section>

      {/* Thin footer: other collections */}
      {otherCollections.length > 0 && (
        <section className="shrink-0 border-t border-border/40 bg-background px-2 py-1 sm:px-3">
          <p className="text-muted-foreground text-xs">
            {otherCollections.map((c, i) => (
              <span key={c.slug}>
                {i > 0 && " · "}
                <Link
                  href={`/collections/${c.slug}`}
                  className="hover:text-foreground underline underline-offset-2 transition-colors"
                >
                  {c.title}
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
