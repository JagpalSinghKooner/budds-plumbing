/**
 * Multi-Domain Support - Type Definitions
 *
 * Shared type definitions for the multi-domain infrastructure
 */

/**
 * Domain configuration interface
 */
export interface DomainConfig {
  /** The full domain (e.g., "client1.buddsplumbing.com" or "clientdomain.com") */
  domain: string;
  /** Sanity project ID - defaults to env var if not specified */
  projectId?: string;
  /** Sanity dataset name */
  dataset: string;
  /** Client identifier for internal tracking */
  clientId: string;
  /** Optional custom site URL override */
  siteUrl?: string;
  /** Whether this domain is enabled */
  enabled: boolean;
  /** Optional custom analytics IDs */
  analytics?: {
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
  };
  /** Optional custom branding */
  branding?: {
    name: string;
    logo?: string;
  };
}

/**
 * Domain context extracted from request headers
 */
export interface DomainContext {
  domain: string;
  clientId: string;
  dataset: string;
  projectId?: string;
}

/**
 * Domain validation result
 */
export interface DomainValidationResult {
  isValid: boolean;
  config: DomainConfig | null;
  domain: string;
  shouldRedirect: boolean;
  redirectUrl?: string;
}
