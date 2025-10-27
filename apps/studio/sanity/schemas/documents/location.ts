import { defineField, defineType } from 'sanity';
import { MapPin } from 'lucide-react';

export default defineType({
  name: 'location',
  type: 'document',
  title: 'Location',
  icon: MapPin,
  groups: [
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'sections',
      title: 'Sections',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Location Name',
      type: 'string',
      group: 'content',
      description: "City or area name (e.g., 'Downtown Toronto', 'North York')",
      validation: (Rule) => Rule.required().error('Location name is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) =>
        Rule.required().error('Slug is required for the location URL'),
    }),
    defineField({
      name: 'aboutLocation',
      title: 'About This Location',
      type: 'text',
      group: 'content',
      description: 'Description of the area and why you serve it',
      rows: 4,
      validation: (Rule) =>
        Rule.max(500).warning('Keep description under 500 characters'),
    }),
    defineField({
      name: 'coverageAreas',
      title: 'Coverage Areas',
      type: 'array',
      group: 'content',
      description:
        'Neighborhoods, zones, or postal codes served in this location',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'operatingHours',
      title: 'Operating Hours',
      type: 'text',
      group: 'content',
      description:
        "Operating hours for this location (e.g., 'Mon-Fri: 8am-5pm')",
      rows: 3,
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      group: 'content',
      description: 'Phone number for this location',
      validation: (Rule) =>
        Rule.custom((phone) => {
          if (!phone) return true;
          // Basic phone validation
          const phoneRegex = /^[\d\s\-()]+$/;
          return phoneRegex.test(phone) || 'Please enter a valid phone number';
        }),
    }),
    defineField({
      name: 'image',
      title: 'Location Image',
      type: 'image',
      group: 'content',
      description: 'Image representing this location',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Describe the image for accessibility',
          validation: (Rule) =>
            Rule.required().error('Alt text is required for accessibility'),
        },
      ],
    }),
    defineField({
      name: 'blocks',
      title: 'Page Sections',
      type: 'array',
      group: 'sections',
      description: 'Add and arrange sections for this location page',
      of: [
        { type: 'hero-1' },
        { type: 'hero-2' },
        { type: 'section-header' },
        { type: 'split-row' },
        { type: 'grid-row' },
        { type: 'carousel-1' },
        { type: 'carousel-2' },
        { type: 'timeline-row' },
        { type: 'cta-1' },
        { type: 'logo-cloud-1' },
        { type: 'faqs' },
        { type: 'form-newsletter' },
      ],
      options: {
        insertMenu: {
          groups: [
            {
              name: 'hero',
              title: 'Hero',
              of: ['hero-1', 'hero-2'],
            },
            {
              name: 'logo-cloud',
              title: 'Logo Cloud',
              of: ['logo-cloud-1'],
            },
            {
              name: 'section-header',
              title: 'Section Header',
              of: ['section-header'],
            },
            {
              name: 'grid',
              title: 'Grid',
              of: ['grid-row'],
            },
            {
              name: 'split',
              title: 'Split',
              of: ['split-row'],
            },
            {
              name: 'carousel',
              title: 'Carousel',
              of: ['carousel-1', 'carousel-2'],
            },
            {
              name: 'timeline',
              title: 'Timeline',
              of: ['timeline-row'],
            },
            {
              name: 'cta',
              title: 'CTA',
              of: ['cta-1'],
            },
            {
              name: 'faqs',
              title: 'FAQs',
              of: ['faqs'],
            },
            {
              name: 'forms',
              title: 'Forms',
              of: ['form-newsletter'],
            },
          ],
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
    defineField({
      name: 'meta_title',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      description: 'SEO title tag (leave empty to use location name)',
      validation: (Rule) =>
        Rule.max(60).warning('Meta titles should be under 60 characters'),
    }),
    defineField({
      name: 'meta_description',
      title: 'Meta Description',
      type: 'text',
      group: 'seo',
      description: 'SEO meta description',
      validation: (Rule) =>
        Rule.max(160).warning(
          'Meta descriptions should be under 160 characters'
        ),
    }),
    defineField({
      name: 'noindex',
      title: 'No Index',
      type: 'boolean',
      group: 'seo',
      description: 'Prevent search engines from indexing this page',
      initialValue: false,
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image - [1200x630]',
      type: 'image',
      group: 'seo',
      description: 'Social media share image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'aboutLocation',
      coverageAreas: 'coverageAreas',
      media: 'image',
    },
    prepare({ title, subtitle, coverageAreas, media }) {
      const areas = coverageAreas?.slice(0, 3).join(', ');
      return {
        title: title || 'Untitled Location',
        subtitle: areas ? `Serving: ${areas}` : subtitle || 'No description',
        media: media || MapPin,
      };
    },
  },
});
