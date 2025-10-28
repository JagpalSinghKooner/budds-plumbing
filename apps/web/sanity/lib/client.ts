import { createClient } from 'next-sanity';
import type { SanityClient } from 'next-sanity';

import { apiVersion, dataset, projectId, useCdn, getDataset } from '../env';
import type { DatasetName } from '@/lib/dataset-config';

/**
 * Default Sanity client using environment variable dataset
 * This is the legacy client for backward compatibility
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: 'published',
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SITE_URL + '/studio',
  },
});

/**
 * Create a Sanity client for a specific dataset
 * Use this when you need to explicitly specify which dataset to query
 *
 * @param datasetName - The dataset name to use
 * @returns A configured Sanity client
 *
 * @example
 * const client = createClientForDataset('production');
 * const data = await client.fetch(query);
 */
export function createClientForDataset(datasetName: DatasetName): SanityClient {
  return createClient({
    projectId,
    dataset: datasetName,
    apiVersion,
    useCdn,
    perspective: 'published',
    stega: {
      studioUrl: process.env.NEXT_PUBLIC_SITE_URL + '/studio',
    },
  });
}

/**
 * Get a Sanity client that uses the dataset from the current request context
 * This should be used in Server Components to automatically use the correct dataset
 * based on the hostname (set by middleware)
 *
 * @returns A configured Sanity client with the dataset from request headers
 *
 * @example
 * // In a Server Component
 * const client = await getClientForRequest();
 * const data = await client.fetch(query);
 */
export async function getClientForRequest(): Promise<SanityClient> {
  const currentDataset = await getDataset();
  return createClientForDataset(currentDataset);
}
