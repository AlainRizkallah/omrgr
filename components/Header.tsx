"use client";

import Link from "next/link";
import { useState } from "react";

type GalleryItem = { slug: string; title: string; seriesSlug: string; imageCount?: number };
type SeriesItem = { slug: string; title: string; galleries: GalleryItem[] };

interface HeaderProps {
  seriesList: SeriesItem[];
}

export default function Header({ seriesList }: HeaderProps) {
  const [worksOpen, setWorksOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/95 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-serif-editorial text-sm font-normal text-[hsl(var(--foreground))] hover:opacity-80"
        >
          Showcase
        </Link>
        <nav className="flex items-center gap-6 text-xs tracking-wide">
          {/* Works dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setWorksOpen((v) => !v); setInfoOpen(false); }}
              className="text-[hsl(var(--foreground))] hover:opacity-80"
            >
              Works
            </button>
            {worksOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden
                  onClick={() => setWorksOpen(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 min-w-[200px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] py-2 shadow">
                  {seriesList.map((series) => (
                    <div key={series.slug} className="px-3 py-1">
                      <span className="block text-[hsl(var(--muted-foreground))] font-medium">
                        {series.title}
                      </span>
                      {(series.galleries || []).map((g) => (
                        <Link
                          key={`${series.slug}-${g.slug}`}
                          href={`/works/${series.slug}/${g.slug}`}
                          className="block py-1 pl-2 text-[hsl(var(--foreground))] hover:opacity-80"
                          onClick={() => setWorksOpen(false)}
                        >
                          {g.title}
                          {g.imageCount != null && g.imageCount > 0 && (
                            <span className="text-[hsl(var(--muted-foreground))]"> ({g.imageCount})</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  ))}
                  {seriesList.length === 0 && (
                    <div className="px-3 py-2 text-[hsl(var(--muted-foreground))] text-xs">
                      No series yet. Add content in Sanity Studio.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Info dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setInfoOpen((v) => !v); setWorksOpen(false); }}
              className="text-[hsl(var(--foreground))] hover:opacity-80"
            >
              Info
            </button>
            {infoOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden
                  onClick={() => setInfoOpen(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 min-w-[140px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] py-2 shadow">
                  <Link
                    href="/info/about"
                    className="block px-3 py-1 text-[hsl(var(--foreground))] hover:opacity-80"
                    onClick={() => setInfoOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/info/cv"
                    className="block px-3 py-1 text-[hsl(var(--foreground))] hover:opacity-80"
                    onClick={() => setInfoOpen(false)}
                  >
                    CV
                  </Link>
                  <Link
                    href="/info/press"
                    className="block px-3 py-1 text-[hsl(var(--foreground))] hover:opacity-80"
                    onClick={() => setInfoOpen(false)}
                  >
                    Press
                  </Link>
                </div>
              </>
            )}
          </div>

          <Link
            href="/contact"
            className="text-[hsl(var(--foreground))] hover:opacity-80"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
