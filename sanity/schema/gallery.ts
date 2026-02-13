import { defineField, defineType } from "sanity";

export const galleryImageType = defineType({
  name: "galleryImage",
  title: "Gallery Image",
  type: "object",
  fields: [
    defineField({
      name: "asset",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "alt",
      type: "string",
      description: "Alt text for accessibility",
    }),
    defineField({
      name: "caption",
      type: "string",
    }),
  ],
  preview: {
    select: { alt: "alt" },
    prepare({ alt }) {
      return { title: alt || "Image" };
    },
  },
});

export const galleryType = defineType({
  name: "gallery",
  title: "Gallery",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "series",
      type: "reference",
      to: [{ type: "series" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      type: "array",
      of: [{ type: "galleryImage" }],
    }),
  ],
});
