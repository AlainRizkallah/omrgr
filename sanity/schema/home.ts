import { defineField, defineType } from "sanity";

export const homeType = defineType({
  name: "home",
  title: "Home",
  type: "document",
  fields: [
    defineField({
      name: "heroImage",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroImageMargin",
      type: "string",
      title: "Hero image margin",
      description: "Space around the hero image (more margin = smaller visible image)",
      options: {
        list: [
          { title: "None (edge to edge)", value: "none" },
          { title: "Small", value: "small" },
          { title: "Medium", value: "medium" },
          { title: "Large", value: "large" },
        ],
        layout: "radio",
      },
      initialValue: "medium",
    }),
    defineField({
      name: "intro",
      type: "array",
      of: [{ type: "block" }],
      description: "Short intro copy below hero",
    }),
  ],
});
