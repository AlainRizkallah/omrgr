"use client";

import Image from "next/image";
import Link from "next/link";

export type MosaicItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  label?: string;
  href?: string;
};

export default function MosaicGrid({ items }: { items: MosaicItem[] }) {
  return (
    <div className="mosaic-grid min-w-0 w-full max-w-[100vw] overflow-hidden">
      {items.map((item, i) => {
        const label = item.label ?? item.alt;
        const content = (
          <span className="relative block w-full min-w-0 overflow-hidden bg-zinc-200">
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              className="h-auto w-full max-w-full object-cover"
              sizes="(max-width: 475px) 100vw, (max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              unoptimized={item.src.includes("(") || item.src.includes(")")}
              priority={i < 6}
            />
            <span
              className="pointer-events-none absolute inset-0 flex items-end justify-start bg-black/20 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
              aria-hidden
            >
              <span className="font-editorial text-[10px] uppercase tracking-wider text-white drop-shadow-md">
                {label}
              </span>
            </span>
          </span>
        );

        const wrapperClass =
          "mosaic-item group relative focus-within:outline focus-within:outline-2 focus-within:outline-offset-0 focus-within:outline-zinc-400";

        if (item.href) {
          return (
            <Link
              key={item.src + (item.href ?? "")}
              href={item.href}
              className={wrapperClass}
              tabIndex={0}
            >
              {content}
            </Link>
          );
        }

        return (
          <figure key={item.src + i} className={wrapperClass} tabIndex={0}>
            {content}
          </figure>
        );
      })}
    </div>
  );
}
