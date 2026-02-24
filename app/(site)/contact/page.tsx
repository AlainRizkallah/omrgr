import type { Metadata } from "next";
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

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {contact?.body && Array.isArray(contact.body) && (contact.body as unknown[]).length > 0 ? (
        <div className="space-y-2">
          <PortableText value={contact.body as object} components={contactPageComponents} />
        </div>
      ) : (
        <p className="text-[hsl(var(--muted-foreground))] text-xs">Add contact content in Sanity Studio.</p>
      )}
    </div>
  );
}
