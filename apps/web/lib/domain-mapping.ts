/**
 * Multi-Domain Support - Domain Mapping Configuration
 *
 * This module handles domain-to-client/dataset mapping for multi-tenant support.
 * It supports:
 * - Subdomains (e.g., client1.buddsplumbing.com)
 * - Custom domains (e.g., clientdomain.com)
 * - Environment-based configuration
 * - Domain validation
 */

import type { DomainConfig } from './domain-types';

export type { DomainConfig } from './domain-types';

/**
 * API version for Sanity
 */
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-31';

/**
 * Base domain for subdomain matching
 * Override with NEXT_PUBLIC_BASE_DOMAIN environment variable
 */
const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'buddsplumbing.com';

/**
 * Default project ID from environment
 */
const DEFAULT_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';

/**
 * Domain mappings configuration
 * Add new domains here to support additional clients
 */
export const DOMAIN_MAPPINGS: DomainConfig[] = [
  // Primary domain (main Budds Plumbing site)
  {
    domain: BASE_DOMAIN,
    projectId: DEFAULT_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    clientId: 'budds-main',
    enabled: true,
    branding: {
      name: 'Budds Plumbing',
    },
  },
  // www subdomain - redirect to main domain
  {
    domain: `www.${BASE_DOMAIN}`,
    projectId: DEFAULT_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    clientId: 'budds-main',
    enabled: true,
    branding: {
      name: 'Budds Plumbing',
    },
  },
  // Development/localhost domain
  {
    domain: 'localhost:3000',
    projectId: DEFAULT_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
    clientId: 'budds-dev',
    enabled: true,
    branding: {
      name: 'Budds Plumbing (Dev)',
    },
  },
  // Example subdomain client
  // {
  //   domain: `client1.${BASE_DOMAIN}`,
  //   projectId: DEFAULT_PROJECT_ID,
  //   dataset: "client1-production",
  //   clientId: "client1",
  //   enabled: true,
  //   branding: {
  //     name: "Client 1 Plumbing",
  //   },
  // },
  // Example custom domain
  // {
  //   domain: "customdomain.com",
  //   projectId: DEFAULT_PROJECT_ID, // or different project ID
  //   dataset: "custom-production",
  //   clientId: "custom-client",
  //   enabled: true,
  //   siteUrl: "https://customdomain.com",
  //   analytics: {
  //     googleAnalyticsId: "G-XXXXXXXXXX",
  //   },
  //   branding: {
  //     name: "Custom Plumbing Co",
  //   },
  // },
];

/**
 * Extract domain from request headers
 * Handles both host header and x-forwarded-host for proxy scenarios
 */
export function extractDomain(headers: Headers): string {
  const host =
    headers.get('x-forwarded-host') || headers.get('host') || 'localhost:3000';
  return host.toLowerCase();
}

/**
 * Get domain configuration by domain name
 * Returns null if domain is not found or disabled
 */
export function getDomainConfig(domain: string): DomainConfig | null {
  // Normalize domain (remove port for localhost)
  const normalizedDomain = domain.includes('localhost')
    ? 'localhost:3000'
    : domain;

  const config = DOMAIN_MAPPINGS.find(
    (mapping) => mapping.domain === normalizedDomain && mapping.enabled
  );

  return config || null;
}

/**
 * Get domain configuration from request headers
 * This is the main function to use in middleware and API routes
 */
export function getDomainConfigFromHeaders(
  headers: Headers
): DomainConfig | null {
  const domain = extractDomain(headers);
  return getDomainConfig(domain);
}

/**
 * Validate if a domain is configured and enabled
 */
export function isValidDomain(domain: string): boolean {
  const config = getDomainConfig(domain);
  return config !== null && config.enabled;
}

/**
 * Get all enabled domains
 * Useful for sitemap generation and domain listing
 */
export function getEnabledDomains(): DomainConfig[] {
  return DOMAIN_MAPPINGS.filter((mapping) => mapping.enabled);
}

/**
 * Get Sanity client configuration for a domain
 */
export function getSanityConfigForDomain(domain: string) {
  const config = getDomainConfig(domain);

  if (!config) {
    throw new Error(`No configuration found for domain: ${domain}`);
  }

  return {
    projectId: config.projectId || DEFAULT_PROJECT_ID,
    dataset: config.dataset,
    apiVersion: API_VERSION,
    useCdn: false,
    perspective: 'published' as const,
  };
}

/**
 * Get site URL for a domain configuration
 * Falls back to environment variable or constructs from domain
 */
export function getSiteUrl(config: DomainConfig): string {
  if (config.siteUrl) {
    return config.siteUrl;
  }

  // Check environment variable
  const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envSiteUrl) {
    return envSiteUrl;
  }

  // Construct from domain
  const protocol = config.domain.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${config.domain}`;
}

/**
 * Check if domain is a subdomain of the base domain
 */
export function isSubdomain(domain: string): boolean {
  return domain !== BASE_DOMAIN && domain.endsWith(`.${BASE_DOMAIN}`);
}

/**
 * Extract subdomain prefix from a domain
 * Returns null if not a subdomain
 */
export function getSubdomainPrefix(domain: string): string | null {
  if (!isSubdomain(domain)) {
    return null;
  }

  return domain.replace(`.${BASE_DOMAIN}`, '');
}

/**
 * Environment-based domain configuration override
 * Allows setting domain config via environment variables for specific deployments
 */
export function getEnvironmentDomainOverride(): Partial<DomainConfig> | null {
  const override: Partial<DomainConfig> = {};

  if (process.env.NEXT_PUBLIC_DOMAIN_OVERRIDE) {
    override.domain = process.env.NEXT_PUBLIC_DOMAIN_OVERRIDE;
  }

  if (process.env.NEXT_PUBLIC_CLIENT_ID) {
    override.clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  }

  if (process.env.NEXT_PUBLIC_SANITY_DATASET) {
    override.dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  }

  return Object.keys(override).length > 0 ? override : null;
}
