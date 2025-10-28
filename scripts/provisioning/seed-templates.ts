/**
 * Default content templates for client provisioning
 * These templates provide starter content for new clients
 */

import type { SeedData, ClientConfig, HeroBlock, CTABlock } from './types';

/**
 * Generates a unique key for Sanity blocks
 */
export function generateKey(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Creates a default hero block
 */
export function createDefaultHeroBlock(
  clientName: string,
  variant: 'hero-1' | 'hero-2' = 'hero-1'
): HeroBlock {
  return {
    _type: variant,
    _key: generateKey(),
    variant,
    tagLine: 'Welcome to',
    title: clientName,
    body: [
      {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: generateKey(),
            text: 'Your trusted partner for professional services. We deliver excellence with every project.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
    links: [
      {
        _type: 'link',
        _key: generateKey(),
        text: 'Get Started',
        url: '/contact',
        variant: 'default',
      },
      {
        _type: 'link',
        _key: generateKey(),
        text: 'Learn More',
        url: '/services',
        variant: 'outline',
      },
    ],
  };
}

/**
 * Creates a default CTA block
 */
export function createDefaultCTABlock(): CTABlock {
  return {
    _type: 'cta-1',
    _key: generateKey(),
    variant: 'cta-1',
    tagLine: 'Ready to get started?',
    title: 'Contact us today',
    body: [
      {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: generateKey(),
            text: 'Get in touch with our team to discuss your project needs and receive a free consultation.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
    links: [
      {
        _type: 'link',
        _key: generateKey(),
        text: 'Contact Us',
        url: '/contact',
        variant: 'default',
      },
    ],
    colorVariant: 'primary',
    sectionWidth: 'default',
    stackAlign: 'center',
  };
}

/**
 * Creates default settings document
 */
export function createDefaultSettings(config: ClientConfig) {
  const currentYear = new Date().getFullYear();

  return {
    _type: 'settings' as const,
    _id: 'settings',
    siteName: config.name,
    copyright: [
      {
        _type: 'block' as const,
        _key: generateKey(),
        style: 'normal' as const,
        children: [
          {
            _type: 'span' as const,
            _key: generateKey(),
            text: `© ${currentYear} ${config.name}. All rights reserved.`,
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
  };
}

/**
 * Creates default navigation document
 */
export function createDefaultNavigation(config: ClientConfig) {
  return {
    _type: 'navigation' as const,
    _id: 'main-navigation',
    title: 'Main Navigation',
    links: [
      {
        _type: 'object' as const,
        _key: generateKey(),
        text: 'Home',
        url: '/',
        openInNewTab: false,
      },
      {
        _type: 'object' as const,
        _key: generateKey(),
        text: 'Services',
        url: '/services',
        openInNewTab: false,
      },
      {
        _type: 'object' as const,
        _key: generateKey(),
        text: 'Locations',
        url: '/locations',
        openInNewTab: false,
      },
      {
        _type: 'object' as const,
        _key: generateKey(),
        text: 'About',
        url: '/about',
        openInNewTab: false,
      },
      {
        _type: 'object' as const,
        _key: generateKey(),
        text: 'Contact',
        url: '/contact',
        openInNewTab: false,
      },
    ],
  };
}

/**
 * Creates default home page
 */
export function createDefaultHomePage(config: ClientConfig) {
  return {
    _type: 'page' as const,
    _id: 'home-page',
    title: 'Home',
    slug: {
      _type: 'slug' as const,
      current: 'home',
    },
    blocks: [createDefaultHeroBlock(config.name), createDefaultCTABlock()],
    meta_title: `${config.name} - Professional Services`,
    meta_description: `Welcome to ${config.name}. Your trusted partner for professional services.`,
    noindex: false,
  };
}

/**
 * Creates a sample service page
 */
export function createSampleService(serviceName: string = 'General Services') {
  const slug = serviceName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return {
    _type: 'service' as const,
    _id: `service-${slug}`,
    name: serviceName,
    slug: {
      _type: 'slug' as const,
      current: slug,
    },
    blocks: [
      {
        _type: 'hero-1',
        _key: generateKey(),
        variant: 'hero-1',
        title: serviceName,
        body: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: `Professional ${serviceName.toLowerCase()} tailored to your needs.`,
                marks: [],
              },
            ],
            markDefs: [],
          },
        ],
        links: [
          {
            _type: 'link',
            _key: generateKey(),
            text: 'Request Service',
            url: '/contact',
            variant: 'default',
          },
        ],
      },
      createDefaultCTABlock(),
    ],
    meta_title: `${serviceName} - Professional Services`,
    meta_description: `Learn more about our ${serviceName.toLowerCase()} and how we can help you.`,
    noindex: false,
  };
}

/**
 * Creates a sample location page
 */
export function createSampleLocation(locationName: string = 'Main Location') {
  const slug = locationName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return {
    _type: 'location' as const,
    _id: `location-${slug}`,
    name: locationName,
    slug: {
      _type: 'slug' as const,
      current: slug,
    },
    blocks: [
      {
        _type: 'hero-1',
        _key: generateKey(),
        variant: 'hero-1',
        title: `Serving ${locationName}`,
        body: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: `Proudly serving the ${locationName} area with professional services.`,
                marks: [],
              },
            ],
            markDefs: [],
          },
        ],
        links: [
          {
            _type: 'link',
            _key: generateKey(),
            text: 'Contact Us',
            url: '/contact',
            variant: 'default',
          },
        ],
      },
      createDefaultCTABlock(),
    ],
    meta_title: `${locationName} Services - Professional Solutions`,
    meta_description: `Professional services in ${locationName}. Contact us today for expert solutions.`,
    noindex: false,
  };
}

/**
 * Generates complete seed data for a new client
 */
export function generateSeedData(
  config: ClientConfig,
  options: {
    includeSampleService?: boolean;
    includeSampleLocation?: boolean;
  } = {}
): SeedData {
  const seedData: SeedData = {
    settings: createDefaultSettings(config),
    navigation: createDefaultNavigation(config),
    homePage: createDefaultHomePage(config),
  };

  if (options.includeSampleService) {
    seedData.sampleService = createSampleService('Plumbing Services');
  }

  if (options.includeSampleLocation) {
    seedData.sampleLocation = createSampleLocation('Downtown');
  }

  return seedData;
}

/**
 * Template presets for different business types
 */
export const TEMPLATE_PRESETS = {
  plumbing: {
    serviceName: 'Emergency Plumbing',
    locationName: 'Downtown',
    heroTagline: 'Professional Plumbing Services',
    ctaTitle: 'Need a Plumber?',
  },
  hvac: {
    serviceName: 'HVAC Repair & Installation',
    locationName: 'Metro Area',
    heroTagline: 'Heating & Cooling Experts',
    ctaTitle: 'Get HVAC Service',
  },
  electrical: {
    serviceName: 'Electrical Services',
    locationName: 'City Center',
    heroTagline: 'Licensed Electricians',
    ctaTitle: 'Contact Our Electricians',
  },
  general: {
    serviceName: 'General Services',
    locationName: 'Main Location',
    heroTagline: 'Professional Services',
    ctaTitle: 'Get Started Today',
  },
} as const;

export type TemplatePreset = keyof typeof TEMPLATE_PRESETS;

/**
 * Generates seed data with a specific preset
 */
export function generatePresetSeedData(
  config: ClientConfig,
  preset: TemplatePreset = 'general'
): SeedData {
  const presetConfig = TEMPLATE_PRESETS[preset];

  const seedData: SeedData = {
    settings: createDefaultSettings(config),
    navigation: createDefaultNavigation(config),
    homePage: {
      ...createDefaultHomePage(config),
      blocks: [
        {
          ...createDefaultHeroBlock(config.name),
          tagLine: presetConfig.heroTagline,
        },
        {
          ...createDefaultCTABlock(),
          title: presetConfig.ctaTitle,
        },
      ],
    },
    sampleService: createSampleService(presetConfig.serviceName),
    sampleLocation: createSampleLocation(presetConfig.locationName),
  };

  return seedData;
}
