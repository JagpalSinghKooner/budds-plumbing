# Routing Strategy

## Overview

This document explains the routing architecture for the Budds Plumbing application, specifically addressing the Phase 1 routing requirements and the resolution of route conflicts.

## Phase 1 Required Routes

According to Phase 1 requirements, the following routes **must** be supported:

1. `/services/[serviceSlug]` - Individual service pages
2. `/locations/[locationSlug]` - Individual location pages
3. `/[serviceSlug]/in/[locationSlug]` - Service+Location combination pages (local SEO)

## Route Conflict Resolution

### The Problem

Next.js does not allow different dynamic parameter names at the same route level. We had a conflict between:

- `[serviceSlug]` - Required for `/[serviceSlug]/in/[locationSlug]` pattern
- `[slug]` - Generic catch-all for pages like /about, /contact, etc.

**Error:** `You cannot use different slug names for the same dynamic path ('serviceSlug' !== 'slug').`

### The Solution

We removed the generic `[slug]` catch-all route to preserve the Phase 1 requirement for `/[serviceSlug]/in/[locationSlug]`.

Generic pages should now use **explicit route folders** instead of a catch-all.

## Current Route Structure

```
app/(main)/
├── page.tsx                                          → /
├── services/
│   └── [serviceSlug]/
│       └── page.tsx                                  → /services/[serviceSlug]
├── locations/
│   ├── [locationSlug]/
│   │   ├── page.tsx                                  → /locations/[locationSlug]
│   │   └── services/
│   │       └── [serviceSlug]/
│   │           └── page.tsx                          → /locations/[locationSlug]/services/[serviceSlug]
├── [serviceSlug]/
│   └── in/
│       └── [locationSlug]/
│           └── page.tsx                              → /[serviceSlug]/in/[locationSlug] ✅ Phase 1
└── blog/
    └── [slug]/
        └── page.tsx                                  → /blog/[slug]
```

## Adding Generic Pages

To add generic pages (like About, Contact, etc.), create **explicit route folders**:

### Example: About Page

```bash
# Create the route
mkdir -p apps/web/app/(main)/about
```

```typescript
// apps/web/app/(main)/about/page.tsx
import { client } from '@/sanity/lib/client';

export default async function AboutPage() {
  // Fetch page data from Sanity using a specific document ID or slug
  const page = await client.fetch(
    `*[_type == "page" && slug.current == "about"][0]{ title, blocks }`
  );

  return (
    <main>
      <h1>{page.title}</h1>
      {/* Render blocks */}
    </main>
  );
}
```

### Example: Contact Page

```bash
# Create the route
mkdir -p apps/web/app/(main)/contact
```

```typescript
// apps/web/app/(main)/contact/page.tsx
export default function ContactPage() {
  return (
    <main>
      <h1>Contact Us</h1>
      {/* Contact form */}
    </main>
  );
}
```

## Alternative: Sanity-Driven Generic Pages

If you need many generic pages managed through Sanity, you can:

1. **Use a prefix** like `/pages/[slug]` to avoid conflicts
2. **Query all pages** and generate them at build time

### Option 1: Prefixed Route

```typescript
// apps/web/app/(main)/pages/[slug]/page.tsx
import { client } from '@/sanity/lib/client';
import Blocks from '@/components/blocks';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const pages = await client.fetch(
    `*[_type == "page"]{ "slug": slug.current }`
  );
  return pages.map((page) => ({ slug: page.slug }));
}

export default async function GenericPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const page = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]`,
    { slug }
  );

  if (!page) notFound();

  return <Blocks blocks={page.blocks ?? []} />;
}
```

This creates routes like:

- `/pages/about`
- `/pages/contact`
- `/pages/privacy-policy`

### Option 2: Explicit Redirects

Create redirects in `next.config.mjs` to map clean URLs to prefixed routes:

```javascript
async redirects() {
  return [
    {
      source: '/about',
      destination: '/pages/about',
      permanent: true,
    },
    {
      source: '/contact',
      destination: '/pages/contact',
      permanent: true,
    },
  ];
}
```

## Best Practices

1. **Service+Location Pages**: Always use `/[serviceSlug]/in/[locationSlug]` (Phase 1 requirement)
2. **Generic Pages**: Use explicit folders for important pages (about, contact)
3. **CMS-Driven Pages**: Use `/pages/[slug]` prefix if you need many dynamic pages
4. **Blog Posts**: Use `/blog/[slug]` (already implemented)

## SEO Considerations

- Service+Location pages use the short URL pattern for SEO: `/plumbing/in/calgary`
- This is more natural than `/services/plumbing/locations/calgary`
- Generic pages can use clean URLs: `/about`, `/contact`
- Blog posts namespace under `/blog/[slug]` to avoid conflicts

## Migration Notes

If you previously had pages using the `[slug]` route:

1. Identify all pages that were accessible via `/:slug`
2. Create explicit folders for each: `about/page.tsx`, `contact/page.tsx`, etc.
3. Update internal links to point to the new routes
4. Set up 301 redirects if URLs changed

## Questions?

For questions about routing, consult:

- [Next.js App Router docs](https://nextjs.org/docs/app)
- Phase 1 requirements in `/project-rules/PHASE1-COMPLETE-PHASE2-PLAN.md`
