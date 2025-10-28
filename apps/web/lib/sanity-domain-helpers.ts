/**
 * Sanity Domain Helpers
 *
 * Helper functions to integrate domain mapping with Sanity client configuration
 * Provides backward compatibility with the existing dataset-config system
 */

import { createClient } from 'next-sanity';
import { apiVersion, useCdn } from '../sanity/env';
import { getDomainConfigFromResponse } from './domain-middleware';
import type { DomainContext } from './domain-types';

/**
 * Create a Sanity client configured for a specific domain context
 * Use this in Server Components and API routes
 *
 * @example
 * import { headers } from 'next/headers';
 * import { createSanityClientForDomain } from '@/lib/sanity-domain-helpers';
 *
 * const client = await createSanityClientForDomain();
 */
export async function createSanityClientForDomain() {
  const { headers } = await import('next/headers');
  const headersList = await headers();
  const context = getDomainConfigFromResponse(headersList);

  return createClient({
    projectId:
      context.projectId || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: context.dataset,
    apiVersion,
    useCdn,
    perspective: 'published' as const,
    stega: {
      studioUrl: process.env.NEXT_PUBLIC_SITE_URL + '/studio',
    },
  });
}

/**
 * Get domain context from headers
 * Use this in Server Components and API routes
 *
 * @example
 * import { getDomainContext } from '@/lib/sanity-domain-helpers';
 *
 * const context = await getDomainContext();
 * console.log(context.clientId, context.dataset);
 */
export async function getDomainContext(): Promise<DomainContext> {
  const { headers } = await import('next/headers');
  const headersList = await headers();
  return getDomainConfigFromResponse(headersList);
}

/**
 * Get dataset from headers
 * Backward compatible with the existing getDataset function
 *
 * @example
 * import { getDatasetFromDomain } from '@/lib/sanity-domain-helpers';
 *
 * const dataset = await getDatasetFromDomain();
 */
export async function getDatasetFromDomain(): Promise<string> {
  const context = await getDomainContext();
  return context.dataset;
}

/**
 * Create a Sanity client with explicit domain context
 * Useful when you need to create a client for a specific domain/dataset
 *
 * @example
 * import { createSanityClientWithContext } from '@/lib/sanity-domain-helpers';
 *
 * const client = createSanityClientWithContext({
 *   domain: 'client1.buddsplumbing.com',
 *   clientId: 'client1',
 *   dataset: 'client1-production',
 * });
 */
export function createSanityClientWithContext(context: DomainContext) {
  return createClient({
    projectId:
      context.projectId || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: context.dataset,
    apiVersion,
    useCdn,
    perspective: 'published' as const,
    stega: {
      studioUrl: process.env.NEXT_PUBLIC_SITE_URL + '/studio',
    },
  });
}
