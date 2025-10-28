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
