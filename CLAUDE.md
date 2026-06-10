# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build (with lint)
npm run build:fast   # Production build (skip lint)
npm run build:clean  # Delete .next then build
npm run lint         # ESLint via next lint
npm run populate-galleries  # Seed Sanity from Pictures/ folder
```

No test suite is configured.

ESLint and TypeScript errors are intentionally ignored during builds (`next.config.mjs` sets `ignoreDuringBuilds: true` for both). Run `npm run lint` to catch lint errors during development.

## Architecture

**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Sanity CMS.

### Route structure

All user-facing routes live under `app/(site)/` — a route group that wraps everything with the shared Header/Footer layout (`app/(site)/layout.tsx`). The root `app/layout.tsx` sets fonts and globals only.

| Route | File |
|-------|------|
| `/` | `app/(site)/page.tsx` |
| `/works/[seriesSlug]/[gallerySlug]` | `app/(site)/works/[seriesSlug]/[gallerySlug]/page.tsx` |
| `/info/[slug]` | `app/(site)/info/[slug]/page.tsx` |
| `/contact` | `app/(site)/contact/page.tsx` |
| `/api/revalidate` | `app/api/revalidate/route.ts` |

All pages use `export const revalidate = 60` (ISR). On-demand revalidation is available via the `/api/revalidate` webhook endpoint.

### Data layer

All Sanity access flows through three files in `lib/sanity/`:

- **`queries.ts`** — Raw GROQ query strings (no fetching).
- **`data.ts`** — Async fetch functions that call the Sanity client and map raw results to typed app objects. Includes an `isSanityConfigured()` guard that returns empty/null when env vars aren't set.
- **`types.ts`** — TypeScript interfaces for all app-level data (`GalleryData`, `InfoPageData`, `HomeData`, etc.).

Images are built via `lib/sanity/image-url.ts` (wraps `@sanity/image-url`). The convention is to request 2× the display dimensions: `urlFor({ _ref }).width(w * 2).height(h * 2).url()`.

### Gallery layout blocks

Gallery pages support rich custom content above the photo grid via `GalleryLayoutBlock` — a discriminated union in `lib/sanity/types.ts` with four variants: `galleryLayoutBlockText`, `galleryLayoutBlockImage`, `galleryLayoutBlockRow` (text+image side-by-side), and `galleryLayoutBlockGrid` (2–4 column grid). These are rendered in `components/WorksGallery.tsx`.

Text inside layout blocks is Sanity Portable Text, rendered with custom `PortableText` components defined in `WorksGallery.tsx`. Text size is controlled by the `SIZE_SCALE` map (`xs | sm | base | lg`) which maps to Tailwind classes. Text inside text+image composites (row, grid, image textBelow) is automatically one step smaller via `smallerSizeForTextImageBlock()`.

### Sanity CMS

Sanity schema types: `series`, `gallery`, `infoPage`, `contact`, `home`, `siteSettings`.

The `sanity/` subdirectory is a **separate project** with its own `package.json` and `node_modules`. To work on the Studio:

```bash
cd sanity
npm install
npx sanity dev       # local Studio
npx sanity deploy    # deploy to sanity.studio
```

The Studio uses `SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET` env vars (set in `sanity/.env.local`), while the Next.js app uses `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` (set in `.env.local` at the repo root).

### Fonts & theming

The site font is configurable via the `siteSettings` Sanity document (`fontFamily` field). Valid values: `eczar` (default), `corbert`, `serif`, `sans`, `hal-timezone`. HAL Timezone requires font files in `public/fonts/`. Fonts are loaded via `next/font` in `lib/fonts.ts` and applied on the root layout. Colors are CSS custom properties (HSL) defined in `app/globals.css`.
