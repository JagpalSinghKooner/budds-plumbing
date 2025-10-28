# Multi-Domain Support - Code Examples

This document provides practical code examples for using the multi-domain infrastructure.

## Table of Contents

- [Adding a New Domain](#adding-a-new-domain)
- [Server Components](#server-components)
- [API Routes](#api-routes)
- [Client Components](#client-components)
- [Dynamic Sanity Queries](#dynamic-sanity-queries)
- [Custom Domain Logic](#custom-domain-logic)
- [Testing Scenarios](#testing-scenarios)

## Adding a New Domain

### Example: Adding a Client Subdomain

```typescript
// In /apps/web/lib/domain-mapping.ts

export const DOMAIN_MAPPINGS: DomainConfig[] = [
  // ... existing mappings

  // New client subdomain
  {
    domain: 'client1.buddsplumbing.com',
    projectId: DEFAULT_PROJECT_ID, // Use same Sanity project
    dataset: 'client1-production', // Client-specific dataset
    clientId: 'client1',
    enabled: true,
    siteUrl: 'https://client1.buddsplumbing.com',
    analytics: {
      googleAnalyticsId: 'G-CLIENT1XXX',
      googleTagManagerId: 'GTM-CLIENT1',
    },
    branding: {
      name: 'Client 1 Plumbing Services',
      logo: '/clients/client1-logo.png',
    },
  },
];
```

### Example: Adding a Custom Domain

```typescript
// In /apps/web/lib/domain-mapping.ts

export const DOMAIN_MAPPINGS: DomainConfig[] = [
  // ... existing mappings

  // Custom domain for a white-label client
  {
    domain: 'acmeplumbing.com',
    projectId: 'different-project-id', // Different Sanity project
    dataset: 'acme-production',
    clientId: 'acme',
    enabled: true,
    siteUrl: 'https://acmeplumbing.com',
    analytics: {
      googleAnalyticsId: 'G-ACMEXXXXXX',
    },
    branding: {
      name: 'ACME Plumbing Co.',
      logo: '/clients/acme-logo.png',
    },
  },
];
```

## Server Components

### Example 1: Fetching Domain-Specific Content

```typescript
// app/(main)/page.tsx

import { createSanityClientForDomain, getDomainContext } from '@/lib/sanity-domain-helpers';

export default async function HomePage() {
  // Get domain context
  const { clientId, dataset } = await getDomainContext();

  // Create domain-specific Sanity client
  const client = await createSanityClientForDomain();

  // Fetch content for this domain
  const page = await client.fetch(
    `*[_type == "page" && slug.current == "home"][0]`,
    {},
    { next: { revalidate: 60 } }
  );

  return (
    <div>
      <h1>{page.title}</h1>
      <p>Client: {clientId}</p>
      <p>Dataset: {dataset}</p>
    </div>
  );
}
```

### Example 2: Dynamic Branding Based on Domain

```typescript
// components/header/header.tsx

import { getDomainContext } from '@/lib/sanity-domain-helpers';
import { getDomainConfig } from '@/lib/domain-mapping';
import Image from 'next/image';

export default async function Header() {
  const { domain } = await getDomainContext();
  const config = getDomainConfig(domain);

  if (!config) {
    return null;
  }

  return (
    <header>
      <div className="logo">
        {config.branding?.logo ? (
          <Image
            src={config.branding.logo}
            alt={config.branding.name || 'Logo'}
            width={200}
            height={60}
          />
        ) : (
          <h1>{config.branding?.name || 'Budds Plumbing'}</h1>
        )}
      </div>
    </header>
  );
}
```

### Example 3: Client-Specific Analytics

```typescript
// app/layout.tsx

import { getDomainContext } from '@/lib/sanity-domain-helpers';
import { getDomainConfig } from '@/lib/domain-mapping';
import { GoogleAnalytics } from '@next/third-parties/google';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { domain } = await getDomainContext();
  const config = getDomainConfig(domain);

  const gaId = config?.analytics?.googleAnalyticsId;

  return (
    <html lang="en">
      <body>
        {children}
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
```

## API Routes

### Example 1: Domain-Aware API Endpoint

```typescript
// app/api/content/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getDomainConfigFromResponse } from '@/lib/domain-middleware';
import { createSanityClientWithContext } from '@/lib/sanity-domain-helpers';

export async function GET(request: NextRequest) {
  // Get domain context from middleware headers
  const context = getDomainConfigFromResponse(request.headers);

  // Create Sanity client for this domain
  const client = createSanityClientWithContext(context);

  // Fetch content
  const content = await client.fetch(
    `*[_type == "service"] | order(title asc)`
  );

  return NextResponse.json({
    content,
    client: context.clientId,
    dataset: context.dataset,
  });
}
```

### Example 2: Client-Specific Rate Limiting

```typescript
// app/api/newsletter/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getDomainConfigFromResponse } from '@/lib/domain-middleware';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create client-specific rate limiters
const rateLimiters = new Map<string, Ratelimit>();

function getRateLimiter(clientId: string) {
  if (!rateLimiters.has(clientId)) {
    rateLimiters.set(
      clientId,
      new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10, '10 s'),
        prefix: `ratelimit:newsletter:${clientId}`,
      })
    );
  }
  return rateLimiters.get(clientId)!;
}

export async function POST(request: NextRequest) {
  const context = getDomainConfigFromResponse(request.headers);
  const rateLimiter = getRateLimiter(context.clientId);

  const { success } = await rateLimiter.limit(context.clientId);

  if (!success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  // Process newsletter signup...
  return NextResponse.json({ success: true });
}
```

## Client Components

### Example: Domain-Aware Contact Form

```typescript
// components/contact-form.tsx

'use client';

import { useState } from 'react';

interface ContactFormProps {
  clientId: string;
  dataset: string;
}

export default function ContactForm({ clientId, dataset }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        clientId,
        dataset,
      }),
    });

    // Handle response...
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
      />
      {/* More fields... */}
      <button type="submit">Submit to {clientId}</button>
    </form>
  );
}
```

```typescript
// app/(main)/contact/page.tsx

import ContactForm from '@/components/contact-form';
import { getDomainContext } from '@/lib/sanity-domain-helpers';

export default async function ContactPage() {
  const { clientId, dataset } = await getDomainContext();

  return (
    <div>
      <h1>Contact Us</h1>
      <ContactForm clientId={clientId} dataset={dataset} />
    </div>
  );
}
```

## Dynamic Sanity Queries

### Example 1: Conditional Queries Based on Client

```typescript
// lib/queries/services.ts

import {
  createSanityClientForDomain,
  getDomainContext,
} from '@/lib/sanity-domain-helpers';

export async function getServices() {
  const { clientId } = await getDomainContext();
  const client = await createSanityClientForDomain();

  // Different query logic based on client
  const query =
    clientId === 'budds-main'
      ? `*[_type == "service"] | order(order asc, title asc)`
      : `*[_type == "service" && !hideFromClients] | order(title asc)`;

  return await client.fetch(query);
}
```

### Example 2: Client-Specific Featured Content

```typescript
// app/(main)/page.tsx

import { createSanityClientForDomain, getDomainContext } from '@/lib/sanity-domain-helpers';

export default async function HomePage() {
  const { clientId } = await getDomainContext();
  const client = await createSanityClientForDomain();

  // Query with client-specific filtering
  const featuredServices = await client.fetch(
    `*[_type == "service" &&
       (featuredForClients == null || $clientId in featuredForClients)]
     | order(order asc)[0...3]`,
    { clientId }
  );

  return (
    <div>
      <h2>Featured Services for {clientId}</h2>
      {/* Render services... */}
    </div>
  );
}
```

## Custom Domain Logic

### Example 1: Domain-Specific Redirects

```typescript
// middleware.ts or custom middleware

import { NextRequest, NextResponse } from 'next/server';
import { getDomainConfigFromHeaders } from '@/lib/domain-mapping';

export function customDomainMiddleware(request: NextRequest) {
  const config = getDomainConfigFromHeaders(request.headers);

  if (!config) {
    return NextResponse.next();
  }

  // Redirect specific paths for certain clients
  if (
    config.clientId === 'client1' &&
    request.nextUrl.pathname === '/old-path'
  ) {
    return NextResponse.redirect(new URL('/new-path', request.url));
  }

  // Block certain paths for specific clients
  if (
    config.clientId !== 'budds-main' &&
    request.nextUrl.pathname.startsWith('/admin')
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
```

### Example 2: Dynamic Sitemap Based on Domain

```typescript
// app/sitemap.ts

import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { getDomainConfigFromResponse } from '@/lib/domain-middleware';
import { createSanityClientForDomain } from '@/lib/sanity-domain-helpers';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const context = getDomainConfigFromResponse(headersList);
  const client = await createSanityClientForDomain();

  // Fetch pages for this specific domain/client
  const pages = await client.fetch(
    `*[_type == "page" && !noindex &&
      (visibleToClients == null || $clientId in visibleToClients)]`,
    { clientId: context.clientId }
  );

  const baseUrl = `https://${context.domain}`;

  return pages.map((page: any) => ({
    url: `${baseUrl}/${page.slug.current}`,
    lastModified: page._updatedAt,
    changeFrequency: 'monthly' as const,
    priority: page.slug.current === 'home' ? 1.0 : 0.8,
  }));
}
```

## Testing Scenarios

### Testing with Hosts File

```bash
# Add to /etc/hosts (macOS/Linux) or C:\Windows\System32\drivers\etc\hosts (Windows)
127.0.0.1 client1.buddsplumbing.local
127.0.0.1 client2.buddsplumbing.local
```

```typescript
// Add to domain-mapping.ts for local testing
{
  domain: "client1.buddsplumbing.local",
  dataset: "client1-development",
  clientId: "client1",
  enabled: true,
  branding: {
    name: "Client 1 (Local)",
  },
},
```

Access: `http://client1.buddsplumbing.local:3000`

### Testing with Environment Variables

```bash
# .env.local
NEXT_PUBLIC_DOMAIN_OVERRIDE=client1.buddsplumbing.com
NEXT_PUBLIC_CLIENT_ID=client1
NEXT_PUBLIC_SANITY_DATASET=client1-development
```

```bash
npm run dev
# Access: http://localhost:3000
```

### Testing Domain Validation

```typescript
// Test file: __tests__/domain-mapping.test.ts

import { getDomainConfig, isValidDomain } from '@/lib/domain-mapping';

describe('Domain Mapping', () => {
  it('should return config for valid domain', () => {
    const config = getDomainConfig('buddsplumbing.com');
    expect(config).not.toBeNull();
    expect(config?.clientId).toBe('budds-main');
  });

  it('should return null for invalid domain', () => {
    const config = getDomainConfig('invalid-domain.com');
    expect(config).toBeNull();
  });

  it('should validate enabled domains', () => {
    expect(isValidDomain('buddsplumbing.com')).toBe(true);
    expect(isValidDomain('invalid.com')).toBe(false);
  });
});
```

## Best Practices

1. **Always use domain helpers in Server Components**

   ```typescript
   const client = await createSanityClientForDomain();
   ```

2. **Pass domain context to Client Components**

   ```typescript
   const { clientId } = await getDomainContext();
   <ClientComponent clientId={clientId} />
   ```

3. **Use environment overrides for testing**

   ```bash
   NEXT_PUBLIC_DOMAIN_OVERRIDE=client1.example.com npm run dev
   ```

4. **Cache domain configs when possible**

   ```typescript
   const config = getDomainConfig(domain); // Already cached internally
   ```

5. **Handle missing configs gracefully**
   ```typescript
   const config = getDomainConfig(domain);
   if (!config) {
     redirect('/');
   }
   ```

## Additional Resources

- [MULTI-DOMAIN.md](./MULTI-DOMAIN.md) - Comprehensive documentation
- [lib/README.md](../lib/README.md) - Library module reference
