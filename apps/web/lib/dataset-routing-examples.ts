/**
 * Dataset Routing Examples
 *
 * This file contains examples of how to use the multi-tenant dataset routing
 * in different contexts within the application.
 */

/**
 * Example 1: Using dynamic dataset in Server Components
 *
 * This is the recommended approach for most Server Components.
 * The dataset is automatically determined from the request hostname.
 */
export async function ServerComponentExample() {
  // Option A: Use the dynamic client directly
  const { getClientForRequest } = await import('@/sanity/lib/client');
  const client = await getClientForRequest();
  const data = await client.fetch('*[_type == "page"]');

  // Option B: Use the dynamic live fetch
  const { getDefineLiveForRequest } = await import('@/sanity/lib/live');
  const { sanityFetch } = await getDefineLiveForRequest();
  const result = await sanityFetch({ query: '*[_type == "page"]' });

  return { data, result };
}

/**
 * Example 2: Using dataset in Client Components
 *
 * Client components can access the dataset through the context provider.
 */
export function ClientComponentExample() {
  // This would be in a 'use client' component
  // import { useClientContext, useDataset } from '@/lib/client-context';
  //
  // const { dataset, clientName, domain } = useClientContext();
  // // or just get the dataset
  // const dataset = useDataset();
  //
  // return <div>Current dataset: {dataset}</div>;
}

/**
 * Example 3: Using a specific dataset explicitly
 *
 * Sometimes you may need to query a specific dataset regardless of the hostname.
 * This is useful for admin pages or data synchronization.
 */
export async function ExplicitDatasetExample() {
  const { createClientForDataset } = await import('@/sanity/lib/client');

  // Query production dataset explicitly
  const productionClient = createClientForDataset('production');
  const productionData = await productionClient.fetch('*[_type == "settings"]');

  // Query staging dataset explicitly
  const stagingClient = createClientForDataset('staging');
  const stagingData = await stagingClient.fetch('*[_type == "settings"]');

  return { productionData, stagingData };
}

/**
 * Example 4: Accessing hostname and dataset in API routes
 *
 * API routes can access the middleware headers to determine the dataset.
 */
export async function ApiRouteExample() {
  // import { getDatasetFromHeaders, getHostnameFromHeaders } from '@/middleware';
  //
  // export async function GET(request: Request) {
  //   const dataset = await getDatasetFromHeaders();
  //   const hostname = await getHostnameFromHeaders();
  //
  //   return Response.json({ dataset, hostname });
  // }
}

/**
 * Example 5: Migrating existing code
 *
 * Here's how to migrate existing code that uses the default client:
 */
export async function MigrationExample() {
  // OLD CODE:
  // import { client } from '@/sanity/lib/client';
  // const data = await client.fetch(query);

  // NEW CODE (for multi-tenant support):
  const { getClientForRequest } = await import('@/sanity/lib/client');
  const client = await getClientForRequest();
  const data = await client.fetch('*[_type == "page"]');

  // Or for sanityFetch:
  // OLD CODE:
  // import { sanityFetch } from '@/sanity/lib/live';
  // const { data } = await sanityFetch({ query });

  // NEW CODE:
  const { getDefineLiveForRequest } = await import('@/sanity/lib/live');
  const { sanityFetch } = await getDefineLiveForRequest();
  const result = await sanityFetch({ query: '*[_type == "page"]' });

  return { data, result };
}
