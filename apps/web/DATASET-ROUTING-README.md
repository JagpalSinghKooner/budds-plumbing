# Multi-Tenant Dataset Routing Implementation

This document describes the multi-tenant dataset routing middleware implementation for the Budds Plumbing application.

## Overview

The dataset routing system enables multi-tenant support by dynamically mapping hostnames to Sanity datasets. This allows different clients to access their specific content based on the domain they're visiting, while maintaining a single codebase.

## Architecture

### Flow Diagram

```
Request → Middleware → Dataset Mapping → Headers → Server Components → Sanity Client
```

1. **Request arrives** with a specific hostname (e.g., `buddsplumbing.com`, `localhost:3000`)
2. **Middleware intercepts** the request and extracts the hostname
3. **Dataset mapping** determines which Sanity dataset to use
4. **Headers are set** with dataset and client information
5. **Server Components** read headers to get current dataset
6. **Sanity Client** is initialized with the correct dataset

## Files Created/Modified

### New Files

1. **`/apps/web/lib/dataset-config.ts`**
   - Dataset configuration and mapping logic
   - Hostname-to-dataset mapping
   - Validation helpers
   - Client configuration types

2. **`/apps/web/lib/client-context.tsx`**
   - React Context provider for client/dataset information
   - Custom hooks for accessing client data in components
   - Type-safe access to current dataset

3. **`/apps/web/lib/dataset-routing-examples.ts`**
   - Usage examples for different scenarios
   - Migration guide from old to new API

### Modified Files

1. **`/apps/web/middleware.ts`**
   - Imports domain middleware
   - Exports helper functions for accessing headers
   - Matcher configuration for routing

2. **`/apps/web/sanity/env.ts`**
   - Added `getDataset()` function to read from headers
   - Async implementation for Next.js 15
   - Fallback to environment variables

3. **`/apps/web/sanity/lib/client.ts`**
   - Added `createClientForDataset()` for explicit dataset selection
   - Added `getClientForRequest()` for automatic dataset detection
   - Maintained backward compatibility with existing client

4. **`/apps/web/sanity/lib/live.ts`**
   - Added `getDefineLiveForRequest()` for dynamic live configuration
   - Async implementation for Next.js 15

5. **`/apps/web/app/layout.tsx`**
   - Added ClientContextProvider wrapper
   - Reads hostname from middleware headers
   - Passes client configuration to context

### Existing Integration Files

These files were already present and integrate with our implementation:

1. **`/apps/web/lib/domain-middleware.ts`**
   - Handles domain validation and security headers
   - Sets dataset headers for downstream use
   - Applies caching strategies

2. **`/apps/web/lib/domain-mapping.ts`**
   - Domain configuration and mapping
   - Supports subdomains and custom domains
   - Environment-based configuration

## How Dataset Routing Works

### 1. Request Processing

When a request comes in:

```typescript
// Request: https://buddsplumbing.com/services
// Middleware extracts hostname: buddsplumbing.com
```

### 2. Dataset Mapping

The middleware uses `dataset-config.ts` to map the hostname:

```typescript
const DATASET_MAP = {
  'buddsplumbing.com': 'production',
  'staging.buddsplumbing.com': 'staging',
  'localhost': 'development',
};
```

### 3. Header Setting

The middleware sets custom headers:

```typescript
// Headers set by middleware:
x-sanity-dataset: production
x-dataset: production (alias)
x-client-hostname: buddsplumbing.com
x-domain: buddsplumbing.com (alias)
x-client-id: budds-plumbing-prod
```

### 4. Server Component Usage

Server Components can access the dataset:

```typescript
// Option 1: Dynamic client (automatic dataset detection)
const client = await getClientForRequest();
const data = await client.fetch('*[_type == "page"]');

// Option 2: Explicit dataset
const client = createClientForDataset('production');
const data = await client.fetch('*[_type == "page"]');
```

### 5. Client Component Usage

Client Components use React Context:

```typescript
'use client';

import { useDataset, useClientContext } from '@/lib/client-context';

function MyComponent() {
  const dataset = useDataset();
  const { clientName, domain } = useClientContext();

  return <div>Dataset: {dataset}</div>;
}
```

## How to Test Locally

### 1. Basic Testing with Localhost

```bash
# Start the development server
cd apps/web
pnpm dev

# Visit http://localhost:3000
# The middleware will use the dataset from NEXT_PUBLIC_SANITY_DATASET
```

### 2. Testing with Custom Hostnames

Add entries to `/etc/hosts`:

```bash
sudo nano /etc/hosts

# Add these lines:
127.0.0.1 buddsplumbing.local
127.0.0.1 staging.buddsplumbing.local
127.0.0.1 client1.buddsplumbing.local
```

Update `dataset-config.ts` to include test domains:

```typescript
const DATASET_MAP: Record<string, DatasetName> = {
  'buddsplumbing.local': 'production',
  'staging.buddsplumbing.local': 'staging',
  'client1.buddsplumbing.local': 'client1-production',
  'localhost': 'development',
};
```

Visit the test domains:
- http://buddsplumbing.local:3000 → uses 'production' dataset
- http://staging.buddsplumbing.local:3000 → uses 'staging' dataset
- http://client1.buddsplumbing.local:3000 → uses 'client1-production' dataset

### 3. Verify Dataset Routing

Check the browser console or server logs for dataset routing information:

```typescript
// In development/staging, you'll see logs like:
[Dataset Routing] {
  hostname: 'buddsplumbing.local',
  dataset: 'production',
  timestamp: '2024-10-31T12:00:00.000Z',
  environment: 'development'
}
```

### 4. Test API Routes

Create a test API route to verify headers:

```typescript
// app/api/test-dataset/route.ts
import { getDatasetFromHeaders, getHostnameFromHeaders } from '@/middleware';

export async function GET() {
  const dataset = await getDatasetFromHeaders();
  const hostname = await getHostnameFromHeaders();

  return Response.json({ dataset, hostname });
}
```

Visit http://localhost:3000/api/test-dataset to see the current dataset.

## Environment Variables

### Required Variables

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-10-31
SANITY_API_READ_TOKEN=your-read-token

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_ENV=development
```

### Optional Variables (for domain overrides)

```env
# Base domain for subdomain matching
NEXT_PUBLIC_BASE_DOMAIN=buddsplumbing.com

# Domain override for specific deployments
NEXT_PUBLIC_DOMAIN_OVERRIDE=custom.domain.com
NEXT_PUBLIC_CLIENT_ID=custom-client
```

## Usage Examples

### Server Component with Dynamic Dataset

```typescript
// app/services/page.tsx
import { getClientForRequest } from '@/sanity/lib/client';

export default async function ServicesPage() {
  const client = await getClientForRequest();
  const services = await client.fetch('*[_type == "service"]');

  return (
    <div>
      {services.map(service => (
        <div key={service._id}>{service.title}</div>
      ))}
    </div>
  );
}
```

### Client Component with Context

```typescript
'use client';

import { useClientContext } from '@/lib/client-context';

export function ClientInfo() {
  const { dataset, clientName, domain } = useClientContext();

  return (
    <div>
      <p>Client: {clientName}</p>
      <p>Dataset: {dataset}</p>
      <p>Domain: {domain}</p>
    </div>
  );
}
```

### API Route with Dataset Access

```typescript
// app/api/data/route.ts
import { getDatasetFromHeaders } from '@/middleware';
import { createClientForDataset } from '@/sanity/lib/client';

export async function GET() {
  const dataset = await getDatasetFromHeaders();

  if (!dataset) {
    return Response.json({ error: 'No dataset found' }, { status: 400 });
  }

  const client = createClientForDataset(dataset);
  const data = await client.fetch('*[_type == "settings"][0]');

  return Response.json(data);
}
```

### Explicit Dataset Selection

```typescript
// When you need to query a specific dataset regardless of hostname
import { createClientForDataset } from '@/sanity/lib/client';

export async function getProductionData() {
  const productionClient = createClientForDataset('production');
  const data = await productionClient.fetch('*[_type == "settings"]');
  return data;
}
```

## Adding New Clients/Datasets

### 1. Update Dataset Configuration

Edit `/apps/web/lib/dataset-config.ts`:

```typescript
export type DatasetName = 'production' | 'staging' | 'development' | 'client1-production';

const DATASET_MAP: Record<string, DatasetName> = {
  // ... existing mappings
  'client1.buddsplumbing.com': 'client1-production',
  'client1customdomain.com': 'client1-production',
};
```

### 2. Update Domain Mapping

Edit `/apps/web/lib/domain-mapping.ts`:

```typescript
export const DOMAIN_MAPPINGS: DomainConfig[] = [
  // ... existing mappings
  {
    domain: 'client1.buddsplumbing.com',
    projectId: DEFAULT_PROJECT_ID,
    dataset: 'client1-production',
    clientId: 'client1',
    enabled: true,
    branding: {
      name: 'Client 1 Plumbing',
    },
  },
];
```

### 3. Create Dataset in Sanity

1. Go to Sanity Studio
2. Settings → Datasets
3. Create new dataset (e.g., `client1-production`)
4. Configure permissions and access

### 4. Deploy and Test

```bash
# Build and start
pnpm build
pnpm start

# Test the new domain
curl http://client1.buddsplumbing.com
```

## Migration Guide

### Migrating Existing Server Components

**Before:**
```typescript
import { client } from '@/sanity/lib/client';

const data = await client.fetch(query);
```

**After:**
```typescript
import { getClientForRequest } from '@/sanity/lib/client';

const client = await getClientForRequest();
const data = await client.fetch(query);
```

### Migrating Existing sanityFetch Calls

**Before:**
```typescript
import { sanityFetch } from '@/sanity/lib/live';

const { data } = await sanityFetch({ query });
```

**After:**
```typescript
import { getDefineLiveForRequest } from '@/sanity/lib/live';

const { sanityFetch } = await getDefineLiveForRequest();
const { data } = await sanityFetch({ query });
```

## Debugging

### Enable Debug Logging

Dataset routing logs are automatically enabled in development/staging environments. Check your server console for:

```
[Dataset Routing] {
  hostname: 'buddsplumbing.com',
  dataset: 'production',
  timestamp: '2024-10-31T12:00:00.000Z',
  environment: 'development'
}
```

### Verify Headers

Add this to any Server Component:

```typescript
import { headers } from 'next/headers';

export default async function DebugPage() {
  const headersList = await headers();

  return (
    <pre>
      {JSON.stringify({
        dataset: headersList.get('x-sanity-dataset'),
        hostname: headersList.get('x-client-hostname'),
        domain: headersList.get('x-domain'),
        clientId: headersList.get('x-client-id'),
      }, null, 2)}
    </pre>
  );
}
```

### Test Middleware

Create a test API route:

```typescript
// app/api/debug-middleware/route.ts
import { headers } from 'next/headers';

export async function GET() {
  const headersList = await headers();

  return Response.json({
    dataset: headersList.get('x-sanity-dataset'),
    hostname: headersList.get('x-client-hostname'),
    domain: headersList.get('x-domain'),
    clientId: headersList.get('x-client-id'),
    allHeaders: Object.fromEntries(headersList.entries()),
  });
}
```

## Security Considerations

1. **Dataset Access**: Ensure proper read tokens are configured for each dataset
2. **Domain Validation**: The middleware validates domains before processing requests
3. **Header Security**: Custom headers are server-side only and not exposed to clients
4. **CDN Configuration**: `useCdn` is set to `false` to ensure fresh data
5. **CORS**: Configure CORS policies for multi-domain support

## Performance Considerations

1. **Caching**: The middleware applies appropriate caching headers based on content type
2. **Client Reuse**: Sanity clients are created per request but use efficient connection pooling
3. **Header Access**: Headers are accessed once per request and cached
4. **Minimal Overhead**: Dataset mapping is a simple object lookup

## Troubleshooting

### Issue: Wrong dataset is being used

**Solution**: Check these in order:
1. Verify hostname mapping in `dataset-config.ts`
2. Check middleware is running (should see logs in dev)
3. Verify headers are being set: visit `/api/debug-middleware`
4. Clear browser cache and restart dev server

### Issue: Headers not available

**Solution**:
- Ensure you're using `await headers()` (Next.js 15+ requirement)
- Verify middleware is running on the route (check `matcher` config)
- Check that route is not excluded in middleware config

### Issue: Type errors with async functions

**Solution**:
- All header-reading functions must be async in Next.js 15+
- Use `await getClientForRequest()` instead of `getClientForRequest()`
- Update function signatures to return `Promise<T>`

## Next Steps

1. **Add more clients**: Update configuration files as needed
2. **Implement client-specific branding**: Use context to customize UI per client
3. **Add analytics**: Track usage per client/dataset
4. **Set up monitoring**: Monitor dataset routing and performance
5. **Configure CDN**: Set up CDN rules for multi-domain support

## Support

For questions or issues, refer to:
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Sanity Multi-Dataset Guide](https://www.sanity.io/docs/datasets)
- Internal documentation in `lib/dataset-routing-examples.ts`
