import { defineField, defineType } from 'sanity';

/**
 * Service Location Schema - Phase 1 Contract
 *
 * NO manual slug - path is derived from service + location references at runtime
 * Uses optional sections[] that fall back to parent service sections
 * Represents service+location combination pages (e.g., /hvac-repair/in/toronto)
 */
export const serviceLocationSchema = defineType({
  name: 'service-location',
  type: 'document',
  title: 'Service Location',
  groups: [
    {
      name: 'references',
      title: 'References',
    },
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
      name: 'sections',
      title: 'Page Sections (Optional)',
      type: 'array',
      group: 'content',
      description:
        'Override service sections for this location. Leave empty to use service sections.',
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
          description:
            'Override the computed "{service} in {location}" title for SEO',
          validation: (Rule) =>
            Rule.max(60).warning('Meta titles should be under 60 characters'),
        }),
        defineField({
          name: 'description',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description:
            'Brief description for search engine results. Falls back to service description.',
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
            'Image for social media sharing. Falls back to service image if not set.',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
    // Keep legacy fields for backward compatibility during migration
    defineField({
      name: 'slug',
      title: 'Slug (Legacy)',
      type: 'slug',
      group: 'references',
      description: 'Legacy field - URL is now computed from service + location',
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
          ? `URL: /${serviceName.toLowerCase().replace(/\s+/g, '-')}/in/${locationName.toLowerCase().replace(/\s+/g, '-')}`
          : 'Select both service and location';

      return {
        title,
        subtitle,
      };
    },
  },
});
