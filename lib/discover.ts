import fs from "fs";
import path from "path";

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
const PUBLIC_DIR = path.join(process.cwd(), "public");

function getImageFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function slugToTitle(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export type DiscoveredCategory = {
  slug: string;
  title: string;
  cover: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export type ImageItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type DiscoveredWork = {
  slug: string;
  title: string;
  year?: string;
  category: string;
  gallery: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }[];
  caption?: string;
};

type ProjectMeta = {
  title?: string;
  year?: string;
  caption?: string;
};

function readProjectMeta(projectDir: string): ProjectMeta | null {
  const metaPath = path.join(projectDir, "project.json");
  if (!fs.existsSync(metaPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(metaPath, "utf-8")) as ProjectMeta;
  } catch {
    return null;
  }
}

export function discoverCategories(): DiscoveredCategory[] {
  const categoriesDir = path.join(PUBLIC_DIR, "categories");
  if (!fs.existsSync(categoriesDir)) return [];

  const slugs = ["design", "chairs", "paintings"];
  const titles: Record<string, string> = {
    design: "Design",
    chairs: "Chairs",
    paintings: "Paintings",
  };

  return slugs
    .map((slug) => {
      const files = getImageFiles(categoriesDir);
      const coverFile = files.find(
        (f) =>
          path.basename(f, path.extname(f)).toLowerCase() === slug.toLowerCase()
      ) ?? files.find((f) => f.toLowerCase().startsWith(slug));
      if (!coverFile) return null;
      return {
        slug,
        title: titles[slug] ?? slugToTitle(slug),
        cover: {
          src: `/categories/${coverFile}`,
          alt: titles[slug] ?? slug,
          width: 2400,
          height: 1600,
        },
      };
    })
    .filter((c): c is DiscoveredCategory => c !== null);
}

export function discoverWorks(): DiscoveredWork[] {
  const workDir = path.join(PUBLIC_DIR, "work");
  if (!fs.existsSync(workDir)) return [];

  const works: DiscoveredWork[] = [];
  const categoryDirs = fs.readdirSync(workDir, { withFileTypes: true });

  for (const catDir of categoryDirs) {
    if (!catDir.isDirectory()) continue;
    const category = catDir.name;
    const categoryPath = path.join(workDir, category);
    const projectDirs = fs.readdirSync(categoryPath, { withFileTypes: true });

    for (const projDir of projectDirs) {
      if (!projDir.isDirectory()) continue;
      const slug = projDir.name;
      const projectPath = path.join(categoryPath, slug);
      const imageFiles = getImageFiles(projectPath);
      if (imageFiles.length === 0) continue;

      const meta = readProjectMeta(projectPath);
      const gallery = imageFiles.map((file, i) => ({
        src: `/work/${category}/${slug}/${encodeURIComponent(file)}`,
        alt: meta?.title
          ? `${meta.title} - Image ${i + 1}`
          : `${slugToTitle(slug)} - Image ${i + 1}`,
        width: 2400,
        height: 1600,
      }));

      works.push({
        slug,
        title: meta?.title ?? slugToTitle(slug),
        year: meta?.year,
        category,
        gallery,
        caption: meta?.caption,
      });
    }
  }

  return works;
}

export function discoverImagesByCategory(categorySlug: string): ImageItem[] {
  const workDir = path.join(PUBLIC_DIR, "work");
  if (!fs.existsSync(workDir)) return [];

  const categoryPath = path.join(workDir, categorySlug);
  if (!fs.existsSync(categoryPath) || !fs.statSync(categoryPath).isDirectory()) {
    return [];
  }

  const items: ImageItem[] = [];
  const projectDirs = fs.readdirSync(categoryPath, { withFileTypes: true }).sort();

  for (const projDir of projectDirs) {
    if (!projDir.isDirectory()) continue;
    const projectPath = path.join(categoryPath, projDir.name);
    const imageFiles = getImageFiles(projectPath);
    const meta = readProjectMeta(projectPath);

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      items.push({
        src: `/work/${categorySlug}/${projDir.name}/${encodeURIComponent(file)}`,
        alt: meta?.title
          ? `${meta.title} - Image ${i + 1}`
          : `${slugToTitle(projDir.name)} - Image ${i + 1}`,
        width: 2400,
        height: 1600,
      });
    }
  }

  return items;
}
