import { headers } from 'next/headers';
import {
  getDatasetFromHeaders,
  getHostnameFromHeaders,
  getClientIdFromHeaders,
} from '@/middleware';
import { getClientConfig } from '@/lib/dataset-config';

/**
 * Debug API Route for Dataset Routing
 *
 * This endpoint returns information about the current dataset routing
 * configuration. Useful for debugging and testing multi-tenant setup.
 *
 * Usage:
 * curl http://localhost:3000/api/debug-dataset
 *
 * @returns JSON with dataset routing information
 */
export async function GET() {
  const headersList = await headers();

  // Get dataset from headers using helper functions
  const dataset = await getDatasetFromHeaders();
  const hostname = await getHostnameFromHeaders();
  const clientId = await getClientIdFromHeaders();

  // Get full client configuration
  const clientConfig = getClientConfig(hostname || 'localhost');

  // Get all custom headers set by middleware
  const customHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    if (key.startsWith('x-')) {
      customHeaders[key] = value;
    }
  });

  return Response.json(
    {
      success: true,
      routing: {
        dataset,
        hostname,
        clientId,
      },
      clientConfig: {
        dataset: clientConfig.dataset,
        clientName: clientConfig.clientName,
        domain: clientConfig.domain,
      },
      customHeaders,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        siteEnv: process.env.NEXT_PUBLIC_SITE_ENV,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
        defaultDataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      },
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
