import { defineField, defineType } from 'sanity';

/**
 * Site Settings Schema - Phase 1 Contract
 *
 * Centralizes NAP (Name, Address, Phone) data
 * Includes defaultSeo object for fallback meta tags
 * Single source of truth for LocalBusiness structured data
 */
export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {
      name: 'general',
      title: 'General',
    },
    {
      name: 'business',
      title: 'Business Information',
    },
    {
      name: 'seo',
      title: 'Default SEO',
    },
    {
      name: 'serviceAreas',
      title: 'Service Areas',
    },
  ],
  fields: [
    // General Group
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      group: 'general',
      description: 'The name of your website',
      validation: (Rule) => Rule.required().error('Site name is required'),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'object',
      group: 'general',
      fields: [
        defineField({
          name: 'dark',
          title: 'Dark Mode Logo',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'light',
          title: 'Light Mode Logo',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'width',
          title: 'Width',
          type: 'number',
          description: 'Logo width in pixels (optional)',
        }),
        defineField({
          name: 'height',
          title: 'Height',
          type: 'number',
          description: 'Logo height in pixels (optional)',
        }),
      ],
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright Text',
      type: 'block-content',
      group: 'general',
      description: 'Footer copyright text',
    }),
    // Business Information Group
    defineField({
      name: 'businessName',
      title: 'Business Name',
      type: 'string',
      group: 'business',
      description: 'Official business name for LocalBusiness schema',
      validation: (Rule) =>
        Rule.required().error(
          'Business name is required for schema.org markup'
        ),
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      group: 'business',
      description: 'Primary business phone number',
      validation: (Rule) =>
        Rule.required()
          .error('Phone number is required')
          .custom((phone) => {
            if (!phone) return true;
            const phoneRegex = /^[\d\s\-()]+$/;
            return (
              phoneRegex.test(phone) || 'Please enter a valid phone number'
            );
          }),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'business',
      description: 'Primary business email',
      validation: (Rule) =>
        Rule.required()
          .error('Email is required')
          .email()
          .error('Please enter a valid email address'),
    }),
    defineField({
      name: 'address',
      title: 'Business Address',
      type: 'object',
      group: 'business',
      description: 'Physical business address for NAP and LocalBusiness schema',
      options: {
        columns: 2,
      },
      fields: [
        defineField({
          name: 'street',
          title: 'Street Address',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'state',
          title: 'State/Province',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'zip',
          title: 'Postal Code',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) =>
        Rule.required().error(
          'Business address is required for LocalBusiness schema'
        ),
    }),
    defineField({
      name: 'businessHours',
      title: 'Business Hours',
      type: 'array',
      group: 'business',
      description: 'Operating hours for each day of the week',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'day',
              title: 'Day',
              type: 'string',
              options: {
                list: [
                  { title: 'Monday', value: 'Monday' },
                  { title: 'Tuesday', value: 'Tuesday' },
                  { title: 'Wednesday', value: 'Wednesday' },
                  { title: 'Thursday', value: 'Thursday' },
                  { title: 'Friday', value: 'Friday' },
                  { title: 'Saturday', value: 'Saturday' },
                  { title: 'Sunday', value: 'Sunday' },
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'open',
              title: 'Opening Time',
              type: 'string',
              description: "Format: '8:00 AM'",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'close',
              title: 'Closing Time',
              type: 'string',
              description: "Format: '5:00 PM'",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              day: 'day',
              open: 'open',
              close: 'close',
            },
            prepare({ day, open, close }) {
              return {
                title: day,
                subtitle: `${open} - ${close}`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'emergencyAvailable',
      title: 'Emergency Service Availability',
      type: 'string',
      group: 'business',
      description: 'When emergency services are available',
      options: {
        list: [
          { title: '24/7 Emergency Service', value: '24/7' },
          { title: 'After Hours Emergency', value: 'after-hours' },
          { title: 'Weekends Only', value: 'weekends' },
          { title: 'Not Available', value: 'not-available' },
        ],
        layout: 'radio',
      },
      initialValue: '24/7',
    }),
    defineField({
      name: 'licenseNumber',
      title: 'License Number',
      type: 'string',
      group: 'business',
      description: 'Professional license or certification number',
    }),
    defineField({
      name: 'insuranceInfo',
      title: 'Insurance Information',
      type: 'text',
      group: 'business',
      description: 'Insurance coverage details',
      rows: 3,
    }),
    // Default SEO Group
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'object',
      group: 'seo',
      description:
        "Fallback SEO settings used when pages don't define their own",
      fields: [
        defineField({
          name: 'title',
          title: 'Default Meta Title',
          type: 'string',
          description: 'Default title for pages without custom titles',
          validation: (Rule) =>
            Rule.max(60).warning('Meta titles should be under 60 characters'),
        }),
        defineField({
          name: 'description',
          title: 'Default Meta Description',
          type: 'text',
          rows: 3,
          description:
            'Default description for pages without custom descriptions',
          validation: (Rule) =>
            Rule.max(160).warning(
              'Meta descriptions should be under 160 characters'
            ),
        }),
        defineField({
          name: 'ogImage',
          title: 'Default Social Share Image',
          type: 'image',
          description:
            'Default image for social media sharing (1200x630px recommended)',
          options: {
            hotspot: true,
          },
        }),
      ],
      validation: (Rule) =>
        Rule.required().error('Default SEO settings are required for Phase 1'),
    }),
    // Service Areas Group
    defineField({
      name: 'serviceRadius',
      title: 'Service Radius',
      type: 'number',
      group: 'serviceAreas',
      description: 'Service radius in miles from primary location',
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(500)
          .error('Enter a valid service radius (1-500 miles)'),
    }),
    defineField({
      name: 'primaryServiceArea',
      title: 'Primary Service Area',
      type: 'string',
      group: 'serviceAreas',
      description:
        'Main geographic area of service (e.g., "Greater Toronto Area")',
      validation: (Rule) =>
        Rule.required().error('Primary service area is required'),
    }),
    defineField({
      name: 'serviceAreas',
      title: 'Service Areas',
      type: 'array',
      group: 'serviceAreas',
      description: 'List of all areas served',
      of: [{ type: 'string' }],
    }),
    // Legacy field for backward compatibility
    defineField({
      name: 'meta_description',
      title: 'Meta Description (Legacy)',
      type: 'text',
      group: 'seo',
      description: 'Legacy field - use defaultSeo.description instead',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'siteName',
      media: 'logo',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Site Settings',
        media,
      };
    },
  },
});
