"use client";

/**
 * Masonry photo grid using react-photo-album. Used on collection pages and supports lightbox via onPhotoClick.
 */

import Image from "next/image";
import PhotoAlbum from "react-photo-album";

type PhotoItem = {
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  collection: string;
};

type ExtendedPhoto = PhotoItem;

/**
 * Renders a responsive masonry grid. compact = more columns (smaller tiles); fillHeight = fill container; onPhotoClick opens lightbox.
 */
export default function PhotoGrid({
  photos,
  compact = false,
  onPhotoClick,
  fillHeight = false,
}: {
  photos: PhotoItem[];
  /** More columns = smaller tiles (for collection page) */
  compact?: boolean;
  /** Called with photo index when a photo is clicked (e.g. open lightbox) */
  onPhotoClick?: (index: number) => void;
  /** Fill container height (for collection page mosaic) */
  fillHeight?: boolean;
}) {
  /* Collection page: fewer columns = larger tiles */
  const columns = compact
    ? (w: number) => (w < 480 ? 2 : w < 768 ? 3 : w < 1024 ? 4 : w < 1280 ? 5 : 6)
    : (w: number) => (w < 480 ? 2 : w < 768 ? 3 : w < 1024 ? 4 : 5);

  return (
    <div
      className={`w-full p-1 sm:p-2 box-border ${fillHeight ? "h-full min-h-0 overflow-auto" : "min-h-screen"}`}
      style={{ minWidth: 0 }}
    >
      <PhotoAlbum
        photos={photos}
        layout="masonry"
        columns={columns}
        spacing={0}
        padding={1}
        defaultContainerWidth={1280}
        breakpoints={[3840, 1920, 1280, 960, 640, 384]}
        onClick={onPhotoClick ? ({ index }) => onPhotoClick(index) : undefined}
        render={{
          photo: ({ onClick }, { photo, width, height }) => {
            const p = photo as ExtendedPhoto;
            return (
              <div
                className="relative group block w-full h-full overflow-hidden rounded-[20px] cursor-pointer"
                onClick={onClick}
                role={onClick ? "button" : undefined}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={width}
                  height={height}
                  className="react-photo-album--photo"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
                <div
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-start p-2 pointer-events-none"
                  aria-hidden
                >
                  <span className="text-white text-xs sm:text-sm font-medium truncate max-w-full">
                    {p.collection} — {p.title}
                  </span>
                </div>
              </div>
            );
          },
        }}
      />
    </div>
  );
}
