import { categories } from "@/lib/content";
import MosaicGrid from "@/components/MosaicGrid";

export default function HomePage() {
  const items = categories.map((c) => ({
    src: c.cover.src,
    alt: c.cover.alt,
    width: c.cover.width,
    height: c.cover.height,
    label: c.title,
    href: `/${c.slug}`,
  }));

  return <MosaicGrid items={items} />;
}
