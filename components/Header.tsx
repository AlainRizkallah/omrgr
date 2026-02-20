"use client";

import Link from "next/link";
import { useState, useRef } from "react";

const BACKDROP_IGNORE_MS = 400;

type GalleryItem = { slug: string; title: string; seriesSlug: string };
type SeriesItem = { slug: string; title: string; galleries: GalleryItem[] };

interface HeaderProps {
  seriesList: SeriesItem[];
  siteTitle: string;
  infoNavLinks: Array<{ href: string; label: string }>;
}

export default function Header({ seriesList, siteTitle, infoNavLinks }: HeaderProps) {
  const [worksOpen, setWorksOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [openSeriesSlug, setOpenSeriesSlug] = useState<string | null>(null);
  const worksOpenedAtRef = useRef(0);
  const infoOpenedAtRef = useRef(0);

  const handleWorksClick = () => {
    const next = !worksOpen;
    if (next) worksOpenedAtRef.current = Date.now();
    setWorksOpen(next);
    setInfoOpen(false);
    setOpenSeriesSlug(null);
  };

  const handleWorksBackdropClick = () => {
    if (Date.now() - worksOpenedAtRef.current < BACKDROP_IGNORE_MS) return;
    setWorksOpen(false);
    setOpenSeriesSlug(null);
  };

  const handleInfoClick = () => {
    const next = !infoOpen;
    if (next) infoOpenedAtRef.current = Date.now();
    setInfoOpen(next);
    setWorksOpen(false);
  };

  const handleInfoBackdropClick = () => {
    if (Date.now() - infoOpenedAtRef.current < BACKDROP_IGNORE_MS) return;
    setInfoOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[hsl(var(--background))]/95 backdrop-blur">
      <div className="mx-auto flex h-14 min-h-[44px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <nav className="flex items-center gap-3 text-xs tracking-wide sm:gap-5" aria-label="Main">
            <div className="relative">
              <button
                type="button"
                onClick={handleWorksClick}
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
                    onClick={handleWorksBackdropClick}
                  />
                  <div className="absolute left-0 top-full z-20 mt-1.5 min-w-[220px] bg-[hsl(var(--background))] py-1.5 shadow-xl max-h-[70vh] overflow-y-auto md:max-h-none md:overflow-visible">
                    {seriesList.length === 0 ? (
                      <div className="px-4 py-3 text-[hsl(var(--muted-foreground))] text-xs">No series yet. Add content in Sanity Studio.</div>
                    ) : (
                      seriesList.map((series) => {
                        const singleGallery = (series.galleries?.length === 1) ? series.galleries[0] : null;
                        if (singleGallery) {
                          return (
                            <Link
                              key={series.slug}
                              href={`/works/${series.slug}/${singleGallery.slug}`}
                              className="flex min-h-[40px] w-full items-center px-4 py-2.5 text-left font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
                              onClick={() => { setWorksOpen(false); setOpenSeriesSlug(null); }}
                            >
                              {singleGallery.title}
                            </Link>
                          );
                        }
                        return (
                          <div key={series.slug} className="relative">
                            <button
                              type="button"
                              className="flex min-h-[40px] w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
                              onClick={(e) => {
                                e.stopPropagation();
                                worksOpenedAtRef.current = Date.now();
                                setOpenSeriesSlug((s) => (s === series.slug ? null : series.slug));
                              }}
                              aria-expanded={openSeriesSlug === series.slug}
                              aria-haspopup="true"
                            >
                              <span className="font-medium">{series.title}</span>
                              <svg
                                className={`h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))] transition-transform duration-200 ${openSeriesSlug === series.slug ? "rotate-90" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                            {openSeriesSlug === series.slug && (series.galleries?.length ?? 0) > 0 && (
                              <>
                                {/* Desktop: flyout to the right */}
                                <div className="absolute left-full top-0 z-20 h-full w-0 hidden md:block" aria-hidden />
                                <div className="absolute left-full top-0 z-30 hidden min-w-[200px] bg-[hsl(var(--background))] py-1.5 shadow-xl md:block">
                                  {(series.galleries || []).map((g) => (
                                    <Link
                                      key={`${series.slug}-${g.slug}`}
                                      href={`/works/${series.slug}/${g.slug}`}
                                      className="block px-4 py-2.5 text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
                                      onClick={() => { setWorksOpen(false); setOpenSeriesSlug(null); }}
                                    >
                                      {g.title}
                                    </Link>
                                  ))}
                                </div>
                                {/* Mobile: inline expansion below series */}
                                <div className="bg-[hsl(var(--muted))]/50 pb-1.5 pt-0 md:hidden">
                                  {(series.galleries || []).map((g) => (
                                    <Link
                                      key={`${series.slug}-${g.slug}-inline`}
                                      href={`/works/${series.slug}/${g.slug}`}
                                      className="flex min-h-[40px] items-center px-4 py-2.5 pl-6 text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
                                      onClick={() => { setWorksOpen(false); setOpenSeriesSlug(null); }}
                                    >
                                      {g.title}
                                    </Link>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={handleInfoClick}
                className="min-h-[44px] min-w-[44px] py-2 text-left text-[hsl(var(--foreground))] hover:opacity-80"
                aria-expanded={infoOpen}
                aria-haspopup="true"
              >
                Info
              </button>
              {infoOpen && (
                <>
                  <div className="fixed inset-0 z-10" aria-hidden onClick={handleInfoBackdropClick} />
                  <div className="absolute left-0 top-full z-20 mt-1.5 min-w-[160px] bg-[hsl(var(--background))] py-1.5 shadow-xl">
                    {infoNavLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block min-h-[40px] px-4 py-2.5 text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
                        onClick={() => setInfoOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
            <Link href="/contact" className="min-h-[44px] -ml-2 flex items-center text-[hsl(var(--foreground))] hover:opacity-80 sm:-ml-3">
              Contact
            </Link>
          </nav>

        <Link
          href="/"
          className="relative shrink-0 text-base font-normal text-[hsl(var(--foreground))] hover:opacity-80 sm:text-lg"
        >
          {siteTitle || "OMRGR"}
          <span className="absolute -top-0.5 -right-1 text-[0.5em] leading-none opacity-70" aria-hidden>®</span>
        </Link>
      </div>
    </header>
  );
}
