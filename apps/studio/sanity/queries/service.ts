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
 * Query for fetching a single service by slug
 */
export const SERVICE_QUERY = groq`
  *[_type == "service" && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    headline,
    introCopy,
    body,
    faqs[]->{
      _id,
      question,
      answer
    },
    testimonials[]->{
      _id,
      name,
      role,
      company,
      quote,
      image {
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
 * Query for fetching all services (for listing pages)
 */
export const SERVICES_QUERY = groq`
  *[_type == "service"] | order(name asc) {
    _id,
    name,
    slug,
    headline,
    meta_description
  }
`;

/**
 * Query for fetching all service slugs (for static generation)
 */
export const SERVICES_SLUGS_QUERY = groq`
  *[_type == "service" && defined(slug.current)]{
    "slug": slug.current
  }
`;
