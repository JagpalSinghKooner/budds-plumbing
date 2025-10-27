# Budds Plumbing - Structured Development Roadmap

**Version:** 3.0
**Author:** Jagpal Kooner
**Status:** Build-Ready
**Date:** October 2025
**Architecture:** Schema UI Starter (Composable Block-Based)

---

## CRITICAL RULE: ONE TASK AT A TIME

**NO task may begin until the previous task is complete, tested, and merged to main.**

### Definition of "Complete":
- ✅ Code written and working locally
- ✅ All TypeScript errors resolved (`npm run typecheck`)
- ✅ All ESLint errors resolved (`npm run lint`)
- ✅ Build passes successfully (`npm run build`)
- ✅ Manual QA verification completed
- ✅ Code committed to main branch
- ✅ Documentation updated if needed

### Workflow Per Task:
1. **Read the task requirements**
2. **Plan the implementation** (use TodoWrite tool if multi-step)
3. **Write the code** following Schema UI rules
4. **Test locally** - verify it works
5. **Run checks** - typecheck, lint, build
6. **Commit to main** - only when all checks pass
7. **Mark task complete** - move to next task

---

## PHASE 1: CORE PLATFORM (Local Business Foundation)

**Goal:** Create a production-grade local business website using Schema UI's composable block system, adding service/location functionality while preserving all existing blocks and architecture.

---

## TASK 1: Service Document Schema

**Status:** PENDING
**Dependencies:** None
**Estimated Time:** 30 minutes

### Requirements:
Create a new `service` document type that follows all Schema UI rules.

### File to Create:
`/sanity/schemas/documents/service.ts`

### Schema UI Rules to Follow:
- ✅ Use `defineType` and `defineField` helper functions
- ✅ Include an appropriate icon from `lucide-react` (suggest: `Wrench` or `Tool`)
- ✅ Include `preview` property with rich contextual details
- ✅ Use `groups` to organize fields (Content, SEO, Sections)
- ✅ Only use `name` attribute unless `title` needs to differ
- ✅ Include brief `description` values for non-obvious fields
- ✅ Include validation with clear error messages
- ✅ Fields ordered from most important to least used

### Schema Structure:
```typescript
{
  name: "service",
  type: "document",
  icon: Wrench, // from lucide-react
  groups: [
    { name: "content", title: "Content", icon: FileText, default: true },
    { name: "seo", title: "SEO", icon: Search },
    { name: "sections", title: "Page Sections", icon: LayoutGrid }
  ],
  fields: [
    // Content Group
    - name (string, required, unique slug)
    - slug (slug, required, validation)
    - headline (string, short description)
    - introCopy (text, 1-2 paragraphs)
    - body (block-content, rich text)
    - faqs (array of references to faq documents)
    - testimonials (array of references to testimonial documents)

    // SEO Group
    - seo (object with meta_title, meta_description, noindex boolean)

    // Sections Group
    - sections (array of all existing Schema UI blocks)
  ],
  preview: {
    // Show service name and headline
  }
}
```

### Testing Checklist:
- [ ] Schema file created in correct location
- [ ] Imported in `/sanity/schema.ts`
- [ ] TypeGen runs without errors: `npm run typegen`
- [ ] Service document appears in Sanity Studio with "+ Create"
- [ ] Can create and publish a test service document
- [ ] All fields render correctly in Studio
- [ ] Groups organize fields properly
- [ ] Preview shows service name

### Validation:
```bash
npm run typecheck  # Must pass
npm run lint       # Must pass
npm run typegen    # Must generate new types
```

### Commit Message:
```
Add service document schema

- Create service.ts following Schema UI patterns
- Include content, SEO, and sections groups
- Add validation and preview configuration
- Register in schema.ts

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## TASK 2: Location Document Schema

**Status:** PENDING
**Dependencies:** Task 1 complete
**Estimated Time:** 30 minutes

### Requirements:
Create a new `location` document type for service areas/cities.

### File to Create:
`/sanity/schemas/documents/location.ts`

### Schema UI Rules to Follow:
- Same rules as Task 1

### Schema Structure:
```typescript
{
  name: "location",
  type: "document",
  icon: MapPin, // from lucide-react
  groups: [
    { name: "content", title: "Content", icon: FileText, default: true },
    { name: "seo", title: "SEO", icon: Search },
    { name: "sections", title: "Page Sections", icon: LayoutGrid }
  ],
  fields: [
    // Content Group
    - name (string, city/area name)
    - slug (slug, required)
    - aboutLocation (text, description of area)
    - coverageAreas (array of strings, neighborhoods/zones)
    - operatingHours (object with day/time fields or text)
    - phoneNumber (string)
    - image (image with hotspot, alt text)

    // SEO Group
    - seo (object)

    // Sections Group
    - sections (array of blocks)
  ],
  preview: {
    // Show location name and coverage areas
  }
}
```

### Testing Checklist:
- [ ] Schema file created
- [ ] Imported in schema.ts
- [ ] TypeGen runs successfully
- [ ] Location document appears in Studio
- [ ] Can create and publish test location
- [ ] All fields functional
- [ ] Preview displays correctly

### Validation:
Same as Task 1

---

## TASK 3: Service-Location Page Schema

**Status:** PENDING
**Dependencies:** Tasks 1 & 2 complete
**Estimated Time:** 45 minutes

### Requirements:
Create a `service-location` document that combines service + location with unique content.

### File to Create:
`/sanity/schemas/documents/service-location.ts`

### Schema Structure:
```typescript
{
  name: "service-location",
  type: "document",
  icon: MapPinned, // from lucide-react
  groups: [
    { name: "references", title: "Service & Location", icon: Link, default: true },
    { name: "content", title: "Content", icon: FileText },
    { name: "seo", title: "SEO", icon: Search },
    { name: "sections", title: "Page Sections", icon: LayoutGrid }
  ],
  fields: [
    // References Group
    - service (reference to service, required)
    - location (reference to location, required)
    - slug (computed or manual: "service-slug-in-location-slug")

    // Content Group (optional overrides)
    - headline (string, optional override)
    - introCopy (text, optional override)
    - body (block-content, optional override)
    - whyUsBullets (array of strings)
    - localTestimonials (array refs, optional override)

    // SEO Group
    - seo (object with computed defaults)

    // Sections Group
    - sections (array of blocks)
  ],
  preview: {
    // Show computed title: "${service.name} in ${location.name}"
  }
}
```

### Special Requirements:
- Add validation to ensure service + location combination is unique
- Computed title in preview should dereference service and location

### Testing Checklist:
- [ ] Schema created and registered
- [ ] Can select service reference
- [ ] Can select location reference
- [ ] Preview shows computed title
- [ ] Unique validation works
- [ ] TypeGen completes

---

## TASK 4: Enhanced Site Settings Schema

**Status:** PENDING
**Dependencies:** None (can run parallel to Tasks 1-3)
**Estimated Time:** 20 minutes

### Requirements:
Extend existing `/sanity/schemas/documents/settings.ts` with business-specific fields.

### Fields to Add:
```typescript
// Business Information group
- businessName (string)
- phoneNumber (string)
- email (string)
- address (object: street, city, state, zip)
- businessHours (array of objects: day, open, close)
- emergencyAvailable (boolean or string with options)
- licenseNumber (string)
- insuranceInfo (text)

// Service Areas group
- serviceRadius (number in miles)
- primaryServiceArea (string)
```

### Schema UI Rules:
- Use `groups` to organize (don't mix with existing groups)
- Add icons to new groups
- Use `fieldsets` with `options: {columns: 2}` for related fields like address
- Avoid boolean fields - use string with options.list

### Testing:
- [ ] Fields added to existing settings
- [ ] Studio shows new groups
- [ ] Can save and publish settings
- [ ] TypeGen updates

---

## TASK 5: Service GROQ Query

**Status:** PENDING
**Dependencies:** Task 1 complete
**Estimated Time:** 30 minutes

### Requirements:
Create GROQ queries for service documents following Schema UI query patterns.

### Files to Create:
`/sanity/queries/service.ts`

### Query Pattern (Schema UI Rules lines 262-375):
```typescript
import { groq } from "next-sanity";

// Individual service query
export const SERVICE_QUERY = groq`*[
  _type == "service" &&
  slug.current == $slug
][0]{
  _id,
  _type,
  name,
  slug,
  headline,
  introCopy,
  body,
  faqs[]->{
    _id,
    question,
    answer
  },
  testimonials[]->{
    _id,
    name,
    role,
    content,
    image{
      ...,
      asset->{
        _id,
        url,
        metadata {
          lqip,
          dimensions { width, height }
        }
      }
    }
  },
  seo,
  sections[]{
    // Import all block query fragments
  }
}`;

// All services list query
export const SERVICES_QUERY = groq`*[
  _type == "service" &&
  defined(slug)
] | order(name asc){
  _id,
  name,
  slug,
  headline
}`;

// Service slugs for static generation
export const SERVICES_SLUGS_QUERY = groq`*[
  _type == "service" &&
  defined(slug)
]{
  "slug": slug.current
}`;
```

### Schema UI Query Rules:
- ✅ SCREAMING_SNAKE_CASE for variable names
- ✅ Import `groq` function from `next-sanity`
- ✅ Each segment on its own line
- ✅ Use parameters, never string interpolation
- ✅ Include asset metadata for images
- ✅ Compose sections from existing block query fragments

### Testing:
- [ ] Queries file created
- [ ] Can fetch service in Sanity Vision
- [ ] Image metadata included
- [ ] TypeGen generates types for queries

---

## TASK 6: Location GROQ Query

**Status:** PENDING
**Dependencies:** Task 2 complete
**Estimated Time:** 20 minutes

### Requirements:
Create GROQ queries for location documents (same pattern as Task 5).

### Files to Create:
`/sanity/queries/location.ts`

### Queries:
- LOCATION_QUERY (single location by slug)
- LOCATIONS_QUERY (all locations list)
- LOCATIONS_SLUGS_QUERY (for static generation)

### Testing:
Same as Task 5

---

## TASK 7: Service-Location GROQ Query

**Status:** PENDING
**Dependencies:** Tasks 3, 5, 6 complete
**Estimated Time:** 30 minutes

### Requirements:
Query that fetches service-location with dereferenced service and location data.

### Files to Create:
`/sanity/queries/service-location.ts`

### Special Query Requirements:
```typescript
export const SERVICE_LOCATION_QUERY = groq`*[
  _type == "service-location" &&
  service->slug.current == $serviceSlug &&
  location->slug.current == $locationSlug
][0]{
  _id,
  _type,
  slug,
  headline,
  introCopy,
  body,
  whyUsBullets,
  localTestimonials[]->{...},
  seo,

  // Dereference service
  service->{
    _id,
    name,
    slug,
    headline,
    introCopy,
    body,
    faqs[]->{...},
    testimonials[]->{...}
  },

  // Dereference location
  location->{
    _id,
    name,
    slug,
    aboutLocation,
    phoneNumber,
    operatingHours
  },

  sections[]{...}
}`;
```

### Testing:
- [ ] Query fetches service-location correctly
- [ ] Service reference dereferenced
- [ ] Location reference dereferenced
- [ ] Works in Sanity Vision

---

## TASK 8: Service Dynamic Route

**Status:** PENDING
**Dependencies:** Task 5 complete
**Estimated Time:** 45 minutes

### Requirements:
Create Next.js dynamic route for individual service pages.

### Files to Create:
`/app/(main)/services/[serviceSlug]/page.tsx`

### Implementation Pattern:
Follow the same pattern as `/app/(main)/[slug]/page.tsx` (existing page route):
- Use `generateStaticParams` with SERVICES_SLUGS_QUERY
- Fetch data with SERVICE_QUERY
- Render sections with existing SectionRenderer
- Add SEO metadata with `generateMetadata`
- Include LocalBusiness JSON-LD

### Code Structure:
```typescript
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { SERVICE_QUERY, SERVICES_SLUGS_QUERY } from "@/sanity/queries/service";
// Import SectionRenderer and other components

export async function generateStaticParams() {
  const services = await client.fetch(SERVICES_SLUGS_QUERY);
  return services.map((service) => ({
    serviceSlug: service.slug,
  }));
}

export async function generateMetadata({ params }) {
  // Fetch service and generate metadata
}

export default async function ServicePage({ params }) {
  const service = await client.fetch(SERVICE_QUERY, {
    slug: params.serviceSlug,
  });

  if (!service) notFound();

  return (
    <>
      {/* Render sections */}
      {/* Add JSON-LD */}
    </>
  );
}
```

### Testing:
- [ ] Route accessible at `/services/[slug]`
- [ ] Static generation works
- [ ] 404 for invalid slugs
- [ ] Sections render correctly
- [ ] SEO metadata present
- [ ] Build completes: `npm run build`

---

## TASK 9: Location Dynamic Route

**Status:** PENDING
**Dependencies:** Task 6 complete
**Estimated Time:** 30 minutes

### Requirements:
Create dynamic route for location pages (same pattern as Task 8).

### Files to Create:
`/app/(main)/locations/[locationSlug]/page.tsx`

### Testing:
Same as Task 8

---

## TASK 10: Service-Location Dynamic Route

**Status:** PENDING
**Dependencies:** Task 7 complete
**Estimated Time:** 60 minutes

### Requirements:
Create nested dynamic route for service + location combination pages.

### Files to Create:
`/app/(main)/services/[serviceSlug]/in/[locationSlug]/page.tsx`

### Special Requirements:
- Generate static params for all service-location combinations
- Implement fallback logic: if field missing in service-location, use service default
- Handle missing service-location gracefully

### Fallback Logic Example:
```typescript
const headline = serviceLocation.headline || service.headline;
const introCopy = serviceLocation.introCopy || service.introCopy;
const sections = serviceLocation.sections?.length > 0
  ? serviceLocation.sections
  : service.sections;
```

### Testing:
- [ ] Route works at `/services/[service]/in/[location]`
- [ ] Static generation for all combinations
- [ ] Fallback logic works
- [ ] No render breakage with missing fields
- [ ] Build completes

---

## TASK 11: SEO Utility Functions

**Status:** PENDING
**Dependencies:** Tasks 8, 9, 10 complete
**Estimated Time:** 90 minutes

### Requirements:
Create shared SEO utilities for metadata and JSON-LD.

### Files to Create:
`/lib/seo.ts`

### Functions to Implement:
```typescript
// Generate Next.js metadata
export function generateSEOMetadata(config: {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
  ogImage?: string;
}): Metadata;

// Generate LocalBusiness JSON-LD
export function generateLocalBusinessSchema(business: {
  name: string;
  address: Address;
  phone: string;
  hours: BusinessHours[];
  image?: string;
}): WithContext<LocalBusiness>;

// Generate FAQ JSON-LD
export function generateFAQSchema(faqs: FAQ[]): WithContext<FAQPage>;

// Generate Breadcrumbs JSON-LD
export function generateBreadcrumbSchema(crumbs: Breadcrumb[]): WithContext<BreadcrumbList>;
```

### Schema.org Types:
Use proper TypeScript types for all JSON-LD objects.

### Testing:
- [ ] Functions export correctly
- [ ] Metadata validates with Next.js
- [ ] JSON-LD validates with Google Rich Results Test
- [ ] Lighthouse SEO score = 100

---

## TASK 12: Sitemap Generator

**Status:** PENDING
**Dependencies:** Tasks 8, 9, 10 complete
**Estimated Time:** 30 minutes

### Requirements:
Extend existing `/app/sitemap.ts` to include service, location, and service-location routes.

### Implementation:
```typescript
import { client } from "@/sanity/client";
import { SERVICES_SLUGS_QUERY } from "@/sanity/queries/service";
import { LOCATIONS_SLUGS_QUERY } from "@/sanity/queries/location";
// Import service-location slugs query

export default async function sitemap() {
  const [services, locations, serviceLocations] = await Promise.all([
    client.fetch(SERVICES_SLUGS_QUERY),
    client.fetch(LOCATIONS_SLUGS_QUERY),
    client.fetch(SERVICE_LOCATIONS_SLUGS_QUERY),
  ]);

  return [
    // Existing pages
    ...existingSitemap,

    // Service pages
    ...services.map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: new Date(),
    })),

    // Location pages
    ...locations.map((l) => ({
      url: `${baseUrl}/locations/${l.slug}`,
      lastModified: new Date(),
    })),

    // Service-Location pages
    ...serviceLocations.map((sl) => ({
      url: `${baseUrl}/services/${sl.serviceSlug}/in/${sl.locationSlug}`,
      lastModified: new Date(),
    })),
  ];
}
```

### Testing:
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] All routes included
- [ ] Valid XML format
- [ ] Build includes sitemap

---

## TASK 13: NOINDEX Support

**Status:** PENDING
**Dependencies:** Task 11 complete
**Estimated Time:** 15 minutes

### Requirements:
Ensure SEO utility respects `noindex` boolean in seo object.

### Implementation:
Update `generateSEOMetadata` in `/lib/seo.ts`:
```typescript
export function generateSEOMetadata(config) {
  const metadata: Metadata = {
    title: config.title,
    description: config.description,
    // ...
  };

  if (config.noindex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}
```

### Testing:
- [ ] noindex=true adds robots meta tag
- [ ] noindex=false or undefined allows indexing
- [ ] Verify in page source

---

## TASK 14: Performance Guardrails - GitHub Actions

**Status:** PENDING
**Dependencies:** None (can run anytime)
**Estimated Time:** 45 minutes

### Requirements:
Set up CI/CD checks that block merges if checks fail.

### Files to Create:
`.github/workflows/ci.yml`

### Checks to Include:
```yaml
name: CI

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm typecheck

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000
          uploadArtifacts: true
```

### Testing:
- [ ] GitHub Actions workflow created
- [ ] All checks run on push
- [ ] Failures block merge
- [ ] Lighthouse runs successfully

---

## TASK 15: Test Content Creation

**Status:** PENDING
**Dependencies:** Tasks 1, 2, 3 complete
**Estimated Time:** 60 minutes

### Requirements:
Create test content following Schema UI content writing rules (lines 246-259).

### Files to Create:
`/test-content.ndjson`

### Content to Create:
```json
// 3 services (e.g., drain cleaning, water heater, emergency plumbing)
// 3 locations (e.g., Vancouver, Burnaby, Surrey)
// 6 service-location combinations
// 3 FAQs per service
// 3 testimonials
```

### Schema UI Rules for Content:
- ✅ Write as `.ndjson` file
- ✅ Use existing schema types only
- ✅ Never include `.` in `_id` unless private
- ✅ Never include image references (use placeholder pattern)
- ✅ Use placeholder images with document ID:
```json
{"_type":"image","_sanityAsset":"image@https://picsum.photos/seed/DOCUMENT_ID/1920/1080"}
```

### Import Command:
```bash
npx sanity dataset import test-content.ndjson production
```

### Testing:
- [ ] NDJSON file validates
- [ ] Import completes without errors
- [ ] All documents visible in Studio
- [ ] Can edit and republish
- [ ] Frontend routes display content

---

## TASK 16: Deployment to Vercel

**Status:** PENDING
**Dependencies:** All previous tasks complete
**Estimated Time:** 30 minutes

### Requirements:
Deploy to Vercel with proper configuration.

### Steps:
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables from `.env.local`:
   - NEXT_PUBLIC_SANITY_PROJECT_ID
   - NEXT_PUBLIC_SANITY_DATASET
   - NEXT_PUBLIC_SANITY_API_VERSION
   - SANITY_API_READ_TOKEN
   - NEXT_PUBLIC_SITE_URL
4. Deploy
5. Configure Sanity CORS for production URL

### Testing:
- [ ] Production build succeeds
- [ ] All routes accessible
- [ ] Static generation works
- [ ] ISR revalidation works
- [ ] Sanity Studio accessible at `/studio`
- [ ] Can edit and see changes live

---

## TASK 17: Editor Workflow Validation

**Status:** PENDING
**Dependencies:** Task 16 complete
**Estimated Time:** 30 minutes

### Requirements:
Non-technical user must be able to perform content operations.

### Test Scenarios:
1. [ ] Create new service page
2. [ ] Edit hero text on service page
3. [ ] Add new section to service page
4. [ ] Reorder sections via drag-drop
5. [ ] Change section variant
6. [ ] Publish changes
7. [ ] Verify changes appear on live site within 60 seconds

### Acceptance Criteria:
- All operations possible without code changes
- Intuitive Studio interface
- No errors during operations
- Changes reflected on frontend

---

## TASK 18: Documentation Update

**Status:** PENDING
**Dependencies:** All tasks complete
**Estimated Time:** 45 minutes

### Requirements:
Update project documentation with new features.

### Files to Update:
- `/README.md` - Add local business features section
- `/project-rules/completed-tasks.md` - List completed tasks with dates

### Documentation to Include:
- Service/Location/Service-Location schema overview
- How to add new services
- How to add new locations
- GROQ query patterns used
- SEO implementation notes
- Deployment notes

---

## TASK 19: Performance Audit

**Status:** PENDING
**Dependencies:** Task 16 complete
**Estimated Time:** 30 minutes

### Requirements:
Run comprehensive performance audit and fix issues.

### Checks:
- [ ] Lighthouse Performance score ≥ 90
- [ ] Lighthouse SEO score = 100
- [ ] Lighthouse Accessibility score ≥ 90
- [ ] Lighthouse Best Practices score ≥ 90
- [ ] Core Web Vitals passing (LCP, FID, CLS)
- [ ] No console errors
- [ ] No unused dependencies

### Tools:
- Chrome DevTools Lighthouse
- WebPageTest
- Next.js Bundle Analyzer

---

## TASK 20: Final QA & Phase 1 Completion

**Status:** PENDING
**Dependencies:** All previous tasks complete
**Estimated Time:** 60 minutes

### Requirements:
Comprehensive testing of entire system.

### Test Matrix:
| Feature | Desktop | Mobile | Status |
|---------|---------|--------|--------|
| Service pages load | | | |
| Location pages load | | | |
| Service-Location pages load | | | |
| Sections render correctly | | | |
| Forms work | | | |
| Navigation works | | | |
| SEO tags present | | | |
| JSON-LD validates | | | |
| Images load/optimized | | | |
| Studio editing works | | | |

### Final Checklist:
- [ ] All routes working
- [ ] All content editable
- [ ] All checks passing
- [ ] Documentation complete
- [ ] Code on main branch
- [ ] Deployed to production
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Build completes successfully

---

## ✅ PHASE 1 COMPLETE CRITERIA

**Phase 1 is complete when:**
1. All 20 tasks marked complete
2. Production-grade single business site deployed
3. All services, locations, and service-location pages working
4. Content editors can manage content without developer intervention
5. SEO, performance, and accessibility scores meet targets
6. All code merged to main branch
7. Documentation updated

**Then and only then, proceed to Phase 2 (Multi-Tenant Platform).**

---

## APPENDIX A: Schema UI Rules Reference

### Schema Type Best Practices:
- Use `defineType`, `defineField`, `defineArrayMember`
- Export named const matching filename
- Include icon from `lucide-react`
- Only use `name` unless `title` differs from title-case `name`
- String fields with <5 options use `options.layout: "radio"`
- Images must include `options.hotspot: true`
- Include `description` for non-obvious fields
- Include `rule.warning()` for length suggestions
- Include `rule.required().error('<Message>')` with useful errors
- Avoid `boolean` - use `string` with `options.list`
- Never single `reference` - always `array` of references
- Order fields: most important first, least used last

### Preview Best Practices:
- Every document/object has customized `preview`
- Show rich contextual details
- Use `select` to pick relevant fields
- Use `prepare` to format display

### GROQ Query Best Practices:
- SCREAMING_SNAKE_CASE for variable names
- Import `groq` from `next-sanity`
- Each filter segment on own line
- Each projection attribute on own line
- Use parameters, never string interpolation
- Include asset metadata for images
- Use modular composition with query fragments
- Annotate fragments with `@sanity-typegen-ignore` if needed

### Component Best Practices:
- Create React component for each schema type
- Use TypeScript for type safety
- Extract types from Sanity query results
- Implement `componentMap` for dynamic child rendering
- Use `stegaClean` from `next-sanity` to clean values

---

## APPENDIX B: Tech Stack

**Frontend:**
- Next.js 15.5.4
- React 19.1.1
- TypeScript 5.9.2
- Tailwind CSS 4.1.13

**CMS:**
- Sanity v4.10.0
- next-sanity 11.1.3
- @portabletext/react 4.0.3

**UI Components:**
- Radix UI primitives
- Shadcn UI patterns
- Lucide React icons
- class-variance-authority

**Package Manager:**
- pnpm

**Deployment:**
- Vercel (target platform)

---

**END OF ROADMAP**

Use this document as the single source of truth for all development work.
