import { defineType, defineField } from 'sanity';
import { ShieldCheck } from 'lucide-react';

export default defineType({
  name: 'compliance-1',
  title: 'Compliance 1',
  type: 'object',
  icon: ShieldCheck,
  fields: [
    defineField({
      name: 'padding',
      type: 'section-padding',
    }),
    defineField({
      name: 'colorVariant',
      type: 'color-variant',
      title: 'Color Variant',
      description: 'Select a background color variant',
    }),
    defineField({
      name: 'tagLine',
      title: 'Tag Line',
      type: 'string',
      description: 'Small text above the title (e.g., "Compliance")',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'badges',
      title: 'Compliance Badges',
      type: 'array',
      of: [
        defineField({
          name: 'badge',
          title: 'Badge',
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Badge Image',
              type: 'image',
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative Text',
                },
              ],
            },
            {
              name: 'label',
              title: 'Label',
              type: 'string',
            },
          ],
          preview: {
            select: {
              title: 'label',
              media: 'image',
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        defineField({
          name: 'feature',
          title: 'Feature',
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Choose an icon',
              options: {
                list: [
                  { title: 'Lock Keyhole', value: 'lock-keyhole' },
                  { title: 'Shield Check', value: 'shield-check' },
                  { title: 'Users', value: 'users' },
                  { title: 'File Check', value: 'file-check' },
                  { title: 'Shield', value: 'shield' },
                  { title: 'Award', value: 'award' },
                ],
              },
            },
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(3),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      tagLine: 'tagLine',
    },
    prepare({ title, tagLine }) {
      return {
        title: 'Compliance',
        subtitle: title || tagLine || 'No Title',
      };
    },
  },
});
