/**
 * Shared Sanity Schemas - Phase 1 Contract
 *
 * This package exports production-ready document schemas that follow
 * the roadmap contract for multi-tenant local business SEO CMS.
 *
 * Key principles:
 * - All documents use sections[] (not blocks)
 * - Service-location has NO manual slug (computed from references)
 * - Site settings includes defaultSeo object
 * - All schemas support fallback behavior
 */

// Document Schemas
export { serviceSchema } from './documents/service';
export { locationSchema } from './documents/location';
export { serviceLocationSchema } from './documents/serviceLocation';
export { siteSettingsSchema } from './documents/siteSettings';

// Export with Sanity Studio-compatible names
export { serviceSchema as service } from './documents/service';
export { locationSchema as location } from './documents/location';
export { serviceLocationSchema as serviceLocation } from './documents/serviceLocation';
export { siteSettingsSchema as settings } from './documents/siteSettings';
