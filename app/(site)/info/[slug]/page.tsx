import { notFound } from "next/navigation";
import { getInfoPageBySlug, getInfoPageSlugs } from "@/lib/sanity/data";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getInfoPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

const infoPageComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-sm leading-relaxed text-justify text-[hsl(var(--foreground))] mb-5 last:mb-0">
        {children}
      </p>
    ),
  },
};

export default async function InfoPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getInfoPageBySlug(slug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {slug !== "about" && slug !== "press" && (
        <h1 className="font-serif-editorial text-2xl font-normal tracking-wide text-[hsl(var(--foreground))] mb-6">
          {page.title}
        </h1>
      )}
      {page.body && Array.isArray(page.body) && (page.body as unknown[]).length > 0 ? (
        <div className="font-serif-editorial">
          <PortableText value={page.body as object} components={infoPageComponents} />
        </div>
      ) : (
        <p className="text-[hsl(var(--muted-foreground))] text-sm">No content yet.</p>
      )}
    </div>
  );
}
