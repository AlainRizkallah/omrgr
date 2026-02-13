import Link from "next/link";

type GalleryItem = { slug: string; title: string; seriesSlug: string };
type SeriesItem = { slug: string; title: string; galleries: GalleryItem[] };

interface FooterProps {
  seriesList: SeriesItem[];
}

export default function Footer({ seriesList }: FooterProps) {
  const links: { href: string; label: string }[] = [];
  seriesList.forEach((s) => {
    (s.galleries || []).forEach((g) => {
      links.push({ href: `/works/${s.slug}/${g.slug}`, label: `${s.title} — ${g.title}` });
    });
  });

  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 sm:px-6">
      <p className="text-[hsl(var(--muted-foreground))] text-xs">
        {links.length > 0 ? (
          links.map((l, i) => (
            <span key={l.href}>
              {i > 0 && " · "}
              <Link href={l.href} className="hover:text-[hsl(var(--foreground))] underline underline-offset-2">
                {l.label}
              </Link>
            </span>
          ))
        ) : (
          <span>© Showcase</span>
        )}
      </p>
    </footer>
  );
}
