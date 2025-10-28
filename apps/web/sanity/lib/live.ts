import { defineLive } from 'next-sanity/live';
import { client, getClientForRequest } from './client';
import { token } from './token';

/**
 * Legacy live configuration using default client
 * This maintains backward compatibility with existing code
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  // Required for showing draft content when the Sanity Presentation Tool is used, or to enable the Vercel Toolbar Edit Mode
  serverToken: token,
  // Required for stand-alone live previews, the token is only shared to the browser if it's a valid Next.js Draft Mode session
  browserToken: token,
});

/**
 * Create a dynamic live configuration that uses the dataset from request context
 * Use this in Server Components that need multi-tenant support
 *
 * @example
 * // In a Server Component
 * const { sanityFetch } = await getDefineLiveForRequest();
 * const { data } = await sanityFetch({ query: MY_QUERY });
 */
export async function getDefineLiveForRequest() {
  const dynamicClient = await getClientForRequest();

  return defineLive({
    client: dynamicClient,
    serverToken: token,
    browserToken: token,
  });
}
