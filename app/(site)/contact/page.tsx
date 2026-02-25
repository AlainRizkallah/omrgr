import type { Metadata } from "next";
import Image from "next/image";
import { getContact } from "@/lib/sanity/data";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact OMRGR. Get in touch for collaborations and inquiries.",
};

const contactBlockClass =
  "text-xs leading-relaxed text-justify text-[hsl(var(--foreground))]";

function isEmptyBlock(value: { children?: Array<{ text?: string }> } | undefined): boolean {
  if (!value?.children?.length) return true;
  return value.children.every((c) => !c.text?.trim());
}

const contactPageComponents: PortableTextComponents = {
  block: {
    normal: ({ children, value }) => {
      if (isEmptyBlock(value as { children?: Array<{ text?: string }> })) {
        return <p className={`${contactBlockClass} h-4 min-h-4`} aria-hidden />;
      }
      return <p className={contactBlockClass}>{children}</p>;
    },
    unknownBlockStyle: ({ children, value }) => {
      if (isEmptyBlock(value as { children?: Array<{ text?: string }> })) {
        return <p className={`${contactBlockClass} h-4 min-h-4`} aria-hidden />;
      }
      return <p className={contactBlockClass}>{children}</p>;
    },
  },
};

export default async function ContactPage() {
  const contact = await getContact();
  const hasBody = contact?.body && Array.isArray(contact.body) && (contact.body as unknown[]).length > 0;
  const hasImage = contact?.image?.src;

  return (
    <div className={`mx-auto px-4 py-12 sm:px-6 ${hasImage ? "" : "max-w-2xl"}`}>
      {hasImage ? (
        <div className="-mx-4 w-[100vw] max-w-none sm:mx-auto sm:w-full sm:max-w-[2400px] lg:max-w-5xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_minmax(0,28rem)] md:gap-10 items-start">
            <div className="min-w-0 px-4 sm:px-0 lg:max-w-2xl lg:mx-auto lg:flex lg:flex-col lg:items-center">
              {hasBody ? (
                <div className="w-full space-y-2">
                  <PortableText value={contact.body as object} components={contactPageComponents} />
                </div>
              ) : (
                <p className="text-[hsl(var(--muted-foreground))] text-xs">Add contact content in Sanity Studio.</p>
              )}
            </div>
            <div className="min-w-0 px-4 sm:px-0 lg:flex lg:justify-center">
              <figure>
                <Image
                  src={contact.image.src}
                  alt={contact.image.alt}
                  width={contact.image.width ?? 800}
                  height={contact.image.height ?? 600}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 28rem"
                />
              </figure>
            </div>
          </div>
        </div>
      ) : (
        <>
          {hasBody ? (
            <div className="space-y-2">
              <PortableText value={contact!.body as object} components={contactPageComponents} />
            </div>
          ) : (
            <p className="text-[hsl(var(--muted-foreground))] text-xs">Add contact content in Sanity Studio.</p>
          )}
        </>
      )}
    </div>
  );
}
