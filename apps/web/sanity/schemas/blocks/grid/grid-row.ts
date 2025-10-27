import { defineField, defineType } from 'sanity';
import { LayoutGrid } from 'lucide-react';
import { COLS_VARIANTS } from '../shared/layout-variants';

export default defineType({
  name: 'grid-row',
  title: 'Grid Row',
  type: 'object',
  icon: LayoutGrid,
  fields: [
    defineField({
      name: 'variant',
      title: 'Layout Variant',
      type: 'string',
      description:
        'Choose the visual layout for this grid section (used for pricing and other grid content)',
      options: {
        list: [
          { title: 'Pricing 1 - Card Grid', value: 'pricing-1' },
          { title: 'Pricing 2 - Highlighted Center', value: 'pricing-2' },
          { title: 'Pricing 3 - Compact List', value: 'pricing-3' },
        ],
        layout: 'radio',
      },
      initialValue: 'pricing-1',
      validation: (Rule) => Rule.required(),
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
      name: 'gridColumns',
      type: 'string',
      title: 'Grid Columns',
      options: {
        list: COLS_VARIANTS.map(({ title, value }) => ({ title, value })),
        layout: 'radio',
      },
      initialValue: 'grid-cols-3',
    }),
    // add only the blocks you need
    defineField({
      name: 'columns',
      type: 'array',
      of: [
        { type: 'grid-card' },
        { type: 'grid-post' },
        { type: 'pricing-card' },
      ],
      options: {
        insertMenu: {
          views: [
            {
              name: 'grid',
              previewImageUrl: (block) => `/sanity/preview/${block}.jpg`,
            },
            { name: 'list' },
          ],
        },
      },
    }),
  ],
  preview: {
    select: {
      title: 'columns.0.title',
      postTitle: 'columns.0.post.title',
    },
    prepare({ title, postTitle }) {
      return {
        title: 'Grid Row',
        subtitle: title || postTitle,
      };
    },
  },
});
