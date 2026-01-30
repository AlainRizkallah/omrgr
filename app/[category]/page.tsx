import { notFound } from "next/navigation";
import { getCategories, getCategoryImages } from "@/lib/content";
import MosaicGrid from "@/components/MosaicGrid";

type Props = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const categories = getCategories();
  const validSlug = categories.some((c) => c.slug === categorySlug);
  if (!validSlug) notFound();

  const images = getCategoryImages(categorySlug);
  const items = images.map((img) => ({
    src: img.src,
    alt: img.alt,
    width: img.width,
    height: img.height,
    label: img.alt,
  }));

  return <MosaicGrid items={items} />;
}
