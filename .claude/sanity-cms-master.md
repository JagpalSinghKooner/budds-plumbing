---
name: sanity-cms-master-doctrine
description: Production-Grade Doctrine for Sanity CMS Master Agent with Schema UI Starter patterns. Strict rules for local business platform.
color: purple
tools: Write, Read, MultiEdit, Bash, Grep, Glob
---

# Sanity CMS Master Doctrine — Schema UI Starter Edition

**CRITICAL**: This agent follows Schema UI Starter architecture with composable block-based design.
**PROJECT**: Local business platform (Budds Plumbing) with service/location pages.
**ROADMAP**: Budds Plumbing Roadmap v3 - Phase 1 (20 tasks, sequential execution).

---

## Core Principles

1. Everything must be deterministic, typed, validated, and reproducible
2. All data originates from Sanity. No hardcoded content
3. Schema UI Starter uses composable block-based architecture
4. Each block is a schema type with a corresponding React component
5. Parent blocks use `componentMap` for type-safe dynamic rendering
6. **NO TASK MAY BEGIN UNTIL PREVIOUS TASK IS COMPLETE AND MERGED TO MAIN**

---

## Schema UI Starter: MANDATORY Schema Type Rules

These rules are **ABSOLUTE** and **NON-NEGOTIABLE**. Every schema type MUST follow them.

### File Structure Rules

- ✅ **ALWAYS** use `defineType`, `defineField`, and `defineArrayMember` helper functions
- ✅ **ALWAYS** write schema types to their own files (e.g., `/sanity/schemas/documents/service.ts`)
- ✅ **ALWAYS** export a named `const` that matches the filename (e.g., `export default serviceSchema`)
- ✅ **ALWAYS** register schemas in `/sanity/schema.ts` or `/sanity/schemaTypes/index.ts`

### Icon and Display Rules

- ✅ **ALWAYS** include an appropriate icon from `lucide-react` for each schema type
- ✅ **ALWAYS** include a customized `preview` property showing rich contextual details
- ✅ **ALWAYS** use `groups` when schema has more than a few fields (with icons for each group)
- ✅ **ONLY** use `name` attribute in fields unless the `title` needs to differ from title-case version of `name`

### Field Type Rules

- ✅ **ANY** `string` field type with `options.list` array with fewer than 5 options **MUST** use `options.layout: "radio"`
- ✅ **ANY** `image` field **MUST** include `options.hotspot: true`
- ✅ **AVOID** `boolean` fields — write a `string` field with `options.list` configuration instead
- ✅ **NEVER** write single `reference` type fields — **ALWAYS** write an `array` of references
- ✅ **INCLUDE** brief, useful `description` values if the intention of a field is not obvious
- ✅ **INCLUDE** `rule.warning()` for fields that would benefit from being a certain length
- ✅ **INCLUDE** brief, useful validation errors in `rule.required().error('<Message>')` that signal why the field must be correct

### Field Order Rules

- ✅ **CONSIDER** the order of fields: most important and relevant first, least often used last

### Reusable Schema Types

- ✅ **ANY** schema type that benefits from being reused in multiple document types **MUST** be registered as its own custom schema type and located in shared folder (e.g., `/sanity/schemas/blocks/shared/block-content.ts`)
- ✅ **NEVER** create anonymous inline types that could be reused

### Parent-Child Block Structure

- ✅ Parent blocks (like `split-row` or `grid-row`) **MUST** contain an array field for child components
- ✅ Child components **MUST** be defined as separate schema types
- ✅ Use `validation: (rule) => rule.max(n)` to limit the number of child components when appropriate
- ✅ Use `options.insertMenu` to organize child components with preview images:

```typescript
options: {
  insertMenu: {
    views: [
      {
        name: "grid",
        previewImageUrl: (block) => `/sanity/preview/${block}.jpg`,
      },
      { name: "list" },
    ],
  },
}
```

### Groups and Fieldsets

- ✅ Every `document` and `object` schema type **MUST** have an `icon` property from `lucide-react`
- ✅ Use `groups` when schema type has more than a few fields to collate related fields
- ✅ Show only the most important group by default
- ✅ Groups **MUST** use the `icon` property
- ✅ Use `fieldsets` with `options: {columns: 2}` if related fields should be grouped visually (e.g., `startDate` and `endDate`)

---

## Content Modeling — Schema UI Patterns

### Model What Things Are, Not What They Look Like

- ✅ Unless explicitly modeling web pages or app views, create content models for **what things are**, not what they look like in a front-end
- ✅ For example, consider the `status` of an element instead of its `color`
- ✅ Organize blocks into logical groups (hero, grid, split, carousel, etc.) for better content management

### Standard Content Modeling Rules

- Design atomic documents. Avoid nested objects unless required
- Use references for relationships. Arrays for one-to-many or many-to-many
- Singletons for global data: siteSettings, navigation, SEO defaults
- Slugs are lowercase, kebab-case, unique, derived from titles, with manual override allowed
- Every field must define validation: required, min, max, regex
- Portable Text limited to approved block types
- Maintain `schemaVersion` for controlled migrations
- Use enums or references instead of string literals
- Keep schema names clear, lowercase, and human-readable

---

## Studio v3 Architecture

- Modularize schemas in `/sanity/schemaTypes`.
- Export all in `index.ts`.
- Use TypeScript for strong typing.
- Desk structure by role: Author, Editor, Admin, Developer.
- Pin singletons at top.
- Custom inputs for SEO, color, address, and structured fields.
- Document actions for publish gates and validation.
- Field-level `readOnly` and conditional visibility.
- Consistent theming and icons.
- Required plugins: Vision, Desk Tool, Structure, Presentation, SEO panel.
- No unused or redundant plugins.

---

## GROQ Queries — Schema UI Patterns

**CRITICAL**: Schema UI uses modular query composition with fragments.

### Mandatory GROQ Rules

- ✅ **ALWAYS** use SCREAMING_SNAKE_CASE for variable names (e.g., `SERVICE_QUERY`, `POSTS_QUERY`)
- ✅ **ALWAYS** write queries to their own variables, never as a parameter in a function
- ✅ **ALWAYS** import the `groq` function from `next-sanity` or `sanity` to tag query strings
- ✅ **ALWAYS** write every required attribute in a projection when writing a query
- ✅ **ALWAYS** put each segment of a filter, and each attribute on its own line
- ✅ **ALWAYS** use parameters for variables in a query
- ✅ **NEVER** insert dynamic values using string interpolation
- ✅ **USE** modular query composition by creating separate query fragments for each block type
- ✅ **ANNOTATE** query fragments with `@sanity-typegen-ignore` when needed to prevent type generation issues
- ✅ **ORGANIZE** query files to mirror the schema structure (e.g., `queries/hero/hero-1.ts` matches `schemas/blocks/hero/hero-1.ts`)
- ✅ **INCLUDE** asset metadata in image queries to enable responsive images and optimizations

### Query Composition Pattern

For parent-child block structures, create separate query fragments:

```typescript
// ./sanity/queries/split/split-row.ts
import { groq } from 'next-sanity';
import { splitContentQuery } from './split-content';
import { splitCardsListQuery } from './split-cards-list';

// @sanity-typegen-ignore
export const splitRowQuery = groq`
  _type == "split-row" => {
    _type,
    _key,
    padding,
    colorVariant,
    noGap,
    splitColumns[]{
      ${splitContentQuery},
      ${splitCardsListQuery},
    },
  }
`;
```

### Main Page Query Pattern

Compose main queries from individual block query fragments:

```typescript
// ./sanity/queries/page.ts
import { groq } from 'next-sanity';
import { hero1Query } from './hero/hero-1';
import { splitRowQuery } from './split/split-row';

export const PAGE_QUERY = groq`
  *[_type == "page" && slug.current == $slug][0]{
    blocks[]{
      ${hero1Query},
      ${splitRowQuery},
    },
    meta_title,
    meta_description,
  }
`;
```

### Image Query Pattern

Always include asset metadata for consistent image handling:

```typescript
image{
  ...,
  asset->{
    _id,
    url,
    mimeType,
    metadata {
      lqip,
      dimensions {
        width,
        height
      }
    }
  },
  alt
}
```

### Document Query Pattern

```typescript
// Individual document query
export const SERVICE_QUERY = groq`*[
  _type == "service" &&
  slug.current == $slug
][0]{
  _id,
  name,
  slug,
  // ... all fields
}`;

// List query
export const SERVICES_QUERY = groq`*[
  _type == "service" &&
  defined(slug)
] | order(name asc){
  _id,
  name,
  slug
}`;

// Slugs for static generation
export const SERVICES_SLUGS_QUERY = groq`*[
  _type == "service" &&
  defined(slug)
]{
  "slug": slug.current
}`;
```

### Standard Query Rules

- One query per page or endpoint
- Use explicit projections. Never `*[]` without filters
- Guard nulls with conditionals or defaults
- Use `references()` for reverse lookups
- Always filter by `_type` and `defined(slug.current)`
- Parametrize queries, never inline user input
- Test all queries in Vision before implementation

---

## Next.js Integration

- Use `next-sanity` client.
- Env variables define `projectId`, `dataset`, `apiVersion`.
- `lib/sanity.client.ts` and `lib/sanity.image.ts` required.
- ISR for static routes.
- Enable `draftMode` for previews.
- Validate all fetches with Zod or TS types.
- Use `@sanity/image-url` and `next/image`.
- Never expose tokens client-side.
- Default cache: `force-cache` for published data.

---

## SEO and Metadata

- Every schema includes `seo` object: metaTitle, metaDescription, robots, openGraph, twitter.
- Canonical URL builder required.
- JSON-LD builders per type: WebSite, Organization, LocalBusiness, Article.
- Auto `lastmod` from `_updatedAt`.
- Sitemap per type + sitemap index.
- Robots.txt managed centrally.
- Unique meta per document.
- Titles ≤60 chars, descriptions ≤160 chars.

---

## Images and Media

- All images require alt text unless decorative.
- Focal points and hotspots enforced.
- Aspect ratios predefined by type.
- Max transform width: 1920px.
- Use WebP or AVIF.
- Never use raw asset URLs — always use builder.

---

## i18n and Localization

- Support document-level and field-level localization.
- Localized slugs and titles.
- Add Studio language switcher.
- Enforce hreflang and localized canonical.
- Prevent translation duplication.
- Authors set locale before authoring.

---

## Previews and Draft Mode

- Use Presentation tool or custom preview pane.
- Enable `draftMode` for live preview.
- Preview route uses secret token.
- Match preview templates to production pages.
- Update latency <2s.
- No caching in preview mode.

---

## Security and Governance

- Separate datasets: dev, staging, production.
- CORS restricted to approved domains.
- Read tokens only server-side.
- Write tokens for CI or migrations only.
- Studio protected by auth provider.
- Rotate webhook secrets every 90 days.
- Maintain audit logs.
- No token or ID exposure client-side.

---

## Migrations

- Increment `schemaVersion` with each schema change.
- Scripts idempotent and reversible.
- Always dry-run first.
- Keep before/after snapshots.
- Rollback plan mandatory.
- Test in staging before production.

---

## Validation and Testing

- TypeScript strict mode required.
- ESLint and Prettier enforced.
- Unit tests for GROQ queries.
- Schema compile test in CI.
- End-to-end preview test with Playwright.
- Seed dataset for smoke testing.
- 100% CI pass required before merge.
- **Generate and commit TypeScript types with `sanity codegen`.**  
  Validate query output against generated types.  
  CI must fail on type mismatch.

---

## CI/CD and Deployment

- CI runs lint, typecheck, build, test, Lighthouse SEO.
- Dataset promotion via `sanity dataset export/import`.
- No manual edits in production dataset.
- Environments: dev, staging, production.
- Webhooks revalidate on publish, delete, slug change.
- ISR TTLs tuned per route.
- CI fails on schema or query breakage.
- Deploy only after full test and validation pass.

---

## Monitoring and Reliability

- Webhook retries with exponential backoff.
- Revalidate queue with failure logging.
- Log GROQ latency and asset errors.
- Alerts for webhook or export failures.
- Nightly dataset backups retained 30 days.
- Schema drift notifications.
- **Weekly dataset verification:** re-import latest backup into staging to validate dataset integrity and schema parity.

---

## Performance Standards

- GROQ queries resolve <200ms.
- Projections under 20 fields.
- No unfiltered fetches.
- Cached builds where safe.
- Image payloads <1MB.
- Track latency metrics.

---

## Access Control

- Roles: Author, Editor, Admin, Developer.
- Field visibility by role.
- Desk filtered by role.
- Publish gates enforce validation.
- Content freeze before release.
- No write access to prod for authors.

---

## Documentation and Playbooks

- Maintain `/docs/playbooks/` for modeling, preview, migration, release, rollback.
- README includes setup and environment.
- New dev productive within 1 hour.
- Inline comments for all schema and queries.
- Maintain changelog for schemaVersion and dataset promotions.

---

## File Structure

```
/sanity
  /schemaTypes
    index.ts
    seo.ts
    siteSettings.ts
    service.ts
    location.ts
    serviceLocation.ts
  /deskStructure.ts
  /components/inputs
  /components/previews
/lib
  sanity.client.ts
  sanity.image.ts
  queries.ts
/app
  api/preview/route.ts
  api/revalidate/route.ts
  sitemap.ts
/scripts
  migrate.ts
  import.ts
  export.ts
/tests
  groq.spec.ts
  schema.spec.ts
/docs
  playbooks/
```

---

## Quality Checklist

- No TypeScript errors.
- Studio loads clean.
- All fields validated.
- Queries exact and typed.
- Previews fast and accurate.
- Unique SEO tags.
- Webhooks pass end-to-end.
- Backups valid.
- CORS locked.
- CI green.
- Author workflow simple.

---

## Stretch Capabilities

- Auto-generate schema docs.
- GROQ performance analyzer bot.
- Image policy enforcer.
- Governance dashboard.
- GBP sync for local businesses.
- AI SEO assistant.
- Migration diff visualizer.

---

## Writing Sanity Content for Importing

When asked to write content:

- ✅ **ONLY** use the existing schema types registered in the Studio configuration
- ✅ **ALWAYS** write content as an `.ndjson` file at the root of the project
- ✅ **NEVER** write a script to write the file, just write the file directly
- ✅ **IMPORT** `.ndjson` files using the CLI command: `npx sanity dataset import <filename.ndjson>`
- ✅ **NEVER** include a `.` in the `_id` field of a document unless you need it to be private
- ✅ **NEVER** include image references because you don't know what image documents exist
- ✅ **ALWAYS** write images in this format, replacing the document ID value to generate the same placeholder image:

```json
{
  "_type": "image",
  "_sanityAsset": "image@https://picsum.photos/seed/DOCUMENT_ID/1920/1080"
}
```

---

## TypeScript Type Generation and Type Safety (ZERO TOLERANCE)

**CRITICAL**: All GROQ query results MUST be properly typed. See `.claude/typescript-standards-enforcer.md`.

### Type Generation Rules

- ✅ **ONLY** write Types for responses if you cannot generate them with Sanity TypeGen
- ✅ **ALWAYS** export schema types first from inside Studio codebase: `npx sanity@latest typegen generate`
- ✅ **ALWAYS** move that schema extraction file to the root of a front-end project before running `npx sanity@latest typegen generate` again
- ✅ Generate and commit TypeScript types with `sanity codegen`
- ✅ Validate query output against generated types
- ✅ CI must fail on type mismatch

### Type Extraction from GROQ Query Results

**CRITICAL**: Extract types from generated `sanity.types.ts`, NEVER write custom types manually.

**Common Type Extraction Patterns:**

```typescript
// ✅ CORRECT - Extract from generated query result type
import type { PAGE_QUERYResult } from '@/sanity.types';

// Extract block union from query result
type Block = NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number];

// Extract specific block type using Extract<>
type Hero1Block = Extract<Block, { _type: 'hero-1' }>;
type SplitRow = Extract<Block, { _type: 'split-row' }>;

// Extract array item type from parent block
type SplitColumn = NonNullable<NonNullable<SplitRow['splitColumns']>[number]>;

// Extract specific column type
type SplitContent = Extract<SplitColumn, { _type: 'split-content' }>;
```

**Wrong Patterns to Avoid:**

```typescript
// ❌ WRONG - Writing custom types manually
type Hero1Block = {
  _type: 'hero-1';
  heading: string;
  // ... manually typed fields
};

// ❌ WRONG - Using any
type Block = any;

// ❌ WRONG - Not using Extract to narrow unions
type Hero1Block = Block; // Still a union, not narrowed!
```

### Reference vs Expanded Object Types

**CRITICAL**: Sanity references use `_ref`, expanded objects use `_id`.

```typescript
// ✅ CORRECT - Checking reference
if (service.image?.asset?._ref) {
  const imageUrl = urlFor(service.image).url();
}

// ❌ WRONG - Using _id on reference
if (service.image?.asset?._id) {
  // Error: _id doesn't exist on reference
  // ...
}
```

### Null vs Undefined in Sanity Types

**CRITICAL**: Sanity returns `| null`, Next.js APIs expect `| undefined`. Coalesce at API boundaries.

```typescript
// ✅ CORRECT - Coalescing null to undefined
import type { Metadata } from 'next';
import type { SERVICE_QUERYResult } from '@/sanity.types';

export async function generateMetadata({ params }): Promise<Metadata> {
  const service = await client.fetch<SERVICE_QUERYResult>(SERVICE_QUERY, {
    slug: params.serviceSlug,
  });

  if (!service) return {};

  return {
    title: service.meta_title || service.name || 'Service', // Coalesce null
    description: service.meta_description || '',
    openGraph: service.ogImage
      ? {
          title: service.meta_title || service.name || 'Service',
        }
      : undefined, // Use undefined for optional objects
  };
}

// ❌ WRONG - Passing null types to Next.js APIs
return {
  title: service.meta_title, // Error: string | null not assignable to string | undefined
};
```

### GROQ Query Projection Rules

**CRITICAL**: Only access properties that are explicitly projected in GROQ queries.

```typescript
// ✅ CORRECT - Query projects resolvedLink
const LINKS_QUERY = groq`*[_type == "link"]{
  _id,
  _type,
  title,
  "resolvedLink": select(
    defined(internalLink) => internalLink->slug.current,
    defined(externalLink) => externalLink
  )
}`;

// In component: only access projected fields
{links.map(link => (
  <a href={link.resolvedLink}>{link.title}</a>
))}

// ❌ WRONG - Accessing non-projected fields
{links.map(link => (
  <a href={link.internalLink?.slug?.current}>  // Error: internalLink not projected
    {link.title}
  </a>
))}
```

### Type Safety Checklist

Before completing any Sanity-related task:

1. [ ] Run `pnpm sanity typegen` after schema changes
2. [ ] Verify all GROQ queries are properly typed with generated types
3. [ ] Check that components only access projected fields
4. [ ] Use Extract<> and NonNullable<> for type narrowing
5. [ ] Coalesce null to undefined at API boundaries
6. [ ] Run `pnpm typecheck` - must pass with 0 errors
7. [ ] Test queries in Vision tool
8. [ ] Commit generated sanity.types.ts

---

## Project-Specific Requirements: Budds Plumbing Platform

### Document Schemas Required

**Phase 1 Core Schemas:**

1. **service** (`/sanity/schemas/documents/service.ts`)
   - Icon: `Wrench` from lucide-react
   - Groups: content, seo, sections
   - Fields: name, slug, headline, introCopy, body, faqs (array refs), testimonials (array refs), seo (object), sections (array of blocks)
   - Preview: Show service name and headline
   - Validation: name required, slug unique

2. **location** (`/sanity/schemas/documents/location.ts`)
   - Icon: `MapPin` from lucide-react
   - Groups: content, seo, sections
   - Fields: name, slug, aboutLocation, coverageAreas (array of strings), operatingHours, phoneNumber, image (with hotspot), seo, sections
   - Preview: Show location name and coverage areas

3. **service-location** (`/sanity/schemas/documents/service-location.ts`)
   - Icon: `MapPinned` from lucide-react
   - Groups: references, content, seo, sections
   - Fields: service (reference), location (reference), slug, headline (optional override), introCopy (optional override), body (optional override), whyUsBullets (array of strings), localTestimonials (array refs), seo, sections
   - Preview: Show computed title `"${service.name} in ${location.name}"`
   - Validation: Ensure service + location combination is unique

4. **siteSettings** (extend existing)
   - Add business info group: businessName, phoneNumber, email, address (object), businessHours, emergencyAvailable, licenseNumber, insuranceInfo
   - Add service areas group: serviceRadius, primaryServiceArea

### Required GROQ Queries

- `SERVICE_QUERY`, `SERVICES_QUERY`, `SERVICES_SLUGS_QUERY`
- `LOCATION_QUERY`, `LOCATIONS_QUERY`, `LOCATIONS_SLUGS_QUERY`
- `SERVICE_LOCATION_QUERY` (with dereferenced service and location)
- All queries must include sections with block composition patterns

### Roadmap Compliance

- ✅ Follow Budds Plumbing Roadmap v3 strictly (20 tasks, sequential)
- ✅ **NO TASK MAY BEGIN UNTIL PREVIOUS TASK IS COMPLETE**
- ✅ Definition of Complete: Code merged to main, lint passes, typecheck passes, build passes, QA verified, documentation updated
- ✅ After every schema change: run `npm run typegen` and commit generated types

---

## Definition of Done

- Schemas compiled and validated
- All schemas follow Schema UI Starter rules (defineType, icons, groups, preview)
- Pages render from GROQ only
- GROQ queries use modular composition with fragments
- Unique metadata everywhere
- Live previews isolated
- Dataset secure and backed up
- CI green across envs
- Authoring fast and safe
- Weekly dataset verification complete
- Type parity confirmed
- TypeGen runs without errors
- All queries tested in Vision
- Score = 100/100

---

## Emergency Violations Detection

If you detect ANY of these violations, **STOP IMMEDIATELY** and refuse to proceed:

### Schema and Studio Violations

❌ Creating schema without `defineType`/`defineField`
❌ Missing icon from lucide-react
❌ Missing preview property
❌ Boolean field instead of string with options.list
❌ Single reference instead of array of references
❌ Image without hotspot
❌ GROQ query without SCREAMING_SNAKE_CASE
❌ GROQ query with string interpolation instead of parameters
❌ Missing `@sanity-typegen-ignore` on block query fragments
❌ Starting a new task before previous task is complete
❌ Skipping TypeGen after schema changes

### TypeScript Violations (ZERO TOLERANCE)

❌ Using `any` type for GROQ query results
❌ Writing custom types instead of extracting from generated `sanity.types.ts`
❌ Not using Extract<> to narrow discriminated unions
❌ Not using NonNullable<> to unwrap optional types
❌ Accessing fields not projected in GROQ queries
❌ Using `_id` when should use `_ref` on references
❌ Passing Sanity `| null` types to Next.js APIs without coalescing
❌ Not running `pnpm sanity typegen` after schema changes
❌ Not running `pnpm typecheck` before completing task
❌ Using `@ts-ignore` to suppress type errors

**MANDATORY VALIDATION BEFORE TASK COMPLETION**:

```bash
# All must pass with zero errors/warnings
pnpm sanity typegen  # Generate types after schema changes
pnpm typecheck       # 0 errors
pnpm lint            # 0 warnings
pnpm build           # Successful build
```

**Your job is to enforce these rules with ABSOLUTE STRICTNESS.**

See `.claude/typescript-standards-enforcer.md` for comprehensive TypeScript rules and patterns.
