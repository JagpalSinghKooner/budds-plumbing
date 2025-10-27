import { defineField, defineType } from 'sanity';
import { MapPinned, Link, FileText, Search, Layout } from 'lucide-react';

export default defineType({
  name: 'service-location',
  type: 'document',
  title: 'Service Location',
  icon: MapPinned,
  groups: [
    {
      name: 'references',
      title: 'References',
      icon: Link,
    },
    {
      name: 'content',
      title: 'Content Overrides',
      icon: FileText,
    },
    {
      name: 'seo',
      title: 'SEO',
      icon: Search,
    },
    {
      name: 'sections',
      title: 'Sections',
      icon: Layout,
    },
  ],
  fields: [
    defineField({
      name: 'service',
      title: 'Service',
      type: 'reference',
      to: [{ type: 'service' }],
      group: 'references',
      description: 'Select the service for this page',
      validation: (Rule) =>
        Rule.required().error('Service reference is required'),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'reference',
      to: [{ type: 'location' }],
      group: 'references',
      description: 'Select the location for this page',
      validation: (Rule) =>
        Rule.required().error('Location reference is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'references',
      description: 'URL slug (auto-generated or manually set)',
      options: {
        source: () => {
          // This will be empty until both references are set
          // In production, this would derive from service + location slugs
          return '';
        },
        maxLength: 96,
      },
      validation: (Rule) =>
        Rule.required().error('Slug is required for the service-location URL'),
    }),
    defineField({
      name: 'headline',
      title: 'Headline Override',
      type: 'string',
      group: 'content',
      description: 'Optional: Override the service headline for this location',
      validation: (Rule) =>
        Rule.max(120).warning('Keep headlines under 120 characters'),
    }),
    defineField({
      name: 'introCopy',
      title: 'Introduction Override',
      type: 'text',
      group: 'content',
      description:
        'Optional: Override the service introduction for this location',
      rows: 4,
      validation: (Rule) =>
        Rule.max(500).warning('Keep intro under 500 characters'),
    }),
    defineField({
      name: 'body',
      title: 'Body Content Override',
      type: 'block-content',
      group: 'content',
      description:
        'Optional: Override the service body content for this location',
    }),
    defineField({
      name: 'whyUsBullets',
      title: 'Why Choose Us',
      type: 'array',
      group: 'content',
      description:
        'Location-specific reasons why customers should choose your service',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'localTestimonials',
      title: 'Local Testimonials Override',
      type: 'array',
      group: 'content',
      description:
        'Optional: Override testimonials with location-specific ones',
      of: [
        {
          type: 'reference',
          to: [{ type: 'testimonial' }],
        },
      ],
    }),
    defineField({
      name: 'blocks',
      title: 'Page Sections Override',
      type: 'array',
      group: 'sections',
      description:
        'Optional: Override service sections with location-specific ones',
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
      description: 'SEO title tag (computed from service + location if empty)',
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
      title: 'Search Engine Indexing',
      type: 'string',
      group: 'seo',
      description: 'Control whether search engines can index this page',
      options: {
        list: [
          { title: 'Allow indexing', value: 'index' },
          { title: 'Prevent indexing (noindex)', value: 'noindex' },
        ],
        layout: 'radio',
      },
      initialValue: 'index',
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
      serviceName: 'service.name',
      locationName: 'location.name',
    },
    prepare({ serviceName, locationName }) {
      const title =
        serviceName && locationName
          ? `${serviceName} in ${locationName}`
          : 'Service Location (incomplete)';

      const subtitle =
        serviceName && locationName
          ? `Connect ${serviceName} to ${locationName} market`
          : 'Please select both service and location';

      return {
        title,
        subtitle,
        media: MapPinned,
      };
    },
  },
  validation: (Rule) =>
    Rule.custom((_doc) => {
      // Ensure service + location combination is unique
      // This would require a GROQ query in production, but we'll add a descriptive message
      // Note: Unique validation would be implemented server-side in production
      return true;
    }),
});
