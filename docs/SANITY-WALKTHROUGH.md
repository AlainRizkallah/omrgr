# Sanity CMS — Quick walkthrough for the client

This guide explains how to manage your showcase site content using Sanity.

## 1. Opening Sanity Studio

- **Hosted Studio**: After project setup, your Studio is at  
  `https://YOUR_PROJECT_ID.sanity.studio`  
  (Replace `YOUR_PROJECT_ID` with your Sanity project ID from the dashboard.)
- Log in with the Sanity account that has access to this project.

## 2. Works (series and galleries)

### Creating a Series

1. In the Studio sidebar, click **Series** (or **Create new** and choose **Series**).
2. Fill in:
   - **Title** (e.g. “Relief Paintings”, “Chairs”).
   - **Slug**: click **Generate** from title, or type a URL-friendly slug (e.g. `chairs`).
   - **Order**: number to control the order in the Works menu (e.g. 0, 1, 2).
3. **Save** (publish when ready).

### Creating a Gallery

1. Click **Gallery** (or **Create new** → **Gallery**).
2. Fill in:
   - **Title** (e.g. “Ready to Ship”, “Main”).
   - **Slug** (e.g. `main`, `ready-to-ship`).
   - **Series**: select the series this gallery belongs to.
3. **Save**.

### Adding and reordering images

1. Open a **Gallery** document.
2. In the **Images** array, click **Add item**.
3. For each item:
   - **Asset**: click to **upload** a new image (drag-and-drop or browse), or choose an existing asset.
   - **Alt**: short description for accessibility.
   - **Caption**: optional caption.
4. **Reordering**: use the **drag handle** (left side of each row) to change the order. The order in the list is the order on the site.
5. **Save** (and **Publish** when you want changes to go live).

### Reordering galleries in the Works menu

1. Open the **Series** document.
2. In the **Galleries** array, drag items using the handle to change their order.
3. **Save**.

## 3. Info pages (About, CV, Press)

1. In the sidebar, open **Info Page** (or the specific document for About, CV, or Press).
2. Edit **Title** and **Body** (rich text: bold, links, lists, etc.).
3. **Save** and **Publish**.

## 4. Contact

1. Open the **Contact** document (there is usually a single one).
2. Edit the **Body** content (e.g. email, address, or short message).
3. **Save** and **Publish**.

## 5. Home (hero and intro)

1. Open the **Home** document.
2. **Hero image**: upload or select an image to show at the top of the homepage.
3. **Intro**: add a short paragraph (rich text) below the hero.
4. **Save** and **Publish**.

## 6. Site settings (optional)

1. Open **Site Settings**.
2. Set **Title** (used in the header).
3. Optionally add a **Logo** image.
4. **Save** and **Publish**.

## 7. Publishing and seeing changes on the site

- Changes in the Studio are saved to Sanity immediately.
- The **website** will show updates after revalidation (typically within about a minute, or when an on-demand revalidation is triggered).
- If you don’t see updates, wait a short while and refresh the site.

---

**Need a token for the bootstrap script?**  
In [sanity.io/manage](https://sanity.io/manage), open your project → **API** → **Tokens**, create a token with **Editor** access, and add it to `.env.local` as `SANITY_API_TOKEN`.
