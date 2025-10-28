/**
 * Dataset Configuration for Multi-Tenant Support
 *
 * This module handles the mapping of hostnames to Sanity datasets,
 * enabling multi-tenant functionality where different clients can
 * access their specific content based on the domain they're visiting.
 */

// Supported dataset names - extend this as new clients are added
export type DatasetName = 'production' | 'staging' | 'development';

// Client configuration interface
export interface ClientConfig {
  dataset: DatasetName;
  clientName: string;
  domain: string;
}

// Dataset mapping configuration
// Add new client domains and their corresponding datasets here
const DATASET_MAP: Record<string, DatasetName> = {
  // Production domains
  'www.buddsplumbing.com': 'production',
  'buddsplumbing.com': 'production',

  // Staging domains
  'staging.buddsplumbing.com': 'staging',

  // Development/localhost - uses environment variable or falls back to 'development'
  localhost:
    (process.env.NEXT_PUBLIC_SANITY_DATASET as DatasetName) || 'development',
  '127.0.0.1':
    (process.env.NEXT_PUBLIC_SANITY_DATASET as DatasetName) || 'development',
};

// Default dataset to use when hostname doesn't match any configured domain
const DEFAULT_DATASET: DatasetName =
  (process.env.NEXT_PUBLIC_SANITY_DATASET as DatasetName) || 'production';

/**
 * Get the dataset name for a given hostname
 * @param hostname - The request hostname (e.g., 'www.buddsplumbing.com')
 * @returns The corresponding dataset name
 */
export function getDatasetForHostname(hostname: string): DatasetName {
  // Remove port if present (e.g., localhost:3000 -> localhost)
  const cleanHostname = hostname.split(':')[0];

  const dataset = DATASET_MAP[cleanHostname];

  if (!dataset) {
    console.warn(
      `[Dataset Config] No dataset mapping found for hostname: ${hostname}. Using default: ${DEFAULT_DATASET}`
    );
    return DEFAULT_DATASET;
  }

  return dataset;
}

/**
 * Get full client configuration for a given hostname
 * @param hostname - The request hostname
 * @returns Client configuration object
 */
export function getClientConfig(hostname: string): ClientConfig {
  const dataset = getDatasetForHostname(hostname);
  const cleanHostname = hostname.split(':')[0];

  return {
    dataset,
    clientName: getClientNameFromDataset(dataset),
    domain: cleanHostname,
  };
}

/**
 * Get a human-readable client name from dataset
 * @param dataset - The dataset name
 * @returns A human-readable client name
 */
function getClientNameFromDataset(dataset: DatasetName): string {
  const clientNames: Record<DatasetName, string> = {
    production: 'Budds Plumbing',
    staging: 'Budds Plumbing (Staging)',
    development: 'Budds Plumbing (Dev)',
  };

  return clientNames[dataset] || 'Unknown Client';
}

/**
 * Validate if a dataset name is valid
 * @param dataset - The dataset name to validate
 * @returns True if valid, false otherwise
 */
export function isValidDataset(dataset: string): dataset is DatasetName {
  return ['production', 'staging', 'development'].includes(dataset);
}

/**
 * Get all configured hostnames
 * @returns Array of configured hostnames
 */
export function getConfiguredHostnames(): string[] {
  return Object.keys(DATASET_MAP);
}

/**
 * Log dataset configuration information (for debugging)
 * @param hostname - The request hostname
 * @param dataset - The resolved dataset
 */
export function logDatasetInfo(hostname: string, dataset: DatasetName): void {
  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === 'production';

  // Only log in development/staging environments
  if (!isProduction) {
    // Using console.warn to avoid ESLint errors (only warn and error are allowed)
    console.warn('[Dataset Routing]', {
      hostname,
      dataset,
      timestamp: new Date().toISOString(),
      environment: process.env.NEXT_PUBLIC_SITE_ENV || 'unknown',
    });
  }
}
