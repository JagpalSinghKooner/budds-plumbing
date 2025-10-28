/**
 * Migration script to create service categories and assign them to services
 * Run with: cd apps/studio && pnpm sanity exec ../../scripts/create-service-categories.js --with-user-token
 */

import { getCliClient } from 'sanity/cli';

// Get the Sanity client
const client = getCliClient();

// Define categories
const categories = [
  {
    _id: 'service-category-hvac-heating',
    _type: 'serviceCategory',
    name: 'HVAC & Heating',
    slug: {
      _type: 'slug',
      current: 'hvac-heating',
    },
    description:
      'Heating, ventilation, air conditioning, and air quality services',
  },
  {
    _id: 'service-category-plumbing',
    _type: 'serviceCategory',
    name: 'Plumbing',
    slug: {
      _type: 'slug',
      current: 'plumbing',
    },
    description: 'Residential and commercial plumbing services',
  },
];

// Map services to categories
const serviceMapping = {
  'service-category-hvac-heating': [
    'service-air-quality',
    'service-boiler-repair',
    'service-ductless-hvac',
    'service-furnace-installation',
    'service-furnace-repair',
    'service-furnace-tuneup',
    'service-heater-checkup',
    'service-heater-service-plans',
    'service-heating-installation',
    'service-humidifier-installation',
    'service-hvac-services',
    'service-smart-thermostats',
  ],
  'service-category-plumbing': [
    'service-drain-cleaning',
    'service-faucet-repair',
    'service-garbage-disposal',
    'service-gas-line',
    'service-piping-repiping',
    'service-plumbing-maintenance',
    'service-sewer-line',
    'service-showers-bathtubs',
    'service-sink-installation-repair',
    'service-sump-pump',
    'service-tankless-water-heater',
    'service-toilet-repair',
    'service-water-heater-repair',
  ],
};

async function migrate() {
  console.log('Starting service category migration...\n');

  try {
    // Step 1: Create categories
    console.log('Step 1: Creating service categories...');
    for (const category of categories) {
      console.log(`  Creating category: ${category.name}`);
      await client.createOrReplace(category);
    }
    console.log('✓ Categories created successfully\n');

    // Step 2: Assign categories to services
    console.log('Step 2: Assigning categories to services...');
    let successCount = 0;
    let errorCount = 0;

    for (const [categoryId, serviceIds] of Object.entries(serviceMapping)) {
      const categoryName = categories.find((c) => c._id === categoryId)?.name;
      console.log(`\n  Assigning services to "${categoryName}":`);

      for (const serviceId of serviceIds) {
        try {
          await client
            .patch(serviceId)
            .set({
              category: {
                _type: 'reference',
                _ref: categoryId,
              },
            })
            .commit();

          console.log(`    ✓ ${serviceId}`);
          successCount++;
        } catch (error) {
          console.error(`    ✗ ${serviceId}: ${error.message}`);
          errorCount++;
        }
      }
    }

    console.log(`\n✓ Migration completed!`);
    console.log(`  Successfully updated: ${successCount} services`);
    if (errorCount > 0) {
      console.log(`  Errors: ${errorCount} services`);
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
