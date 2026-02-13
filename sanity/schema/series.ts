import { defineField, defineType } from "sanity";

export const seriesType = defineType({
  name: "series",
  title: "Series",
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
      name: "order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "galleries",
      type: "array",
      of: [{ type: "reference", to: [{ type: "gallery" }] }],
    }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
});
