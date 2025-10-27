import { defineType, defineField } from 'sanity';
import { ListCollapse } from 'lucide-react';

export default defineType({
  name: 'faqs',
  type: 'object',
  icon: ListCollapse,
  fields: [
    defineField({
      name: 'variant',
      title: 'Layout Variant',
      type: 'string',
      description: 'Choose the visual layout for this FAQ section',
      options: {
        list: [
          { title: 'FAQ 1 - Simple List', value: 'faq-1' },
          { title: 'FAQ 2 - Accordion Style', value: 'faq-2' },
          { title: 'FAQ 3 - Two Column', value: 'faq-3' },
        ],
        layout: 'radio',
      },
      initialValue: 'faq-1',
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
      name: 'faqs',
      type: 'array',
      title: 'FAQs',
      of: [
        {
          name: 'faq',
          type: 'reference',
          to: [{ type: 'faq' }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'faqs.0.title',
    },
    prepare({ title }) {
      return {
        title: 'FAQs',
        subtitle: title || 'No Title',
      };
    },
  },
});
