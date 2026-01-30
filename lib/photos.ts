/**
 * Photo and collection data from the Pictures folder.
 * Discovers images under public/Pictures (or ./Pictures) and exposes collections by slug.
 */

import { readdirSync, existsSync } from "fs";
import path from "path";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

/** Single image: URL, dimensions, and labels for grid/lightbox */
export interface PhotoItem {
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  collection: string;
}

/** One collection: slug, display title, cover image URL, and list of photos */
export interface CollectionInfo {
  slug: string;
  title: string;
  coverSrc: string;
  photos: PhotoItem[];
}

/** True if the file has a known image extension */
function isImage(filename: string): boolean {
  return IMAGE_EXT.has(path.extname(filename).toLowerCase());
}

/** Converts folder name to URL slug (e.g. "Interior Design" → "interior-design") */
function folderToSlug(folder: string): string {
  return folder
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Resolves Pictures directory (public/Pictures or ./Pictures) and public URL prefix */
function getPicturesDir(): { dir: string; publicPrefix: string } | null {
  const baseDirs = [
    path.join(process.cwd(), "public", "Pictures"),
    path.join(process.cwd(), "Pictures"),
  ];

  for (const dir of baseDirs) {
    if (existsSync(dir)) {
      return { dir, publicPrefix: "/Pictures" };
    }
  }
  return null;
}

/**
 * Get all collections (Chairs, Interior Design, Paintings) with cover image and photos.
 */
export function getCollections(): CollectionInfo[] {
  const result = getPicturesDir();
  if (!result) return [];

  const { dir: picturesDir, publicPrefix } = result;
  const subdirs = readdirSync(picturesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const collections: CollectionInfo[] = [];

  for (const folder of subdirs) {
    const folderPath = path.join(picturesDir, folder);
    let files: string[];
    try {
      files = readdirSync(folderPath).filter(isImage);
    } catch {
      continue;
    }
    if (files.length === 0) continue;

    const slug = folderToSlug(folder);
    const encodedFolder = folder.split("/").map(encodeURIComponent).join("/");
    const photos: PhotoItem[] = files.map((file) => {
      const title = path.basename(file, path.extname(file));
      const src = `${publicPrefix}/${encodedFolder}/${encodeURIComponent(file)}`;
      return {
        src,
        width: 1200,
        height: 800,
        alt: title,
        title,
        collection: folder,
      };
    });

    const firstFile = files[0];
    const coverSrc = `${publicPrefix}/${encodedFolder}/${encodeURIComponent(firstFile)}`;

    collections.push({
      slug,
      title: folder,
      coverSrc,
      photos,
    });
  }

  // Order: Chairs (1st), Paintings (2nd), Interior Design (3rd)
  const displayOrder = ["chairs", "paintings", "interior-design"];
  collections.sort(
    (a, b) =>
      displayOrder.indexOf(a.slug) - displayOrder.indexOf(b.slug) ||
      a.slug.localeCompare(b.slug)
  );

  return collections;
}

/**
 * Get photos for a single collection by slug.
 */
export function getPhotosByCollection(slug: string): PhotoItem[] {
  const collections = getCollections();
  const collection = collections.find((c) => c.slug === slug);
  return collection?.photos ?? [];
}

/**
 * Get all photos (flat) for backward compatibility.
 */
export function getPhotos(): PhotoItem[] {
  return getCollections().flatMap((c) => c.photos);
}
