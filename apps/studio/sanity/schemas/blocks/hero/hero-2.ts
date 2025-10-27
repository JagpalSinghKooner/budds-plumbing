import { defineField, defineType } from 'sanity';
import { LayoutTemplate } from 'lucide-react';

export default defineType({
  name: 'hero-2',
  title: 'Hero 2',
  type: 'object',
  icon: LayoutTemplate,
  fields: [
    defineField({
      name: 'variant',
      title: 'Layout Variant',
      type: 'string',
      description: 'Choose the visual layout for this hero section',
      options: {
        list: [
          { title: 'Hero 1 - Centered with Image', value: 'hero-1' },
          { title: 'Hero 2 - Split Layout', value: 'hero-2' },
          { title: 'Hero 3 - Full Width Background', value: 'hero-3' },
        ],
        layout: 'radio',
      },
      initialValue: 'hero-2',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagLine',
      type: 'string',
    }),
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'body',
      type: 'block-content',
    }),
    defineField({
      name: 'links',
      type: 'array',
      of: [{ type: 'link' }],
      validation: (rule) => rule.max(2),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: 'Hero 2',
        subtitle: title,
      };
    },
  },
});
