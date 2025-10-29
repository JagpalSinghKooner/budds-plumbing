import { defineField, defineType } from 'sanity';

/**
 * Service Schema - Phase 1 Contract
 *
 * Uses sections[] array for content blocks
 * Lean SEO with structured fields
 * No legacy category reference required for Phase 1
 */
export const serviceSchema = defineType({
  name: 'service',
  type: 'document',
  title: 'Service',
  groups: [
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Service Name',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().error('Service name is required'),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('URL slug is required'),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'object',
      group: 'content',
      description: 'Brief introduction for the service',
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
        }),
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      group: 'content',
      description: 'Content sections that make up this service page',
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
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      description: 'Search engine optimization settings',
      fields: [
        defineField({
          name: 'title',
          title: 'Meta Title',
          type: 'string',
          description: 'Override the default page title for SEO',
          validation: (Rule) =>
            Rule.max(60).warning('Meta titles should be under 60 characters'),
        }),
        defineField({
          name: 'description',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Brief description for search engine results',
          validation: (Rule) =>
            Rule.max(160).warning(
              'Meta descriptions should be under 160 characters'
            ),
        }),
        defineField({
          name: 'noindex',
          title: 'Hide from Search Engines',
          type: 'boolean',
          description: 'Prevent search engines from indexing this page',
          initialValue: false,
        }),
        defineField({
          name: 'ogImage',
          title: 'Social Share Image',
          type: 'image',
          description:
            'Image for social media sharing (1200x630px recommended)',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
    // Keep legacy fields for backward compatibility during migration
    defineField({
      name: 'category',
      title: 'Category (Legacy)',
      type: 'reference',
      to: [{ type: 'serviceCategory' }],
      group: 'content',
      description: 'Legacy field - optional for Phase 1',
      hidden: true,
    }),
    defineField({
      name: 'blocks',
      title: 'Blocks (Legacy)',
      type: 'array',
      group: 'content',
      description: 'Legacy field - use sections[] instead',
      hidden: true,
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
    }),
    defineField({
      name: 'meta_title',
      title: 'Meta Title (Legacy)',
      type: 'string',
      group: 'seo',
      description: 'Legacy field - use seo.title instead',
      hidden: true,
    }),
    defineField({
      name: 'meta_description',
      title: 'Meta Description (Legacy)',
      type: 'text',
      group: 'seo',
      description: 'Legacy field - use seo.description instead',
      hidden: true,
    }),
    defineField({
      name: 'noindex',
      title: 'No Index (Legacy)',
      type: 'boolean',
      group: 'seo',
      description: 'Legacy field - use seo.noindex instead',
      hidden: true,
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image (Legacy)',
      type: 'image',
      group: 'seo',
      description: 'Legacy field - use seo.ogImage instead',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'seo.ogImage',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Untitled Service',
        media,
      };
    },
  },
});
