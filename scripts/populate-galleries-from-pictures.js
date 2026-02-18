/**
 * Populate Sanity galleries with layout blocks: intro text + Text+Image rows from Pictures folders.
 * Run: node scripts/populate-galleries-from-pictures.js
 * Requires: .env.local with NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN (write)
 *
 * Edit the INTRO_TEXTS and optional ROW_TEXT_FN below to tweak copy, then re-run.
 */
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "..", ".env.local") });

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

// ——— Config: edit intro texts and row text here ———
const INTRO_TEXTS = {
  chairs: `Our sculptural chairs are not just objects of utility; they are artistic statements born from a dialogue between the designer's vision and the maker's hand. We believe that true luxury lies in the story behind the object.

Each piece in this limited series collection is carved from high-end American Walnut and aromatic Cedar timbers chosen for their enduring character and rich grain. But the soul of these chairs comes from their creation. We partner directly with local workshops, reviving age-old joinery and finishing methods that have been passed down through generations.

This collaboration is more than a production process; it is a commitment to empowering our artisan community. By bridging contemporary design with traditional expertise, we are building a sustainable, mutually beneficial relationship between concept and craft ensuring that every chair is as ethical as it is beautiful.`,
  lamps: `Our sculptural lamps are born from the coast of North Lebanon, where the sea is a way of life. This collection is a personal tribute to my hometown, a celebration of the hands that have built and repaired our local fishing fleet for generations.

We have partnered directly with the local fisherman community, translating the industrial strength of boat-building into delicate, luminous forms. Using the same raw fiberglass and resin that protect vessels against the Mediterranean waves, we are casting light through a material traditionally reserved for the sea.

This collaboration creates a new dialogue between design and survival skills. By applying these age-old boat-building methods to contemporary lighting, we are empowering the artisan community with a sustainable new craft preserving their expertise while illuminating our interiors with the soul of the coast.`,
  collaborations: `We believe that the boldest ideas emerge when disciplines collide. We actively seek to dissolve the boundaries between architecture, art, and product design by joining forces with fellow visionaries.

Our Collaboration Series is a dedicated space for co-creation to explore new narratives in form and space. Whether it is a limited edition furniture capsule or a site specific interior installation, these projects are born from a shared dialogue, merging our distinct voices to create a singular, unique expression that neither of us could achieve alone.`,
  
}

const ROW_TEMPLATE = {
  year: "2025",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
};

/** Optional: return Portable Text body (array of blocks) for each Text+Image row. Title (h3), date (italic), then body (normal). */
function rowBodyForFile(seriesKey, fileName) {
  const baseName = path.basename(fileName, path.extname(fileName));
  const key = () => "b-" + Math.random().toString(36).slice(2, 10);
  const spanKey = () => "s-" + Math.random().toString(36).slice(2, 10);
  return [
    {
      _type: "block",
      _key: key(),
      style: "h3",
      children: [{ _type: "span", _key: spanKey(), text: baseName }],
      markDefs: [],
    },
    {
      _type: "block",
      _key: key(),
      style: "normal",
      children: [{ _type: "span", _key: spanKey(), text: ROW_TEMPLATE.year, marks: ["em"] }],
      markDefs: [],
    },
    {
      _type: "block",
      _key: key(),
      style: "normal",
      children: [{ _type: "span", _key: spanKey(), text: ROW_TEMPLATE.body }],
      markDefs: [],
    },
  ];
}

/** Build Portable Text body (array of block) from a plain string. Multiple paragraphs (split by \\n\\n) become multiple blocks. */
function portableText(text) {
  const paragraphs = (text || "").split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) paragraphs.push("");
  return paragraphs.map((para) => ({
    _type: "block",
    _key: "b-" + Math.random().toString(36).slice(2, 10),
    children: [{ _type: "span", _key: "s1", text: para }],
    markDefs: [],
  }));
}

async function querySanity(groq) {
  const q = encodeURIComponent(groq);
  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${q}`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
    }
  );
  if (!res.ok) throw new Error(`Query failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.result;
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
  return data.document?._id ?? data.document?.id ?? data.id;
}

/** Gallery config: folder under Pictures/, intro text key, and Sanity series + gallery slugs. */
const GALLERY_CONFIG = [
  { folder: "Chairs", key: "chairs", seriesSlug: "collectable-design", gallerySlug: "sculptural-chairs" },
  { folder: "Lamps", key: "lamps", seriesSlug: "collectable-design", gallerySlug: "sculptural-lamps" },
  { folder: "Paintings", key: "paintings", seriesSlug: "paintings", gallerySlug: "all-paintings" },
  { folder: "Interior Design", key: "interior-design", seriesSlug: "interior-design", gallerySlug: "interior-designs" },
  { folder: "Collaborations", key: "collaborations", seriesSlug: "collectable-design", gallerySlug: "collaborations" },
];

function findGalleryForConfig(galleries, cfg) {
  const norm = (s) => (s || "").toLowerCase().trim();
  return galleries.find(
    (x) => norm(x.seriesSlug) === norm(cfg.seriesSlug) && norm(x.gallerySlug) === norm(cfg.gallerySlug)
  );
}

async function main() {
  // Resolve gallery IDs (include series title in case slugs differ)
  const galleries = await querySanity(
    `*[_type == "gallery"]{
      _id,
      "seriesSlug": series->slug.current,
      "seriesTitle": series->title,
      "gallerySlug": slug.current,
      "galleryTitle": title
    }`
  );
  if (galleries.length === 0) {
    console.error("No galleries found in Sanity. Create at least one Series and one Gallery, then re-run.");
    process.exit(1);
  }
  console.log("Galleries in Sanity:", galleries.map((g) => ({ id: g._id, series: g.seriesSlug || g.seriesTitle, gallery: g.gallerySlug || g.galleryTitle })));

  for (const cfg of GALLERY_CONFIG) {
    const gallery = findGalleryForConfig(galleries, cfg);
    if (!gallery) {
      console.warn(`No matching gallery for folder "${cfg.folder}" (series=${cfg.seriesSlug}, gallery=${cfg.gallerySlug}). Skip.`);
      continue;
    }

    const introText = INTRO_TEXTS[cfg.key] ?? "";
    const dir = path.join(PICTURES_DIR, cfg.folder);
    if (!fs.existsSync(dir)) {
      console.warn(`Folder not found: ${dir}. Setting only intro block.`);
    }

    const files = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
      : [];

    const layoutBlocks = [];

    // 1. Intro text block (Serif, Small) — only if intro text is set
    const introTrimmed = (introText || "").trim();
    if (introTrimmed) {
      layoutBlocks.push({
        _type: "galleryLayoutBlockText",
        _key: "intro-" + cfg.key,
        font: "eczar",
        textSize: "sm",
        body: portableText(introText),
      });
    }

    // 2. One Text + Image row per image (text left, image right, text first, Serif, Small)
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(dir, file);
      let assetId;
      try {
        assetId = await uploadImage(filePath);
      } catch (e) {
        console.warn(`Skip image ${file}:`, e.message);
        continue;
      }
      const rowBody = rowBodyForFile(cfg.key, file);

      layoutBlocks.push({
        _type: "galleryLayoutBlockRow",
        _key: "row-" + cfg.key + "-" + i + "-" + Date.now(),
        layout: "textLeft",
        mobileOrder: "textFirst",
        font: "eczar",
        textSize: "sm",
        body: rowBody,
        image: { _type: "image", asset: { _type: "reference", _ref: assetId } },
        // caption: title,
      });
    }

    await mutate([{ patch: { id: gallery._id, set: { layoutBlocks } } }]);
    console.log(
      `Updated "${cfg.folder}" (${gallery.seriesTitle || gallery.seriesSlug}): 1 intro + ${layoutBlocks.length - 1} text+image rows.`
    );
  }

  console.log("Done. Open Sanity Studio to edit intro texts and row content.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
