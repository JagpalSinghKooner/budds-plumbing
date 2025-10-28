import type { NextRequest } from 'next/server';
import { domainMiddleware } from '@/lib/domain-middleware';

/**
 * Next.js Middleware
 *
 * This middleware runs on every request and handles:
 * - Multi-domain support and routing
 * - Domain validation and redirects
 * - Security headers
 * - Request context enrichment
 * - Dataset mapping based on domain
 *
 * The domain information is passed via custom headers that can be
 * accessed by Server Components and API routes.
 */

export function middleware(request: NextRequest) {
  return domainMiddleware(request);
}

/**
 * Configure which routes the middleware should run on
 *
 * This middleware runs on all routes except:
 * - Static files (_next/static)
 * - Image optimization files (_next/image)
 * - Favicon and other static assets
 * - Studio routes (to avoid interfering with Sanity Studio)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (static files)
     * - /studio (Sanity Studio routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|studio).*)',
  ],
};

/**
 * Helper function to get dataset from request headers
 * Use this in Server Components and API routes to access the dataset
 *
 * @example
 * import { getDatasetFromHeaders } from '@/middleware';
 *
 * const dataset = await getDatasetFromHeaders();
 */
export async function getDatasetFromHeaders(): Promise<string | undefined> {
  const { headers } = await import('next/headers');
  const headersList = await headers();
  return headersList.get('x-dataset') || undefined;
}

/**
 * Helper function to get hostname from request headers
 * Use this in Server Components and API routes
 *
 * @example
 * import { getHostnameFromHeaders } from '@/middleware';
 *
 * const hostname = await getHostnameFromHeaders();
 */
export async function getHostnameFromHeaders(): Promise<string | undefined> {
  const { headers } = await import('next/headers');
  const headersList = await headers();
  return headersList.get('x-domain') || undefined;
}

/**
 * Helper function to get client ID from request headers
 * Use this in Server Components and API routes
 *
 * @example
 * import { getClientIdFromHeaders } from '@/middleware';
 *
 * const clientId = await getClientIdFromHeaders();
 */
export async function getClientIdFromHeaders(): Promise<string | undefined> {
  const { headers } = await import('next/headers');
  const headersList = await headers();
  return headersList.get('x-client-id') || undefined;
}
