import { defineField, defineType } from 'sanity';
import { Info } from 'lucide-react';

interface BlockChild {
  text: string;
  _type?: string;
}

interface Block {
  _type: string;
  children?: BlockChild[];
}

function extractPlainText(blocks: unknown): string {
  if (!blocks) return '';
  if (!Array.isArray(blocks)) return '';
  return blocks
    .map((block: Block) => {
      if (block._type !== 'block' || !block.children) {
        return '';
      }
      return block.children.map((child: BlockChild) => child.text).join('');
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
