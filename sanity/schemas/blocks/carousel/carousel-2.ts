import { defineField, defineType } from 'sanity';
import { Quote } from 'lucide-react';

export default defineType({
  name: 'carousel-2',
  type: 'object',
  title: 'Carousel 2',
  icon: Quote,
  description: 'A carousel of testimonials',
  fields: [
    defineField({
      name: 'variant',
      title: 'Layout Variant',
      type: 'string',
      description: 'Choose the visual layout for this testimonial carousel',
      options: {
        list: [
          { title: 'Testimonial 1 - Card Style', value: 'testimonial-1' },
          { title: 'Testimonial 2 - Quote Style', value: 'testimonial-2' },
          { title: 'Testimonial 3 - Centered', value: 'testimonial-3' },
        ],
        layout: 'radio',
      },
      initialValue: 'testimonial-1',
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
      name: 'testimonial',
      type: 'array',
      of: [
        {
          name: 'testimonial',
          type: 'reference',
          to: [{ type: 'testimonial' }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'testimonial.0.name',
    },
    prepare({ title }) {
      return {
        title: 'Testimonials Carousel',
        subtitle: title,
      };
    },
  },
});
