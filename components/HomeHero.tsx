import Image from "next/image";
import { PortableText } from "@portabletext/react";

interface HomeHeroProps {
  heroImageUrl: string | null;
  intro: unknown;
  siteTitle: string;
}

export default function HomeHero({ heroImageUrl, intro, siteTitle }: HomeHeroProps) {
  return (
    <div className="w-full">
      {heroImageUrl && (
        <div className="relative aspect-[3/1] w-full overflow-hidden bg-[hsl(var(--muted))] sm:aspect-[21/9]">
          <Image
            src={heroImageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        {intro && Array.isArray(intro) && (intro as unknown[]).length > 0 ? (
          <div className="font-serif-editorial text-[15px] leading-relaxed text-[hsl(var(--foreground))] prose prose-p:mb-3">
            <PortableText value={intro as object} />
          </div>
        ) : (
          <p className="font-serif-editorial text-[15px] leading-relaxed text-[hsl(var(--muted-foreground))]">
            Welcome to {siteTitle}. Add intro content in Sanity Studio (Home document).
          </p>
        )}
      </div>
    </div>
  );
}
