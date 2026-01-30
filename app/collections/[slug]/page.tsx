/**
 * Collection page: one collection by slug. Renders title, mosaic grid, and links to other collections; 404 if slug invalid or empty.
 */
import { notFound } from "next/navigation";
import { getCollections } from "@/lib/photos";
import CollectionGallery from "@/components/collection-gallery";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-render paths for all collection slugs (chairs, paintings, interior-design). */
export async function generateStaticParams() {
  const collections = getCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collections = getCollections();
  const collection = collections.find((c) => c.slug === slug);

  if (!collection || collection.photos.length === 0) {
    notFound();
  }

  const otherCollections = collections
    .filter((c) => c.slug !== slug)
    .map((c) => ({ slug: c.slug, title: c.title }));

  return (
    <div className="flex min-h-full flex-1 flex-col w-full">
      <CollectionGallery
        title={collection.title}
        photos={collection.photos}
        otherCollections={otherCollections}
      />
    </div>
  );
}
