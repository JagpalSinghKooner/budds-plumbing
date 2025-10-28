import type { Metadata } from 'next';

/**
 * Configuration for generating SEO metadata
 */
export interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
  openGraph?: {
    title?: string;
    description?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image';
    title?: string;
    description?: string;
    images?: string[];
  };
}

/**
 * Generates Next.js Metadata object for SEO
 */
export function generateSEOMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    canonical,
    noindex = false,
    openGraph,
    twitter,
  } = config;

  const metadata: Metadata = {
    title,
    description,
  };

  // Add canonical URL if provided
  if (canonical) {
    metadata.alternates = {
      canonical,
    };
  }

  // Handle noindex
  if (noindex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  // Open Graph metadata
  if (openGraph) {
    metadata.openGraph = {
      title: openGraph.title || title,
      description: openGraph.description || description,
      url: canonical,
      siteName: 'Budds Plumbing',
      locale: 'en_US',
      type: 'website',
      images: openGraph.images || [],
    };
  }

  // Twitter Card metadata
  if (twitter) {
    metadata.twitter = {
      card: twitter.card || 'summary_large_image',
      title: twitter.title || title,
      description: twitter.description || description,
      images: twitter.images || [],
    };
  }

  return metadata;
}

/**
 * Business information for LocalBusiness schema
 */
export interface LocalBusinessConfig {
  name: string;
  description?: string;
  url: string;
  telephone: string;
  email?: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry?: string;
  };
  openingHours?: Array<{
    day: string;
    open: string;
    close: string;
  }>;
  image?: string;
  priceRange?: string;
  areaServed?: string[];
}

/**
 * Generates LocalBusiness JSON-LD schema
 */
export function generateLocalBusinessSchema(
  business: LocalBusinessConfig
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description,
    url: business.url,
    telephone: business.telephone,
    email: business.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.addressLocality,
      addressRegion: business.address.addressRegion,
      postalCode: business.address.postalCode,
      addressCountry: business.address.addressCountry || 'US',
    },
    image: business.image,
    priceRange: business.priceRange || '$$',
  };

  // Add opening hours if provided
  if (business.openingHours && business.openingHours.length > 0) {
    const dayMapping: Record<string, string> = {
      Monday: 'Mo',
      Tuesday: 'Tu',
      Wednesday: 'We',
      Thursday: 'Th',
      Friday: 'Fr',
      Saturday: 'Sa',
      Sunday: 'Su',
    };

    schema.openingHoursSpecification = business.openingHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: dayMapping[hours.day] || hours.day,
      opens: hours.open,
      closes: hours.close,
    }));
  }

  // Add area served if provided
  if (business.areaServed && business.areaServed.length > 0) {
    schema.areaServed = business.areaServed.map((area) => ({
      '@type': 'City',
      name: area,
    }));
  }

  return schema;
}

/**
 * FAQ item structure
 */
export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Generates FAQPage JSON-LD schema
 */
export function generateFAQSchema(faqs: FAQItem[]): object {
  if (!faqs || faqs.length === 0) {
    return {};
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Breadcrumb item structure
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generates BreadcrumbList JSON-LD schema
 */
export function generateBreadcrumbSchema(
  breadcrumbs: BreadcrumbItem[]
): object {
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return {};
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Service schema for specific service pages
 */
export interface ServiceConfig {
  name: string;
  description: string;
  provider: {
    name: string;
    url: string;
  };
  areaServed?: string[];
  serviceType?: string;
}

/**
 * Generates Service JSON-LD schema
 */
export function generateServiceSchema(
  service: ServiceConfig
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: service.provider.name,
      url: service.provider.url,
    },
    serviceType: service.serviceType,
  };

  if (service.areaServed && service.areaServed.length > 0) {
    schema.areaServed = service.areaServed.map((area) => ({
      '@type': 'City',
      name: area,
    }));
  }

  return schema;
}

/**
 * Combines multiple JSON-LD schemas into a single script tag content
 */
export function combineSchemas(...schemas: object[]): object {
  const validSchemas = schemas.filter(
    (schema) => Object.keys(schema).length > 0
  );

  if (validSchemas.length === 0) {
    return {};
  }

  if (validSchemas.length === 1) {
    return validSchemas[0];
  }

  return {
    '@context': 'https://schema.org',
    '@graph': validSchemas,
  };
}

/**
 * Renders JSON-LD script tag for embedding in HTML
 */
export function renderJSONLD(schema: object): string {
  if (!schema || Object.keys(schema).length === 0) {
    return '';
  }

  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}
