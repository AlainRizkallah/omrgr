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
      title: "Hero image size",
      description: "Small = compact, Medium = balanced, Large = wide, None = edge to edge",
      options: {
        list: [
          { title: "None (edge to edge)", value: "none" },
          { title: "Small (much smaller)", value: "small" },
          { title: "Medium (average)", value: "medium" },
          { title: "Large (wide)", value: "large" },
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
