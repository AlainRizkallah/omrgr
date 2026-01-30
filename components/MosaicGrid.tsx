"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type MosaicItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  label?: string;
  href?: string;
};

function MosaicLabel({ label, visible }: { label: string; visible: boolean }) {
  return (
    <span
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[100] flex items-end justify-start bg-gradient-to-t from-black/50 to-transparent px-2 pb-2 pt-8 transition-opacity duration-200"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden
    >
      <span className="font-editorial text-[10px] uppercase tracking-wider text-white drop-shadow-lg">
        {label}
      </span>
    </span>
  );
}

function MosaicCell({
  item,
  index,
  priority,
}: {
  item: MosaicItem;
  index: number;
  priority: boolean;
}) {
  const [labelVisible, setLabelVisible] = useState(false);
  const [touchLabelOpen, setTouchLabelOpen] = useState(false);
  const label = item.label ?? item.alt;
  const showLabel = labelVisible || touchLabelOpen;
  const unoptimized = item.src.includes("(") || item.src.includes(")");

  const handleClick = (e: React.MouseEvent) => {
    if ("ontouchstart" in window && touchLabelOpen && item.href) {
      setTouchLabelOpen(false);
      return;
    }
    if ("ontouchstart" in window) {
      e.preventDefault();
      setTouchLabelOpen((v) => !v);
    }
  };

  const content = (
    <span
      className="relative block w-full min-w-0 overflow-hidden bg-zinc-900"
      onMouseEnter={() => setLabelVisible(true)}
      onMouseLeave={() => setLabelVisible(false)}
    >
      <Image
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        className="h-auto w-full max-w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16.67vw"
        unoptimized={unoptimized}
        priority={priority}
      />
      <MosaicLabel label={label} visible={showLabel} />
    </span>
  );

  const wrapperClass =
    "mosaic-item group relative block w-full focus-within:outline focus-within:outline-2 focus-within:outline-offset-0 focus-within:outline-zinc-400";

  if (item.href) {
    return (
      <Link
        key={item.src + (item.href ?? "") + index}
        href={item.href}
        className={wrapperClass}
        tabIndex={0}
        onFocus={() => setLabelVisible(true)}
        onBlur={() => setLabelVisible(false)}
        onClick={handleClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <figure
      key={item.src + index}
      className={wrapperClass}
      tabIndex={0}
      onFocus={() => setLabelVisible(true)}
      onBlur={() => setLabelVisible(false)}
      onClick={handleClick}
    >
      {content}
    </figure>
  );
}

export default function MosaicGrid({ items }: { items: MosaicItem[] }) {
  return (
    <div className="mosaic-grid min-w-0 w-full max-w-none overflow-hidden">
      {items.map((item, i) => (
        <MosaicCell
          key={item.src + (item.href ?? "") + i}
          item={item}
          index={i}
          priority={i < 6}
        />
      ))}
    </div>
  );
}
