# Showcase (Sanity CMS)

Static showcase site with content managed in Sanity. Layout and structure inspired by minimal artist/portfolio sites (e.g. monicacuriel.art). No shop, cart, search, or auth.

---

## Overview

- **Home** (`/`): Hero image and intro copy from Sanity (Home document).
- **Works** (header dropdown): Series → Galleries. Each gallery is a masonry grid with lightbox.
- **Info** (header): About, CV, Press — editable in Sanity (Info Page documents).
- **Contact** (`/contact`): Single page, content from Sanity.
- **Content**: All text and images come from [Sanity](https://sanity.io). Revalidation (ISR) refreshes the site when content is updated.

---

## Setup

### 1. Sanity project

1. Create a project at [sanity.io](https://sanity.io) (or use an existing one).
2. In the project dashboard, note your **Project ID** and **Dataset** (e.g. `production`).
3. Deploy the schema: from the project, use **Sanity Studio** (hosted at `https://YOUR_PROJECT_ID.sanity.studio`) and create the document types there, or run `npx sanity schema deploy` if you use the CLI with this repo’s `sanity/` config.

### 2. Environment variables

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

Optional:

- `SANITY_API_TOKEN` — Editor token (for the bootstrap script and optional server-side write).
- `REVALIDATION_SECRET` — Secret for the on-demand revalidate API (e.g. for a Sanity webhook).

### 3. Bootstrap content (optional)

To seed Sanity from the **Pictures** folder (Chairs, Paintings, Interior Design) and add placeholder text for Info, Contact, and Home:

1. Set `SANITY_API_TOKEN` in `.env.local` (token with Editor access).
2. Run:

```bash
node scripts/bootstrap-sanity.js
```

This creates Series, Galleries, uploads images from `Pictures/`, and creates Info, Contact, and Home documents with placeholder text.

### 4. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Build

```bash
npm run build
npm start
```

- `npm run build:fast` — build without lint.
- `npm run build:clean` — remove `.next` then build.

---

## Editing content (client)

Use **Sanity Studio** (hosted at `https://YOUR_PROJECT_ID.sanity.studio`) to:

- Create and edit **Series** and **Galleries**, upload and **drag-and-drop reorder** images.
- Edit **Info** (About, CV, Press) and **Contact**.
- Edit **Home** (hero image and intro) and **Site Settings**.

See **[docs/SANITY-WALKTHROUGH.md](docs/SANITY-WALKTHROUGH.md)** for a short step-by-step walkthrough.

---

## Project structure

```
omrgr/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── (site)/                  # Site routes (header + footer)
│   │   ├── layout.tsx           # Header, main, Footer
│   │   ├── page.tsx             # Home (hero + intro)
│   │   ├── works/[seriesSlug]/[gallerySlug]/page.tsx
│   │   ├── info/[slug]/page.tsx # About, CV, Press
│   │   └── contact/page.tsx
│   └── api/revalidate/route.ts  # On-demand revalidation (optional)
├── components/
│   ├── Header.tsx               # Works / Info / Contact nav
│   ├── Footer.tsx
│   ├── HomeHero.tsx
│   └── WorksGallery.tsx         # Masonry grid + lightbox
├── lib/sanity/
│   ├── client.ts
│   ├── queries.ts
│   ├── data.ts                  # Fetch + map to app types
│   ├── image-url.ts
│   └── types.ts
├── sanity/
│   ├── schema/                  # Series, Gallery, InfoPage, Contact, Home, SiteSettings
│   └── sanity.config.ts
├── scripts/
│   └── bootstrap-sanity.js      # Seed from Pictures + placeholders
├── docs/
│   └── SANITY-WALKTHROUGH.md
├── .env.example
└── package.json
```

---

## Tech stack

- **Next.js 15** (App Router), **TypeScript**, **Tailwind CSS**
- **Sanity** (headless CMS, hosted)
- **next-sanity**, **@sanity/image-url**, **@portabletext/react**
- **react-photo-album**, **yet-another-react-lightbox** (gallery and lightbox)

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home: hero + intro from Sanity |
| `/works/[series]/[gallery]` | Gallery: masonry grid + lightbox |
| `/info/about`, `/info/cv`, `/info/press` | Info pages |
| `/contact` | Contact page |

---

## Deploy (Vercel)

1. Connect the repo to Vercel and set the **production branch** (e.g. `showcase-sanity` or `main`).
2. Add environment variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`. Optionally `REVALIDATION_SECRET` for on-demand revalidation.
3. Deploy. The site is static (SSG) with revalidation (e.g. 60s or via webhook).

To trigger revalidation when content is published in Sanity, configure a webhook in the Sanity project that calls:

`https://your-site.vercel.app/api/revalidate?secret=YOUR_REVALIDATION_SECRET`
