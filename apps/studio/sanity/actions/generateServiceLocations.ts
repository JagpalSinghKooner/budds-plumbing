import { DocumentActionComponent } from 'sanity';

/**
 * Custom document action to automatically generate service-location documents
 * for all locations when a service is published or a button is clicked
 */
export const generateServiceLocationsAction: DocumentActionComponent = (
  props
) => {
  const { id, type, published, draft } = props;

  // Only show this action for service documents
  if (type !== 'service') {
    return null;
  }

  return {
    label: 'Generate Service Locations',
    icon: () => '🗺️',
    disabled: !published && !draft,
    onHandle: async () => {
      const { getClient } = await import('sanity');
      const client = getClient({ apiVersion: '2024-01-01' });

      try {
        // Get the service document
        const service = await client.fetch(
          `*[_type == "service" && _id == $id][0]{_id, name, slug}`,
          { id: published?._id || draft?._id || id }
        );

        if (!service || !service.slug?.current) {
          throw new Error('Service not found or missing slug');
        }

        // Get all locations
        const locations = await client.fetch<
          Array<{ _id: string; name: string; slug: { current: string } }>
        >(`*[_type == "location"]{_id, name, slug}`);

        if (!locations || locations.length === 0) {
          console.warn('No locations found. Please create locations first.');
          props.onComplete();
          return;
        }

        // Check which service-locations already exist
        const existingServiceLocations = await client.fetch<
          Array<{ serviceId: string; locationId: string }>
        >(
          `*[_type == "service-location" && service._ref == $serviceId]{
            "serviceId": service._ref,
            "locationId": location._ref
          }`,
          { serviceId: service._id }
        );

        const existingLocationIds = new Set(
          existingServiceLocations.map((sl) => sl.locationId)
        );

        // Create service-location documents for locations that don't have one yet
        const mutations = locations
          .filter((location) => !existingLocationIds.has(location._id))
          .map((location) => ({
            create: {
              _type: 'service-location',
              service: {
                _type: 'reference',
                _ref: service._id,
              },
              location: {
                _type: 'reference',
                _ref: location._id,
              },
              slug: {
                _type: 'slug',
                current: `${location.slug.current}-${service.slug.current}`,
              },
              meta_title: `${service.name} in ${location.name}`,
              meta_description: `Professional ${service.name.toLowerCase()} services in ${location.name}. Contact Budds Plumbing for expert plumbing solutions.`,
              noindex: false,
              blocks: [],
            },
          }));

        if (mutations.length === 0) {
          console.warn(
            `Service locations already exist for all ${locations.length} locations.`
          );
        } else {
          // Execute mutations in batches to avoid hitting API limits
          const batchSize = 10;
          for (let i = 0; i < mutations.length; i += batchSize) {
            const batch = mutations.slice(i, i + batchSize);
            await client
              .transaction(
                batch.map((m) => client.transaction().create(m.create))
              )
              .commit();
          }

          console.warn(
            `Successfully created ${mutations.length} service-location page(s) for "${service.name}".`
          );
        }

        props.onComplete();
      } catch (error) {
        console.error('Error generating service locations:', error);
      }
    },
  };
};
