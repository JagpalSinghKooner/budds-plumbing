import type { DatasetName } from '@/lib/dataset-config';

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-31';

// Default dataset from environment variables
// Used by Sanity Studio and as fallback for Server Components
export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
);

export const useCdn = false;

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}

/**
 * Get the dataset from request headers (set by middleware)
 * Falls back to environment variable if headers are not available
 *
 * NOTE: This function imports 'next/headers' dynamically to avoid issues
 * with client components and Sanity Studio configuration.
 */
export async function getDataset(): Promise<DatasetName> {
  try {
    // Dynamic import to avoid bundling next/headers in client components
    const { headers } = await import('next/headers');
    const headersList = await headers();
    const datasetFromHeaders = headersList.get('x-sanity-dataset');

    if (datasetFromHeaders) {
      return datasetFromHeaders as DatasetName;
    }
  } catch {
    // headers() can only be called in Server Components
    // If it fails, fall back to environment variable
  }

  // Fallback to environment variable
  return dataset as DatasetName;
}
