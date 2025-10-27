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
  generateFAQSchema,
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
    serviceLocation.headline ||
    serviceLocation.service.meta_description ||
    serviceLocation.service.headline ||
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

  // Fallback logic for content
  const headline =
    serviceLocation.headline ||
    (serviceLocation.service.headline && serviceLocation.location.name
      ? `${serviceLocation.service.headline} in ${serviceLocation.location.name}`
      : serviceLocation.service.headline);

  const introCopy =
    serviceLocation.introCopy || serviceLocation.service.introCopy;

  // Use service-location blocks if they exist, otherwise use service blocks
  const blocks =
    serviceLocation.blocks && serviceLocation.blocks.length > 0
      ? serviceLocation.blocks
      : serviceLocation.service.blocks;

  // Use service-location FAQs if they exist, otherwise use service FAQs
  const faqs =
    serviceLocation.faqs && (serviceLocation.faqs as any).length > 0
      ? serviceLocation.faqs
      : serviceLocation.service.faqs;

  // Use service-location testimonials if they exist, otherwise use service testimonials
  const testimonials =
    serviceLocation.testimonials &&
    (serviceLocation.testimonials as any).length > 0
      ? serviceLocation.testimonials
      : serviceLocation.service.testimonials;

  // Generate JSON-LD schemas
  const serviceSchema = generateServiceSchema({
    name: serviceLocation.service.name
      ? `${serviceLocation.service.name} in ${serviceLocation.location.name}`
      : 'Service',
    description: headline || introCopy || '',
    provider: {
      name: 'Budds Plumbing',
      url: siteUrl,
    },
    serviceType: 'Plumbing Service',
    areaServed: serviceLocation.location.coverageAreas || undefined,
  });

  const businessSchema = generateLocalBusinessSchema({
    name: serviceLocation.location.name || 'Budds Plumbing',
    description:
      serviceLocation.location.aboutLocation ||
      'Professional plumbing services',
    url: siteUrl,
    telephone: serviceLocation.location.phoneNumber || '+1-555-PLUMBING',
    address: {
      streetAddress: '123 Main St',
      addressLocality: 'City',
      addressRegion: 'State',
      postalCode: '12345',
      addressCountry: 'US',
    },
    areaServed: serviceLocation.location.coverageAreas || undefined,
  });

  // Generate FAQ schema if FAQs exist
  const faqSchema =
    faqs && faqs.length > 0
      ? generateFAQSchema(
          faqs.map((faq) => ({
            question: faq.question || '',
            answer: faq.answer || '',
          }))
        )
      : {};

  const combinedSchema = combineSchemas(
    serviceSchema,
    businessSchema,
    faqSchema
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
              {serviceLocation.service.name} in {serviceLocation.location.name}
            </h1>
            {headline && (
              <p className="text-xl text-muted-foreground mb-8">{headline}</p>
            )}
            {introCopy && (
              <div className="prose max-w-none mb-8">
                <p>{introCopy}</p>
              </div>
            )}

            {/* Location Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Service Area</h2>
              <p className="mb-2">
                <strong>Location:</strong> {serviceLocation.location.name}
              </p>
              {serviceLocation.location.coverageAreas &&
                serviceLocation.location.coverageAreas.length > 0 && (
                  <>
                    <p className="mb-2">
                      <strong>Coverage Areas:</strong>
                    </p>
                    <ul className="list-disc list-inside ml-4">
                      {serviceLocation.location.coverageAreas.map(
                        (area, index) => (
                          <li key={index}>{area}</li>
                        )
                      )}
                    </ul>
                  </>
                )}
              {serviceLocation.location.phoneNumber && (
                <p className="mb-2 mt-4">
                  <strong>Phone:</strong> {serviceLocation.location.phoneNumber}
                </p>
              )}
              {serviceLocation.location.operatingHours && (
                <>
                  <p className="mb-2 mt-4">
                    <strong>Operating Hours:</strong>
                  </p>
                  <p className="whitespace-pre-line ml-4">
                    {serviceLocation.location.operatingHours}
                  </p>
                </>
              )}
            </div>

            {/* FAQs */}
            {faqs && faqs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq._id} className="border-b pb-4">
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonials */}
            {testimonials && testimonials.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  What Our Customers Say
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials.map((testimonial) => (
                    <div
                      key={testimonial._id}
                      className="border rounded-lg p-6"
                    >
                      <p className="mb-4 italic">"{testimonial.quote}"</p>
                      <p className="font-semibold">{testimonial.name}</p>
                      {testimonial.role && (
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
