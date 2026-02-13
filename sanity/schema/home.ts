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
      name: "intro",
      type: "array",
      of: [{ type: "block" }],
      description: "Short intro copy below hero",
    }),
  ],
});
