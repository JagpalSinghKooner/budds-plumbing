/**
 * Script to generate all service-location combinations
 * Run with: pnpm sanity exec scripts/generate-all-service-locations.ts --with-user-token
 */

import { getCliClient } from 'sanity/cli';

const client = getCliClient();

interface Service {
  _id: string;
  name: string;
  slug: { current: string };
}

interface Location {
  _id: string;
  name: string;
  slug: { current: string };
}

interface ExistingServiceLocation {
  serviceId: string;
  locationId: string;
}

async function generateAllServiceLocations() {
  console.log('🚀 Starting service-location generation...\n');

  // Fetch all services
  const services = await client.fetch<Service[]>(
    `*[_type == "service"]{_id, name, slug}`
  );

  if (!services || services.length === 0) {
    console.error('❌ No services found. Please create services first.');
    return;
  }

  console.log(`✅ Found ${services.length} services`);

  // Fetch all locations
  const locations = await client.fetch<Location[]>(
    `*[_type == "location"]{_id, name, slug}`
  );

  if (!locations || locations.length === 0) {
    console.error('❌ No locations found. Please create locations first.');
    return;
  }

  console.log(`✅ Found ${locations.length} locations`);

  // Fetch existing service-locations
  const existingServiceLocations = await client.fetch<
    ExistingServiceLocation[]
  >(`*[_type == "service-location"]{
    "serviceId": service._ref,
    "locationId": location._ref
  }`);

  console.log(
    `📊 Found ${existingServiceLocations.length} existing service-location combinations\n`
  );

  // Create a Set for quick lookup
  const existingCombos = new Set(
    existingServiceLocations.map((sl) => `${sl.serviceId}|${sl.locationId}`)
  );

  // Generate all possible combinations
  const mutations = [];
  let skipped = 0;

  for (const service of services) {
    for (const location of locations) {
      const comboKey = `${service._id}|${location._id}`;

      if (existingCombos.has(comboKey)) {
        skipped++;
        continue;
      }

      mutations.push({
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
      });
    }
  }

  console.log(`📝 Creating ${mutations.length} new service-location documents`);
  console.log(`⏭️  Skipping ${skipped} existing combinations\n`);

  if (mutations.length === 0) {
    console.log('✅ All service-location combinations already exist!');
    return;
  }

  // Execute mutations in batches
  const batchSize = 10;
  let created = 0;

  for (let i = 0; i < mutations.length; i += batchSize) {
    const batch = mutations.slice(i, i + batchSize);
    const transaction = client.transaction();

    for (const mutation of batch) {
      transaction.create(mutation.create);
    }

    await transaction.commit();
    created += batch.length;

    console.log(
      `✅ Created ${created}/${mutations.length} service-locations...`
    );
  }

  console.log(
    `\n🎉 Successfully created ${mutations.length} service-location documents!`
  );
  console.log(
    `📊 Total service-locations in database: ${existingServiceLocations.length + mutations.length}`
  );
}

generateAllServiceLocations()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
