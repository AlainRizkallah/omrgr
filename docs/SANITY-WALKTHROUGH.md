# Sanity CMS — Quick walkthrough for editors

This guide explains how to manage your showcase site content using Sanity. No technical experience required: you click, fill in, save, and publish.

---

## 1. Opening Sanity Studio

- **Where to go**: Your Studio is at  
  `https://omrgr.sanity.studio`  
  (Use the project link you were given, or ask for it.)
- **Log in** with the Sanity account that has access to this project.

---

## 2. Works (series and galleries)

Works are organized in **Series** (e.g. “Relief Paintings”, “Chairs”). Each series contains **Galleries** (e.g. “Ready to Ship”, “Main”). What you create here appears in the **Works** menu in the top bar of the website.

Gallery pages are built with **Layout blocks** — see **Custom layout for a gallery** (section 2.3) below.

### 2.1 Creating a Series

1. In the Studio sidebar, click **Series** (or **Create new** and choose **Series**).
2. Fill in:
   - **Title** (e.g. “Relief Paintings”, “Chairs”).
   - **Slug**: click **Generate** from title, or type a short URL-friendly name (e.g. `chairs`). This is the name used in the web address.
   - **Order**: a number that controls the order in the Works menu (e.g. 0, 1, 2).
3. Click **Save** (and **Publish** when you want it to go live).

### 2.2 Creating a Gallery

1. Click **Gallery** (or **Create new** → **Gallery**).
2. Fill in:
   - **Title** (e.g. “Ready to Ship”, “Main”).
   - **Slug**: e.g. `main`, `ready-to-ship` (URL-friendly name).
   - **Series**: select the series this gallery belongs to.
   - **Hide All Media section**: *on by default*. When on, the gallery page shows only your custom layout blocks (if any) and hides the “All Media” grid. Turn it *off* if you want the All Media grid to appear on the page.
3. Click **Save**.

### 2.3 Adding and reordering images (All Media)

The **Images** list in a Gallery is what appears on the site as the **“All Media”** section at the bottom of that gallery page—*if* **Hide All Media section** is turned *off* for that gallery. You can also add optional text and images *above* that section (see 2.4).

1. Open a **Gallery** document.
2. To show the All Media grid on the site, ensure **Hide All Media section** is *off* (unchecked).
3. Scroll to **Images (All Media)**.
3. Click **Add item**.
4. For each item:
   - **Asset**: click to **upload** a new image (drag-and-drop or browse), or choose an existing one.
   - **Alt**: short description for accessibility (recommended).
   - **Caption**: optional caption.
5. **Reordering**: use the **drag handle** (left side of each row) to change the order. The order here is the order on the site.
6. Click **Save** (and **Publish** when you want changes to go live).

### 2.4 Custom layout for a gallery

You can shape how a gallery page looks by adding your own **text and images at the top**. Optionally, the **“All Media”** grid appears below (see **Hide All Media section** in 2.2).

- **What it is**: Custom blocks (paragraphs, single images, text+image rows, or grids) show at the top of the gallery page. If **Hide All Media section** is *off*, the **All Media** section then shows the grid of everything in the **Images (All Media)** list.
- **Where to edit**: Open a **Gallery** document. Find **Hide All Media section** (controls whether the All Media grid is visible) and the **Layout blocks** section (above **Images (All Media)**).
- **How to add blocks**:
  1. Click **Add item** in **Layout blocks**.
  2. Choose:
     - **Text block** — a full-width paragraph (rich text: bold, links, lists). Set Font and Text size, then add Content.
     - **Image block** — a full-width single image with optional caption.
     - **Text + Image row** — text and image side by side on desktop, stacked on small screens. Choose **Layout (desktop)**: “Text left, image right” or “Image left, text right”. Optionally set **Order on small screens**: “Text first” or “Image first”. Fill in Font, Text size, and **Content (text side)**; add **Image** and **Image caption**.
     - **Grid** — a multi-column grid of text and image cells. Set **Columns (desktop)** to 2, 3, or 4. Add **Cells**: choose **Text** or **Image** for each cell (same options as the blocks above). Cells flow left-to-right, top-to-bottom. The layout is responsive (fewer columns on small screens).
  3. You can add several blocks and **drag to reorder**. The order here is the order on the website.
  4. Click **Save** and **Publish** when ready.
- **All Media**: The **Images (All Media)** list is the “All Media” section on the site. It only appears when **Hide All Media section** is *off*. When it appears, it shows *below* your custom layout blocks. You can reorder those images with the drag handle.

**Tips**: Use layout blocks for an intro, a featured image, a text+image row, or a grid of cells; use All Media for the full set of works. With **Hide All Media section** *on* (default), the page shows only layout blocks—good for narrative or single-piece galleries. Turn it *off* to show the full image grid.

### 2.5 Reordering galleries in the Works menu

1. Open the **Series** document.
2. In the **Galleries** array, drag items using the handle to change their order.
3. Click **Save**.

---

## 3. Info pages (About, CV, Press)

1. In the sidebar, open **Info Page** (or the document for About, CV, or Press).
2. Edit **Title** and **Body** (rich text: bold, links, lists, etc.).
3. Click **Save** and **Publish**.

*What you’ll see on the site*: These appear under the **Info** menu in the top bar.

---

## 4. Contact

1. Open the **Contact** document (there is usually a single one).
2. Edit the **Body** content (e.g. email, address, or short message).
3. Click **Save** and **Publish**.

*What you’ll see on the site*: The **Contact** link in the top bar goes to this page.

---

## 5. Home (hero and intro)

1. Open the **Home** document.
2. **Hero image**: upload or select an image. It appears at the top of the homepage and may also be used in the header area.
3. **Intro**: add a short paragraph (rich text) below the hero.
4. Click **Save** and **Publish**.

*What you’ll see on the site*: The homepage shows this hero and intro. The site title in the middle of the header comes from **Site Settings** (see below).

---

## 6. Site settings

1. Open **Site Settings**.
2. **Title**: set the name that appears in the **middle of the top bar** on the website (e.g. “OMRGR”). This is what visitors see as the main site name.
3. Optionally add a **Logo** image.
4. Click **Save** and **Publish**.

---

## 7. Publishing and seeing changes on the site

- When you click **Publish** in the Studio, changes are saved immediately.
- The **website** will show updates after a short delay (usually within about a minute), or when an on-demand revalidation is triggered.
- If you don’t see your changes, wait a moment and refresh the page.

---

## Quick reference — what controls what

| In Sanity        | On the website                          |
|------------------|-----------------------------------------|
| Site Settings    | Title in the middle of the header       |
| Home             | Homepage hero image and intro           |
| Series + Gallery | Works menu and gallery pages            |
| Gallery → Layout blocks | Text and images on the gallery page |
| Gallery → Layout blocks → Text + Image row | Text and image in one row (side-by-side on desktop, stacked on mobile) |
| Gallery → Layout blocks → Grid | Multi-column grid of text and image cells (responsive) |
| Gallery → Images (All Media) | “All Media” grid on gallery page (only if Hide All Media section is *off*) |
| Info Page        | About, CV, Press (under Info menu)      |
| Contact          | Contact page                            |

---

**Need a token for the bootstrap script?**  
In [sanity.io/manage](https://sanity.io/manage), open your project → **API** → **Tokens**, create a token with **Editor** access, and add it to `.env.local` as `SANITY_API_TOKEN`.
