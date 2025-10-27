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
  name: 'split-info-list',
  type: 'object',
  icon: Info,
  title: 'Split Info List',
  description:
    'Column with list of cards. Each card has a title, content body, image and tags',
  fields: [
    defineField({
      name: 'list',
      type: 'array',
      of: [{ type: 'split-info' }],
    }),
  ],
  preview: {
    select: {
      title: 'list.0.title',
      subtitle: 'list.0.body',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'No Title',
        subtitle: extractPlainText(subtitle) || 'No Subtitle',
      };
    },
  },
});
