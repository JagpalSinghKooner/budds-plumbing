import { notFound } from 'next/navigation';
import { client, getClientForRequest } from '@/sanity/lib/client';
import {
  SERVICE_LOCATION_QUERY,
  SERVICE_LOCATIONS_SLUGS_QUERY,
} from '@/sanity/queries/service-location';
import { SETTINGS_QUERY } from '@/sanity/queries/settings';
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
  const requestClient = await getClientForRequest();
  const serviceLocation = await requestClient.fetch<SERVICE_LOCATION_QUERYResult>(
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
  const requestClient = await getClientForRequest();

  // Fetch service-location and siteSettings in parallel
  const [serviceLocation, siteSettings] = await Promise.all([
    requestClient.fetch<SERVICE_LOCATION_QUERYResult>(
      SERVICE_LOCATION_QUERY,
      {
        locationSlug,
        serviceSlug,
      }
    ),
    requestClient.fetch(SETTINGS_QUERY),
  ]);

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

  // Generate JSON-LD schemas using siteSettings data
  const serviceSchema = generateServiceSchema({
    name: serviceLocation.service.name
      ? `${serviceLocation.service.name} in ${serviceLocation.location.name}`
      : 'Service',
    description:
      serviceLocation.meta_description ||
      serviceLocation.service.meta_description ||
      '',
    provider: {
      name: siteSettings?.businessName || 'Budds Plumbing',
      url: siteUrl,
    },
    serviceType: 'Plumbing Service',
  });

  // Filter and map business hours with proper typing
  const openingHours = siteSettings?.businessHours
    ?.filter((hour: any) => Boolean(hour?.day && hour?.open && hour?.close))
    .map((hour: any) => ({
      day: hour.day as string,
      open: hour.open as string,
      close: hour.close as string,
    })) as Array<{ day: string; open: string; close: string }> | undefined;

  const businessSchema = generateLocalBusinessSchema({
    name: siteSettings?.businessName || 'Budds Plumbing',
    description:
      serviceLocation.location.meta_description ||
      siteSettings?.meta_description ||
      'Professional plumbing services',
    url: siteUrl,
    telephone: siteSettings?.phoneNumber || '',
    email: siteSettings?.email ?? undefined,
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
          addressLocality: serviceLocation.location.name || '',
          addressRegion: '',
          postalCode: '',
          addressCountry: 'US',
        },
    openingHours,
    areaServed: serviceLocation.location.name
      ? [serviceLocation.location.name]
      : [],
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
        {blocks && blocks.length > 0 && (
          <SectionRenderer
            sections={
              blocks as Parameters<typeof SectionRenderer>[0]['sections']
            }
          />
        )}

        {/* Fallback content inherits from service if service-location has no blocks */}
        {(!blocks || blocks.length === 0) && serviceLocation.service.blocks && (
          <SectionRenderer
            sections={
              serviceLocation.service.blocks as Parameters<
                typeof SectionRenderer
              >[0]['sections']
            }
          />
        )}
      </main>
    </>
  );
}
