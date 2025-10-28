# Local Business Platform — Roadmap v3

**Version:** 3.0  
**Author:** Jagpal Kooner  
**Status:** Build-Ready  
**Date:** October 2025

---

## Core Rule

**No task or phase may begin until the previous one is complete, tested, and deployed to the main branch.**  
Completion means:

- ✅ Code merged to main
- ✅ Lint, TypeScript, and build checks pass
- ✅ QA verification (manual or automated)
- ✅ Documentation updated

---

## PHASE 1 — CORE PLATFORM (Single Business Foundation)

**Goal:**  
Create one production-grade, SEO-optimized local business site built from reusable Sanity sections and shared code.

### 1. Repository Setup

- Create **monorepo structure:**
  ```
  /apps/web
  /apps/studio
  /packages/ui
  /packages/schemas
  /scripts
  ```
- Initialize **pnpm workspaces** and **turbo.json** for builds.
- Configure **ESLint**, **Prettier**, **TypeScript**, **Husky** pre-commit checks.

### 2. ShadcnBlocks Integration

- Add ShadcnBlocks into `/apps/web` and `/apps/studio`.
- Ensure `page.sections[]` renders dynamically via `SectionRenderer`.
- Validate: non-dev user can reorder and edit sections.

### 3. Design System Setup

- Configure Tailwind with design tokens, spacing, typography, and color variables.
- Verify visual consistency across all UI blocks.
- Define and document token usage in `/packages/ui/README.md`.

### 4. Sanity Block Variant Fields

- Add `variant` field to each block schema (hero, testimonial, FAQ, CTA, pricing).
- Use dropdowns for predefined variants.
- Validate type safety via generated types.

### 5. Frontend Variant Registries

- Create component registries:
  ```
  heroRegistry
  testimonialRegistry
  pricingRegistry
  faqRegistry
  ctaRegistry
  ```
- Each maps `variant` → React component.
- Test rendering logic through SectionRenderer.

### 6. Section Renderer

- Create central `SectionRenderer.tsx` that loops `sections[]` and renders by `_type` and `variant`.
- Add error boundary for unknown variants.
- Validate with 3+ block types.

### 7. Service Schema

- Create `service` document schema with:
  - `name`, `slug`, `headline`, `introCopy`, `body`, `faqs`, `testimonials`, `seo`, `sections[]`.
- Add Zod validation and TypeScript types.

### 8. Location Schema

- Create `location` document schema with:
  - `name`, `slug`, `aboutLocation`, `coverageAreas`, `operatingHours`, `phoneNumber`, `seo`, `sections[]`.

### 9. Service + Location Schema

- Create `serviceLocationPage` schema with:
  - `service` ref, `location` ref, `slug`, `headline`, `introCopy`, `body`, `whyUsBullets[]`, `seo`, `sections[]`.
- Add computed title: `${service.name} in ${location.name}`.

### 10. Site Settings Schema

- Add singleton `siteSettings` schema with:
  - business info, address, phone, email, brand colors, logo, emergency availability.

### 11. SEO Utility

- Create shared SEO util:
  - builds `<title>`, `<meta>`, canonical, JSON-LD for LocalBusiness, FAQ, Breadcrumbs.
- Validate with Lighthouse SEO score = 100.

### 12–14. Dynamic Routing

- `/services/[serviceSlug]` → fetch service
- `/locations/[locationSlug]` → fetch location
- `/[serviceSlug]/in/[locationSlug]` → fetch serviceLocationPage
- Validate ISR builds all routes successfully.

### 15. Fallback Logic

- Fallback: missing serviceLocation fields → use service defaults.
- No render breakage allowed.

### 16. NOINDEX Support

- Add boolean `noindex` to `seo` object.
- Inject `<meta name="robots" content="noindex,nofollow">` if true.

### 17. Sitemap Generator

- Generate `sitemap.xml` from service, location, serviceLocationPage slugs.

### 18. Performance Guardrails

- Add **Lighthouse**, **TypeScript**, **ESLint**, and **Prettier** checks.
- Block merge if any fail.

### 19. Deployment

- Deploy single site to **Vercel** with dataset hardcoded in `.env`.
- Confirm all dynamic routes render and revalidate correctly.

### 20. Editor Workflow Validation

- Editor must be able to edit hero text, reorder sections, change variant, and publish updates.
- Confirm live deployment updates instantly.

✅ **Phase 1 Complete When:**  
Working production-grade single client site built, tested, and deployed.
