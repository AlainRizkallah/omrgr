/**
 * Sanity CLI config: projectId and dataset for `sanity deploy` and other CLI commands.
 * Loads .env.local from the repo root so NEXT_PUBLIC_SANITY_* are set.
 */
const path = require("path");
const { defineCliConfig } = require("sanity/cli");

// Load .env.local from repo root (parent of sanity/)
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env.local") });

// Expose as SANITY_STUDIO_* so sanity.config.ts gets them inlined at build time (no process in browser)
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
if (projectId) process.env.SANITY_STUDIO_PROJECT_ID = projectId;
if (dataset) process.env.SANITY_STUDIO_DATASET = dataset;

if (!projectId || projectId === "placeholder") {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Set it in .env.local (in the repo root), then run: cd sanity && npx sanity deploy"
  );
}

module.exports = defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: "omrgr",
});
