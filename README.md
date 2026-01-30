# OMRGR

Minimal photo gallery inspired by the [X100](https://github.com/lilxyzz/X100) template: responsive tiled mosaic on the homepage and per-collection galleries with thin header/footer.

---

## Overview

- **Homepage** (`/`): Three collection tiles (Chairs, Paintings, Interior Design). Each tile crossfades through random images from that collection; labels on hover. Third tile is full-width with shorter aspect ratio so the grid fits the viewport.
- **Collection pages** (`/collections/[slug]`): Thin title bar, full-page masonry grid with rounded corners, thin footer with links to other collections. Click a photo to open the lightbox (zoom). Labels on hover only.
- **Header**: Thin bar with logo link to home (no extra nav).
- **Data**: Images are discovered from `public/Pictures` (or `./Pictures`). Collections are ordered: Chairs (1st), Paintings (2nd), Interior Design (3rd).

---

## Setup

### 1. Images

Photos are served from **`public/Pictures`**. After adding or changing images in the repo `Pictures` folder, copy them into public:

**Windows (PowerShell):**
```powershell
xcopy "Pictures" "public\Pictures\" /E /I /Y
```

**macOS / Linux:**
```bash
cp -r Pictures/* public/Pictures/
```

### 2. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3. Build

```bash
npm run build
npm start
```

- `npm run build:fast` — build without lint (faster).
- `npm run build:clean` — remove `.next` then build (use if build locks; stop dev server first).

---

## Project structure

```
omrgr/
├── app/
│   ├── layout.tsx          # Root layout: header + main (flex)
│   ├── page.tsx            # Home: collection tiles
│   ├── globals.css         # Tailwind + masonry/lightbox CSS + photo radius
│   └── collections/[slug]/
│       └── page.tsx        # Collection page (title, grid, footer)
├── components/
│   ├── header.tsx          # Thin header (logo → home)
│   ├── collection-grid.tsx # Home grid + RotatingCover (crossfade, dephased)
│   ├── collection-gallery.tsx # Collection page: title, PhotoGrid, footer, Lightbox
│   └── photo-grid.tsx      # Masonry grid (react-photo-album)
├── lib/
│   └── photos.ts           # getCollections(), getPhotosByCollection(), getPhotos()
├── public/Pictures/        # Served images (Chairs, Interior Design, Paintings)
├── Pictures/               # Source images (optional; copy to public)
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Documentation by file

### `lib/photos.ts`

- **PhotoItem**: `src`, `width`, `height`, `alt`, `title`, `collection`.
- **CollectionInfo**: `slug`, `title`, `coverSrc`, `photos`.
- **getCollections()**: Reads `public/Pictures` (or `Pictures`), builds one collection per folder, sorts by display order (chairs → paintings → interior-design).
- **getPhotosByCollection(slug)**: Returns photos for one collection.
- **getPhotos()**: Flat list of all photos (for compatibility).

### `components/header.tsx`

- Sticky thin bar: height `h-8`, small padding and `text-xs` logo. Link to `/`.

### `components/collection-grid.tsx`

- **CollectionGrid**: Renders three tiles; first two in one row, third full-width with `sm:aspect-[3/1]`. Minimal padding/gap.
- **RotatingCover**: Crossfades through random images from the collection. `phaseOffset` (ms) delays the first transition so tiles don’t change in sync. Uses two layers (outgoing/incoming) and 700ms ease-in-out; interval 4500ms.

### `components/collection-gallery.tsx`

- **CollectionGallery**: Receives `title`, `photos`, `otherCollections`. Renders thin title section, masonry `PhotoGrid` (compact, fillHeight, onPhotoClick), thin footer with links to other collections, and `Lightbox` with Zoom plugin.

### `components/photo-grid.tsx`

- **PhotoGrid**: Masonry layout via `react-photo-album`. Props: `photos`, `compact` (more columns), `fillHeight` (fill container), `onPhotoClick(index)`. Photos have 20px rounded corners (globals.css). Uses `defaultContainerWidth` and breakpoints so layout works before resize.

### `app/layout.tsx`

- Root layout: `body` flex column, `Header`, `main` with `flex-1 flex flex-col` so collection pages can fill height.

### `app/page.tsx`

- Home: loads collections; if none, shows “copy Pictures to public” message; else renders `CollectionGrid`.

### `app/collections/[slug]/page.tsx`

- **generateStaticParams**: Returns `{ slug }` for chairs, paintings, interior-design.
- Page: finds collection by slug; 404 if missing or no photos. Passes `title`, `photos`, `otherCollections` to `CollectionGallery`.

### `app/globals.css`

- Imports react-photo-album and yet-another-react-lightbox styles.
- Tailwind base; CSS variables for background, foreground, border, muted.
- `.react-photo-album--photo`: 20px border-radius, object-fit cover.

---

## Tech stack

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS**
- [react-photo-album](https://github.com/igordanchenko/react-photo-album) — masonry grid
- [yet-another-react-lightbox](https://github.com/igordanchenko/yet-another-react-lightbox) — lightbox with Zoom

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home: three collection tiles with rotating covers |
| `/collections/chairs` | Chairs collection mosaic + lightbox |
| `/collections/paintings` | Paintings collection mosaic + lightbox |
| `/collections/interior-design` | Interior Design collection mosaic + lightbox |
