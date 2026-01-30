/**
 * Homepage: three collection tiles (Chairs, Paintings, Interior Design) with rotating covers.
 */
import { getCollections } from "@/lib/photos";
import CollectionGrid from "@/components/collection-grid";

export default function HomePage() {
  const collections = getCollections();

  if (collections.length === 0) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center p-4">
        <p className="text-muted-foreground text-sm">
          No images found. Copy the <code className="bg-muted px-1 rounded">Pictures</code> folder
          into <code className="bg-muted px-1 rounded">public/Pictures</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col w-full">
      <CollectionGrid collections={collections} />
    </div>
  );
}
