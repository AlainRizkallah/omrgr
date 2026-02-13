import { defineField, defineType } from "sanity";

export const infoPageType = defineType({
  name: "infoPage",
  title: "Info Page",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      type: "string",
      options: {
        list: [
          { title: "About", value: "about" },
          { title: "CV", value: "cv" },
          { title: "Press", value: "press" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
});
