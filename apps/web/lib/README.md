# Library Modules

This directory contains core library modules for the Budds Plumbing application.

## Multi-Domain Support

The multi-domain infrastructure enables multi-tenant functionality with domain-based routing.

### Core Files

#### `domain-types.ts`
Shared TypeScript type definitions for the multi-domain system.

**Exports:**
- `DomainConfig` - Configuration interface for a domain
- `DomainContext` - Domain context extracted from headers
- `DomainValidationResult` - Result of domain validation

#### `domain-mapping.ts`
Domain-to-client/dataset mapping configuration.

**Key Features:**
- Maps domains to Sanity datasets and client configurations
- Supports subdomains and custom domains
- Environment-based configuration overrides
- Domain validation utilities

**Main Exports:**
- `DOMAIN_MAPPINGS` - Array of domain configurations
- `getDomainConfig(domain)` - Get config for a domain
- `getDomainConfigFromHeaders(headers)` - Get config from request headers
- `isValidDomain(domain)` - Validate domain
- `getSanityConfigForDomain(domain)` - Get Sanity config for domain
- `getEnabledDomains()` - Get all enabled domains

**Usage:**
```typescript
import { getDomainConfigFromHeaders } from '@/lib/domain-mapping';

const config = getDomainConfigFromHeaders(request.headers);
console.log(config.clientId, config.dataset);
```

#### `domain-middleware.ts`
Next.js middleware for domain validation, security headers, and caching.

**Key Features:**
- Domain extraction and validation
- Automatic redirects for invalid domains
- Security headers (HSTS, CSP, etc.)
- Domain-specific caching strategies
- Request context enrichment via headers

**Main Exports:**
- `domainMiddleware(request)` - Main middleware function
- `validateDomain(request)` - Validate domain from request
- `applySecurityHeaders(response, config)` - Apply security headers
- `applyCachingHeaders(response, request, config)` - Apply caching headers
- `getDomainConfigFromResponse(headers)` - Get domain context from headers

**Usage:**
```typescript
// In middleware.ts
import { domainMiddleware } from '@/lib/domain-middleware';

export function middleware(request: NextRequest) {
  return domainMiddleware(request);
}

// In API routes
import { getDomainConfigFromResponse } from '@/lib/domain-middleware';

export async function GET(request: NextRequest) {
  const context = getDomainConfigFromResponse(request.headers);
  // Use context.dataset, context.clientId, etc.
}
```

#### `sanity-domain-helpers.ts`
Helper functions to integrate domain mapping with Sanity client configuration.

**Main Exports:**
- `createSanityClientForDomain()` - Create Sanity client for current domain
- `getDomainContext()` - Get domain context from headers
- `getDatasetFromDomain()` - Get dataset from domain
- `createSanityClientWithContext(context)` - Create client with explicit context

**Usage:**
```typescript
// In Server Components
import { createSanityClientForDomain } from '@/lib/sanity-domain-helpers';

const client = await createSanityClientForDomain();
const data = await client.fetch(query);

// Get domain context
import { getDomainContext } from '@/lib/sanity-domain-helpers';

const { dataset, clientId } = await getDomainContext();
```

### Migration from dataset-config.ts

If you're migrating from the old `dataset-config.ts` system:

1. Update domain mappings in `domain-mapping.ts`
2. Replace `getDatasetForHostname()` with `getDomainConfig()`
3. Update header names:
   - `x-sanity-dataset` → `x-dataset`
   - `x-client-hostname` → `x-domain`
   - Add `x-client-id`
4. Use `sanity-domain-helpers.ts` for Sanity client creation

## Other Utilities

#### `utils.ts`
General utility functions.

**Exports:**
- `cn(...inputs)` - Merge Tailwind classes with clsx and tailwind-merge
- `extractPlainText(blocks)` - Extract plain text from Portable Text blocks
- `formatDate(date)` - Format date string

#### `seo.ts`
SEO and metadata utilities.

**Note:** Check file for available exports and usage.

## Documentation

For detailed documentation on multi-domain support, see:
- [`/apps/web/docs/MULTI-DOMAIN.md`](../docs/MULTI-DOMAIN.md) - Comprehensive guide

## Environment Variables

Multi-domain system uses the following environment variables:

```bash
# Required
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=https://buddsplumbing.com

# Optional - Multi-Domain
NEXT_PUBLIC_BASE_DOMAIN=buddsplumbing.com
NEXT_PUBLIC_DOMAIN_OVERRIDE=client1.buddsplumbing.com
NEXT_PUBLIC_CLIENT_ID=client1
```

## TypeScript Support

All modules are fully typed with strict TypeScript. Import types as needed:

```typescript
import type { DomainConfig, DomainContext } from '@/lib/domain-types';
import type { DomainValidationResult } from '@/lib/domain-middleware';
```
