import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import {
  LOCATION_QUERY,
  LOCATIONS_SLUGS_QUERY,
} from '@/sanity/queries/location';
import {
  generateSEOMetadata,
  generateLocalBusinessSchema,
  combineSchemas,
} from '@/lib/seo';
import SectionRenderer from '@/components/SectionRenderer';
import type { Location } from '@/sanity.types';

interface LocationPageProps {
  params: Promise<{
    locationSlug: string;
  }>;
}

/**
 * Generate static params for all locations
 */
export async function generateStaticParams() {
  const locations = await client.fetch<Array<{ slug: string }>>(
    LOCATIONS_SLUGS_QUERY
  );

  return locations.map((location) => ({
    locationSlug: location.slug,
  }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: LocationPageProps) {
  const { locationSlug } = await params;
  const location = await client.fetch<Location>(LOCATION_QUERY, {
    slug: locationSlug,
  });

  if (!location) {
    return {
      title: 'Location Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonical = `${siteUrl}/locations/${locationSlug}`;

  return generateSEOMetadata({
    title: location.meta_title || location.name || 'Location',
    description: location.meta_description || location.aboutLocation || '',
    canonical,
    noindex: location.noindex === 'noindex',
    openGraph: location.ogImage
      ? {
          title: location.meta_title || location.name,
          description: location.meta_description || location.aboutLocation,
        }
      : undefined,
    twitter: location.ogImage
      ? {
          card: 'summary_large_image',
          title: location.meta_title || location.name,
          description: location.meta_description || location.aboutLocation,
        }
      : undefined,
  });
}

/**
 * Location page component
 */
export default async function LocationPage({ params }: LocationPageProps) {
  const { locationSlug } = await params;
  const location = await client.fetch<Location>(LOCATION_QUERY, {
    slug: locationSlug,
  });

  if (!location) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Generate JSON-LD schemas
  const businessSchema = generateLocalBusinessSchema({
    name: location.name || 'Budds Plumbing',
    description:
      location.aboutLocation ||
      location.meta_description ||
      'Professional plumbing services',
    url: `${siteUrl}/locations/${locationSlug}`,
    telephone: location.phoneNumber || '+1-555-PLUMBING',
    address: {
      streetAddress: '123 Main St',
      addressLocality: 'City',
      addressRegion: 'State',
      postalCode: '12345',
      addressCountry: 'US',
    },
    areaServed: location.coverageAreas,
  });

  const combinedSchema = combineSchemas(businessSchema);

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(combinedSchema),
        }}
      />

      {/* Page Content */}
      <main>
        {/* Render dynamic sections */}
        {location.blocks && location.blocks.length > 0 && (
          <SectionRenderer sections={location.blocks as any} />
        )}

        {/* Default content if no blocks */}
        {(!location.blocks || location.blocks.length === 0) && (
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-4">{location.name}</h1>
            {location.aboutLocation && (
              <p className="text-xl text-muted-foreground mb-8">
                {location.aboutLocation}
              </p>
            )}

            {/* Coverage Areas */}
            {location.coverageAreas && location.coverageAreas.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Service Areas</h2>
                <ul className="list-disc list-inside">
                  {location.coverageAreas.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact Information */}
            {location.phoneNumber && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Contact Information
                </h2>
                <p className="mb-2">
                  <strong>Phone:</strong> {location.phoneNumber}
                </p>
              </div>
            )}

            {/* Operating Hours */}
            {location.operatingHours && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Operating Hours</h2>
                <p className="whitespace-pre-line">{location.operatingHours}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
