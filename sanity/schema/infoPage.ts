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
      of: [
        {
          type: "block",
          marks: {
            annotations: [
              {
                name: "link",
                type: "object",
                title: "URL",
                fields: [
                  { name: "href", type: "url", title: "URL" },
                  { name: "blank", type: "boolean", title: "Open in new tab", initialValue: false },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      description: "Optional image shown on the right (text stays on the left).",
      options: { hotspot: true },
    }),
  ],
});
