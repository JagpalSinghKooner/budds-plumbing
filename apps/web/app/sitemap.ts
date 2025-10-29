import { MetadataRoute } from 'next';
import { groq } from 'next-sanity';
import { getDefineLiveForRequest } from '@/sanity/lib/live';

/**
 * Sitemap Generator - Phase 1 Contract
 *
 * Only includes approved document types: service, location, service-location
 * Uses request-scoped dataset for multi-tenant safety
 * Filters out noindex documents
 */

async function getServicesSitemap(): Promise<MetadataRoute.Sitemap[]> {
  const servicesQuery = groq`
    *[_type == 'service' && !defined(seo.noindex) || seo.noindex != true] | order(_updatedAt desc) {
      'url': $baseUrl + '/services/' + slug.current,
      'lastModified': _updatedAt,
      'changeFrequency': 'weekly',
      'priority': 0.8
    }
  `;

  const { sanityFetch } = await getDefineLiveForRequest();
  const { data } = await sanityFetch({
    query: servicesQuery,
    params: {
      baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  });

  return data || [];
}

async function getLocationsSitemap(): Promise<MetadataRoute.Sitemap[]> {
  const locationsQuery = groq`
    *[_type == 'location' && !defined(seo.noindex) || seo.noindex != true] | order(_updatedAt desc) {
      'url': $baseUrl + '/locations/' + slug.current,
      'lastModified': _updatedAt,
      'changeFrequency': 'weekly',
      'priority': 0.8
    }
  `;

  const { sanityFetch } = await getDefineLiveForRequest();
  const { data } = await sanityFetch({
    query: locationsQuery,
    params: {
      baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  });

  return data || [];
}

async function getServiceLocationsSitemap(): Promise<MetadataRoute.Sitemap[]> {
  const serviceLocationsQuery = groq`
    *[_type == 'serviceLocation' && !defined(seo.noindex) || seo.noindex != true] | order(_updatedAt desc) {
      'service': service->,
      'location': location->,
      'updatedAt': _updatedAt
    }[defined(service.slug.current) && defined(location.slug.current)] {
      'url': $baseUrl + '/' + service.slug.current + '/in/' + location.slug.current,
      'lastModified': updatedAt,
      'changeFrequency': 'weekly',
      'priority': 0.9
    }
  `;

  const { sanityFetch } = await getDefineLiveForRequest();
  const { data } = await sanityFetch({
    query: serviceLocationsQuery,
    params: {
      baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  });

  return data || [];
}

/**
 * Phase 1 Sitemap
 *
 * Only includes Phase 1 approved document types:
 * - service
 * - location
 * - serviceLocation (derived URLs from references)
 *
 * Uses request-scoped dataset to prevent cross-tenant URL leaks.
 * Excludes documents with seo.noindex = true.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap[]> {
  const [services, locations, serviceLocations] = await Promise.all([
    getServicesSitemap(),
    getLocationsSitemap(),
    getServiceLocationsSitemap(),
  ]);

  return [...services, ...locations, ...serviceLocations];
}
