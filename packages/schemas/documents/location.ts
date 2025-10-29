import { defineField, defineType } from 'sanity';

/**
 * Location Schema - Phase 1 Contract
 *
 * Uses sections[] array for content blocks
 * Includes structured coverage/operating fields
 * Falls back to site settings for missing data
 */
export const locationSchema = defineType({
  name: 'location',
  type: 'document',
  title: 'Location',
  groups: [
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'coverage',
      title: 'Coverage Area',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Location Name',
      type: 'string',
      group: 'content',
      description: 'City or region name (e.g., "Toronto", "Greater Vancouver")',
      validation: (Rule) => Rule.required().error('Location name is required'),
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
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      group: 'content',
      description: 'Content sections for this location page',
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
      name: 'coverage',
      title: 'Coverage Information',
      type: 'object',
      group: 'coverage',
      description: 'Geographic coverage details for this location',
      fields: [
        defineField({
          name: 'county',
          title: 'County',
          type: 'string',
        }),
        defineField({
          name: 'state',
          title: 'State/Province',
          type: 'string',
          description: 'Full name or abbreviation (e.g., "ON", "California")',
        }),
        defineField({
          name: 'postalCodes',
          title: 'Postal Codes',
          type: 'array',
          description: 'Primary postal/zip codes covered',
          of: [{ type: 'string' }],
        }),
        defineField({
          name: 'radius',
          title: 'Service Radius (miles)',
          type: 'number',
          description: 'Service radius from this location in miles',
          validation: (Rule) => Rule.min(0).max(500),
        }),
        defineField({
          name: 'neighborhoods',
          title: 'Neighborhoods',
          type: 'array',
          description: 'Specific neighborhoods or districts served',
          of: [{ type: 'string' }],
        }),
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
            Rule.max(160).warning('Meta descriptions should be under 160 characters'),
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
          description: 'Image for social media sharing (1200x630px recommended)',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
    // Keep legacy fields for backward compatibility during migration
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
      state: 'coverage.state',
      media: 'seo.ogImage',
    },
    prepare({ title, state, media }) {
      return {
        title: title || 'Untitled Location',
        subtitle: state || undefined,
        media,
      };
    },
  },
});
