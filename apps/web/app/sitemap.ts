import { MetadataRoute } from 'next';
import { groq } from 'next-sanity';
import { sanityFetch } from '@/sanity/lib/live';

async function getPagesSitemap(): Promise<MetadataRoute.Sitemap[]> {
  const pagesQuery = groq`
    *[_type == 'page'] | order(slug.current) {
      'url': $baseUrl + select(slug.current == 'index' => '', '/' + slug.current),
      'lastModified': _updatedAt,
      'changeFrequency': 'daily',
      'priority': select(
        slug.current == 'index' => 1,
        0.5
      )
    }
  `;

  const { data } = await sanityFetch({
    query: pagesQuery,
    params: {
      baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
    },
  });

  return data;
}

async function getPostsSitemap(): Promise<MetadataRoute.Sitemap[]> {
  const postsQuery = groq`
    *[_type == 'post'] | order(_updatedAt desc) {
      'url': $baseUrl + '/blog/' + slug.current,
      'lastModified': _updatedAt,
      'changeFrequency': 'weekly',
      'priority': 0.7
    }
  `;

  const { data } = await sanityFetch({
    query: postsQuery,
    params: {
      baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
    },
  });

  return data;
}

async function getServicesSitemap(): Promise<MetadataRoute.Sitemap[]> {
  const servicesQuery = groq`
    *[_type == 'service' && !noindex] | order(_updatedAt desc) {
      'url': $baseUrl + '/services/' + slug.current,
      'lastModified': _updatedAt,
      'changeFrequency': 'weekly',
      'priority': 0.8
    }
  `;

  const { data } = await sanityFetch({
    query: servicesQuery,
    params: {
      baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
    },
  });

  return data;
}

async function getLocationsSitemap(): Promise<MetadataRoute.Sitemap[]> {
  const locationsQuery = groq`
    *[_type == 'location' && !noindex] | order(_updatedAt desc) {
      'url': $baseUrl + '/locations/' + slug.current,
      'lastModified': _updatedAt,
      'changeFrequency': 'weekly',
      'priority': 0.8
    }
  `;

  const { data } = await sanityFetch({
    query: locationsQuery,
    params: {
      baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
    },
  });

  return data;
}

async function getServiceLocationsSitemap(): Promise<MetadataRoute.Sitemap[]> {
  const serviceLocationsQuery = groq`
    *[_type == 'service-location' && !noindex] | order(_updatedAt desc) {
      'url': $baseUrl + '/locations/' + location->slug.current + '/services/' + service->slug.current,
      'lastModified': _updatedAt,
      'changeFrequency': 'weekly',
      'priority': 0.9
    }
  `;

  const { data } = await sanityFetch({
    query: serviceLocationsQuery,
    params: {
      baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
    },
  });

  return data;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap[]> {
  const [pages, posts, services, locations, serviceLocations] =
    await Promise.all([
      getPagesSitemap(),
      getPostsSitemap(),
      getServicesSitemap(),
      getLocationsSitemap(),
      getServiceLocationsSitemap(),
    ]);

  return [...pages, ...posts, ...services, ...locations, ...serviceLocations];
}
