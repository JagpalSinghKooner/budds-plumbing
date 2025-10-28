import { defineField, defineType } from 'sanity';
import { Building2 } from 'lucide-react';

export default defineType({
  name: 'client',
  type: 'document',
  title: 'Client',
  icon: Building2,
  groups: [
    {
      name: 'general',
      title: 'General',
    },
    {
      name: 'branding',
      title: 'Branding',
    },
    {
      name: 'configuration',
      title: 'Configuration',
    },
  ],
  fields: [
    defineField({
      name: 'clientId',
      title: 'Client ID',
      type: 'string',
      group: 'general',
      description:
        'Unique identifier for the client (e.g., "budds-plumbing", "acme-hvac")',
      validation: (Rule) =>
        Rule.required()
          .error('Client ID is required')
          .custom((clientId) => {
            if (!clientId) return true;
            const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
            return (
              slugRegex.test(clientId) ||
              'Client ID must be lowercase alphanumeric with hyphens only (e.g., "my-client")'
            );
          }),
    }),
    defineField({
      name: 'businessName',
      title: 'Business Name',
      type: 'string',
      group: 'general',
      description:
        'Official business name (e.g., "Budds Plumbing Services Inc.")',
      validation: (Rule) =>
        Rule.required().error('Business name is required for client setup'),
    }),
    defineField({
      name: 'domain',
      title: 'Domain',
      type: 'string',
      group: 'general',
      description:
        'Primary domain for this client (e.g., "example.com" without protocol)',
      validation: (Rule) =>
        Rule.required()
          .error('Domain is required')
          .custom((domain) => {
            if (!domain) return true;
            const domainRegex =
              /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;
            return (
              domainRegex.test(domain) ||
              'Please enter a valid domain (e.g., "example.com")'
            );
          }),
    }),
    defineField({
      name: 'dataset',
      title: 'Dataset',
      type: 'string',
      group: 'configuration',
      description:
        'Sanity dataset name for this client (e.g., "production", "staging")',
      validation: (Rule) =>
        Rule.required()
          .error('Dataset is required')
          .custom((dataset) => {
            if (!dataset) return true;
            const datasetRegex = /^[a-z0-9_]+$/;
            return (
              datasetRegex.test(dataset) ||
              'Dataset must be lowercase alphanumeric with underscores only'
            );
          }),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'configuration',
      description: 'Current status of the client account',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Active', value: 'active' },
          { title: 'Suspended', value: 'suspended' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required().error('Status is required'),
    }),
    defineField({
      name: 'plan',
      title: 'Plan',
      type: 'string',
      group: 'configuration',
      description: 'Subscription plan tier for this client',
      options: {
        list: [
          { title: 'Starter', value: 'starter' },
          { title: 'Pro', value: 'pro' },
          { title: 'Enterprise', value: 'enterprise' },
        ],
        layout: 'radio',
      },
      initialValue: 'starter',
      validation: (Rule) => Rule.required().error('Plan is required'),
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      group: 'configuration',
      description: 'Date and time when this client was created',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'siteSettings',
      title: 'Site Settings',
      type: 'reference',
      group: 'configuration',
      description:
        'Reference to the settings document containing NAP (Name, Address, Phone) information',
      to: [{ type: 'settings' }],
      validation: (Rule) =>
        Rule.required().error(
          'Site settings reference is required for client configuration'
        ),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'branding',
      description:
        'Primary logo for this client (will be used across the site)',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for accessibility',
          validation: (Rule) => Rule.required().error('Alt text is required'),
        }),
        defineField({
          name: 'width',
          title: 'Display Width',
          type: 'number',
          description: 'Display width in pixels (optional, defaults to image width)',
        }),
        defineField({
          name: 'height',
          title: 'Display Height',
          type: 'number',
          description: 'Display height in pixels (optional, defaults to image height)',
        }),
      ],
    }),
    defineField({
      name: 'brandColors',
      title: 'Brand Colors',
      type: 'object',
      group: 'branding',
      description:
        'Primary brand colors for this client (used for theme customization)',
      fields: [
        defineField({
          name: 'primary',
          title: 'Primary Color',
          type: 'string',
          description: 'Main brand color (hex format, e.g., "#0066CC")',
          validation: (Rule) =>
            Rule.required()
              .error('Primary color is required')
              .custom((color) => {
                if (!color) return true;
                const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                return (
                  hexRegex.test(color) ||
                  'Please enter a valid hex color (e.g., "#0066CC")'
                );
              }),
        }),
        defineField({
          name: 'secondary',
          title: 'Secondary Color',
          type: 'string',
          description: 'Secondary brand color (hex format, e.g., "#FF6600")',
          validation: (Rule) =>
            Rule.custom((color) => {
              if (!color) return true;
              const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
              return (
                hexRegex.test(color) ||
                'Please enter a valid hex color (e.g., "#FF6600")'
              );
            }),
        }),
        defineField({
          name: 'accent',
          title: 'Accent Color',
          type: 'string',
          description: 'Accent color for highlights and CTAs (hex format)',
          validation: (Rule) =>
            Rule.custom((color) => {
              if (!color) return true;
              const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
              return (
                hexRegex.test(color) ||
                'Please enter a valid hex color (e.g., "#00CC66")'
              );
            }),
        }),
      ],
      validation: (Rule) =>
        Rule.required().error('Brand colors are required for client branding'),
    }),
  ],
  preview: {
    select: {
      title: 'businessName',
      subtitle: 'domain',
      status: 'status',
      media: 'logo',
    },
    prepare({ title, subtitle, status, media }) {
      const statusEmoji = {
        pending: '⏳',
        active: '✅',
        suspended: '⚠️',
      };
      return {
        title: title || 'Untitled Client',
        subtitle: `${subtitle || 'No domain'} ${statusEmoji[status as keyof typeof statusEmoji] || ''}`,
        media: media || Building2,
      };
    },
  },
});
