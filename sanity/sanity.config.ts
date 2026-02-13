import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schema";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: "default",
  title: "Showcase CMS",
  projectId: projectId || "placeholder",
  dataset: dataset || "production",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
