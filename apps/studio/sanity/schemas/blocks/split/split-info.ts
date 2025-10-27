import { defineField, defineType } from 'sanity';
import { Info } from 'lucide-react';

function extractPlainText(blocks: any): string {
  if (!blocks) return '';
  if (!Array.isArray(blocks)) return '';
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) {
        return '';
      }
      return block.children.map((child: any) => child.text).join('');
    })
    .join(' ');
}

export default defineType({
  name: 'split-info',
  type: 'object',
  icon: Info,
  title: 'Split Info',
  description:
    'Column with a title, content body, image and tags. Part of a split cards.',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
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
      name: 'tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'body',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'No Title',
        subtitle: extractPlainText(subtitle) || 'No Subtitle',
      };
    },
  },
});
