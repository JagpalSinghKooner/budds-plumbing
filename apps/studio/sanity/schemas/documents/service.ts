import { defineField, defineType } from 'sanity';
import { Wrench, FileText, Search, Layout } from 'lucide-react';

export default defineType({
  name: 'service',
  type: 'document',
  title: 'Service',
  icon: Wrench,
  groups: [
    {
      name: 'content',
      title: 'Content',
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
      name: 'name',
      title: 'Service Name',
      type: 'string',
      group: 'content',
      description: "The name of the service (e.g., 'Emergency Plumbing')",
      validation: (Rule) => Rule.required().error('Service name is required'),
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
        Rule.required().error('Slug is required for the service URL'),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'content',
      description: 'Short, compelling description (1 sentence)',
      validation: (Rule) =>
        Rule.max(120).warning(
          'Keep headlines under 120 characters for best display'
        ),
    }),
    defineField({
      name: 'introCopy',
      title: 'Introduction',
      type: 'text',
      group: 'content',
      description: '1-2 paragraph introduction to the service',
      rows: 4,
      validation: (Rule) =>
        Rule.max(500).warning(
          'Keep intro under 500 characters for readability'
        ),
    }),
    defineField({
      name: 'body',
      title: 'Body Content',
      type: 'block-content',
      group: 'content',
      description: 'Rich text content for the service page',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'content',
      description: 'Frequently asked questions about this service',
      of: [
        {
          type: 'reference',
          to: [{ type: 'faq' }],
        },
      ],
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      group: 'content',
      description: 'Customer testimonials related to this service',
      of: [
        {
          type: 'reference',
          to: [{ type: 'testimonial' }],
        },
      ],
    }),
    defineField({
      name: 'blocks',
      title: 'Page Sections',
      type: 'array',
      group: 'sections',
      description: 'Add and arrange sections for this service page',
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
      description: 'SEO title tag (leave empty to use service name)',
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
      title: 'name',
      subtitle: 'headline',
      media: 'ogImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Untitled Service',
        subtitle: subtitle || 'No headline',
        media: media || Wrench,
      };
    },
  },
});
