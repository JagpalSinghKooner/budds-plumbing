import { defineField, defineType } from 'sanity';
import { Captions } from 'lucide-react';
import { STACK_ALIGN, SECTION_WIDTH } from '../shared/layout-variants';

export default defineType({
  name: 'cta-1',
  title: 'CTA 1',
  type: 'object',
  icon: Captions,
  fields: [
    defineField({
      name: 'variant',
      title: 'Layout Variant',
      type: 'string',
      description: 'Choose the visual layout for this CTA section',
      options: {
        list: [
          { title: 'CTA 1 - Centered', value: 'cta-1' },
          { title: 'CTA 2 - Split with Image', value: 'cta-2' },
          { title: 'CTA 3 - Banner Style', value: 'cta-3' },
        ],
        layout: 'radio',
      },
      initialValue: 'cta-1',
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
      name: 'sectionWidth',
      type: 'string',
      title: 'Section Width',
      options: {
        list: SECTION_WIDTH.map(({ title, value }) => ({ title, value })),
        layout: 'radio',
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'stackAlign',
      type: 'string',
      title: 'Stack Layout Alignment',
      options: {
        list: STACK_ALIGN.map(({ title, value }) => ({ title, value })),
        layout: 'radio',
      },
      initialValue: 'left',
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
        title: 'CTA 1',
        subtitle: title,
      };
    },
  },
});
