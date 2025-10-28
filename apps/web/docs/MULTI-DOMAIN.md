# Multi-Domain Support Infrastructure

This document explains the multi-domain support infrastructure implemented in the Budds Plumbing application. This system enables multi-tenant functionality where different clients can have their own domains (subdomains or custom domains) while sharing the same codebase.

## Overview

The multi-domain system consists of three main components:

1. **Domain Mapping** (`lib/domain-mapping.ts`) - Maps domains to client configurations and Sanity datasets
2. **Domain Middleware** (`lib/domain-middleware.ts`) - Validates domains, applies security headers, and enriches requests
3. **Next.js Middleware** (`middleware.ts`) - Integrates the domain middleware into the Next.js request pipeline

## Architecture

```
Request → Next.js Middleware → Domain Validation → Domain Config Lookup → Response with Headers
```

Each request is processed through the middleware which:

1. Extracts the domain from request headers
2. Validates the domain against configured mappings
3. Applies security headers (HSTS, CSP, etc.)
4. Applies caching strategies
5. Adds domain context headers (`x-domain`, `x-client-id`, `x-dataset`, etc.)
6. Redirects invalid domains to the default domain

## How Domain Mapping Works

### Domain Configuration

Domains are configured in `/apps/web/lib/domain-mapping.ts` in the `DOMAIN_MAPPINGS` array:

```typescript
export const DOMAIN_MAPPINGS: DomainConfig[] = [
  {
    domain: 'buddsplumbing.com',
    projectId: DEFAULT_PROJECT_ID,
    dataset: 'production',
    clientId: 'budds-main',
    enabled: true,
    branding: {
      name: 'Budds Plumbing',
    },
  },
  // Add more domains here...
];
```

### Domain Types Supported

1. **Primary Domain**: `buddsplumbing.com`
2. **www Subdomain**: `www.buddsplumbing.com`
3. **Client Subdomains**: `client1.buddsplumbing.com`, `client2.buddsplumbing.com`
4. **Custom Domains**: `customdomain.com`
5. **Localhost**: `localhost:3000` (for development)

### Request Flow

1. A request comes in for `client1.buddsplumbing.com/services`
2. Middleware extracts domain: `client1.buddsplumbing.com`
3. Domain is validated against `DOMAIN_MAPPINGS`
4. If valid, response headers are set:
   - `x-domain: client1.buddsplumbing.com`
   - `x-client-id: client1`
   - `x-dataset: client1-production`
   - `x-project-id: <sanity-project-id>`
5. Server components and API routes can read these headers to fetch client-specific data

## Adding a New Domain

### Step 1: Configure Domain Mapping

Add a new entry to the `DOMAIN_MAPPINGS` array in `/apps/web/lib/domain-mapping.ts`:

```typescript
{
  domain: "client1.buddsplumbing.com", // or "customdomain.com"
  projectId: DEFAULT_PROJECT_ID, // or a different Sanity project ID
  dataset: "client1-production", // the Sanity dataset for this client
  clientId: "client1", // unique identifier for this client
  enabled: true,
  siteUrl: "https://client1.buddsplumbing.com", // optional, auto-generated if not provided
  analytics: { // optional
    googleAnalyticsId: "G-XXXXXXXXXX",
    googleTagManagerId: "GTM-XXXXXXX",
  },
  branding: { // optional
    name: "Client 1 Plumbing",
    logo: "/client1-logo.png",
  },
}
```

### Step 2: Create Sanity Dataset

Create a new dataset in Sanity Studio for the client:

```bash
# Using Sanity CLI
cd apps/studio
npx sanity dataset create client1-production
```

### Step 3: DNS Configuration

#### For Subdomains (e.g., client1.buddsplumbing.com)

Add a DNS record:

```
Type: CNAME
Name: client1
Value: cname.vercel-dns.com.
TTL: 3600
```

#### For Custom Domains (e.g., customdomain.com)

Add DNS records:

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com.
TTL: 3600
```

### Step 4: Vercel Domain Configuration

#### Option A: Vercel Dashboard

1. Go to your project in Vercel
2. Navigate to **Settings** → **Domains**
3. Click **Add Domain**
4. Enter the domain (e.g., `client1.buddsplumbing.com`)
5. Click **Add** and verify DNS configuration
6. Vercel will automatically provision SSL certificates

#### Option B: Vercel CLI

```bash
vercel domains add client1.buddsplumbing.com
```

#### Wildcard Domain Support (Advanced)

For automatic subdomain support without adding each subdomain individually:

1. Add wildcard domain in Vercel: `*.buddsplumbing.com`
2. Add wildcard DNS record:
   ```
   Type: CNAME
   Name: *
   Value: cname.vercel-dns.com.
   TTL: 3600
   ```

**Note**: Wildcard domains require a Pro Vercel plan.

### Step 5: Environment Variables (Optional)

For deployment-specific overrides, set environment variables in Vercel:

```bash
# For a specific deployment branch
NEXT_PUBLIC_DOMAIN_OVERRIDE=client1.buddsplumbing.com
NEXT_PUBLIC_CLIENT_ID=client1
NEXT_PUBLIC_SANITY_DATASET=client1-production
```

## Testing Locally with Multiple Domains

### Method 1: Hosts File (Recommended)

Edit your hosts file to map domains to localhost:

**macOS/Linux**: `/etc/hosts`
**Windows**: `C:\Windows\System32\drivers\etc\hosts`

Add entries:

```
127.0.0.1 client1.buddsplumbing.local
127.0.0.1 client2.buddsplumbing.local
127.0.0.1 customdomain.local
```

Then update `DOMAIN_MAPPINGS` to include these local domains:

```typescript
{
  domain: "client1.buddsplumbing.local",
  dataset: "client1-development",
  clientId: "client1",
  enabled: true,
}
```

Access via: `http://client1.buddsplumbing.local:3000`

### Method 2: Environment Variables

Set environment variables to override domain configuration:

```bash
# In .env.local
NEXT_PUBLIC_DOMAIN_OVERRIDE=client1.buddsplumbing.com
NEXT_PUBLIC_CLIENT_ID=client1
NEXT_PUBLIC_SANITY_DATASET=client1-development
```

Then run:

```bash
npm run dev
```

### Method 3: Query Parameters (Development Only)

For development, you can add a debug mode to read domain from query params (not recommended for production):

```typescript
// In domain-middleware.ts
const debugDomain = request.nextUrl.searchParams.get('domain');
if (process.env.NEXT_PUBLIC_SITE_ENV === 'development' && debugDomain) {
  domain = debugDomain;
}
```

Access via: `http://localhost:3000?domain=client1.buddsplumbing.com`

## Using Domain Context in Your Application

### In Server Components

```typescript
import { headers } from 'next/headers';
import { getDatasetFromHeaders, getClientIdFromHeaders } from '@/middleware';

export default async function Page() {
  const headersList = await headers();
  const dataset = getDatasetFromHeaders(headersList);
  const clientId = getClientIdFromHeaders(headersList);

  // Use dataset and clientId to fetch data
  const data = await fetchDataForClient(dataset);

  return <div>Client: {clientId}</div>;
}
```

### In API Routes

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getDomainConfigFromResponse } from '@/lib/domain-middleware';

export async function GET(request: NextRequest) {
  const { dataset, clientId } = getDomainConfigFromResponse(request.headers);

  // Use dataset and clientId
  const data = await fetchDataForClient(dataset);

  return NextResponse.json({ data, clientId });
}
```

### In Client Components

Domain context is available via headers passed from server components or API routes.

## Security Considerations

### Security Headers Applied

The middleware automatically applies:

1. **HSTS** (HTTP Strict Transport Security) - Forces HTTPS
2. **CSP** (Content Security Policy) - Prevents XSS attacks
3. **X-Frame-Options** - Prevents clickjacking
4. **X-Content-Type-Options** - Prevents MIME sniffing
5. **X-XSS-Protection** - XSS filter
6. **Referrer-Policy** - Controls referrer information
7. **Permissions-Policy** - Controls browser features

### Domain Validation

- Invalid domains are redirected to the default domain
- Disabled domains return 404
- Only explicitly configured domains are allowed

### SSL/TLS

- Vercel automatically provisions SSL certificates for all domains
- HSTS header enforces HTTPS in production
- SSL is handled at the edge by Vercel

## Caching Strategies

The middleware applies different caching strategies based on content type:

- **Static Assets** (images, fonts): `public, max-age=31536000, immutable`
- **JavaScript/CSS**: `public, max-age=3600, stale-while-revalidate=86400`
- **API Routes**: `private, no-cache, no-store, must-revalidate`
- **Pages**: `public, max-age=60, stale-while-revalidate=3600`

## Troubleshooting

### Domain Not Found Error

**Problem**: Request returns 404 "Domain not found"

**Solution**:

1. Check that domain is in `DOMAIN_MAPPINGS`
2. Verify `enabled: true` is set
3. Check domain spelling (case-sensitive)
4. Ensure DNS is configured correctly

### Infinite Redirect Loop

**Problem**: Page keeps redirecting

**Solution**:

1. Check that domain matches exactly in `DOMAIN_MAPPINGS`
2. Verify redirect logic in `validateDomain` function
3. Check that `shouldRedirect` is not always true

### Wrong Dataset Being Used

**Problem**: Application shows wrong content

**Solution**:

1. Check `x-dataset` header in browser DevTools
2. Verify domain mapping configuration
3. Check Sanity Studio has data in the correct dataset
4. Clear browser cache and cookies

### Local Testing Not Working

**Problem**: Cannot access subdomain locally

**Solution**:

1. Verify hosts file entry is correct
2. Add `.local` domains to `DOMAIN_MAPPINGS`
3. Restart browser after hosts file change
4. Try `http://` instead of `https://` for localhost

## Performance Optimization

### Edge Middleware

The middleware runs at the edge on Vercel, providing:

- Low latency domain resolution
- Global distribution
- Automatic failover

### Caching

- Domain configurations are cached in memory
- Middleware responses are cached at the edge
- Static assets have long cache times

### Best Practices

1. **Minimize Middleware Logic**: Keep middleware fast and lightweight
2. **Use Environment Variables**: For deployment-specific overrides
3. **Cache Domain Lookups**: Domain configs are read once and cached
4. **Optimize Security Headers**: Only necessary headers are applied

## Migration from Existing Setup

If you have an existing dataset-config.ts:

1. **Migrate Configurations**: Copy domain mappings to `DOMAIN_MAPPINGS`
2. **Update Imports**: Change imports from `dataset-config` to `domain-mapping`
3. **Update Header Names**: Change `x-sanity-dataset` to `x-dataset`
4. **Test Thoroughly**: Verify all domains work correctly

## Environment Variables Reference

```bash
# Required
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=https://buddsplumbing.com
NEXT_PUBLIC_SITE_ENV=production

# Optional - Multi-Domain
NEXT_PUBLIC_BASE_DOMAIN=buddsplumbing.com
NEXT_PUBLIC_DOMAIN_OVERRIDE=client1.buddsplumbing.com
NEXT_PUBLIC_CLIENT_ID=client1
```

## Additional Resources

- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Vercel Domain Configuration](https://vercel.com/docs/concepts/projects/domains)
- [Sanity Multi-Tenant Guide](https://www.sanity.io/guides/multi-tenant-saas)
- [DNS Configuration Guide](https://vercel.com/docs/concepts/projects/domains/dns)

## Support

For issues or questions:

1. Check this documentation
2. Review the code in `lib/domain-mapping.ts` and `lib/domain-middleware.ts`
3. Check Vercel deployment logs
4. Verify DNS configuration with `dig` or `nslookup`
