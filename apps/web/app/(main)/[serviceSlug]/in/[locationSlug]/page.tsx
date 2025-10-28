import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import {
  SERVICE_LOCATION_QUERY,
  SERVICE_LOCATIONS_SLUGS_QUERY,
} from '@/sanity/queries/service-location';
import { SETTINGS_QUERY } from '@/sanity/queries/settings';
import {
  generateSEOMetadata,
  generateServiceSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
  combineSchemas,
} from '@/lib/seo';
import SectionRenderer from '@/components/SectionRenderer';
import type { SERVICE_LOCATION_QUERYResult } from '@/sanity.types';

interface ServiceLocationPageProps {
  params: Promise<{
    serviceSlug: string;
    locationSlug: string;
  }>;
}

/**
 * Generate static params for all service-locations
 * Using the correct /[serviceSlug]/in/[locationSlug] pattern
 */
export async function generateStaticParams() {
  const serviceLocations = await client.fetch<
    Array<{
      serviceSlug: string;
      locationSlug: string;
    }>
  >(SERVICE_LOCATIONS_SLUGS_QUERY);

  return serviceLocations.map((sl) => ({
    serviceSlug: sl.serviceSlug,
    locationSlug: sl.locationSlug,
  }));
}

/**
 * Generate metadata for SEO with fallback logic
 */
export async function generateMetadata({ params }: ServiceLocationPageProps) {
  const { serviceSlug, locationSlug } = await params;
  const serviceLocation = await client.fetch<SERVICE_LOCATION_QUERYResult>(
    SERVICE_LOCATION_QUERY,
    {
      serviceSlug,
      locationSlug,
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
  const canonical = `${siteUrl}/${serviceSlug}/in/${locationSlug}`;

  // Computed title as per requirements
  const title =
    serviceLocation.meta_title ||
    `${serviceLocation.service.name} in ${serviceLocation.location.name}`;

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
 * Service-Location page component with fallback logic and siteSettings
 */
export default async function ServiceLocationPage({
  params,
}: ServiceLocationPageProps) {
  const { serviceSlug, locationSlug } = await params;

  // Fetch all required data in parallel
  const [serviceLocation, siteSettings] = await Promise.all([
    client.fetch<SERVICE_LOCATION_QUERYResult>(SERVICE_LOCATION_QUERY, {
      serviceSlug,
      locationSlug,
    }),
    client.fetch(SETTINGS_QUERY),
  ]);

  // If no serviceLocation document found, we still render with fallback
  // But we need at least the service and location to exist
  if (!serviceLocation?.service || !serviceLocation?.location) {
    // Try to fetch service directly as fallback
    const service = await client.fetch(
      `*[_type == 'service' && slug.current == $serviceSlug][0]`,
      { serviceSlug }
    );
    const location = await client.fetch(
      `*[_type == 'location' && slug.current == $locationSlug][0]`,
      { locationSlug }
    );

    if (!service || !location) {
      notFound();
    }

    // Create a fallback serviceLocation object
    const fallbackServiceLocation = {
      service,
      location,
      blocks: service.blocks,
    };

    return renderPage(
      fallbackServiceLocation as any,
      siteSettings,
      serviceSlug,
      locationSlug
    );
  }

  return renderPage(serviceLocation, siteSettings, serviceSlug, locationSlug);
}

function renderPage(
  serviceLocation: NonNullable<SERVICE_LOCATION_QUERYResult>,
  siteSettings: any,
  serviceSlug: string,
  locationSlug: string
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Use service-location blocks if they exist, otherwise use service blocks (fallback)
  const blocks =
    serviceLocation.blocks && serviceLocation.blocks.length > 0
      ? serviceLocation.blocks
      : serviceLocation.service?.blocks;

  // Generate JSON-LD schemas with siteSettings data
  const serviceSchema = generateServiceSchema({
    name: serviceLocation.service?.name
      ? `${serviceLocation.service.name} in ${serviceLocation.location?.name}`
      : 'Service',
    description:
      serviceLocation.meta_description ||
      serviceLocation.service?.meta_description ||
      '',
    provider: {
      name: siteSettings?.businessName || 'Budds Plumbing',
      url: siteUrl,
    },
    serviceType: 'Plumbing Service',
    areaServed: serviceLocation.location?.name
      ? [serviceLocation.location.name]
      : [],
  });

  const businessSchema = generateLocalBusinessSchema({
    name: siteSettings?.businessName || 'Budds Plumbing',
    description:
      siteSettings?.meta_description || 'Professional plumbing services',
    url: siteUrl,
    telephone: siteSettings?.phoneNumber || '',
    email: siteSettings?.email,
    address: siteSettings?.address
      ? {
          streetAddress: siteSettings.address.street || '',
          addressLocality: siteSettings.address.city || '',
          addressRegion: siteSettings.address.state || '',
          postalCode: siteSettings.address.zip || '',
          addressCountry: 'US',
        }
      : {
          streetAddress: '',
          addressLocality: serviceLocation.location?.name || '',
          addressRegion: '',
          postalCode: '',
          addressCountry: 'US',
        },
    openingHours: siteSettings?.businessHours,
    areaServed: serviceLocation.location?.name
      ? [serviceLocation.location.name]
      : [],
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteUrl },
    {
      name: serviceLocation.service?.name || 'Service',
      url: `${siteUrl}/services/${serviceSlug}`,
    },
    {
      name: `${serviceLocation.service?.name} in ${serviceLocation.location?.name}`,
      url: `${siteUrl}/${serviceSlug}/in/${locationSlug}`,
    },
  ]);

  const combinedSchema = combineSchemas(
    serviceSchema,
    businessSchema,
    breadcrumbSchema
  );

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
        {blocks && blocks.length > 0 && (
          <SectionRenderer sections={blocks as any} />
        )}

        {/* Default content if no blocks */}
        {(!blocks || blocks.length === 0) && (
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-4">
              {serviceLocation.service?.name} in{' '}
              {serviceLocation.location?.name}
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
