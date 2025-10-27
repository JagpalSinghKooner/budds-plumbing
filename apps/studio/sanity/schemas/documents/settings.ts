import { defineField, defineType } from 'sanity';
import { Settings, Building2, MapPin } from 'lucide-react';

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: Settings,
  groups: [
    {
      name: 'general',
      title: 'General',
      icon: Settings,
    },
    {
      name: 'business',
      title: 'Business Information',
      icon: Building2,
    },
    {
      name: 'service-areas',
      title: 'Service Areas',
      icon: MapPin,
    },
  ],
  fields: [
    defineField({
      name: 'logo',
      type: 'object',
      group: 'general',
      fields: [
        defineField({
          name: 'dark',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'light',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'width',
          type: 'number',
          title: 'Width',
          description:
            'The width of the logo. Default is dimensions of the image.',
        }),
        defineField({
          name: 'height',
          type: 'number',
          title: 'Height',
          description:
            'The height of the logo. Default is dimensions of the image.',
        }),
      ],
    }),
    defineField({
      name: 'siteName',
      type: 'string',
      group: 'general',
      description: 'The name of your site',
      validation: (Rule) => Rule.required().error('Site name is required'),
    }),
    defineField({
      name: 'copyright',
      type: 'block-content',
      group: 'general',
      description: 'The copyright text to display in the footer',
    }),
    // Business Information Group
    defineField({
      name: 'businessName',
      title: 'Business Name',
      type: 'string',
      group: 'business',
      description:
        "Official business name (e.g., 'Budds Plumbing Services Inc.')",
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
              description: "e.g., '8:00 AM'",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'close',
              title: 'Closing Time',
              type: 'string',
              description: "e.g., '5:00 PM'",
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
    // Service Areas Group
    defineField({
      name: 'serviceRadius',
      title: 'Service Radius',
      type: 'number',
      group: 'service-areas',
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
      group: 'service-areas',
      description:
        "Main geographic area of service (e.g., 'Greater Toronto Area')",
      validation: (Rule) =>
        Rule.required().error('Primary service area is required'),
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
