#!/usr/bin/env node

/**
 * Client validation script
 * Validates that a client dataset is properly configured and contains required documents
 */

import { createClient, type SanityClient } from '@sanity/client';
import type { ValidationResult } from './types';

/**
 * Color codes for terminal output
 */
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Validates environment variables
 */
function validateEnvironment(): {
  projectId: string;
  token: string;
  apiVersion: string;
} {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token = process.env.SANITY_API_READ_TOKEN;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-18';

  if (!projectId) {
    throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID environment variable is required');
  }

  if (!token) {
    throw new Error('SANITY_API_READ_TOKEN environment variable is required');
  }

  return { projectId, token, apiVersion };
}

/**
 * Creates a Sanity client for a specific dataset
 */
function createDatasetClient(
  projectId: string,
  dataset: string,
  token: string,
  apiVersion: string
): SanityClient {
  return createClient({
    projectId,
    dataset,
    token,
    apiVersion,
    useCdn: false,
  });
}

/**
 * Checks if a dataset exists
 */
async function checkDatasetExists(
  client: SanityClient,
  datasetName: string
): Promise<boolean> {
  try {
    const datasets = await client.datasets.list();
    return datasets.some((ds: { name: string }) => ds.name === datasetName);
  } catch (error) {
    console.error(`${colors.red}Error checking dataset:${colors.reset}`, error);
    return false;
  }
}

/**
 * Checks if required documents exist
 */
async function checkRequiredDocuments(
  client: SanityClient
): Promise<{
  settings: boolean;
  navigation: boolean;
  pages: number;
}> {
  try {
    const [settings, navigation, pages] = await Promise.all([
      client.fetch('*[_type == "settings"][0]'),
      client.fetch('*[_type == "navigation"][0]'),
      client.fetch('count(*[_type == "page"])'),
    ]);

    return {
      settings: !!settings,
      navigation: !!navigation,
      pages: pages || 0,
    };
  } catch (error) {
    console.error(
      `${colors.red}Error checking required documents:${colors.reset}`,
      error
    );
    return {
      settings: false,
      navigation: false,
      pages: 0,
    };
  }
}

/**
 * Validates schema structure
 */
async function validateSchema(client: SanityClient): Promise<{
  isValid: boolean;
  errors: string[];
}> {
  const errors: string[] = [];

  try {
    // Check for critical document types
    const queries = [
      { name: 'settings', query: '*[_type == "settings"][0]' },
      { name: 'page', query: '*[_type == "page"][0]' },
    ];

    for (const { name, query } of queries) {
      try {
        await client.fetch(query);
      } catch (error) {
        errors.push(`Document type "${name}" may not be properly configured`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  } catch (error) {
    errors.push(`Schema validation failed: ${error instanceof Error ? error.message : String(error)}`);
    return {
      isValid: false,
      errors,
    };
  }
}

/**
 * Performs comprehensive validation
 */
async function validateClient(datasetName: string): Promise<ValidationResult> {
  console.log(`${colors.cyan}Validating client dataset: ${datasetName}${colors.reset}\n`);

  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Validate environment
    const { projectId, token, apiVersion } = validateEnvironment();

    // Create client
    const client = createDatasetClient(projectId, datasetName, token, apiVersion);

    // Check if dataset exists
    console.log(`${colors.blue}Checking dataset existence...${colors.reset}`);
    const datasetExists = await checkDatasetExists(client, datasetName);

    if (!datasetExists) {
      errors.push(`Dataset "${datasetName}" does not exist`);
      return {
        isValid: false,
        errors,
        warnings,
        checks: {
          datasetExists: false,
          settingsExists: false,
          navigationExists: false,
          schemaValid: false,
        },
      };
    }

    console.log(`${colors.green}✓ Dataset exists${colors.reset}`);

    // Check required documents
    console.log(`${colors.blue}Checking required documents...${colors.reset}`);
    const { settings, navigation, pages } = await checkRequiredDocuments(client);

    const settingsExists = settings;
    const navigationExists = navigation;

    if (settingsExists) {
      console.log(`${colors.green}✓ Settings document exists${colors.reset}`);
    } else {
      errors.push('Settings document is missing');
    }

    if (navigationExists) {
      console.log(`${colors.green}✓ Navigation document exists${colors.reset}`);
    } else {
      warnings.push('Navigation document is missing (optional)');
    }

    console.log(`${colors.blue}Found ${pages} page(s)${colors.reset}`);

    if (pages === 0) {
      warnings.push('No pages found - consider adding content');
    }

    // Validate schema
    console.log(`${colors.blue}Validating schema structure...${colors.reset}`);
    const schemaValidation = await validateSchema(client);

    if (schemaValidation.isValid) {
      console.log(`${colors.green}✓ Schema is valid${colors.reset}`);
    } else {
      errors.push(...schemaValidation.errors);
    }

    // Additional checks
    try {
      const documentCount = await client.fetch('count(*)');
      console.log(`${colors.blue}Total documents: ${documentCount}${colors.reset}`);

      if (documentCount === 0) {
        warnings.push('Dataset is empty - no documents found');
      }
    } catch (error) {
      warnings.push('Could not count total documents');
    }

    // Return validation result
    const isValid = errors.length === 0;

    console.log('\n' + '='.repeat(50));
    if (isValid) {
      console.log(`${colors.green}✓ Validation passed${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ Validation failed${colors.reset}`);
    }
    console.log('='.repeat(50) + '\n');

    if (errors.length > 0) {
      console.log(`${colors.red}Errors:${colors.reset}`);
      errors.forEach((error) => console.log(`  - ${error}`));
      console.log('');
    }

    if (warnings.length > 0) {
      console.log(`${colors.yellow}Warnings:${colors.reset}`);
      warnings.forEach((warning) => console.log(`  - ${warning}`));
      console.log('');
    }

    return {
      isValid,
      errors,
      warnings,
      checks: {
        datasetExists,
        settingsExists,
        navigationExists,
        schemaValid: schemaValidation.isValid,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown validation error';
    errors.push(errorMessage);

    console.error(`${colors.red}Validation error: ${errorMessage}${colors.reset}\n`);

    return {
      isValid: false,
      errors,
      warnings,
      checks: {
        datasetExists: false,
        settingsExists: false,
        navigationExists: false,
        schemaValid: false,
      },
    };
  }
}

/**
 * Main execution
 */
async function main() {
  const datasetName = process.argv[2];

  if (!datasetName) {
    console.error(`${colors.red}Error: Dataset name is required${colors.reset}`);
    console.log(`\nUsage: ${colors.cyan}npm run validate-client <dataset-name>${colors.reset}`);
    console.log(`Example: ${colors.cyan}npm run validate-client client-acme${colors.reset}\n`);
    process.exit(1);
  }

  try {
    const result = await validateClient(datasetName);
    process.exit(result.isValid ? 0 : 1);
  } catch (error) {
    console.error(
      `${colors.red}Fatal error:${colors.reset}`,
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

// Export for use as a module
export { validateClient, checkDatasetExists, checkRequiredDocuments, validateSchema };
