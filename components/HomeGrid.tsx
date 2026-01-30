"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Category } from "@/lib/content";

type HomeGridProps = {
  categories: Category[];
};

export default function HomeGrid({ categories }: HomeGridProps) {
  const items = categories.slice(0, 3);

  return (
    <div className="grid w-full grid-cols-1 grid-rows-3 min-[769px]:grid-cols-3 min-[769px]:grid-rows-1">
      {items.map((c) => (
        <HomeGridCell
          key={c.slug}
          slug={c.slug}
          title={c.title}
          coverSrc={c.cover.src}
          coverAlt={c.cover.alt}
          coverWidth={c.cover.width}
          coverHeight={c.cover.height}
        />
      ))}
    </div>
  );
}

function HomeGridCell({
  slug,
  title,
  coverSrc,
  coverAlt,
  coverWidth,
  coverHeight,
}: {
  slug: string;
  title: string;
  coverSrc: string;
  coverAlt: string;
  coverWidth: number;
  coverHeight: number;
}) {
  const [labelVisible, setLabelVisible] = useState(false);
  const [touchLabelOpen, setTouchLabelOpen] = useState(false);
  const unoptimized = coverSrc.includes("(") || coverSrc.includes(")");
  const showLabel = labelVisible || touchLabelOpen;

  const handleClick = (e: React.MouseEvent) => {
    if ("ontouchstart" in window && touchLabelOpen) {
      setTouchLabelOpen(false);
      return;
    }
    if ("ontouchstart" in window) {
      e.preventDefault();
      setTouchLabelOpen(true);
    }
  };

  return (
    <Link
      href={`/${slug}`}
      className="group relative block min-h-[33.33vh] w-full overflow-hidden min-[769px]:min-h-screen focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-zinc-400"
      onFocus={() => setLabelVisible(true)}
      onBlur={() => setLabelVisible(false)}
      onClick={handleClick}
    >
      <span
        className="relative block h-full min-h-[33.33vh] w-full min-[769px]:min-h-screen"
        onMouseEnter={() => setLabelVisible(true)}
        onMouseLeave={() => setLabelVisible(false)}
      >
        <Image
          src={coverSrc}
          alt={coverAlt}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 33.33vw"
          unoptimized={unoptimized}
          priority
        />
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[100] flex items-end justify-start bg-gradient-to-t from-black/50 to-transparent px-2 pb-2 pt-8 transition-opacity duration-200"
          style={{ opacity: showLabel ? 1 : 0 }}
          aria-hidden
        >
          <span className="font-editorial text-[10px] uppercase tracking-wider text-white drop-shadow-md">
            {title}
          </span>
        </span>
      </span>
    </Link>
  );
}
