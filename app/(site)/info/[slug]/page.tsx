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

function infoPageComponents(slug: string): PortableTextComponents {
  const justifyClass = slug === "about" ? "" : " text-justify";
  return {
    block: {
      normal: ({ children }) => (
        <p className={`font-eczar text-xs leading-relaxed${justifyClass} text-[hsl(var(--foreground))] mb-5 last:mb-0`}>
          {children}
        </p>
      ),
    },
  };
}

export default async function InfoPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getInfoPageBySlug(slug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {slug !== "about" && slug !== "press" && (
        <h1 className="font-eczar text-xl font-normal tracking-wide text-[hsl(var(--foreground))] mb-6">
          {page.title}
        </h1>
      )}
      {page.body && Array.isArray(page.body) && (page.body as unknown[]).length > 0 ? (
        <div className="font-eczar">
          <PortableText value={page.body as object} components={infoPageComponents(slug)} />
        </div>
      ) : (
        <p className="font-eczar text-[hsl(var(--muted-foreground))] text-xs">No content yet.</p>
      )}
    </div>
  );
}
