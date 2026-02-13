"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

type GalleryItem = { slug: string; title: string; seriesSlug: string; imageCount?: number };
type SeriesItem = { slug: string; title: string; galleries: GalleryItem[] };

interface HeaderProps {
  seriesList: SeriesItem[];
  siteTitle: string;
  heroImageUrl?: string | null;
}

const NAV_LINKS = [
  { href: "/info/about", label: "About" },
  { href: "/info/cv", label: "CV" },
  { href: "/info/press", label: "Press" },
] as const;

export default function Header({ seriesList, siteTitle, heroImageUrl }: HeaderProps) {
  const [worksOpen, setWorksOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerWorksOpen, setDrawerWorksOpen] = useState(false);
  const [drawerInfoOpen, setDrawerInfoOpen] = useState(false);

  // Close drawer on resize to desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => {
      if (mq.matches) setDrawerOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerWorksOpen(false);
    setDrawerInfoOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/95 backdrop-blur">
      <div className="mx-auto flex h-14 min-h-[44px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Left: desktop nav (hidden on mobile) */}
        <nav className="hidden items-center gap-5 text-xs tracking-wide md:flex" aria-label="Main">
          {/* Works dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setWorksOpen((v) => !v);
                setInfoOpen(false);
              }
              }
              className="min-h-[44px] min-w-[44px] py-2 text-left text-[hsl(var(--foreground))] hover:opacity-80"
              aria-expanded={worksOpen}
              aria-haspopup="true"
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
                <div className="absolute left-0 top-full z-20 mt-1 min-w-[200px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] py-2 shadow-lg">
                  {seriesList.map((series) => (
                    <div key={series.slug} className="px-3 py-1">
                      <span className="block text-[hsl(var(--muted-foreground))] font-medium">
                        {series.title}
                      </span>
                      {(series.galleries || []).map((g) => (
                        <Link
                          key={`${series.slug}-${g.slug}`}
                          href={`/works/${series.slug}/${g.slug}`}
                          className="block py-1.5 pl-2 text-[hsl(var(--foreground))] hover:opacity-80"
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
              onClick={() => {
                setInfoOpen((v) => !v);
                setWorksOpen(false);
              }}
              className="min-h-[44px] min-w-[44px] py-2 text-left text-[hsl(var(--foreground))] hover:opacity-80"
              aria-expanded={infoOpen}
              aria-haspopup="true"
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
                <div className="absolute left-0 top-full z-20 mt-1 min-w-[140px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] py-2 shadow-lg">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-3 py-2 text-[hsl(var(--foreground))] hover:opacity-80"
                      onClick={() => setInfoOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          <Link
            href="/contact"
            className="min-h-[44px] flex items-center text-[hsl(var(--foreground))] hover:opacity-80"
          >
            Contact
          </Link>
        </nav>

        {/* Center: site title + optional hero (always visible) */}
        <div className="flex min-w-0 flex-1 justify-center md:flex-none">
          <Link
            href="/"
            className="flex flex-col items-center gap-0.5 font-serif-editorial text-base font-normal text-[hsl(var(--foreground))] hover:opacity-80 sm:text-lg"
          >
            <span className="truncate">{siteTitle || "OMRGR"}</span>
            {heroImageUrl && (
              <span className="relative mt-0.5 block h-8 w-16 overflow-hidden rounded sm:h-10 sm:w-20">
                <Image
                  src={heroImageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </span>
            )}
          </Link>
        </div>

        {/* Right: mobile drawer trigger (visible only on mobile) */}
        <div className="flex min-w-[44px] justify-end md:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[hsl(var(--foreground))] hover:opacity-80"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            aria-hidden
            onClick={closeDrawer}
          />
          <aside
            className="fixed inset-y-0 left-0 z-50 w-full max-w-[280px] border-r border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-xl md:hidden"
            role="dialog"
            aria-label="Navigation menu"
          >
            <div className="flex h-14 items-center justify-between border-b border-[hsl(var(--border))] px-4">
              <span className="font-serif-editorial text-sm font-normal text-[hsl(var(--muted-foreground))]">Menu</span>
              <button
                type="button"
                onClick={closeDrawer}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[hsl(var(--foreground))] hover:opacity-80"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-0 py-2" aria-label="Main">
              {/* Works (expandable) */}
              <div>
                <button
                  type="button"
                  onClick={() => setDrawerWorksOpen((v) => !v)}
                  className="flex min-h-[44px] w-full items-center justify-between px-4 py-2 text-left text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                  aria-expanded={drawerWorksOpen}
                >
                  Works
                  <svg
                    className={`h-4 w-4 transition-transform ${drawerWorksOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {drawerWorksOpen && (
                  <div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50 py-1">
                    {seriesList.map((series) => (
                      <div key={series.slug} className="px-4 py-1">
                        <span className="block text-xs font-medium text-[hsl(var(--muted-foreground))]">
                          {series.title}
                        </span>
                        {(series.galleries || []).map((g) => (
                          <Link
                            key={`${series.slug}-${g.slug}`}
                            href={`/works/${series.slug}/${g.slug}`}
                            className="block py-2 pl-3 text-sm text-[hsl(var(--foreground))] hover:opacity-80"
                            onClick={closeDrawer}
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
                      <p className="px-4 py-2 text-xs text-[hsl(var(--muted-foreground))]">No series yet.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Info (expandable) */}
              <div>
                <button
                  type="button"
                  onClick={() => setDrawerInfoOpen((v) => !v)}
                  className="flex min-h-[44px] w-full items-center justify-between px-4 py-2 text-left text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                  aria-expanded={drawerInfoOpen}
                >
                  Info
                  <svg
                    className={`h-4 w-4 transition-transform ${drawerInfoOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {drawerInfoOpen && (
                  <div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50 py-1">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block py-2 pl-4 text-sm text-[hsl(var(--foreground))] hover:opacity-80"
                        onClick={closeDrawer}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/contact"
                className="flex min-h-[44px] items-center px-4 py-2 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                onClick={closeDrawer}
              >
                Contact
              </Link>
            </nav>
          </aside>
        </>
      )}
    </header>
  );
}
