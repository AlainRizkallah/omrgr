import { notFound } from "next/navigation";
import { getGalleryBySlugs, getSeriesList } from "@/lib/sanity/data";
import WorksGallery from "@/components/WorksGallery";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ seriesSlug: string; gallerySlug: string }>;
}

export async function generateStaticParams() {
  const seriesList = await getSeriesList();
  const params: { seriesSlug: string; gallerySlug: string }[] = [];
  for (const s of seriesList) {
    for (const g of s.galleries || []) {
      params.push({ seriesSlug: s.slug, gallerySlug: g.slug });
    }
  }
  return params;
}

export default async function WorksGalleryPage({ params }: PageProps) {
  const { seriesSlug, gallerySlug } = await params;
  const gallery = await getGalleryBySlugs(seriesSlug, gallerySlug);
  if (!gallery) notFound();

  return (
    <div className="flex min-h-full flex-1 flex-col w-full">
      <WorksGallery
        title={gallery.title}
        seriesTitle={gallery.seriesTitle}
        layoutBlocks={gallery.layoutBlocks}
        photos={gallery.photos}
        otherGalleries={gallery.otherGalleries}
      />
    </div>
  );
}
