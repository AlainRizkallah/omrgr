import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { HeroImageMargin } from "@/lib/sanity/types";

/** Margin = max width of hero (centered). Large = 60%, medium = 75%, small = 90%, none = full width. */
const HERO_MARGIN_CLASSES: Record<HeroImageMargin, string> = {
  none: "w-full",
  small: "mx-auto w-full max-w-[90%]",
  medium: "mx-auto w-full max-w-[80%]",
  large: "mx-auto w-full max-w-[60%]",
};

interface HomeHeroProps {
  heroImageUrl: string | null;
  heroImageMargin: HeroImageMargin;
  intro: unknown;
  siteTitle: string;
}

export default function HomeHero({ heroImageUrl, heroImageMargin, intro, siteTitle }: HomeHeroProps) {
  const marginClass = HERO_MARGIN_CLASSES[heroImageMargin] ?? HERO_MARGIN_CLASSES.medium;
  return (
    <div className="w-full">
      {heroImageUrl ? (
        <div className={`pt-4 sm:pt-6 ${marginClass}`}>
          <div className="relative block w-full shrink-0 overflow-hidden rounded-lg bg-[hsl(var(--muted))] aspect-[21/9] min-h-[200px] sm:min-h-[260px]">
            <Image
            src={heroImageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          </div>
        </div>
      ) : null}
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
