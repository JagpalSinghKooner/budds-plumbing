import { groq } from 'next-sanity';
import { hero1Query } from './hero/hero-1';
import { hero2Query } from './hero/hero-2';
import { sectionHeaderQuery } from './section-header';
import { splitRowQuery } from './split/split-row';
import { gridRowQuery } from './grid/grid-row';
import { carousel1Query } from './carousel/carousel-1';
import { carousel2Query } from './carousel/carousel-2';
import { timelineQuery } from './timeline';
import { cta1Query } from './cta/cta-1';
import { logoCloud1Query } from './logo-cloud/logo-cloud-1';
import { faqsQuery } from './faqs';
import { formNewsletterQuery } from './forms/newsletter';

/**
 * Query for fetching a single service-location by slugs
 */
export const SERVICE_LOCATION_QUERY = groq`
  *[_type == "service-location"
    && service->slug.current == $serviceSlug
    && location->slug.current == $locationSlug][0]{
    _id,
    _type,
    service->{
      _id,
      name,
      slug,
      blocks[]{
        ${hero1Query},
        ${hero2Query},
        ${sectionHeaderQuery},
        ${splitRowQuery},
        ${gridRowQuery},
        ${carousel1Query},
        ${carousel2Query},
        ${timelineQuery},
        ${cta1Query},
        ${logoCloud1Query},
        ${faqsQuery},
        ${formNewsletterQuery},
      },
      meta_title,
      meta_description,
      noindex,
      ogImage {
        asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      }
    },
    location->{
      _id,
      name,
      slug,
      meta_title,
      meta_description,
      noindex,
      ogImage {
        asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      }
    },
    blocks[]{
      ${hero1Query},
      ${hero2Query},
      ${sectionHeaderQuery},
      ${splitRowQuery},
      ${gridRowQuery},
      ${carousel1Query},
      ${carousel2Query},
      ${timelineQuery},
      ${cta1Query},
      ${logoCloud1Query},
      ${faqsQuery},
      ${formNewsletterQuery},
    },
    meta_title,
    meta_description,
    noindex,
    ogImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      }
    }
  }
`;

/**
 * Query for fetching all service-location slugs (for static generation)
 */
export const SERVICE_LOCATIONS_SLUGS_QUERY = groq`
  *[_type == "service-location"
    && defined(service->slug.current)
    && defined(location->slug.current)]{
    "serviceSlug": service->slug.current,
    "locationSlug": location->slug.current
  }
`;

/**
 * Query for fetching all service-locations (for listing pages)
 */
export const SERVICE_LOCATIONS_QUERY = groq`
  *[_type == "service-location"] | order(service->name asc, location->name asc) {
    _id,
    "serviceName": service->name,
    "serviceSlug": service->slug.current,
    "locationName": location->name,
    "locationSlug": location->slug.current,
    meta_description
  }
`;
