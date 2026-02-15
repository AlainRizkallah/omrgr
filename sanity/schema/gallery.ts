import { defineField, defineType } from "sanity";
import { GalleryLayoutBlockTextInput } from "../components/GalleryLayoutBlockTextInput";

/** Font choice for layout block text (matches site UI) */
const LAYOUT_BLOCK_FONT_OPTIONS = [
  { value: "serif", title: "Serif (editorial)" },
  { value: "sans", title: "Sans" },
] as const;

/** Text size for layout block (matches site UI) */
const LAYOUT_BLOCK_TEXT_SIZE_OPTIONS = [
  { value: "sm", title: "Small" },
  { value: "base", title: "Base" },
  { value: "lg", title: "Large" },
] as const;

const FONT_LABELS: Record<string, string> = { serif: "Serif", sans: "Sans" };
const TEXT_SIZE_LABELS: Record<string, string> = { sm: "Small", base: "Base", lg: "Large" };

/** Text block for gallery custom layout (appears above All Media grid) */
export const galleryLayoutBlockTextType = defineType({
  name: "galleryLayoutBlockText",
  title: "Text block",
  type: "object",
  fields: [
    defineField({
      name: "font",
      type: "string",
      title: "Font",
      description: "Font used on the gallery page.",
      options: {
        list: [...LAYOUT_BLOCK_FONT_OPTIONS],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "serif",
    }),
    defineField({
      name: "textSize",
      type: "string",
      title: "Text size",
      description: "Base text size on the gallery page.",
      options: {
        list: [...LAYOUT_BLOCK_TEXT_SIZE_OPTIONS],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "base",
    }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }],
      title: "Content",
      description: "Rich text (paragraphs, bold, links, etc.)",
    }),
  ],
  preview: {
    select: { font: "font", textSize: "textSize" },
    prepare({ font, textSize }) {
      const fontLabel = FONT_LABELS[font] ?? "Serif";
      const sizeLabel = TEXT_SIZE_LABELS[textSize] ?? "Base";
      return {
        title: "Text block",
        subtitle: `${fontLabel}, ${sizeLabel}`,
      };
    },
  },
  components: {
    input: GalleryLayoutBlockTextInput,
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

const ROW_LAYOUT_OPTIONS = [
  { value: "textLeft", title: "Text left, image right" },
  { value: "imageLeft", title: "Image left, text right" },
] as const;

const ROW_MOBILE_ORDER_OPTIONS = [
  { value: "textFirst", title: "Text first" },
  { value: "imageFirst", title: "Image first" },
] as const;

/** Text + Image row: side-by-side on desktop, stacked on mobile */
export const galleryLayoutBlockRowType = defineType({
  name: "galleryLayoutBlockRow",
  title: "Text + Image row",
  type: "object",
  fields: [
    defineField({
      name: "layout",
      type: "string",
      title: "Layout (desktop)",
      description: "Which side is text, which is image.",
      options: {
        list: [...ROW_LAYOUT_OPTIONS],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "textLeft",
    }),
    defineField({
      name: "mobileOrder",
      type: "string",
      title: "Order on small screens",
      description: "When stacked on mobile: text first or image first.",
      options: {
        list: [...ROW_MOBILE_ORDER_OPTIONS],
        layout: "radio",
        direction: "horizontal",
      },
    }),
    defineField({
      name: "font",
      type: "string",
      title: "Font (text side)",
      options: {
        list: [...LAYOUT_BLOCK_FONT_OPTIONS],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "serif",
    }),
    defineField({
      name: "textSize",
      type: "string",
      title: "Text size (text side)",
      options: {
        list: [...LAYOUT_BLOCK_TEXT_SIZE_OPTIONS],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "base",
    }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }],
      title: "Content (text side)",
      description: "Rich text for the text side of the row.",
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      options: { hotspot: true },
    }),
    defineField({
      name: "caption",
      type: "string",
      title: "Image caption",
    }),
  ],
  preview: {
    select: { layout: "layout" },
    prepare({ layout }) {
      const label = layout === "imageLeft" ? "Image left" : "Text left";
      return { title: "Text + Image row", subtitle: label };
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
        { type: "galleryLayoutBlockRow" },
      ],
    }),
    defineField({
      name: "hideAllMediaSection",
      type: "boolean",
      title: "Hide All Media section",
      description: "When enabled, the All Media grid is hidden on the gallery page. Layout blocks (if any) are still shown.",
      initialValue: true,
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
