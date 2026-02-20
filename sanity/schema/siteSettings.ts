import { defineField, defineType } from "sanity";

const SITE_FONT_OPTIONS = [
  { value: "corbert", title: "Corbert" },
  { value: "eczar", title: "Eczar" },
  { value: "serif", title: "Serif (editorial)" },
  { value: "sans", title: "Sans" },
  { value: "hal-timezone", title: "HAL Timezone" },
] as const;

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "Site title (e.g. for header)",
    }),
    defineField({
      name: "logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "fontFamily",
      type: "string",
      title: "Site font",
      description: "Font used across the whole website.",
      options: {
        list: [...SITE_FONT_OPTIONS],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "eczar",
    }),
  ],
});
