import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BlockChild {
  text: string;
  _type?: string;
}

interface Block {
  _type: string;
  children?: BlockChild[];
}

export function extractPlainText(blocks: unknown): string {
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

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}
