import type { Metadata } from "next";
import Image from "next/image";
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
  const isPress = slug === "press";
  const linkClass = isPress
    ? "text-[hsl(var(--foreground))] underline underline-offset-2 inline-block transition-[transform] duration-200 ease-out hover:scale-105 origin-left"
    : "text-[hsl(var(--foreground))] underline underline-offset-2 hover:no-underline";

  const linkProps = (value?: { href?: string; url?: string; blank?: boolean }) => {
    const href = value?.href ?? value?.url ?? "#";
    return {
      href,
      className: linkClass,
      target: value?.blank ? "_blank" as const : undefined,
      rel: value?.blank ? "noopener noreferrer" : undefined,
    };
  };

  const LinkMark = ({ value, children }: { value?: { href?: string; url?: string; blank?: boolean }; children?: React.ReactNode }) => (
    <a {...linkProps(value)}>{children}</a>
  );

  return {
    block: {
      normal: ({ children }) => (
        <p className={`text-xs leading-relaxed${justifyClass} text-[hsl(var(--foreground))] mb-5 last:mb-0`}>
          {children}
        </p>
      ),
    },
    marks: {
      link: LinkMark,
      externalLink: LinkMark,
    },
  };
}

export default async function InfoPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getInfoPageBySlug(slug);
  if (!page) notFound();

  const hasBody = page.body && Array.isArray(page.body) && (page.body as unknown[]).length > 0;
  const hasImage = page.image?.src;

  return (
    <div className={`mx-auto px-4 py-12 sm:px-6 ${hasImage ? "" : "max-w-2xl"}`}>
      {hasImage ? (
        <div className="-mx-4 w-[100vw] max-w-none sm:mx-auto sm:w-full sm:max-w-[2400px]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_2fr] md:gap-10 items-start">
            <div className="min-w-0 px-4 sm:px-0">
              {slug !== "about" && slug !== "press" && (
                <h1 className="text-xl font-normal tracking-wide text-[hsl(var(--foreground))] mb-6">
                  {page.title}
                </h1>
              )}
              {hasBody ? (
                <div>
                  <PortableText value={page.body as object} components={infoPageComponents(slug)} />
                </div>
              ) : (
                <p className="text-[hsl(var(--muted-foreground))] text-xs">No content yet.</p>
              )}
            </div>
            <div className="min-w-0 space-y-2 px-4 sm:px-0">
              <figure className="space-y-2">
                <div className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-[3/2]">
                  <Image
                    src={page.image.src}
                    alt={page.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1536px) 66vw, 1600px"
                    className="object-contain"
                  />
                </div>
              </figure>
            </div>
          </div>
        </div>
      ) : (
        <>
          {slug !== "about" && slug !== "press" && (
            <h1 className="text-xl font-normal tracking-wide text-[hsl(var(--foreground))] mb-6">
              {page.title}
            </h1>
          )}
          {hasBody ? (
            <div>
              <PortableText value={page.body as object} components={infoPageComponents(slug)} />
            </div>
          ) : (
            <p className="text-[hsl(var(--muted-foreground))] text-xs">No content yet.</p>
          )}
        </>
      )}
    </div>
  );
}
