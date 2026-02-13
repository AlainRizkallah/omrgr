import { getContact } from "@/lib/sanity/data";
import { PortableText } from "@portabletext/react";

export const revalidate = 60;

export default async function ContactPage() {
  const contact = await getContact();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-serif-editorial text-2xl font-normal tracking-wide text-[hsl(var(--foreground))] mb-6">
        Contact
      </h1>
      {contact?.body && Array.isArray(contact.body) && (contact.body as unknown[]).length > 0 ? (
        <div className="prose prose-neutral font-serif-editorial text-[15px] leading-relaxed">
          <PortableText value={contact.body as object} />
        </div>
      ) : (
        <p className="text-[hsl(var(--muted-foreground))] text-sm">Add contact content in Sanity Studio.</p>
      )}
    </div>
  );
}
