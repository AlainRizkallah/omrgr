"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

type GalleryItem = { slug: string; title: string; seriesSlug: string; imageCount?: number };
type SeriesItem = { slug: string; title: string; galleries: GalleryItem[] };

interface HeaderProps {
  seriesList: SeriesItem[];
  siteTitle: string;
}

const NAV_LINKS = [
  { href: "/info/about", label: "About" },
  { href: "/info/cv", label: "CV" },
  { href: "/info/press", label: "Press" },
] as const;

export default function Header({ seriesList, siteTitle }: HeaderProps) {
  const [worksOpen, setWorksOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerWorksOpen, setDrawerWorksOpen] = useState(false);
  const [drawerInfoOpen, setDrawerInfoOpen] = useState(false);

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

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/95 backdrop-blur">
      <div className="mx-auto grid h-14 min-h-[44px] max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6">
        {/* Left: hamburger (mobile) + desktop nav */}
        <div className="flex items-center gap-4">
          {/* Hamburger: left side, mobile only */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[hsl(var(--foreground))] hover:opacity-80 md:hidden"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* Desktop nav */}
          <nav className="hidden items-center gap-5 text-xs tracking-wide md:flex" aria-label="Main">
            <div className="relative">
              <button
                type="button"
                onClick={() => { setWorksOpen((v) => !v); setInfoOpen(false); }}
                className="min-h-[44px] min-w-[44px] py-2 text-left text-[hsl(var(--foreground))] hover:opacity-80"
                aria-expanded={worksOpen}
                aria-haspopup="true"
              >
                Works
              </button>
              {worksOpen && (
                <>
                  <div className="fixed inset-0 z-10" aria-hidden onClick={() => setWorksOpen(false)} />
                  <div className="absolute left-0 top-full z-20 mt-1 min-w-[200px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] py-2 shadow-lg">
                    {seriesList.map((series) => (
                      <div key={series.slug} className="px-3 py-1">
                        <span className="block text-[hsl(var(--muted-foreground))] font-medium">{series.title}</span>
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
                      <div className="px-3 py-2 text-[hsl(var(--muted-foreground))] text-xs">No series yet. Add content in Sanity Studio.</div>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => { setInfoOpen((v) => !v); setWorksOpen(false); }}
                className="min-h-[44px] min-w-[44px] py-2 text-left text-[hsl(var(--foreground))] hover:opacity-80"
                aria-expanded={infoOpen}
                aria-haspopup="true"
              >
                Info
              </button>
              {infoOpen && (
                <>
                  <div className="fixed inset-0 z-10" aria-hidden onClick={() => setInfoOpen(false)} />
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
            <Link href="/contact" className="min-h-[44px] flex items-center text-[hsl(var(--foreground))] hover:opacity-80">
              Contact
            </Link>
          </nav>
        </div>

        {/* Center: site title (centered on desktop via grid) */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="font-serif-editorial text-base font-normal text-[hsl(var(--foreground))] hover:opacity-80 sm:text-lg"
          >
            {siteTitle || "OMRGR"}
          </Link>
        </div>

        {/* Right: empty so grid keeps title centered */}
        <div />
      </div>

      {/* Mobile drawer: portal to body so overlay + panel cover full viewport */}
      {mounted && drawerOpen && createPortal(
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/40 md:hidden"
            aria-hidden
            onClick={closeDrawer}
          />
          <aside
            className="fixed top-0 left-0 bottom-0 z-[101] flex h-[100dvh] min-h-[100dvh] w-full max-w-[300px] flex-col bg-[hsl(var(--background))] shadow-2xl md:hidden"
            role="dialog"
            aria-label="Navigation menu"
          >
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4">
              <span className="font-serif-editorial text-sm font-medium text-[hsl(var(--foreground))]">Menu</span>
              <button
                type="button"
                onClick={closeDrawer}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex min-h-0 flex-1 flex-col overflow-auto border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] py-2" aria-label="Main">
              <div className="border-b border-[hsl(var(--border))]">
                <button
                  type="button"
                  onClick={() => setDrawerWorksOpen((v) => !v)}
                  className="flex min-h-[48px] w-full items-center justify-between px-4 text-left text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                  aria-expanded={drawerWorksOpen}
                >
                  <span className="font-medium">Works</span>
                  <svg
                    className={`h-4 w-4 shrink-0 transition-transform ${drawerWorksOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {drawerWorksOpen && (
                  <div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-4 py-2">
                    {seriesList.map((series) => (
                      <div key={series.slug} className="py-2">
                        <span className="block text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                          {series.title}
                        </span>
                        {(series.galleries || []).map((g) => (
                          <Link
                            key={`${series.slug}-${g.slug}`}
                            href={`/works/${series.slug}/${g.slug}`}
                            className="block py-2 pl-2 text-sm text-[hsl(var(--foreground))] hover:opacity-80"
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
                      <p className="py-2 text-xs text-[hsl(var(--muted-foreground))]">No series yet.</p>
                    )}
                  </div>
                )}
              </div>
              <div className="border-b border-[hsl(var(--border))]">
                <button
                  type="button"
                  onClick={() => setDrawerInfoOpen((v) => !v)}
                  className="flex min-h-[48px] w-full items-center justify-between px-4 text-left text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                  aria-expanded={drawerInfoOpen}
                >
                  <span className="font-medium">Info</span>
                  <svg
                    className={`h-4 w-4 shrink-0 transition-transform ${drawerInfoOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {drawerInfoOpen && (
                  <div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-4 py-2">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block py-3 text-sm text-[hsl(var(--foreground))] hover:opacity-80"
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
                className="flex min-h-[48px] items-center px-4 font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                onClick={closeDrawer}
              >
                Contact
              </Link>
            </nav>
          </aside>
        </>,
        document.body
      )}
    </header>
  );
}
