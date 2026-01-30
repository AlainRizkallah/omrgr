import { getCategoryImages } from "@/lib/content";
import MosaicGrid from "@/components/MosaicGrid";

export default function ChairsPage() {
  const images = getCategoryImages("chairs");
  const items = images.map((img) => ({
    src: img.src,
    alt: img.alt,
    width: img.width,
    height: img.height,
    label: img.alt,
  }));

  return <MosaicGrid items={items} />;
}
