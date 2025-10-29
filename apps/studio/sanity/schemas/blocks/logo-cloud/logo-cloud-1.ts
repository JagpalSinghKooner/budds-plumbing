import { defineType, defineField } from 'sanity';
import { Images } from 'lucide-react';

export default defineType({
  name: 'logo-cloud-1',
  type: 'object',
  icon: Images,
  fields: [
    defineField({
      name: 'variant',
      type: 'string',
      title: 'Variant',
      description: 'Rendering variant for this block',
      initialValue: 'logo-cloud-1',
      hidden: true,
    }),
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
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'images',
      type: 'array',
      of: [
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: 'Logo Cloud',
        subtitle: title || 'No Title',
      };
    },
  },
});
