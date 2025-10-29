# Phase 1 Development Rules

**If you break these rules, Phase 1 fails.**

This document defines the architectural contract for the multi-tenant Local Business SEO CMS. Phase 1 is production-grade single tenant that is safe to scale to multi-tenant without refactor.

## Dataset Routing

### Rule: Every query must use request-scoped dataset

**How it works:**

Middleware reads domain → maps to dataset → sets `x-sanity-dataset` header.

Server components call `getClientForRequest()` → reads header → returns client bound to that dataset.

**Code pattern:**

```typescript
// ✅ CORRECT
import { getClientForRequest } from '@/sanity/lib/client';

export default async function MyPage() {
  const client = await getClientForRequest();
  const data = await client.fetch(MY_QUERY);
  // ...
}
```

```typescript
// ❌ WRONG
import { client } from '@/sanity/lib/client';

export default async function MyPage() {
  const data = await client.fetch(MY_QUERY);  // Uses env var dataset
  // ...
}
```

**For fetch helpers (like `fetchSanityPageBySlug`):**

```typescript
// ✅ CORRECT
import { getDefineLiveForRequest } from '@/sanity/lib/live';

export async function fetchSanityPageBySlug({ slug }: { slug: string }) {
  const { sanityFetch } = await getDefineLiveForRequest();
  const { data } = await sanityFetch({ query: PAGE_QUERY, params: { slug } });
  return data;
}
```

**Why:** Cross-tenant data leaks break multi-tenant safety. Every request must query only its dataset.

---

## Schema Contract

### Rule: All schemas live in `packages/schemas`

**Source of truth:** `packages/schemas/documents/`

- service.ts
- location.ts
- serviceLocation.ts
- siteSettings.ts

**Studio imports from package:**

```typescript
// apps/studio/sanity/schema.ts
import {
  service,
  location,
  serviceLocation,
  settings,
} from '@budds-plumbing/schemas';
```

**Why:** Shared schema package enables dataset cloning for new tenants.

---

### Rule: Documents use `sections[]` not `blocks[]`

**Schema pattern:**

```typescript
defineField({
  name: 'sections',
  type: 'array',
  of: [
    { type: 'hero-1' },
    { type: 'section-header' },
    { type: 'split-row' },
    // ...
  ],
})
```

Legacy `blocks` field exists hidden for backward compatibility. New schemas use `sections`.

**Why:** Naming consistency across codebase. `sections` is the contract.

---

### Rule: serviceLocation has NO manual slug

**Schema:**

```typescript
// ❌ WRONG
defineField({
  name: 'slug',
  type: 'slug',
  validation: (Rule) => Rule.required(),
})

// ✅ CORRECT
// No slug field. URL is computed from references at runtime.
```

**URL derivation:**

`/${service.slug}/in/${location.slug}`

**Why:** Manual slugs cause conflicts across tenants. Computed URLs enforce uniqueness.

---

### Rule: siteSettings must have `defaultSeo` object

**Schema:**

```typescript
defineField({
  name: 'defaultSeo',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'ogImage', type: 'image' }),
  ],
  validation: (Rule) => Rule.required(),
})
```

**Usage:** Fallback meta tags when pages don't define custom SEO.

**Why:** Centralized defaults prevent missing SEO data.

---

## Rendering Pipeline

### Rule: SectionRenderer is the only renderer

**Code pattern:**

```typescript
// ✅ CORRECT
import SectionRenderer from '@/components/SectionRenderer';

export default function MyPage() {
  return <SectionRenderer sections={data.sections} />;
}
```

```typescript
// ❌ WRONG
import Blocks from '@/components/blocks';  // File deleted

export default function MyPage() {
  return <Blocks blocks={data.blocks} />;
}
```

**Why:** Single rendering pipeline prevents drift. No duplicate logic. No silent fallbacks.

---

### Rule: Every block must have a variant field

**Schema:**

```typescript
defineField({
  name: 'variant',
  type: 'string',
  title: 'Variant',
  description: 'Rendering variant for this block',
  initialValue: 'carousel-1',
  hidden: true,  // Phase 1: single variant per block type
})
```

**Why:** Editorial control over presentation. Enables future multi-variant blocks.

---

### Rule: SectionRenderer must register all block types

**If you add a new block schema:**

1. Create component in `apps/web/components/blocks/[category]/[block-name].tsx`
2. Register in `apps/web/components/SectionRenderer.tsx`:

```typescript
import NewBlockComponent from './blocks/category/new-block';

const newBlockRegistry: ComponentRegistry = {
  'new-block': NewBlockComponent as React.ComponentType<Record<string, unknown>>,
};

const registryMap = {
  // ...existing
  'new-block': newBlockRegistry,
};

const defaultVariants = {
  // ...existing
  'new-block': 'new-block',
};
```

3. Add to allowed types in schema sections[] field

**Never** edit `components/blocks/index.tsx`. That file is deleted.

---

## Content Source of Truth

### Rule: No hardcoded NAP (Name, Address, Phone)

**Code pattern:**

```typescript
// ✅ CORRECT
const businessSchema = generateLocalBusinessSchema({
  name: siteSettings?.businessName || '',
  telephone: siteSettings?.phoneNumber || '',
  address: siteSettings?.address ? {
    streetAddress: siteSettings.address.street,
    addressLocality: siteSettings.address.city,
    addressRegion: siteSettings.address.state,
    postalCode: siteSettings.address.zip,
    addressCountry: 'US',
  } : undefined,
});
```

```typescript
// ❌ WRONG
const businessSchema = generateLocalBusinessSchema({
  name: 'Budds Plumbing',
  telephone: '+1-555-PLUMBING',
  address: {
    streetAddress: '123 Main St',
    addressLocality: 'City',
    // ...
  },
});
```

**Why:** Hardcoded business details break single source of truth. Updates must propagate from CMS.

---

### Rule: No hardcoded "Content coming soon" fallbacks

**Code pattern:**

```typescript
// ❌ WRONG
{(!blocks || blocks.length === 0) && (
  <div>
    <p>Content coming soon. Please add blocks in the CMS.</p>
  </div>
)}
```

```typescript
// ✅ CORRECT
{(!blocks || blocks.length === 0) && service.sections && (
  <SectionRenderer sections={service.sections} />
)}
```

**Why:** Fallbacks must inherit from parent document or stay empty. No inline marketing strings.

---

## SEO & Sitemap

### Rule: Sitemap only includes Phase 1 document types

**Allowed types:**

- `service`
- `location`
- `serviceLocation`

**Excluded:** `page`, `post`, `author`, `category` are not in Phase 1 contract.

**Code pattern:**

```typescript
// sitemap.ts
const { sanityFetch } = await getDefineLiveForRequest();
const services = await sanityFetch({
  query: groq`*[_type == 'service' && !defined(seo.noindex) || seo.noindex != true]`,
});
```

**Why:** Sitemap scope matches approved schema contract. No route leaks.

---

### Rule: Sitemap must be dataset-scoped

**Code:**

```typescript
// ✅ CORRECT
import { getDefineLiveForRequest } from '@/sanity/lib/live';

export default async function sitemap() {
  const { sanityFetch } = await getDefineLiveForRequest();
  const data = await sanityFetch({ query: QUERY });
  // ...
}
```

```typescript
// ❌ WRONG
import { sanityFetch } from '@/sanity/lib/live';

export default async function sitemap() {
  const { data } = await sanityFetch({ query: QUERY });  // Uses default dataset
  // ...
}
```

**Why:** Each tenant's sitemap must list only their URLs. No cross-tenant sitemap pollution.

---

## CI Rules and Performance Budgets

### Rule: Lighthouse CI enforces SEO 100 and JS ≤ 250KB

**Configuration (lighthouserc.js):**

```javascript
assert: {
  assertions: {
    'categories:seo': ['error', { minScore: 1.0 }],
    'resource-summary:script:size': ['error', { maxNumericValue: 250000 }],
    // ...
  },
}
```

**Why:** Phase 1 requires production-grade SEO and performance. PRs that regress these metrics must fail.

---

### Rule: Critical checks are `error` not `warn`

**Required error-level checks:**

- `categories:seo`
- `categories:performance`
- `resource-summary:script:size`
- `document-title`
- `meta-description`
- `canonical`
- `is-crawlable`
- `robots-txt`

**Why:** Warnings don't fail builds. Phase 1 requires enforcement.

---

## Type Safety

### Rule: Generate types from packages/schemas

**Command:**

```bash
cd packages/schemas
pnpm typecheck
```

**Usage:**

```typescript
import type { Service, Location, SiteSettings } from '@budds-plumbing/schemas';
```

**Why:** Shared types prevent drift between Studio and web app.

---

## Phase 1 Failure Checklist

If any of these are true, Phase 1 fails:

- [ ] Route imports global `client` instead of `getClientForRequest()`
- [ ] Schema uses `blocks` instead of `sections[]`
- [ ] `serviceLocation` schema has manual `slug` field
- [ ] `siteSettings` lacks `defaultSeo` object
- [ ] Component imports from `@/components/blocks` (deleted file)
- [ ] Block schema missing `variant` field
- [ ] Block type not registered in `SectionRenderer`
- [ ] Hardcoded NAP/phone/address in any route
- [ ] Inline "Content coming soon" fallback text
- [ ] Sitemap includes `page` or `post` types
- [ ] Sitemap uses shared `sanityFetch` not request-scoped
- [ ] `lighthouserc.js` allows SEO < 1.0
- [ ] `lighthouserc.js` allows JS > 250KB
- [ ] Critical checks set to `warn` instead of `error`

---

## Developer Workflow

### Adding a new service or location

1. Create document in Sanity Studio
2. Add `sections[]` content blocks
3. Set `seo` object fields (title, description, ogImage)
4. Deploy → dataset-aware sitemap auto-includes new URL

### Adding a new block type

1. Create schema in `apps/studio/sanity/schemas/blocks/[category]/[block-name].ts`
2. Add `variant` field (hidden, default = block _type)
3. Create component in `apps/web/components/blocks/[category]/[block-name].tsx`
4. Register in `SectionRenderer.tsx` registry + default variants
5. Add to allowed types in service/location schemas
6. Test rendering on service/location page

### Checking dataset isolation

```bash
# Set domain → dataset mapping in apps/web/lib/domain-middleware.ts
# Test: curl with Host header
curl -H "Host: client1.example.com" http://localhost:3000/
# Middleware should set x-sanity-dataset: client1-dataset
```

### Running Lighthouse CI locally

```bash
# Build production bundle
pnpm build

# Start production server
pnpm start

# Run Lighthouse CI
pnpm lhci autorun
```

CI fails if any `error` assertion fails.

---

## Multi-Tenant Readiness

Phase 1 is single tenant but safe to scale. When Phase 2 begins:

- **New tenant onboarding:** Clone `packages/schemas` → provision new Sanity dataset → add domain mapping
- **No code changes required:** Dataset routing already works per request
- **Sitemap auto-segregates:** Each domain gets its own sitemap scoped to its dataset
- **LocalBusiness schema:** Pulls from tenant's `siteSettings`, no hardcoded data

Phase 1 prevents refactor debt. All routes already use request-scoped clients. All schemas centralized. All rendering unified.

---

## Questions?

- Dataset routing: See `apps/web/lib/domain-middleware.ts`
- Schema source: See `packages/schemas/documents/`
- Rendering logic: See `apps/web/components/SectionRenderer.tsx`
- CI enforcement: See `lighthouserc.js`

**If you break Phase 1 rules, deployments will fail CI. Fix violations before merging.**
