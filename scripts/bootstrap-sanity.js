/**
 * Bootstrap Sanity with content from the Pictures folder and placeholder text.
 * Run: node scripts/bootstrap-sanity.js
 * Requires: .env.local with NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN (write)
 */
const fs = require("fs");
const path = require("path");

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_TOKEN;
const API_VERSION = "2024-01-01";

if (!PROJECT_ID || PROJECT_ID === "placeholder") {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
  process.exit(1);
}
if (!TOKEN) {
  console.error("Set SANITY_API_TOKEN in .env.local (token with Editor access)");
  process.exit(1);
}

const PICTURES_DIR = path.join(process.cwd(), "Pictures");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

async function mutate(mutations) {
  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ mutations }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sanity mutate failed: ${res.status} ${text}`);
  }
  return res.json();
}

async function uploadImage(filePath) {
  const buffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v2024-06-24/assets/images/${DATASET}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/octet-stream",
        "Content-Length": buffer.length,
        "Content-Disposition": `inline; filename="${fileName}"`,
      },
      body: buffer,
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed for ${fileName}: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.document?._id || data.document?.id || data.id;
}

function main() {
  if (!fs.existsSync(PICTURES_DIR)) {
    console.log("Pictures folder not found. Creating placeholder content only.");
  }

  const seriesOrder = ["chairs", "paintings", "interior-design"];
  const folderToSlug = { Chairs: "chairs", Paintings: "paintings", "Interior Design": "interior-design" };
  const folders = fs.existsSync(PICTURES_DIR)
    ? fs.readdirSync(PICTURES_DIR, { withFileTypes: true }).filter((d) => d.isDirectory())
    : [];

  (async () => {
    try {
      // 1. Site settings
      await mutate([
        {
          createOrReplace: {
            _type: "siteSettings",
            _id: "siteSettings",
            title: "Showcase",
          },
        },
      ]);
      console.log("Created site settings");

      // 2. Series and galleries (one gallery per series)
      const seriesIds = {};
      const galleryIds = {};
      for (let i = 0; i < seriesOrder.length; i++) {
        const slug = seriesOrder[i];
        const title = slug === "chairs" ? "Chairs" : slug === "paintings" ? "Paintings" : "Interior Design";
        const seriesId = `series-${slug}`;
        seriesIds[slug] = seriesId;
        await mutate([
          {
            create: {
              _type: "series",
              _id: seriesId,
              title,
              slug: { _type: "slug", current: slug },
              order: i,
              galleries: [],
            },
          },
        ]);
        const galleryId = `gallery-${slug}-main`;
        galleryIds[slug] = galleryId;
        await mutate([
          {
            create: {
              _type: "gallery",
              _id: galleryId,
              title: "Main",
              slug: { _type: "slug", current: "main" },
              series: { _type: "reference", _ref: seriesId },
              images: [],
            },
          },
        ]);
        await mutate([
          { patch: { id: seriesId, set: { galleries: [{ _type: "reference", _ref: galleryId }] } } },
        ]);
      }
      console.log("Created series and galleries");

      // 3. Upload images from Pictures and add to galleries
      for (const folder of folders) {
        const slug = folderToSlug[folder.name];
        if (!slug || !galleryIds[slug]) continue;
        const dir = path.join(PICTURES_DIR, folder.name);
        const files = fs.readdirSync(dir).filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()));
        const imageRefs = [];
        for (const file of files.slice(0, 20)) {
          const filePath = path.join(dir, file);
          try {
            const assetId = await uploadImage(filePath);
            const title = path.basename(file, path.extname(file));
            imageRefs.push({
              _type: "galleryImage",
              _key: path.basename(file, path.extname(file)) + "-" + Date.now(),
              asset: { _type: "reference", _ref: assetId },
              alt: title,
              caption: title,
            });
          } catch (e) {
            console.warn("Skip image", file, e.message);
          }
        }
        if (imageRefs.length > 0) {
          await mutate([
            { patch: { id: galleryIds[slug], set: { images: imageRefs } } },
          ]);
          console.log(`Uploaded ${imageRefs.length} images to ${folder.name}`);
        }
      }

      // 4. Info pages (placeholder text)
      const blocks = (text) => [
        { _type: "block", _key: "k1", children: [{ _type: "span", _key: "s1", text }], markDefs: [] },
      ];
      for (const slug of ["about", "cv", "press"]) {
        const titles = { about: "About", cv: "CV", press: "Press" };
        const placeholders = {
          about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Add your about content in Sanity Studio.",
          cv: "Education, exhibitions, and experience. Replace this placeholder in Sanity Studio.",
          press: "Press and publications. Replace this placeholder in Sanity Studio.",
        };
        await mutate([
          {
            createOrReplace: {
              _type: "infoPage",
              _id: `info-${slug}`,
              slug,
              title: titles[slug],
              body: blocks(placeholders[slug]),
            },
          },
        ]);
      }
      console.log("Created Info pages (About, CV, Press)");

      // 5. Contact
      await mutate([
        {
          createOrReplace: {
            _type: "contact",
            _id: "contact",
            body: blocks("Get in touch. Add your contact details in Sanity Studio."),
          },
        },
      ]);
      console.log("Created Contact page");

      // 6. Home (no hero ref unless we set one)
      await mutate([
        {
          createOrReplace: {
            _type: "home",
            _id: "home",
            intro: blocks(
              "Welcome. This is placeholder intro text. Edit the Home document in Sanity Studio to add your hero image and intro."
            ),
          },
        },
      ]);
      console.log("Created Home document");
      console.log("Bootstrap done. Open your site and Sanity Studio to edit content.");
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  })();
}

main();
