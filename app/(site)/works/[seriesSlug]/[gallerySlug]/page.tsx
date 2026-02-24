import type { Metadata } from "next";
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { seriesSlug, gallerySlug } = await params;
  const gallery = await getGalleryBySlugs(seriesSlug, gallerySlug);
  if (!gallery) return { title: "Works" };
  const title = gallery.isSingleGalleryInSeries ? gallery.title : `${gallery.seriesTitle} — ${gallery.title}`;
  const description = `OMRGR — ${gallery.seriesTitle}: ${gallery.title}. Portfolio gallery.`;
  const firstImage = gallery.photos?.[0]?.src;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(firstImage && { images: [{ url: firstImage, width: 1200, height: 630, alt: gallery.title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(firstImage && { images: [firstImage] }),
    },
  };
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
        hideSeriesInTitle={gallery.isSingleGalleryInSeries}
        layoutBlocks={gallery.layoutBlocks}
        photos={gallery.photos}
      />
    </div>
  );
}
