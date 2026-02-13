import { defineField, defineType } from "sanity";

/** Text block for gallery custom layout (appears above All Media grid) */
export const galleryLayoutBlockTextType = defineType({
  name: "galleryLayoutBlockText",
  title: "Text block",
  type: "object",
  fields: [
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }],
      description: "Rich text (paragraphs, bold, links, etc.)",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Text block" };
    },
  },
});

/** Image block for gallery custom layout */
export const galleryLayoutBlockImageType = defineType({
  name: "galleryLayoutBlockImage",
  title: "Image block",
  type: "object",
  fields: [
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "caption",
      type: "string",
    }),
  ],
  preview: {
    select: { caption: "caption" },
    prepare({ caption }) {
      return { title: caption ? `Image: ${caption}` : "Image block" };
    },
  },
});

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
      name: "layoutBlocks",
      type: "array",
      title: "Layout blocks",
      description: "Optional text and images shown at the top of this gallery page. Reorder by dragging. Below this, the Images list appears as \"All Media\" on the site.",
      of: [
        { type: "galleryLayoutBlockText" },
        { type: "galleryLayoutBlockImage" },
      ],
    }),
    defineField({
      name: "images",
      type: "array",
      title: "Images (All Media)",
      description: "All images shown in the All Media grid at the bottom of the gallery page.",
      of: [{ type: "galleryImage" }],
    }),
  ],
});
