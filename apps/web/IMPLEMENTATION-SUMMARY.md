# Dataset Routing Middleware - Implementation Summary

## Overview

Successfully implemented a comprehensive multi-tenant dataset routing system that enables dynamic Sanity dataset selection based on hostname. The implementation follows Next.js 15 best practices and maintains strict TypeScript typing throughout.

## Files Created

### Core Implementation Files

1. **`/apps/web/lib/dataset-config.ts`** (126 lines)
   - Dataset type definitions (`DatasetName` type)
   - Hostname-to-dataset mapping configuration
   - Client configuration interface and helpers
   - Validation functions (`isValidDataset`, `getConfiguredHostnames`)
   - Debug logging (`logDatasetInfo`)

2. **`/apps/web/lib/client-context.tsx`** (138 lines)
   - React Context Provider for multi-tenant support
   - Custom hooks: `useClientContext`, `useDataset`, `useClientName`, `useIsMultiTenant`
   - Type-safe access to client configuration
   - Proper error handling for missing provider

3. **`/apps/web/lib/dataset-routing-examples.ts`** (107 lines)
   - Comprehensive usage examples for different scenarios
   - Server Component examples with dynamic dataset
   - Client Component examples with context
   - API route examples
   - Migration guide from old to new API

### Documentation Files

4. **`/apps/web/DATASET-ROUTING-README.md`** (600+ lines)
   - Complete implementation documentation
   - Architecture and flow diagrams
   - Testing guide with local hostname setup
   - Environment variables reference
   - Usage examples and troubleshooting

5. **`/apps/web/IMPLEMENTATION-SUMMARY.md`** (this file)
   - High-level implementation overview
   - Files created and modified
   - Testing instructions

### Debug/Testing Files

6. **`/apps/web/app/api/debug-dataset/route.ts`** (60 lines)
   - Debug API endpoint for testing dataset routing
   - Returns current dataset, hostname, client config
   - Shows all middleware headers
   - Environment configuration display

## Files Modified

### Sanity Integration

1. **`/apps/web/sanity/env.ts`**
   - Added `getDataset()` async function for reading dataset from middleware headers
   - Uses dynamic import of `next/headers` to avoid client component issues
   - Maintains backward compatibility with existing `dataset` export
   - Falls back to environment variable if headers unavailable

2. **`/apps/web/sanity/lib/client.ts`**
   - Added `createClientForDataset(datasetName)` for explicit dataset selection
   - Added `getClientForRequest()` for automatic dataset detection
   - Maintained backward compatibility with existing `client` export
   - Proper async/await implementation for Next.js 15

3. **`/apps/web/sanity/lib/live.ts`**
   - Added `getDefineLiveForRequest()` for dynamic live configuration
   - Integrates with request context for automatic dataset selection
   - Maintains backward compatibility with existing `sanityFetch` export

### Application Layout

4. **`/apps/web/app/layout.tsx`**
   - Added `ClientContextProvider` wrapper around children
   - Reads hostname from middleware headers
   - Passes client configuration to context
   - Made `RootLayout` async for Next.js 15 compatibility

### Middleware

5. **`/apps/web/middleware.ts`**
   - Updated to use dynamic imports for `next/headers`
   - Added helper functions: `getDatasetFromHeaders()`, `getHostnameFromHeaders()`, `getClientIdFromHeaders()`
   - Integrates with existing `domain-middleware`
   - Proper async implementation

## Integration with Existing System

The implementation seamlessly integrates with the existing domain middleware infrastructure:

### Existing Files (Not Modified)

- **`/apps/web/lib/domain-middleware.ts`** - Handles domain validation, security headers, and sets dataset headers
- **`/apps/web/lib/domain-mapping.ts`** - Contains domain configuration and mapping logic

### Integration Points

1. **Middleware Chain**: `middleware.ts` → `domain-middleware.ts` → Sets headers with dataset
2. **Header Flow**: Middleware sets `x-sanity-dataset`, `x-dataset`, `x-client-hostname`, `x-domain`, `x-client-id`
3. **Server Components**: Read headers via `getDataset()` or `getClientForRequest()`
4. **Client Components**: Access context via `useClientContext()` hooks

## How Dataset Routing Works

### Request Flow

```
1. Request arrives (e.g., https://buddsplumbing.com/services)
   ↓
2. Middleware intercepts request
   ↓
3. Domain middleware extracts hostname and maps to dataset
   ↓
4. Headers set: x-sanity-dataset=production, x-domain=buddsplumbing.com
   ↓
5. Server Component calls getClientForRequest()
   ↓
6. getClientForRequest() reads x-sanity-dataset header
   ↓
7. Sanity client created with correct dataset
   ↓
8. Client fetches data from correct dataset
```

### Dataset Mapping

```typescript
// Configured in dataset-config.ts
const DATASET_MAP = {
  'buddsplumbing.com': 'production',
  'www.buddsplumbing.com': 'production',
  'staging.buddsplumbing.com': 'staging',
  localhost: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
};
```

## Testing Locally

### 1. Basic Testing with Localhost

```bash
# Run development server
cd apps/web
pnpm dev

# Visit http://localhost:3000
# Will use dataset from NEXT_PUBLIC_SANITY_DATASET
```

### 2. Test with Custom Hostnames

Edit `/etc/hosts`:

```bash
sudo nano /etc/hosts

# Add these lines:
127.0.0.1 buddsplumbing.local
127.0.0.1 staging.buddsplumbing.local
```

Update `lib/dataset-config.ts`:

```typescript
const DATASET_MAP = {
  'buddsplumbing.local': 'production',
  'staging.buddsplumbing.local': 'staging',
  localhost: 'development',
};
```

Visit:

- http://buddsplumbing.local:3000 → production dataset
- http://staging.buddsplumbing.local:3000 → staging dataset
- http://localhost:3000 → development dataset

### 3. Verify Dataset Routing

Visit the debug endpoint:

```bash
curl http://localhost:3000/api/debug-dataset | jq
```

Expected output:

```json
{
  "success": true,
  "routing": {
    "dataset": "development",
    "hostname": "localhost",
    "clientId": "budds-plumbing-dev"
  },
  "clientConfig": {
    "dataset": "development",
    "clientName": "Budds Plumbing (Dev)",
    "domain": "localhost"
  },
  "customHeaders": {
    "x-sanity-dataset": "development",
    "x-dataset": "development",
    "x-client-hostname": "localhost",
    "x-domain": "localhost",
    "x-client-id": "budds-plumbing-dev"
  }
}
```

### 4. Check Browser Console/Server Logs

In development, you'll see logs:

```
[Dataset Routing] {
  hostname: 'localhost',
  dataset: 'development',
  timestamp: '2024-10-31T12:00:00.000Z',
  environment: 'development'
}
```

## Environment Variables

### Required

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=2x758fv1
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-10-31
SANITY_API_READ_TOKEN=your-token-here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_ENV=development
```

### Optional (for overrides)

```env
# Domain overrides
NEXT_PUBLIC_BASE_DOMAIN=buddsplumbing.com
NEXT_PUBLIC_DOMAIN_OVERRIDE=custom.domain.com
NEXT_PUBLIC_CLIENT_ID=custom-client
```

## Usage Examples

### Server Component (Recommended)

```typescript
// app/services/page.tsx
import { getClientForRequest } from '@/sanity/lib/client';

export default async function ServicesPage() {
  const client = await getClientForRequest();
  const services = await client.fetch('*[_type == "service"]');

  return <div>{/* render services */}</div>;
}
```

### Client Component

```typescript
'use client';
import { useClientContext } from '@/lib/client-context';

export function ClientInfo() {
  const { dataset, clientName, domain } = useClientContext();
  return <div>Dataset: {dataset}</div>;
}
```

### API Route

```typescript
// app/api/data/route.ts
import { getDatasetFromHeaders } from '@/middleware';
import { createClientForDataset } from '@/sanity/lib/client';

export async function GET() {
  const dataset = await getDatasetFromHeaders();
  const client = createClientForDataset(dataset!);
  const data = await client.fetch('*[_type == "settings"]');
  return Response.json(data);
}
```

## Migration from Old Code

### Old Way

```typescript
import { client } from '@/sanity/lib/client';
const data = await client.fetch(query);
```

### New Way (Multi-Tenant)

```typescript
import { getClientForRequest } from '@/sanity/lib/client';
const client = await getClientForRequest();
const data = await client.fetch(query);
```

**Note**: The old way still works! It uses the default dataset from environment variables. Only migrate when you need multi-tenant support.

## Type Safety

All functions are fully typed with strict TypeScript:

```typescript
// Type-safe dataset names
type DatasetName = 'production' | 'staging' | 'development';

// Type-safe client configuration
interface ClientConfig {
  dataset: DatasetName;
  clientName: string;
  domain: string;
}

// Type-safe hooks
const dataset: DatasetName = useDataset();
const config: ClientConfig = useClientContext();
```

## Key Design Decisions

1. **Async by Default**: All header-reading functions are async for Next.js 15 compatibility
2. **Dynamic Imports**: Used dynamic imports of `next/headers` to avoid client component issues
3. **Backward Compatibility**: Existing `client` and `sanityFetch` exports still work with default dataset
4. **Fallback Strategy**: Always falls back to environment variable if headers unavailable
5. **Logging**: Debug logging only in non-production environments using `console.warn`
6. **Type Safety**: Strict TypeScript with no `any` types or `eslint-disable` comments

## Verification

### TypeScript Compilation

```bash
cd apps/web
pnpm typecheck
```

All dataset routing files pass TypeScript checks with no errors.

### Runtime Testing

1. Start dev server: `pnpm dev`
2. Visit: http://localhost:3000/api/debug-dataset
3. Verify correct dataset is returned
4. Check server logs for dataset routing information

## Known Limitations

1. **Build Warnings**: Existing files (`domain-mapping.ts`, `domain-middleware.ts`) have ESLint warnings about `Headers` type. These are pre-existing and not related to this implementation.

2. **Sanity Studio**: The Sanity Studio always uses the default dataset from environment variables. Multi-tenant dataset selection only works for the main application routes.

3. **Client-Side Only**: Client components cannot directly access dataset headers. They must use the `ClientContextProvider` hooks.

## Next Steps

1. **Add More Clients**: Update `dataset-config.ts` and `domain-mapping.ts` to add new client domains
2. **Create Datasets**: Create corresponding datasets in Sanity Studio
3. **Test Production**: Deploy to staging/production and test with real domains
4. **Monitor**: Add monitoring for dataset routing performance and errors
5. **Analytics**: Track usage per client/dataset for insights

## Support & Documentation

- **Main Documentation**: `/apps/web/DATASET-ROUTING-README.md`
- **Examples**: `/apps/web/lib/dataset-routing-examples.ts`
- **Debug Endpoint**: `http://localhost:3000/api/debug-dataset`
- **Server Logs**: Check console for `[Dataset Routing]` messages

## Success Criteria ✅

All requirements have been met:

- ✅ Created middleware file for dataset routing
- ✅ Implemented hostname extraction and dataset mapping
- ✅ Set dataset in request context via headers
- ✅ Implemented fallback to default dataset
- ✅ Added logging for debugging
- ✅ Created dataset configuration file with mapping logic
- ✅ Implemented environment-based dataset selection
- ✅ Type-safe dataset names and validation helpers
- ✅ Created client context provider for components
- ✅ Provided type-safe hooks for accessing client data
- ✅ Updated Sanity client initialization for dynamic dataset
- ✅ Followed strict TypeScript patterns (no eslint-disable)
- ✅ Comprehensive documentation and testing guide
- ✅ Debug endpoint for testing

## Summary

The dataset routing middleware is fully implemented, tested, and documented. It provides a robust, type-safe solution for multi-tenant support that integrates seamlessly with the existing codebase while maintaining backward compatibility.
