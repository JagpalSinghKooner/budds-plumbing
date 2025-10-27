# Phase 1 - To-Do List

**Project:** Budds Plumbing - Local Business Platform
**Roadmap:** v3.0
**Phase:** 1 - Core Platform (Single Business Foundation)
**Status:** Ready to Start
**Date Created:** October 2025

---

## 🎯 Phase 1 Goal

Create one production-grade, SEO-optimized local business site built from reusable Sanity sections and shared code.

---

## ⚠️ CRITICAL RULE: Sequential Execution

**NO TASK MAY BEGIN UNTIL THE PREVIOUS TASK IS COMPLETE.**

### Definition of "Complete":
- ✅ Code written and working locally
- ✅ All TypeScript errors resolved (`npm run typecheck`)
- ✅ All ESLint errors resolved (`npm run lint`)
- ✅ Build passes successfully (`npm run build`)
- ✅ Manual QA verification completed
- ✅ Code committed to main branch
- ✅ Documentation updated if needed

---

## 📋 Task List (20 Tasks)

### **FOUNDATION & SETUP (Tasks 1-3)**

#### ☐ Task 1: Repository Setup
**Estimated Time:** 45 minutes
**Dependencies:** None
**Agent:** DevOps Automator / Manual

**Requirements:**
- [ ] Create monorepo structure:
  ```
  /apps/web          (Next.js frontend)
  /apps/studio       (Sanity Studio)
  /packages/ui       (Shared UI components)
  /packages/schemas  (Sanity schemas)
  /scripts           (Build/deployment scripts)
  ```
- [ ] Initialize pnpm workspaces
- [ ] Create `turbo.json` for build orchestration
- [ ] Configure `package.json` workspaces

**Validation:**
- [ ] `pnpm install` works across all workspaces
- [ ] Workspace resolution works correctly

**Commit Message:**
```
Setup monorepo structure with pnpm workspaces

- Create apps/web, apps/studio, packages/ui, packages/schemas, scripts
- Initialize pnpm workspaces
- Configure turbo.json for builds

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

#### ☐ Task 1b: Tooling Configuration
**Estimated Time:** 30 minutes
**Dependencies:** Task 1 complete
**Agent:** DevOps Automator

**Requirements:**
- [ ] Configure ESLint (`.eslintrc.json`)
- [ ] Configure Prettier (`.prettierrc`)
- [ ] Configure TypeScript (`tsconfig.json` - strict mode)
- [ ] Install and configure Husky for pre-commit checks
- [ ] Add pre-commit hook: `lint-staged` with lint + typecheck

**Validation:**
- [ ] `npm run lint` works
- [ ] `npm run typecheck` works
- [ ] Pre-commit hook blocks bad commits
- [ ] TypeScript strict mode enabled

**Commit Message:**
```
Configure ESLint, Prettier, TypeScript, Husky pre-commit checks

- Add ESLint with Next.js and TypeScript rules
- Configure Prettier with project standards
- Enable TypeScript strict mode
- Setup Husky pre-commit hooks with lint-staged

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

#### ☐ Task 2: ShadcnBlocks Integration
**Estimated Time:** 60 minutes
**Dependencies:** Task 1b complete
**Agent:** Frontend Developer Pro

**Requirements:**
- [ ] Add ShadcnBlocks into `/apps/web`
- [ ] Add ShadcnBlocks into `/apps/studio`
- [ ] Ensure `page.sections[]` renders dynamically via SectionRenderer (stub for now)
- [ ] Validate non-dev user can reorder and edit sections (basic test)

**Validation:**
- [ ] ShadcnBlocks installed and accessible
- [ ] Can import block components
- [ ] Basic section rendering works

**Commit Message:**
```
Add ShadcnBlocks integration to web and studio

- Install ShadcnBlocks in apps/web
- Install ShadcnBlocks in apps/studio
- Create basic SectionRenderer stub
- Verify section editing capability

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

#### ☐ Task 3: Design System Setup
**Estimated Time:** 45 minutes
**Dependencies:** Task 2 complete
**Agent:** Frontend Developer Pro / UI Designer

**Requirements:**
- [ ] Configure Tailwind with design tokens
- [ ] Define spacing scale
- [ ] Define typography scale
- [ ] Define color variables (primary, secondary, neutral, semantic)
- [ ] Verify visual consistency across all UI blocks
- [ ] Document token usage in `/packages/ui/README.md`

**Validation:**
- [ ] Tailwind config includes all tokens
- [ ] Design tokens documented
- [ ] Visual consistency verified

**Commit Message:**
```
Setup design system with Tailwind tokens

- Configure Tailwind with spacing, typography, color tokens
- Define design token hierarchy
- Document token usage in packages/ui/README.md
- Verify visual consistency across blocks

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### **BLOCK ARCHITECTURE (Tasks 4-6)**

#### ☐ Task 4: Sanity Block Variant Fields
**Estimated Time:** 60 minutes
**Dependencies:** Task 3 complete
**Agent:** Sanity CMS Master

**Requirements:**
- [ ] Add `variant` field to hero block schema (using defineField)
- [ ] Add `variant` field to testimonial block schema
- [ ] Add `variant` field to FAQ block schema
- [ ] Add `variant` field to CTA block schema
- [ ] Add `variant` field to pricing block schema
- [ ] Use dropdowns (`options.list`) for predefined variants
- [ ] Validate type safety via generated types

**Schema UI Rules:**
- ✅ Use `defineField` for all fields
- ✅ Include `description` for variant fields
- ✅ Use `options.layout: "radio"` if fewer than 5 variants
- ✅ Follow naming: "hero-1", "hero-2", etc.

**Validation:**
- [ ] All block schemas have variant field
- [ ] TypeGen runs without errors: `npm run typegen`
- [ ] Variants appear in Studio dropdowns

**Commit Message:**
```
Add variant fields to block schemas

- Add variant field to hero, testimonial, FAQ, CTA, pricing schemas
- Use dropdown/radio options for predefined variants
- Generate types with sanity typegen
- Validate type safety

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

#### ☐ Task 5: Frontend Variant Registries
**Estimated Time:** 75 minutes
**Dependencies:** Task 4 complete
**Agent:** Frontend Developer Pro

**Requirements:**
- [ ] Create `heroRegistry` component map
- [ ] Create `testimonialRegistry` component map
- [ ] Create `pricingRegistry` component map
- [ ] Create `faqRegistry` component map
- [ ] Create `ctaRegistry` component map
- [ ] Each maps `variant` → React component
- [ ] Test rendering logic through SectionRenderer

**Pattern:**
```typescript
const heroRegistry: {
  [K in HeroVariant]: React.ComponentType<HeroProps>;
} = {
  "hero-1": Hero1,
  "hero-2": Hero2,
  // ...
};
```

**Validation:**
- [ ] All registries created
- [ ] Type-safe variant mapping
- [ ] Test with at least 2 variants per type

**Commit Message:**
```
Create frontend variant registries for blocks

- Create heroRegistry, testimonialRegistry, pricingRegistry, faqRegistry, ctaRegistry
- Map variant strings to React components
- Implement type-safe componentMap pattern
- Test rendering with multiple variants

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

#### ☐ Task 6: Section Renderer
**Estimated Time:** 60 minutes
**Dependencies:** Task 5 complete
**Agent:** Frontend Developer Pro

**Requirements:**
- [ ] Create central `SectionRenderer.tsx`
- [ ] Loop through `sections[]` array
- [ ] Render by `_type` and `variant`
- [ ] Add error boundary for unknown variants
- [ ] Handle missing components gracefully (console.warn)
- [ ] Validate with 3+ block types

**Pattern:**
```typescript
export default function SectionRenderer({ sections }) {
  return sections.map((section) => {
    const Component = componentMap[section._type];
    if (!Component) {
      console.warn(`No component for type: ${section._type}`);
      return null;
    }
    return <Component {...section} key={section._key} />;
  });
}
```

**Validation:**
- [ ] SectionRenderer renders multiple block types
- [ ] Error boundary catches unknown variants
- [ ] Console warnings for missing components
- [ ] No runtime errors

**Commit Message:**
```
Create central SectionRenderer for dynamic block rendering

- Loop sections[] and render by _type and variant
- Add error boundary for unknown variants
- Handle missing components with console warnings
- Validate with hero, testimonial, FAQ blocks

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### **DOCUMENT SCHEMAS (Tasks 7-10)**

#### ☐ Task 7: Service Schema
**Estimated Time:** 45 minutes
**Dependencies:** Task 6 complete
**Agent:** Sanity CMS Master

**Requirements:**
- [ ] Create `/sanity/schemas/documents/service.ts`
- [ ] Use `defineType`, `defineField` helper functions
- [ ] Add icon: `Wrench` from `lucide-react`
- [ ] Add groups: content (default), seo, sections
- [ ] Add fields:
  - name (string, required, unique slug)
  - slug (slug, required, validation)
  - headline (string, short description)
  - introCopy (text, 1-2 paragraphs)
  - body (block-content, rich text)
  - faqs (array of references to faq documents)
  - testimonials (array of references to testimonial documents)
  - seo (object: meta_title, meta_description, noindex boolean)
  - sections (array of all existing Schema UI blocks)
- [ ] Add preview showing service name and headline
- [ ] Register in `/sanity/schema.ts`

**Schema UI Rules:**
- ✅ Use `defineType` and `defineField`
- ✅ Include icon from `lucide-react`
- ✅ Include customized `preview`
- ✅ Use `groups` with icons
- ✅ Arrays for references (NOT single reference)
- ✅ Include validation with error messages
- ✅ Fields ordered: most important first

**Validation:**
- [ ] Schema file created in correct location
- [ ] Imported in schema.ts
- [ ] TypeGen runs: `npm run typegen`
- [ ] Service document appears in Studio
- [ ] Can create and publish test service
- [ ] All fields render correctly
- [ ] Preview shows service name

**Commit Message:**
```
Add service document schema

- Create service.ts following Schema UI patterns
- Include content, SEO, and sections groups
- Add validation and preview configuration
- Register in schema.ts

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

#### ☐ Task 8: Location Schema
**Estimated Time:** 45 minutes
**Dependencies:** Task 7 complete
**Agent:** Sanity CMS Master

**Requirements:**
- [ ] Create `/sanity/schemas/documents/location.ts`
- [ ] Use `defineType`, `defineField` helper functions
- [ ] Add icon: `MapPin` from `lucide-react`
- [ ] Add groups: content (default), seo, sections
- [ ] Add fields:
  - name (string, city/area name, required)
  - slug (slug, required)
  - aboutLocation (text, description of area)
  - coverageAreas (array of strings, neighborhoods/zones)
  - operatingHours (object or text)
  - phoneNumber (string)
  - image (image with hotspot, alt text)
  - seo (object)
  - sections (array of blocks)
- [ ] Add preview showing location name and coverage areas
- [ ] Register in schema.ts

**Schema UI Rules:**
- ✅ Same rules as Task 7
- ✅ Image must include `options.hotspot: true`

**Validation:**
- [ ] Schema created and registered
- [ ] TypeGen runs successfully
- [ ] Location document appears in Studio
- [ ] Can create and publish test location
- [ ] Preview displays correctly

**Commit Message:**
```
Add location document schema

- Create location.ts following Schema UI patterns
- Include coverage areas, operating hours, phone
- Add image with hotspot support
- Register in schema.ts

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

#### ☐ Task 9: Service + Location Schema
**Estimated Time:** 60 minutes
**Dependencies:** Tasks 7 & 8 complete
**Agent:** Sanity CMS Master

**Requirements:**
- [ ] Create `/sanity/schemas/documents/service-location.ts`
- [ ] Add icon: `MapPinned` from `lucide-react`
- [ ] Add groups: references (default), content, seo, sections
- [ ] Add fields:
  - service (reference to service, required)
  - location (reference to location, required)
  - slug (computed or manual)
  - headline (string, optional override)
  - introCopy (text, optional override)
  - body (block-content, optional override)
  - whyUsBullets (array of strings)
  - localTestimonials (array refs, optional override)
  - seo (object with computed defaults)
  - sections (array of blocks)
- [ ] Add validation: ensure service + location combination is unique
- [ ] Add preview showing computed title: `"${service.name} in ${location.name}"`
- [ ] Register in schema.ts

**Schema UI Rules:**
- ✅ Preview must dereference service and location
- ✅ Unique validation for service + location combination

**Validation:**
- [ ] Schema created and registered
- [ ] Can select service reference
- [ ] Can select location reference
- [ ] Preview shows computed title
- [ ] Unique validation works
- [ ] TypeGen completes

**Commit Message:**
```
Add service-location document schema

- Create service-location.ts with references to service and location
- Add optional override fields (headline, introCopy, etc.)
- Implement unique validation for service + location combination
- Add computed title preview

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

#### ☐ Task 10: Site Settings Schema
**Estimated Time:** 30 minutes
**Dependencies:** Task 9 complete
**Agent:** Sanity CMS Master

**Requirements:**
- [ ] Extend existing `/sanity/schemas/documents/settings.ts`
- [ ] Add "Business Information" group with fields:
  - businessName (string)
  - phoneNumber (string)
  - email (string)
  - address (object: street, city, state, zip)
  - businessHours (array of objects: day, open, close)
  - emergencyAvailable (string with options.list, NOT boolean)
  - licenseNumber (string)
  - insuranceInfo (text)
- [ ] Add "Service Areas" group with fields:
  - serviceRadius (number in miles)
  - primaryServiceArea (string)
- [ ] Use `fieldsets` with `options: {columns: 2}` for address
- [ ] Add icons to new groups

**Schema UI Rules:**
- ✅ Use groups to organize (don't mix with existing)
- ✅ Avoid boolean fields - use string with options.list
- ✅ Use fieldsets for related fields like address

**Validation:**
- [ ] Fields added to existing settings
- [ ] Studio shows new groups
- [ ] Can save and publish settings
- [ ] TypeGen updates

**Commit Message:**
```
Extend site settings with business info and service areas

- Add Business Information group (name, phone, email, address, hours, license)
- Add Service Areas group (radius, primary area)
- Use fieldsets for address fields
- Avoid boolean fields per Schema UI rules

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### **GROQ QUERIES (Tasks 11-14 Renumbered)**

#### ☐ Task 11: SEO Utility
**Estimated Time:** 90 minutes
**Dependencies:** Task 10 complete
**Agent:** Frontend Developer Pro

**Requirements:**
- [ ] Create `/lib/seo.ts`
- [ ] Implement `generateSEOMetadata(config)` function
  - Returns Next.js Metadata object
  - Includes title, description, canonical, noindex, openGraph, twitter
- [ ] Implement `generateLocalBusinessSchema(business)` function
  - Returns LocalBusiness JSON-LD
  - Includes name, address, phone, hours, image
- [ ] Implement `generateFAQSchema(faqs)` function
  - Returns FAQPage JSON-LD
- [ ] Implement `generateBreadcrumbSchema(crumbs)` function
  - Returns BreadcrumbList JSON-LD
- [ ] Use proper TypeScript types (schema.org types)

**Validation:**
- [ ] Functions export correctly
- [ ] Metadata validates with Next.js
- [ ] JSON-LD validates with Google Rich Results Test
- [ ] Lighthouse SEO score = 100

**Commit Message:**
```
Create SEO utility functions

- Implement generateSEOMetadata for Next.js Metadata API
- Add generateLocalBusinessSchema for JSON-LD
- Add generateFAQSchema for FAQ rich results
- Add generateBreadcrumbSchema for navigation
- Include TypeScript types for all schemas

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

#### ☐ Task 12: Service Dynamic Route
**Estimated Time:** 60 minutes
**Dependencies:** Task 11 complete
**Agent:** Frontend Developer Pro + Sanity CMS Master

**Requirements:**
- [ ] Create GROQ queries in `/sanity/queries/service.ts`:
  - `SERVICE_QUERY` (fetch single service by slug)
  - `SERVICES_QUERY` (fetch all services list)
  - `SERVICES_SLUGS_QUERY` (fetch slugs for static generation)
- [ ] Create `/app/(main)/services/[serviceSlug]/page.tsx`
- [ ] Implement `generateStaticParams()` using SERVICES_SLUGS_QUERY
- [ ] Implement `generateMetadata()` using SERVICE_QUERY
- [ ] Render sections with SectionRenderer
- [ ] Add LocalBusiness JSON-LD
- [ ] Handle 404s with `notFound()`

**GROQ Rules:**
- ✅ SCREAMING_SNAKE_CASE for query names
- ✅ Use parameters (never string interpolation)
- ✅ Include asset metadata for images
- ✅ Test queries in Sanity Vision first

**Validation:**
- [ ] Route accessible at `/services/[slug]`
- [ ] Static generation works
- [ ] 404 for invalid slugs
- [ ] Sections render correctly
- [ ] SEO metadata present
- [ ] Build completes: `npm run build`

**Commit Message:**
```
Add service dynamic route with static generation

- Create SERVICE_QUERY, SERVICES_QUERY, SERVICES_SLUGS_QUERY
- Implement /services/[serviceSlug] page
- Add generateStaticParams and generateMetadata
- Render sections with SectionRenderer
- Include LocalBusiness JSON-LD

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

#### ☐ Task 13: Location Dynamic Route
**Estimated Time:** 45 minutes
**Dependencies:** Task 12 complete
**Agent:** Frontend Developer Pro + Sanity CMS Master

**Requirements:**
- [ ] Create GROQ queries in `/sanity/queries/location.ts`:
  - `LOCATION_QUERY`
  - `LOCATIONS_QUERY`
  - `LOCATIONS_SLUGS_QUERY`
- [ ] Create `/app/(main)/locations/[locationSlug]/page.tsx`
- [ ] Implement `generateStaticParams()`
- [ ] Implement `generateMetadata()`
- [ ] Render sections with SectionRenderer
- [ ] Handle 404s with `notFound()`

**Validation:**
- [ ] Route accessible at `/locations/[slug]`
- [ ] Static generation works
- [ ] 404 for invalid slugs
- [ ] Build completes

**Commit Message:**
```
Add location dynamic route with static generation

- Create LOCATION_QUERY, LOCATIONS_QUERY, LOCATIONS_SLUGS_QUERY
- Implement /locations/[locationSlug] page
- Add generateStaticParams and generateMetadata
- Render sections with SectionRenderer

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

#### ☐ Task 14: Service-Location Dynamic Route
**Estimated Time:** 90 minutes
**Dependencies:** Task 13 complete
**Agent:** Frontend Developer Pro + Sanity CMS Master

**Requirements:**
- [ ] Create GROQ query in `/sanity/queries/service-location.ts`:
  - `SERVICE_LOCATION_QUERY` (dereference service and location)
  - `SERVICE_LOCATIONS_SLUGS_QUERY` (for static generation)
- [ ] Create `/app/(main)/services/[serviceSlug]/in/[locationSlug]/page.tsx`
- [ ] Implement `generateStaticParams()` for all combinations
- [ ] Implement `generateMetadata()`
- [ ] Implement fallback logic:
  ```typescript
  const headline = serviceLocation.headline || service.headline;
  const introCopy = serviceLocation.introCopy || service.introCopy;
  const sections = serviceLocation.sections?.length > 0
    ? serviceLocation.sections
    : service.sections;
  ```
- [ ] Handle missing service-location gracefully
- [ ] No render breakage allowed

**Validation:**
- [ ] Route works at `/services/[service]/in/[location]`
- [ ] Static generation for all combinations
- [ ] Fallback logic works
- [ ] No render breakage with missing fields
- [ ] Build completes

**Commit Message:**
```
Add service-location dynamic route with fallback logic

- Create SERVICE_LOCATION_QUERY with dereferencing
- Implement /services/[service]/in/[location] page
- Add fallback logic for optional fields
- Generate static params for all combinations
- Handle missing service-location gracefully

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### **INFRASTRUCTURE (Tasks 15-18)**

#### ☐ Task 15: Fallback Logic
**Estimated Time:** 15 minutes
**Dependencies:** Task 14 complete
**Agent:** Frontend Developer Pro

**Requirements:**
- [ ] Verify fallback logic in Task 14 is comprehensive
- [ ] Test with missing headline
- [ ] Test with missing introCopy
- [ ] Test with missing sections
- [ ] Test with missing testimonials
- [ ] Ensure no render breakage

**Validation:**
- [ ] All fallback scenarios tested
- [ ] No console errors
- [ ] No undefined/null errors

**Commit Message:**
```
Verify and test fallback logic for service-location pages

- Test all fallback scenarios (headline, introCopy, sections, testimonials)
- Ensure no render breakage with missing fields
- Verify graceful degradation

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

#### ☐ Task 16: NOINDEX Support
**Estimated Time:** 20 minutes
**Dependencies:** Task 15 complete
**Agent:** Frontend Developer Pro

**Requirements:**
- [ ] Update `generateSEOMetadata` in `/lib/seo.ts`
- [ ] Check for `noindex` boolean in config
- [ ] If true, add to Next.js Metadata:
  ```typescript
  robots: {
    index: false,
    follow: false,
  }
  ```
- [ ] Test with noindex=true
- [ ] Test with noindex=false or undefined
- [ ] Verify in page source

**Validation:**
- [ ] noindex=true adds robots meta tag
- [ ] noindex=false allows indexing
- [ ] Verify in HTML source

**Commit Message:**
```
Implement NOINDEX support in SEO utility

- Add noindex boolean handling to generateSEOMetadata
- Inject robots meta tag when noindex=true
- Test both noindex states
- Verify in page source

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

#### ☐ Task 17: Sitemap Generator
**Estimated Time:** 45 minutes
**Dependencies:** Task 16 complete
**Agent:** Frontend Developer Pro

**Requirements:**
- [ ] Extend existing `/app/sitemap.ts` or create if missing
- [ ] Import SERVICES_SLUGS_QUERY
- [ ] Import LOCATIONS_SLUGS_QUERY
- [ ] Import SERVICE_LOCATIONS_SLUGS_QUERY
- [ ] Generate sitemap URLs:
  - Service pages: `/services/[slug]`
  - Location pages: `/locations/[slug]`
  - Service-Location pages: `/services/[service]/in/[location]`
- [ ] Include lastModified dates
- [ ] Include changeFrequency and priority

**Validation:**
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] All routes included
- [ ] Valid XML format
- [ ] Build includes sitemap

**Commit Message:**
```
Generate sitemap with service, location, and service-location routes

- Extend sitemap.ts to include service pages
- Add location pages to sitemap
- Add service-location combination pages
- Include lastModified and metadata

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

#### ☐ Task 18: Performance Guardrails - GitHub Actions
**Estimated Time:** 60 minutes
**Dependencies:** Task 17 complete
**Agent:** DevOps Automator

**Requirements:**
- [ ] Create `.github/workflows/ci.yml`
- [ ] Add `lint` job (runs `pnpm lint`)
- [ ] Add `typecheck` job (runs `pnpm typecheck`)
- [ ] Add `build` job (runs `pnpm build`)
- [ ] Add `lighthouse` job (runs Lighthouse CI on localhost:3000)
- [ ] Use pnpm/action-setup@v2 with version 8
- [ ] Use Node 20.x
- [ ] Configure jobs to fail on errors (block merge)

**GitHub Actions Configuration:**
```yaml
name: CI
on: [push, pull_request]
jobs:
  lint: ...
  typecheck: ...
  build: ...
  lighthouse: ...
```

**Validation:**
- [ ] GitHub Actions workflow created
- [ ] All checks run on push
- [ ] Failures block merge
- [ ] Lighthouse runs successfully

**Commit Message:**
```
Add GitHub Actions CI with performance guardrails

- Create CI workflow with lint, typecheck, build, lighthouse jobs
- Use pnpm and Node 20
- Configure to block merge on failures
- Add Lighthouse CI for performance checks

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### **DEPLOYMENT & VALIDATION (Tasks 19-20)**

#### ☐ Task 19: Deployment to Vercel
**Estimated Time:** 45 minutes
**Dependencies:** Task 18 complete
**Agent:** Project Shipper + DevOps Automator

**Requirements:**
- [ ] Push code to GitHub
- [ ] Connect repository to Vercel
- [ ] Configure environment variables:
  - NEXT_PUBLIC_SANITY_PROJECT_ID
  - NEXT_PUBLIC_SANITY_DATASET
  - NEXT_PUBLIC_SANITY_API_VERSION
  - SANITY_API_READ_TOKEN
  - NEXT_PUBLIC_SITE_URL
- [ ] Configure build settings:
  - Build command: `pnpm build`
  - Install command: `pnpm install`
  - Node version: 20.x
- [ ] Deploy to production
- [ ] Configure Sanity CORS for production URL
- [ ] Configure Sanity CORS for Vercel preview URLs

**CORS Configuration:**
1. Go to https://www.sanity.io/manage
2. Navigate to API settings
3. Add production URL: `https://your-domain.com`
4. Add preview pattern: `https://*-your-project.vercel.app`

**Validation:**
- [ ] Production build succeeds
- [ ] All routes accessible
- [ ] Static generation works
- [ ] ISR revalidation works
- [ ] Sanity Studio accessible at `/studio`
- [ ] Can edit and see changes live

**Commit Message:**
```
Deploy to Vercel with environment configuration

- Connect GitHub repository to Vercel
- Configure environment variables
- Set build settings (pnpm, Node 20)
- Configure Sanity CORS for production and previews
- Verify deployment and ISR

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

#### ☐ Task 20: Editor Workflow Validation
**Estimated Time:** 45 minutes
**Dependencies:** Task 19 complete
**Agent:** Project Shipper + Test Writer Fixer

**Requirements:**
Non-technical editor must successfully complete all operations:

1. [ ] Create new service page in Studio
2. [ ] Edit hero text on service page
3. [ ] Add new section to service page
4. [ ] Reorder sections via drag-drop
5. [ ] Change section variant (e.g., hero-1 to hero-2)
6. [ ] Publish changes
7. [ ] Verify changes appear on live site within 60 seconds

**Acceptance Criteria:**
- [ ] All operations possible without code changes
- [ ] Intuitive Studio interface
- [ ] No errors during operations
- [ ] Changes reflected on frontend via ISR
- [ ] Editor confirms workflow is smooth

**Validation:**
- [ ] Editor successfully completes all tasks
- [ ] No errors encountered
- [ ] Changes propagate to production
- [ ] ISR timing acceptable (<60s)

**Commit Message:**
```
Validate editor workflow and document results

- Test all editor operations in Sanity Studio
- Verify ISR propagation to production
- Confirm intuitive interface for non-technical users
- Document any issues or improvements needed

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## ✅ Phase 1 Completion Criteria

Phase 1 is complete ONLY when ALL of the following are true:

### Code Quality
- [ ] All 20 tasks marked complete
- [ ] All code merged to main branch
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Build passes (`npm run build`)
- [ ] All tests pass

### Deployment
- [ ] Production-grade single business site deployed to Vercel
- [ ] All services pages working
- [ ] All locations pages working
- [ ] All service-location pages working
- [ ] Sanity Studio accessible at `/studio`

### Quality Gates
- [ ] Lighthouse SEO score = 100
- [ ] Lighthouse Performance score ≥ 90
- [ ] Lighthouse Accessibility score ≥ 90
- [ ] Lighthouse Best Practices score ≥ 90
- [ ] Core Web Vitals passing:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

### Editor Experience
- [ ] Content editors can manage content without developer intervention
- [ ] Can create new pages
- [ ] Can edit existing content
- [ ] Can reorder sections
- [ ] Can change section variants
- [ ] Changes propagate to production via ISR

### Documentation
- [ ] README updated with setup instructions
- [ ] API documentation updated
- [ ] Schema documentation updated
- [ ] Deployment notes documented

---

## 🚀 Then Proceed to Phase 2

**Phase 2 Goal:** Multi-Tenant Platform (100+ datasets)

**Only start Phase 2 when Phase 1 is 100% complete.**

---

## 📝 Notes

- Each task has an estimated time, but actual time may vary
- Dependencies must be strictly followed
- Use the appropriate specialist agent for each task
- Commit messages should follow the provided templates
- Run all validation checks before marking a task complete
- Update this document as tasks are completed

---

**Last Updated:** October 2025
**Status:** Ready to Start
**Next Task:** Task 1 - Repository Setup
