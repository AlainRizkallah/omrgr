import { defineField, defineType } from "sanity";
import { GalleryLayoutBlockTextInput } from "../components/GalleryLayoutBlockTextInput";

/** Font choice for layout block text (matches site UI). Use a plain array so Sanity Studio shows all options. */
const LAYOUT_BLOCK_FONT_OPTIONS: { value: string; title: string }[] = [
  { value: "serif", title: "Serif (editorial)" },
  { value: "sans", title: "Sans" },
  { value: "eczar", title: "Eczar" },
  { value: "hal-timezone", title: "HAL Timezone" },
];

/** Text size for layout block (matches site UI) */
const LAYOUT_BLOCK_TEXT_SIZE_OPTIONS = [
  { value: "sm", title: "Small" },
  { value: "base", title: "Base" },
  { value: "lg", title: "Large" },
] as const;

const FONT_LABELS: Record<string, string> = {
  serif: "Serif",
  sans: "Sans",
  eczar: "Eczar",
  "hal-timezone": "HAL Timezone",
};
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
      title: "Caption",
      description: "Optional short caption (e.g. for accessibility and figcaption).",
    }),
    defineField({
      name: "textBelowFont",
      type: "string",
      title: "Font (text below)",
      description: "Font for the optional text block below the image.",
      options: {
        list: [...LAYOUT_BLOCK_FONT_OPTIONS],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "serif",
    }),
    defineField({
      name: "textBelowTextSize",
      type: "string",
      title: "Text size (text below)",
      options: {
        list: [...LAYOUT_BLOCK_TEXT_SIZE_OPTIONS],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "base",
    }),
    defineField({
      name: "textBelowBody",
      type: "array",
      of: [{ type: "block" }],
      title: "Text below image",
      description: "Optional rich text below the image (same formatting as text blocks: paragraphs, bold, links, lists).",
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
      description: "Optional short caption for the image.",
    }),
    defineField({
      name: "textBelowFont",
      type: "string",
      title: "Font (text below image)",
      options: {
        list: [...LAYOUT_BLOCK_FONT_OPTIONS],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "serif",
    }),
    defineField({
      name: "textBelowTextSize",
      type: "string",
      title: "Text size (text below image)",
      options: {
        list: [...LAYOUT_BLOCK_TEXT_SIZE_OPTIONS],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "base",
    }),
    defineField({
      name: "textBelowBody",
      type: "array",
      of: [{ type: "block" }],
      title: "Text below image",
      description: "Optional rich text below the image (same formatting as text blocks).",
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

/** Text cell inside a Grid layout block */
export const galleryGridCellTextType = defineType({
  name: "galleryGridCellText",
  title: "Text",
  type: "object",
  fields: [
    defineField({
      name: "font",
      type: "string",
      title: "Font",
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
    }),
  ],
  preview: {
    prepare() {
      return { title: "Text", subtitle: "Text cell" };
    },
  },
});

/** Image cell inside a Grid layout block */
export const galleryGridCellImageType = defineType({
  name: "galleryGridCellImage",
  title: "Image",
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
      title: "Caption",
      description: "Optional short caption for the image.",
    }),
    defineField({
      name: "textBelowFont",
      type: "string",
      title: "Font (text below)",
      options: {
        list: [...LAYOUT_BLOCK_FONT_OPTIONS],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "serif",
    }),
    defineField({
      name: "textBelowTextSize",
      type: "string",
      title: "Text size (text below)",
      options: {
        list: [...LAYOUT_BLOCK_TEXT_SIZE_OPTIONS],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "base",
    }),
    defineField({
      name: "textBelowBody",
      type: "array",
      of: [{ type: "block" }],
      title: "Text below image",
      description: "Optional rich text below the image (same formatting as text blocks).",
    }),
  ],
  preview: {
    select: { caption: "caption" },
    prepare({ caption }) {
      return { title: "Image", subtitle: caption ? caption : "Image cell" };
    },
  },
});

const GRID_COLUMNS_OPTIONS = [
  { value: "2", title: "2" },
  { value: "3", title: "3" },
  { value: "4", title: "4" },
] as const;

/** Grid layout block: multiple columns and rows of text/image cells */
export const galleryLayoutBlockGridType = defineType({
  name: "galleryLayoutBlockGrid",
  title: "Grid",
  type: "object",
  fields: [
    defineField({
      name: "columns",
      type: "string",
      title: "Columns (desktop)",
      description: "Number of columns on large screens. On smaller screens the grid uses fewer columns (responsive).",
      options: {
        list: [...GRID_COLUMNS_OPTIONS],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "2",
    }),
    defineField({
      name: "items",
      type: "array",
      title: "Cells",
      description: "Add text or image cells. Order is left-to-right, top-to-bottom.",
      of: [
        { type: "galleryGridCellText" },
        { type: "galleryGridCellImage" },
      ],
    }),
  ],
  preview: {
    select: { columns: "columns", items: "items" },
    prepare({ columns, items }) {
      const count = Array.isArray(items) ? items.length : 0;
      return {
        title: "Grid",
        subtitle: `${columns ?? 2} columns, ${count} item${count !== 1 ? "s" : ""}`,
      };
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
      title: "Caption",
      description: "Optional caption for the image.",
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
      description: "Text and images for this gallery page. Reorder by dragging.",
      of: [
        { type: "galleryLayoutBlockText" },
        { type: "galleryLayoutBlockImage" },
        { type: "galleryLayoutBlockRow" },
        { type: "galleryLayoutBlockGrid" },
      ],
    }),
  ],
});
