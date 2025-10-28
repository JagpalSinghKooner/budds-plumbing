# CLAUDE CODE AUDIT — PHASE 1 (CORE PLATFORM)

**Source of Truth:** `roadmap-v3.md`
**Goal:** Verify that the Core Platform (single business foundation) is production-grade, error-free, secure, and aligned with roadmap-v3 before moving to Phase 2.

---

## 1. CORE VALIDATION SEQUENCE

Claude must audit in this exact order. Stop if any section fails.

### 1.1 Repository Structure & Tooling

1. Confirm monorepo structure:
   ```
   /apps/web
   /apps/studio
   /packages/ui
   /packages/schemas
   /scripts
   ```
   - All folders exist.
   - Each has a README.md explaining purpose.
   - `packages/ui` and `packages/schemas` imported via workspace alias.

2. Workspace configuration:
   - `pnpm-workspace.yaml` lists all apps/packages.
   - `turbo.json` defines pipeline: lint, typecheck, build, deploy.

3. Code quality setup:
   - ESLint and Prettier fully configured.
   - tsconfig has `"strict": true`.
   - No skipLibCheck, allowJs, or any shortcuts.
   - `pnpm typecheck` passes with zero errors.

4. Pre-commit pipeline:
   - `.husky/pre-commit` runs `pnpm typecheck`, `pnpm lint`, `pnpm format:check`.
   - No TODO disabling steps.

5. CI/CD setup:
   - `.github/workflows/ci.yml` includes TypeScript, ESLint, Prettier, Build, Lighthouse (SEO 100).
   - Build fails if Lighthouse SEO < 100 or JS bundle > 250KB.

6. Ensure zero `eslint-disable`, zero `ts-ignore`, and no “temporary fix” comments.

---

## 2. CORE PLATFORM LOGIC

### 2.1 ShadcnBlocks Integration

- `page.sections[]` renders dynamically via `SectionRenderer.tsx`.
- Editors can reorder, edit, and publish sections without code changes.
- SectionRenderer must:
  - Map `_type` + `variant` to registry.
  - Catch unknown variants (no crash).

### 2.2 Design System

- Tailwind uses tokens for color, typography, spacing.
- No inline styles or hex values.
- `/packages/ui/README.md` documents usage.

### 2.3 Schema Architecture (Lean Contract — All Content via Blocks)

**Core Rule**
- All visible content delivered through `sections[]` (blocks[]).
- Pages contain only identifiers and SEO.
- No top-level body text or hardcoded JSX copy.

#### A. service
```
name (string, required)
slug (slug, required)
seo (object, required)
sections[] (array, required)
```

#### B. location
```
name (string, required)
slug (slug, required)
seo (object, required)
sections[] (array, required)
```
- No phoneNumber (single NAP handled via siteSettings).

#### C. serviceLocationPage
```
service (reference, required)
location (reference, required)
seo (object, optional)
sections[] (array, optional)
```
- URL: `/[serviceSlug]/in/[locationSlug]`.
- No slug field.
- Computed title: `${service.name} in ${location.name}`.
- If not found → use service.sections (fallback).
- Must **never block rendering**.

#### D. siteSettings
```
businessName
phoneNumber
email
address
emergencyAvailable
defaultSeo
logo / brand
```
- Single NAP for all pages.
- No hardcoded details in React.

---

## 3. ROUTING CONTRACT

| Page | Path | Data Source | Description |
|------|------|--------------|--------------|
| Service | /services/[serviceSlug] | service | General service info |
| Location | /locations/[locationSlug] | location | Coverage area info |
| Service + Location | /[serviceSlug]/in/[locationSlug] | serviceLocationPage (+fallback) | Local SEO conversion page |

Rules:
- `/in/` is static (no standalone page).
- Redirect legacy `/locations/[location]/services/[service]` → `/[service]/in/[location]`.
- Sitemap outputs only these three URL types.
- Breadcrumb: Home > Service > Service in Location.

---

## 4. PAGE RENDER CONTRACT

### /services/[serviceSlug]
- Fetch service + siteSettings.
- Render `SectionRenderer(service.sections)`.
- SEO:
  - title = service.seo.title || service.name
  - description = service.seo.description
  - canonical = /services/[serviceSlug]
  - robots = noindex if true
- JSON-LD: Service + LocalBusiness (NAP from siteSettings)

### /locations/[locationSlug]
- Fetch location + siteSettings.
- Render `SectionRenderer(location.sections)`.
- SEO:
  - title = location.seo.title || `${siteSettings.businessName} in ${location.name}`
  - canonical = /locations/[locationSlug]
- JSON-LD: LocalBusiness (NAP from siteSettings), areaServed = location.name

### /[serviceSlug]/in/[locationSlug]
- Fetch service, location, serviceLocationPage, siteSettings.
- Render sections:
  - if serviceLocationPage.sections exist → render those.
  - else → service.sections.
- SEO:
  - title = `${service.name} in ${location.name}`
  - description = serviceLocationPage.seo.description || service.seo.description
  - canonical = /[serviceSlug]/in/[locationSlug]
- JSON-LD: LocalBusiness + BreadcrumbList.
- Page must render even if no document found (fallback).

---

## 5. SECURITY & PERFORMANCE

- `.env` never committed.
- Only NEXT_PUBLIC_ vars exposed to client.
- API routes: Zod validation + rate limiting + CSRF check.
- Await all async external calls.
- No dangerouslySetInnerHTML without sanitisation.
- No process.env in client components.
- Lighthouse SEO = 100, Performance ≥95, Bundle <250KB, LCP <2.5s, CLS <0.1.
- Use next/image with lazy loading.

---

## 6. CI/CD REQUIREMENTS

| Check | Location | Must Pass |
|--------|-----------|-----------|
| TypeScript | CI + Pre-commit | ✅ |
| ESLint | CI + Pre-commit | ✅ |
| Prettier | CI + Pre-commit | ✅ |
| Lighthouse SEO 100 | CI | ✅ |
| Bundle < 250KB | CI | ✅ |
| Build | CI | ✅ |

---

## 7. EDITOR WORKFLOW VALIDATION

- Non-dev editors can:
  - Reorder sections.
  - Change variants.
  - Publish → Live updates (ISR).
- No code deployment required for content changes.

---

## 8. FINAL BULLETPROOF CHECKLIST

- ✅ No TypeScript or lint errors.
- ✅ No eslint-disable, ts-ignore, TODO.
- ✅ siteSettings used for all business info.
- ✅ All page content via Sanity sections[].
- ✅ serviceLocationPage optional but never blocks rendering.
- ✅ Routing strictly /services/, /locations/, /[service]/in/[location].
- ✅ Fallback logic verified.
- ✅ Lighthouse SEO 100.
- ✅ Bundle <250KB.
- ✅ ISR + revalidation work on Vercel.
- ✅ Editor workflow verified.
