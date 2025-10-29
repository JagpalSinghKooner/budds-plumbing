import { defineField, defineType } from 'sanity';
import { Newspaper } from 'lucide-react';

export default defineType({
  name: 'all-posts',
  type: 'object',
  title: 'All Posts',
  description: 'A list of all posts',
  icon: Newspaper,
  fields: [
    defineField({
      name: 'variant',
      type: 'string',
      title: 'Variant',
      description: 'Rendering variant for this block',
      initialValue: 'all-posts',
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
  ],
  preview: {
    prepare() {
      return {
        title: 'All Posts',
      };
    },
  },
});
