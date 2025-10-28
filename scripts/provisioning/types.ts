/**
 * Types and interfaces for the client provisioning system
 */

import type { SanityClient } from '@sanity/client';

export interface ClientConfig {
  /** Client's business name */
  name: string;
  /** Unique identifier for the client (used in dataset name) */
  slug: string;
  /** Client's primary contact email */
  email: string;
  /** Client's phone number (optional) */
  phone?: string;
  /** Client's website URL (optional) */
  website?: string;
  /** Dataset name override (defaults to slug) */
  datasetName?: string;
}

export interface ProvisioningResult {
  success: boolean;
  clientId?: string;
  datasetName?: string;
  message: string;
  errors?: string[];
  warnings?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  checks: {
    datasetExists: boolean;
    settingsExists: boolean;
    navigationExists: boolean;
    schemaValid: boolean;
  };
}

export interface SeedData {
  settings: {
    _type: 'settings';
    _id: 'settings';
    siteName: string;
    copyright: Array<{
      _type: 'block';
      _key: string;
      style: 'normal';
      children: Array<{
        _type: 'span';
        _key: string;
        text: string;
        marks: string[];
      }>;
      markDefs: [];
    }>;
  };
  navigation: {
    _type: 'navigation';
    _id: 'main-navigation';
    title: string;
    links: Array<{
      _type: 'object';
      _key: string;
      text: string;
      url: string;
      openInNewTab: boolean;
    }>;
  };
  homePage: {
    _type: 'page';
    _id: 'home-page';
    title: string;
    slug: {
      _type: 'slug';
      current: string;
    };
    blocks: Array<Record<string, unknown>>;
    meta_title?: string;
    meta_description?: string;
    noindex: boolean;
  };
  sampleService?: {
    _type: 'service';
    _id: string;
    name: string;
    slug: {
      _type: 'slug';
      current: string;
    };
    blocks: Array<Record<string, unknown>>;
    meta_title?: string;
    meta_description?: string;
    noindex: boolean;
  };
  sampleLocation?: {
    _type: 'location';
    _id: string;
    name: string;
    slug: {
      _type: 'slug';
      current: string;
    };
    blocks: Array<Record<string, unknown>>;
    meta_title?: string;
    meta_description?: string;
    noindex: boolean;
  };
}

export interface ProvisioningOptions {
  /** Whether to seed initial content */
  seedContent?: boolean;
  /** Whether to validate after provisioning */
  validate?: boolean;
  /** Whether to perform dry run (no actual changes) */
  dryRun?: boolean;
  /** Custom templates to use for seeding */
  templates?: Partial<SeedData>;
  /** Rollback on error */
  rollback?: boolean;
}

export interface DatasetInfo {
  name: string;
  aclMode: string;
  createdAt: string;
}

export interface ProvisioningContext {
  client: SanityClient;
  config: ClientConfig;
  options: ProvisioningOptions;
  datasetName: string;
}

export interface RollbackAction {
  type: 'delete-dataset' | 'delete-documents';
  description: string;
  execute: () => Promise<void>;
}

export interface ProvisioningStep {
  name: string;
  description: string;
  execute: (context: ProvisioningContext) => Promise<void>;
  rollback?: (context: ProvisioningContext) => Promise<void>;
}

export interface BlockTemplate {
  _type: string;
  _key: string;
  [key: string]: unknown;
}

export interface HeroBlock extends BlockTemplate {
  _type: 'hero-1' | 'hero-2';
  variant: string;
  tagLine?: string;
  title?: string;
  body?: Array<{
    _type: 'block';
    _key: string;
    style: string;
    children: Array<{
      _type: 'span';
      _key: string;
      text: string;
      marks: string[];
    }>;
    markDefs: [];
  }>;
  links?: Array<{
    _type: 'link';
    _key: string;
    text: string;
    url: string;
    variant?: string;
  }>;
  image?: {
    _type: 'image';
    asset: {
      _type: 'reference';
      _ref: string;
    };
    alt?: string;
  };
}

export interface CTABlock extends BlockTemplate {
  _type: 'cta-1';
  variant: string;
  tagLine?: string;
  title?: string;
  body?: Array<{
    _type: 'block';
    _key: string;
    style: string;
    children: Array<{
      _type: 'span';
      _key: string;
      text: string;
      marks: string[];
    }>;
    markDefs: [];
  }>;
  links?: Array<{
    _type: 'link';
    _key: string;
    text: string;
    url: string;
    variant?: string;
  }>;
  colorVariant?: string;
  sectionWidth?: string;
  stackAlign?: string;
}
