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
