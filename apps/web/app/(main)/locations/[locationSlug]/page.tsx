import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import {
  LOCATION_QUERY,
  LOCATIONS_SLUGS_QUERY,
} from '@/sanity/queries/location';
import { SETTINGS_QUERY } from '@/sanity/queries/settings';
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

  // Fetch location and siteSettings in parallel
  const [location, siteSettings] = await Promise.all([
    client.fetch<Location>(LOCATION_QUERY, {
      slug: locationSlug,
    }),
    client.fetch(SETTINGS_QUERY),
  ]);

  if (!location) {
    return {
      title: 'Location Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonical = `${siteUrl}/locations/${locationSlug}`;

  // Title with fallback to siteSettings
  const title = location.meta_title ||
                `${siteSettings?.businessName || 'Budds Plumbing'} in ${location.name}`;

  return generateSEOMetadata({
    title,
    description: location.meta_description || '',
    canonical,
    noindex: location.noindex || false,
    openGraph: location.ogImage
      ? {
          title,
          description: location.meta_description || '',
        }
      : undefined,
    twitter: location.ogImage
      ? {
          card: 'summary_large_image',
          title,
          description: location.meta_description || '',
        }
      : undefined,
  });
}

/**
 * Location page component
 */
export default async function LocationPage({ params }: LocationPageProps) {
  const { locationSlug } = await params;

  // Fetch location and siteSettings in parallel
  const [location, siteSettings] = await Promise.all([
    client.fetch<Location>(LOCATION_QUERY, {
      slug: locationSlug,
    }),
    client.fetch(SETTINGS_QUERY),
  ]);

  if (!location) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Generate JSON-LD schemas using siteSettings data
  const businessSchema = generateLocalBusinessSchema({
    name: siteSettings?.businessName || 'Budds Plumbing',
    description: location.meta_description || siteSettings?.meta_description || 'Professional plumbing services',
    url: `${siteUrl}/locations/${locationSlug}`,
    telephone: siteSettings?.phoneNumber || '',
    email: siteSettings?.email,
    address: siteSettings?.address ? {
      streetAddress: siteSettings.address.street || '',
      addressLocality: siteSettings.address.city || '',
      addressRegion: siteSettings.address.state || '',
      postalCode: siteSettings.address.zip || '',
      addressCountry: 'US',
    } : {
      streetAddress: '',
      addressLocality: location.name || '',
      addressRegion: '',
      postalCode: '',
      addressCountry: 'US',
    },
    openingHours: siteSettings?.businessHours,
    areaServed: location.name ? [location.name] : [],
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
          <SectionRenderer sections={location.blocks} />
        )}

        {/* Default content if no blocks */}
        {(!location.blocks || location.blocks.length === 0) && (
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-4">{location.name}</h1>
            <p className="text-muted-foreground">
              Content coming soon. Please add blocks to this location in the
              CMS.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
