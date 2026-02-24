import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInfoPageBySlug, getInfoPageSlugs } from "@/lib/sanity/data";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

function textFromPortableBody(body: unknown): string {
  if (!Array.isArray(body) || body.length === 0) return "";
  const block = body[0] as { children?: Array<{ text?: string }> };
  const text = (block.children || []).map((c) => c.text ?? "").join("").trim();
  return text.slice(0, 150);
}

export async function generateStaticParams() {
  const slugs = await getInfoPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getInfoPageBySlug(slug);
  if (!page) return {};
  const title = `${page.title} | OMRGR`;
  const fromBody = textFromPortableBody(page.body);
  const description = fromBody
    ? `${fromBody}${fromBody.length >= 150 ? "…" : ""}`
    : `OMRGR — ${page.title}. About the studio.`;
  return { title, description };
}

function infoPageComponents(slug: string): PortableTextComponents {
  const justifyClass = slug === "about" ? "" : " text-justify";
  return {
    block: {
      normal: ({ children }) => (
        <p className={`text-xs leading-relaxed${justifyClass} text-[hsl(var(--foreground))] mb-5 last:mb-0`}>
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
        <h1 className="text-xl font-normal tracking-wide text-[hsl(var(--foreground))] mb-6">
          {page.title}
        </h1>
      )}
      {page.body && Array.isArray(page.body) && (page.body as unknown[]).length > 0 ? (
        <div>
          <PortableText value={page.body as object} components={infoPageComponents(slug)} />
        </div>
      ) : (
        <p className="text-[hsl(var(--muted-foreground))] text-xs">No content yet.</p>
      )}
    </div>
  );
}
