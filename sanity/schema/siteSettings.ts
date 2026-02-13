import { defineField, defineType } from "sanity";

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
  ],
});
