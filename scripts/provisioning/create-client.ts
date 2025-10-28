#!/usr/bin/env node

/**
 * Client provisioning script
 * Creates a new Sanity dataset for a client and seeds it with initial content
 */

import { createClient, type SanityClient } from '@sanity/client';
import * as readline from 'readline';
import type {
  ClientConfig,
  ProvisioningResult,
  ProvisioningContext,
  ProvisioningOptions,
  RollbackAction,
} from './types';
import {
  generateSeedData,
  generatePresetSeedData,
  type TemplatePreset,
} from './seed-templates';
import { validateClient } from './validate-client';

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
  magenta: '\x1b[35m',
};

/**
 * Creates readline interface for user input
 */
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Prompts user for input
 */
function question(rl: readline.Interface, query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

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
    throw new Error(
      'NEXT_PUBLIC_SANITY_PROJECT_ID environment variable is required'
    );
  }

  if (!token) {
    throw new Error('SANITY_API_READ_TOKEN environment variable is required');
  }

  // Token must have write permissions
  console.log(
    `${colors.yellow}Note: Token must have write permissions for dataset creation${colors.reset}`
  );

  return { projectId, token, apiVersion };
}

/**
 * Creates a Sanity client
 */
function createSanityClient(
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
 * Validates client configuration
 */
function validateClientConfig(config: ClientConfig): string[] {
  const errors: string[] = [];

  if (!config.name || config.name.trim().length === 0) {
    errors.push('Client name is required');
  }

  if (!config.slug || config.slug.trim().length === 0) {
    errors.push('Client slug is required');
  }

  // Validate slug format (lowercase, alphanumeric, hyphens only)
  const slugRegex = /^[a-z0-9-]+$/;
  if (config.slug && !slugRegex.test(config.slug)) {
    errors.push(
      'Client slug must contain only lowercase letters, numbers, and hyphens'
    );
  }

  if (!config.email || config.email.trim().length === 0) {
    errors.push('Client email is required');
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (config.email && !emailRegex.test(config.email)) {
    errors.push('Invalid email format');
  }

  return errors;
}

/**
 * Creates a new dataset
 */
async function createDataset(
  client: SanityClient,
  datasetName: string
): Promise<void> {
  console.log(
    `${colors.blue}Creating dataset: ${datasetName}...${colors.reset}`
  );

  try {
    await client.datasets.create(datasetName, {
      aclMode: 'private',
    });
    console.log(`${colors.green}✓ Dataset created successfully${colors.reset}`);
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      throw new Error(`Dataset "${datasetName}" already exists`);
    }
    throw new Error(
      `Failed to create dataset: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Seeds initial data into the dataset
 */
async function seedInitialData(
  context: ProvisioningContext,
  preset?: TemplatePreset
): Promise<void> {
  console.log(`${colors.blue}Seeding initial data...${colors.reset}`);

  const { client, config } = context;

  // Generate seed data
  const seedData = preset
    ? generatePresetSeedData(config, preset)
    : generateSeedData(config, {
        includeSampleService: true,
        includeSampleLocation: true,
      });

  try {
    // Create documents in order
    const documents = [
      seedData.settings,
      seedData.navigation,
      seedData.homePage,
      seedData.sampleService,
      seedData.sampleLocation,
    ].filter(Boolean);

    console.log(
      `${colors.blue}Creating ${documents.length} documents...${colors.reset}`
    );

    // Use transaction for atomic creation
    const transaction = client.transaction();

    documents.forEach((doc) => {
      transaction.createOrReplace(doc);
    });

    await transaction.commit();

    console.log(
      `${colors.green}✓ Initial data seeded successfully${colors.reset}`
    );
    console.log(`${colors.cyan}  - Settings document${colors.reset}`);
    console.log(`${colors.cyan}  - Navigation document${colors.reset}`);
    console.log(`${colors.cyan}  - Home page${colors.reset}`);
    if (seedData.sampleService) {
      console.log(`${colors.cyan}  - Sample service page${colors.reset}`);
    }
    if (seedData.sampleLocation) {
      console.log(`${colors.cyan}  - Sample location page${colors.reset}`);
    }
  } catch (error) {
    throw new Error(
      `Failed to seed data: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Performs rollback actions
 */
async function performRollback(actions: RollbackAction[]): Promise<void> {
  console.log(`${colors.yellow}Performing rollback...${colors.reset}`);

  for (const action of actions.reverse()) {
    try {
      console.log(`${colors.blue}${action.description}${colors.reset}`);
      await action.execute();
      console.log(`${colors.green}✓ Rollback action completed${colors.reset}`);
    } catch (error) {
      console.error(
        `${colors.red}✗ Rollback action failed: ${error instanceof Error ? error.message : String(error)}${colors.reset}`
      );
    }
  }
}

/**
 * Main provisioning function
 */
async function provisionClient(
  config: ClientConfig,
  options: ProvisioningOptions = {},
  preset?: TemplatePreset
): Promise<ProvisioningResult> {
  const {
    seedContent = true,
    validate = true,
    dryRun = false,
    rollback = true,
  } = options;

  const errors: string[] = [];
  const warnings: string[] = [];
  const rollbackActions: RollbackAction[] = [];

  console.log('\n' + '='.repeat(50));
  console.log(`${colors.magenta}Client Provisioning System${colors.reset}`);
  console.log('='.repeat(50) + '\n');

  try {
    // Validate configuration
    console.log(`${colors.blue}Validating configuration...${colors.reset}`);
    const configErrors = validateClientConfig(config);

    if (configErrors.length > 0) {
      return {
        success: false,
        message: 'Configuration validation failed',
        errors: configErrors,
      };
    }

    console.log(`${colors.green}✓ Configuration valid${colors.reset}\n`);

    // Validate environment
    const { projectId, token, apiVersion } = validateEnvironment();

    // Determine dataset name
    const datasetName = config.datasetName || `client-${config.slug}`;

    console.log(`${colors.cyan}Client Details:${colors.reset}`);
    console.log(`  Name: ${config.name}`);
    console.log(`  Slug: ${config.slug}`);
    console.log(`  Email: ${config.email}`);
    console.log(`  Dataset: ${datasetName}`);
    if (preset) {
      console.log(`  Template Preset: ${preset}`);
    }
    console.log('');

    if (dryRun) {
      console.log(
        `${colors.yellow}DRY RUN MODE - No changes will be made${colors.reset}\n`
      );
      return {
        success: true,
        message: 'Dry run completed successfully',
        datasetName,
        warnings: ['This was a dry run - no actual changes were made'],
      };
    }

    // Create admin client for dataset creation
    const adminClient = createSanityClient(
      projectId,
      'production', // Use any existing dataset for admin operations
      token,
      apiVersion
    );

    // Check if dataset already exists
    const datasets = await adminClient.datasets.list();
    const datasetExists = datasets.some(
      (ds: { name: string }) => ds.name === datasetName
    );

    if (datasetExists) {
      return {
        success: false,
        message: `Dataset "${datasetName}" already exists`,
        errors: [
          'A dataset with this name already exists. Please choose a different slug or delete the existing dataset.',
        ],
      };
    }

    // Create dataset
    await createDataset(adminClient, datasetName);

    // Add rollback action for dataset deletion
    if (rollback) {
      rollbackActions.push({
        type: 'delete-dataset',
        description: `Deleting dataset: ${datasetName}`,
        execute: async () => {
          await adminClient.datasets.delete(datasetName);
        },
      });
    }

    // Create client for the new dataset
    const datasetClient = createSanityClient(
      projectId,
      datasetName,
      token,
      apiVersion
    );

    const context: ProvisioningContext = {
      client: datasetClient,
      config,
      options,
      datasetName,
    };

    // Seed initial data
    if (seedContent) {
      await seedInitialData(context, preset);
    } else {
      warnings.push('Skipped seeding initial content');
    }

    // Validate setup
    if (validate) {
      console.log(`${colors.blue}Validating setup...${colors.reset}`);
      const validationResult = await validateClient(datasetName);

      if (!validationResult.isValid) {
        throw new Error(
          `Validation failed: ${validationResult.errors.join(', ')}`
        );
      }

      warnings.push(...validationResult.warnings);
    }

    // Success
    console.log('\n' + '='.repeat(50));
    console.log(
      `${colors.green}✓ Client provisioned successfully!${colors.reset}`
    );
    console.log('='.repeat(50) + '\n');

    console.log(`${colors.cyan}Next Steps:${colors.reset}`);
    console.log(`  1. Access the dataset in Sanity Studio`);
    console.log(`  2. Update environment variables to use: ${datasetName}`);
    console.log(`  3. Customize the default content`);
    console.log(`  4. Configure domain and deployment\n`);

    return {
      success: true,
      datasetName,
      message: 'Client provisioned successfully',
      warnings,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    errors.push(errorMessage);

    console.error(
      `${colors.red}✗ Provisioning failed: ${errorMessage}${colors.reset}\n`
    );

    // Perform rollback if enabled
    if (rollback && rollbackActions.length > 0) {
      await performRollback(rollbackActions);
    }

    return {
      success: false,
      message: 'Client provisioning failed',
      errors,
      warnings,
    };
  }
}

/**
 * Interactive provisioning flow
 */
async function interactiveProvisioning(): Promise<void> {
  const rl = createReadlineInterface();

  try {
    console.log(
      `${colors.cyan}Welcome to the Client Provisioning System${colors.reset}\n`
    );

    // Collect client information
    const name = await question(rl, 'Client name: ');
    const slug = await question(rl, 'Client slug (lowercase, hyphens): ');
    const email = await question(rl, 'Client email: ');
    const phone = await question(rl, 'Client phone (optional): ');
    const website = await question(rl, 'Client website (optional): ');

    // Ask about template preset
    console.log(`\n${colors.cyan}Template Presets:${colors.reset}`);
    console.log('  1. General (default)');
    console.log('  2. Plumbing');
    console.log('  3. HVAC');
    console.log('  4. Electrical');

    const presetChoice = await question(
      rl,
      '\nChoose a preset (1-4, default: 1): '
    );

    const presetMap: Record<string, TemplatePreset> = {
      '1': 'general',
      '2': 'plumbing',
      '3': 'hvac',
      '4': 'electrical',
    };

    const preset = presetMap[presetChoice.trim()] || 'general';

    // Confirm
    console.log(`\n${colors.yellow}Review Configuration:${colors.reset}`);
    console.log(`  Name: ${name}`);
    console.log(`  Slug: ${slug}`);
    console.log(`  Email: ${email}`);
    console.log(`  Phone: ${phone || 'N/A'}`);
    console.log(`  Website: ${website || 'N/A'}`);
    console.log(`  Preset: ${preset}`);

    const confirm = await question(
      rl,
      '\nProceed with provisioning? (yes/no): '
    );

    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log(`${colors.yellow}Provisioning cancelled${colors.reset}`);
      rl.close();
      return;
    }

    rl.close();

    // Create client config
    const config: ClientConfig = {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      website: website.trim() || undefined,
    };

    // Run provisioning
    const result = await provisionClient(config, {}, preset);

    if (!result.success) {
      console.error(
        `${colors.red}Provisioning failed${colors.reset}`,
        result.errors
      );
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error(
      `${colors.red}Error:${colors.reset}`,
      error instanceof Error ? error.message : String(error)
    );
    rl.close();
    process.exit(1);
  }
}

/**
 * Command-line provisioning
 */
async function cliProvisioning(args: string[]): Promise<void> {
  const [name, slug, email, preset] = args;

  if (!name || !slug || !email) {
    console.error(
      `${colors.red}Error: Missing required arguments${colors.reset}`
    );
    console.log(
      `\nUsage: ${colors.cyan}npm run create-client <name> <slug> <email> [preset]${colors.reset}`
    );
    console.log(
      `Example: ${colors.cyan}npm run create-client "ACME Corp" "acme" "contact@acme.com" plumbing${colors.reset}`
    );
    console.log(
      `\nOr run interactively: ${colors.cyan}npm run create-client${colors.reset}\n`
    );
    process.exit(1);
  }

  const config: ClientConfig = {
    name,
    slug: slug.toLowerCase(),
    email,
  };

  const templatePreset = (preset as TemplatePreset) || undefined;

  const result = await provisionClient(config, {}, templatePreset);

  if (!result.success) {
    console.error(
      `${colors.red}Provisioning failed${colors.reset}`,
      result.errors
    );
    process.exit(1);
  }

  process.exit(0);
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Interactive mode
    await interactiveProvisioning();
  } else {
    // CLI mode
    await cliProvisioning(args);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

// Export for use as a module
export {
  provisionClient,
  validateClientConfig,
  createDataset,
  seedInitialData,
};
