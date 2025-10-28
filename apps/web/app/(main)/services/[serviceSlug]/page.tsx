import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { SERVICE_QUERY, SERVICES_SLUGS_QUERY } from '@/sanity/queries/service';
import { SETTINGS_QUERY } from '@/sanity/queries/settings';
import {
  generateSEOMetadata,
  generateServiceSchema,
  generateLocalBusinessSchema,
  combineSchemas,
} from '@/lib/seo';
import SectionRenderer from '@/components/SectionRenderer';
import type { Service } from '@/sanity.types';

interface ServicePageProps {
  params: Promise<{
    serviceSlug: string;
  }>;
}

/**
 * Generate static params for all services
 */
export async function generateStaticParams() {
  const services =
    await client.fetch<Array<{ slug: string }>>(SERVICES_SLUGS_QUERY);

  return services.map((service) => ({
    serviceSlug: service.slug,
  }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: ServicePageProps) {
  const { serviceSlug } = await params;
  const service = await client.fetch<Service>(SERVICE_QUERY, {
    slug: serviceSlug,
  });

  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonical = `${siteUrl}/services/${serviceSlug}`;

  return generateSEOMetadata({
    title: service.meta_title || service.name || 'Service',
    description: service.meta_description || '',
    canonical,
    noindex: service.noindex || false,
    openGraph: service.ogImage
      ? {
          title: service.meta_title || service.name,
          description: service.meta_description || '',
        }
      : undefined,
    twitter: service.ogImage
      ? {
          card: 'summary_large_image',
          title: service.meta_title || service.name,
          description: service.meta_description || '',
        }
      : undefined,
  });
}

/**
 * Service page component
 */
export default async function ServicePage({ params }: ServicePageProps) {
  const { serviceSlug } = await params;

  // Fetch service and siteSettings in parallel
  const [service, siteSettings] = await Promise.all([
    client.fetch<Service>(SERVICE_QUERY, {
      slug: serviceSlug,
    }),
    client.fetch(SETTINGS_QUERY),
  ]);

  if (!service) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Generate JSON-LD schemas using siteSettings data
  const serviceSchema = generateServiceSchema({
    name: service.name || 'Service',
    description: service.meta_description || '',
    provider: {
      name: siteSettings?.businessName || 'Budds Plumbing',
      url: siteUrl,
    },
    serviceType: 'Plumbing Service',
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
          addressLocality: '',
          addressRegion: '',
          postalCode: '',
          addressCountry: 'US',
        },
    openingHours: siteSettings?.businessHours,
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
        {service.blocks && service.blocks.length > 0 && (
          <SectionRenderer sections={service.blocks} />
        )}

        {/* Default content if no blocks */}
        {(!service.blocks || service.blocks.length === 0) && (
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
            <p className="text-muted-foreground">
              Content coming soon. Please add blocks to this service in the CMS.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
