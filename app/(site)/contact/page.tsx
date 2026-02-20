import { getContact } from "@/lib/sanity/data";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

export const revalidate = 60;

const contactPageComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-eczar text-xs leading-relaxed text-justify text-[hsl(var(--foreground))] mb-5 last:mb-0">
        {children}
      </p>
    ),
  },
};

export default async function ContactPage() {
  const contact = await getContact();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {contact?.body && Array.isArray(contact.body) && (contact.body as unknown[]).length > 0 ? (
        <div className="font-eczar">
          <PortableText value={contact.body as object} components={contactPageComponents} />
        </div>
      ) : (
        <p className="font-eczar text-[hsl(var(--muted-foreground))] text-xs">Add contact content in Sanity Studio.</p>
      )}
    </div>
  );
}
