import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import {
  SERVICE_LOCATION_QUERY,
  SERVICE_LOCATIONS_SLUGS_QUERY,
} from '@/sanity/queries/service-location';
import {
  generateSEOMetadata,
  generateServiceSchema,
  generateLocalBusinessSchema,
  combineSchemas,
} from '@/lib/seo';
import SectionRenderer from '@/components/SectionRenderer';
import type { SERVICE_LOCATION_QUERYResult } from '@/sanity.types';

interface ServiceLocationPageProps {
  params: Promise<{
    locationSlug: string;
    serviceSlug: string;
  }>;
}

/**
 * Generate static params for all service-locations
 */
export async function generateStaticParams() {
  const serviceLocations = await client.fetch<
    Array<{
      serviceSlug: string;
      locationSlug: string;
    }>
  >(SERVICE_LOCATIONS_SLUGS_QUERY);

  return serviceLocations.map((sl) => ({
    locationSlug: sl.locationSlug,
    serviceSlug: sl.serviceSlug,
  }));
}

/**
 * Generate metadata for SEO with fallback logic
 */
export async function generateMetadata({ params }: ServiceLocationPageProps) {
  const { locationSlug, serviceSlug } = await params;
  const serviceLocation = await client.fetch<SERVICE_LOCATION_QUERYResult>(
    SERVICE_LOCATION_QUERY,
    {
      locationSlug,
      serviceSlug,
    }
  );

  if (
    !serviceLocation ||
    !serviceLocation.service ||
    !serviceLocation.location
  ) {
    return {
      title: 'Service Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonical = `${siteUrl}/locations/${locationSlug}/services/${serviceSlug}`;

  // Fallback logic for title
  const title =
    serviceLocation.meta_title ||
    (serviceLocation.service.name && serviceLocation.location.name
      ? `${serviceLocation.service.name} in ${serviceLocation.location.name}`
      : serviceLocation.service.meta_title ||
        serviceLocation.service.name ||
        'Service');

  // Fallback logic for description
  const description =
    serviceLocation.meta_description ||
    serviceLocation.service.meta_description ||
    '';

  return generateSEOMetadata({
    title,
    description,
    canonical,
    noindex:
      serviceLocation.noindex || serviceLocation.service.noindex || false,
    openGraph:
      serviceLocation.ogImage || serviceLocation.service.ogImage
        ? {
            title,
            description,
          }
        : undefined,
    twitter:
      serviceLocation.ogImage || serviceLocation.service.ogImage
        ? {
            card: 'summary_large_image',
            title,
            description,
          }
        : undefined,
  });
}

/**
 * Service-Location page component with fallback logic
 */
export default async function ServiceLocationPage({
  params,
}: ServiceLocationPageProps) {
  const { locationSlug, serviceSlug } = await params;
  const serviceLocation = await client.fetch<SERVICE_LOCATION_QUERYResult>(
    SERVICE_LOCATION_QUERY,
    {
      locationSlug,
      serviceSlug,
    }
  );

  if (
    !serviceLocation ||
    !serviceLocation.service ||
    !serviceLocation.location
  ) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Use service-location blocks if they exist, otherwise use service blocks
  const blocks =
    serviceLocation.blocks && serviceLocation.blocks.length > 0
      ? serviceLocation.blocks
      : serviceLocation.service.blocks;

  // Generate JSON-LD schemas
  const serviceSchema = generateServiceSchema({
    name: serviceLocation.service.name
      ? `${serviceLocation.service.name} in ${serviceLocation.location.name}`
      : 'Service',
    description:
      serviceLocation.meta_description ||
      serviceLocation.service.meta_description ||
      '',
    provider: {
      name: 'Budds Plumbing',
      url: siteUrl,
    },
    serviceType: 'Plumbing Service',
  });

  const businessSchema = generateLocalBusinessSchema({
    name: serviceLocation.location.name || 'Budds Plumbing',
    description:
      serviceLocation.location.meta_description ||
      'Professional plumbing services',
    url: siteUrl,
    telephone: '+1-555-PLUMBING',
    address: {
      streetAddress: '123 Main St',
      addressLocality: serviceLocation.location.name || 'City',
      addressRegion: 'State',
      postalCode: '12345',
      addressCountry: 'US',
    },
  });

  const combinedSchema = combineSchemas(serviceSchema, businessSchema);

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
        {blocks && blocks.length > 0 && <SectionRenderer sections={blocks} />}

        {/* Default content if no blocks */}
        {(!blocks || blocks.length === 0) && (
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-4">
              {serviceLocation.service.name} in {serviceLocation.location.name}
            </h1>
            <p className="text-muted-foreground">
              Content coming soon. Please add blocks to this service-location in
              the CMS.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
