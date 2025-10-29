# Phase 1 Audit Findings & 100-Point Recovery Plan

## Scope & Scoring Context

- Phase 1 requires a production-grade single-tenant launch that can scale to multi-tenant without refactoring.
- SEO scope for these businesses is limited to a single **LocalBusiness** schema sourced from Sanity site settings; FAQ and other schemas are handled inside page components and are not Phase 1 blockers.
- Score target: 100/100 = every roadmap deliverable met, no hardcoded fallbacks, and multi-tenant readiness complete.

## Status by Roadmap Deliverable

- **Monorepo structure (`apps/web`, `apps/studio`, `packages/ui`, `packages/schemas`) → PARTIAL.** Skeleton exists but `packages/schemas` is still a placeholder export, so shared schemas/types are not centralized.【F:packages/schemas/index.ts†L1-L4】
- **SectionRenderer drives Shadcn blocks with variant registry → PARTIAL.** Renderer exists yet the registry map only wires six `_type` values; many blocks fall back to console warnings instead of rendering.【F:apps/web/components/SectionRenderer.tsx†L56-L151】
- **Block schemas expose `variant` control → PARTIAL.** Blocks such as `carousel-1` ship sizing/color fields but no `variant` selector, blocking registry-driven variants.【F:apps/studio/sanity/schemas/blocks/carousel/carousel-1.ts†L1-L64】
- **Service schema matches Phase 1 contract (`sections[]`, lean SEO, no legacy fields) → WRONG.** Document still uses `blocks`, requires slug/category, and stores raw meta fields instead of shared objects.【F:apps/studio/sanity/schemas/documents/service.ts†L20-L111】
- **Location schema matches contract (coverage info, sections[], fallback to site settings) → WRONG.** Schema relies on `blocks`, keeps manual slug, and lacks structured coverage/operating fields mandated in the roadmap.【F:apps/studio/sanity/schemas/documents/location.ts†L20-L93】
- **Service-location schema derives path from references (no slug) with optional sections[] → WRONG.** Schema keeps a required slug and its own `blocks` array, breaking computed routing and fallback behaviour.【F:apps/studio/sanity/schemas/documents/service-location.ts†L20-L120】
- **siteSettings centralizes NAP + default SEO used by all pages → PARTIAL.** NAP fields exist, but there is no `defaultSeo` object; pages improvise meta fallbacks and hardcode LocalBusiness data in places.【F:apps/studio/sanity/schemas/documents/settings.ts†L1-L137】
- **Dynamic routes use per-request dataset client → PARTIAL.** `/services/[slug]`, `/locations/[slug]`, and `/[service]/in/[location]` fetch with the legacy `client` tied to the default dataset, so multi-tenant isolation fails.【F:apps/web/app/(main)/services/[serviceSlug]/page.tsx†L1-L83】【F:apps/web/app/(main)/locations/[locationSlug]/page.tsx†L1-L97】【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L1-L118】
- **LocalBusiness schema generated from siteSettings for every route → PARTIAL.** Service and location routes hydrate from siteSettings, but the service-location route hardcodes NAP data and the dataset mismatch can leak another tenant’s settings.【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L136-L166】
- **sitemap.xml limited to active service/location/service-location docs per dataset → WRONG.** Sitemap uses shared `sanityFetch` (default dataset) and includes `page`/`post` docs outside Phase 1 scope.【F:apps/web/app/sitemap.ts†L1-L78】
- **Content-only fallback (no hardcoded marketing copy) → WRONG.** Routes render “Content coming soon” placeholders instead of Sanity-managed fallback sections.【F:apps/web/app/(main)/services/[serviceSlug]/page.tsx†L146-L153】【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L191-L200】【F:apps/web/app/(main)/locations/[locationSlug]/page.tsx†L148-L160】
- **CI enforcement at roadmap thresholds (SEO 100, JS bundle ≤ 250KB) → PARTIAL.** Lighthouse config relaxes SEO to 0.95 and script bundle to 400KB so regressions pass.【F:lighthouserc.js†L21-L37】
- **Middleware propagates dataset headers consumed by server components → WRONG.** Middleware sets `x-dataset` but server utilities read `x-sanity-dataset`, so dataset overrides never apply.【F:apps/web/lib/domain-middleware.ts†L162-L209】【F:apps/web/sanity/env.ts†L28-L43】
- **Legacy block map removed in favour of SectionRenderer → WRONG.** `apps/web/components/blocks/index.tsx` still duplicates rendering logic and must be deprecated.【F:apps/web/components/blocks/index.tsx†L1-L65】

## Code Errors & Architecture Drift

- **Dataset header mismatch** – Middleware writes `x-dataset` while `getDataset()` looks for `x-sanity-dataset`, forcing every request onto the default dataset and breaking tenant isolation.【F:apps/web/lib/domain-middleware.ts†L162-L209】【F:apps/web/sanity/env.ts†L28-L43】
- **Incomplete registry coverage** – SectionRenderer only maps six `_type` keys; valid blocks like `section-header`, `split-row`, `timeline-row`, and forms never render through the shared pipeline.【F:apps/web/components/SectionRenderer.tsx†L56-L151】
- **Legacy block mapper still active** – `components/blocks/index.tsx` duplicates rendering logic, ensuring future edits drift from the registry approach.【F:apps/web/components/blocks/index.tsx†L1-L65】
- **Hardcoded NAP in service-location route** – LocalBusiness schema uses literal strings for address/phone instead of siteSettings, creating data drift when details change.【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L152-L166】
- **Hardcoded “Content coming soon” copy** – Dynamic routes render inline placeholders when sections are empty, violating the “all marketing content in Sanity” rule.【F:apps/web/app/(main)/services/[serviceSlug]/page.tsx†L146-L153】【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L191-L200】【F:apps/web/app/(main)/locations/[locationSlug]/page.tsx†L148-L160】
- **Sitemap not tenant-safe** – Queries run through shared `sanityFetch`, so tenants risk leaking each other’s URLs and unsupported document types appear in the feed.【F:apps/web/app/sitemap.ts†L1-L78】

## SEO & Routing Observations (LocalBusiness Focus)

- **Canonical duplication** – Service-location content lives at both `/[service]/in/[location]` and `/locations/[location]/services/[service]`, producing duplicate canonicals and splitting authority.【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L63-L205】
- **LocalBusiness consistency gap** – Only the service-location route breaks the single-source-of-truth rule by hardcoding phone/address; service and location routes already hydrate from siteSettings.【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L152-L166】【F:apps/web/app/(main)/services/[serviceSlug]/page.tsx†L102-L125】【F:apps/web/app/(main)/locations/[locationSlug]/page.tsx†L104-L130】
- **Dataset isolation risk** – Because dataset headers are ignored, LocalBusiness schema can read another tenant’s settings during multi-tenant rollout, violating Phase 1 readiness.【F:apps/web/sanity/env.ts†L28-L43】【F:apps/web/lib/domain-middleware.ts†L162-L209】

## Schema & Content Model Gaps

- **Service document drift** – Retains category refs, manual slug, and `blocks` array instead of roadmap `sections[]` with structured intro/seo objects, complicating automation and variant fallback.【F:apps/studio/sanity/schemas/documents/service.ts†L20-L111】
- **Location document drift** – Same `blocks` pattern, no structured coverage/operating fields, and manual slug, limiting regional personalization tooling.【F:apps/studio/sanity/schemas/documents/location.ts†L20-L93】
- **Service-location document drift** – Required slug + `blocks` prevent deterministic URL computation and fallback logic across tenants.【F:apps/studio/sanity/schemas/documents/service-location.ts†L20-L120】
- **Missing block variants** – Carousel and other blocks lack `variant` dropdowns, so the editor can’t select registry presentations, undermining the “Sections[] + variant” contract.【F:apps/studio/sanity/schemas/blocks/carousel/carousel-1.ts†L1-L64】
- **No shared schema package** – With `packages/schemas` empty, there is no single source for document definitions or generated types, blocking CLI automation and reuse.【F:packages/schemas/index.ts†L1-L4】
- **Site settings without `defaultSeo`** – SEO defaults live in ad-hoc fields (`meta_description`) not defined in the schema, so pages add manual fallbacks and risk drift.【F:apps/studio/sanity/schemas/documents/settings.ts†L1-L137】【F:apps/web/app/(main)/services/[serviceSlug]/page.tsx†L47-L68】

## Technical Debt Risks Affecting Future Phases

1. **Dataset routing failure** – Without aligned headers and request-aware clients, Phase 2 multi-tenant rollouts will leak cross-client data. Fix: align header name and require `getClientForRequest()` everywhere.【F:apps/web/lib/domain-middleware.ts†L162-L209】【F:apps/web/sanity/env.ts†L28-L43】【F:apps/web/sanity/lib/client.ts†L1-L61】
2. **Duplicate service-location route** – Two URL patterns will create canonical conflicts and double maintenance. Fix: remove `/locations/[location]/services/[service]` once canonical `/[service]/in/[location]` is stable.【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L1-L205】
3. **Legacy block mapper** – As new blocks ship, developers will touch `SectionRenderer` and `components/blocks/index.tsx`, guaranteeing divergence. Fix: delete the legacy mapper after registry coverage expands.【F:apps/web/components/blocks/index.tsx†L1-L65】
4. **Schema drift** – Automation, AI content generation, and dataset provisioning scripts will fail with the current field shapes. Fix: migrate service/location/service-location documents to the roadmap contract and publish shared types.【F:apps/studio/sanity/schemas/documents/service.ts†L20-L111】【F:apps/studio/sanity/schemas/documents/location.ts†L20-L93】【F:apps/studio/sanity/schemas/documents/service-location.ts†L20-L120】
5. **Relaxed CI thresholds** – With SEO and bundle budgets loosened, regressions slip through, undermining platform guarantees. Fix: restore roadmap thresholds in Lighthouse config.【F:lighthouserc.js†L21-L37】
6. **Hardcoded marketing copy** – Inline placeholders prevent localization/AI updates and require code deploys for messaging changes. Fix: provide CMS-managed fallback sections or reuse service-level sections only.【F:apps/web/app/(main)/services/[serviceSlug]/page.tsx†L146-L153】【F:apps/web/app/(main)/locations/[locationSlug]/page.tsx†L148-L160】

## Step-by-Step Plan to Reach 100/100

1. **Unify dataset plumbing**
   - Rename middleware header to `x-sanity-dataset` (or update `getDataset` to read `x-dataset`) and refactor every server fetch to call `getClientForRequest()` or `getDefineLiveForRequest()` before querying.【F:apps/web/lib/domain-middleware.ts†L162-L209】【F:apps/web/sanity/env.ts†L28-L43】【F:apps/web/sanity/lib/client.ts†L1-L61】
   - Regression test routes to confirm tenant-specific datasets resolve.
2. **Refactor schemas to roadmap contract**
   - Move `service`, `location`, `service-location`, and `settings` schemas into `packages/schemas` with `sections[]` arrays, computed paths, and a shared `defaultSeo` object.
   - Remove manual slug on service-location, ensure service/location slug references drive the path, and generate TypeScript types for frontend consumption.【F:apps/studio/sanity/schemas/documents/service.ts†L20-L111】【F:apps/studio/sanity/schemas/documents/location.ts†L20-L93】【F:apps/studio/sanity/schemas/documents/service-location.ts†L20-L120】【F:packages/schemas/index.ts†L1-L4】
3. **Expand registry & remove legacy mapper**
   - Register every block `_type` + variant in `SectionRenderer` (hero, section-header, split, grid, carousel, timeline, forms, testimonials, etc.).
   - Once coverage is complete, delete `components/blocks/index.tsx` and update any callers to use `SectionRenderer` exclusively.【F:apps/web/components/SectionRenderer.tsx†L56-L151】【F:apps/web/components/blocks/index.tsx†L1-L65】
4. **Add `variant` dropdowns to all blocks**
   - Update block schemas (carousel, section-header, timelines, forms, CTA) to expose a `variant` field aligned with frontend registries.
   - Provide validation/defaults so editors can always select a supported variant.【F:apps/studio/sanity/schemas/blocks/carousel/carousel-1.ts†L1-L64】
5. **Centralize LocalBusiness data**
   - Extend `siteSettings` with a structured `defaultSeo` object and ensure LocalBusiness schema generation pulls address/phone/email exclusively from settings.
   - Update the service-location route to consume `siteSettings` instead of hardcoded strings and remove the duplicate `/locations/.../services/...` route.【F:apps/studio/sanity/schemas/documents/settings.ts†L1-L137】【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L136-L200】
6. **Eliminate hardcoded fallbacks**
   - Provide CMS-managed fallback sections (e.g., default hero + CTA) or reuse service-level sections when page arrays are empty.
   - Remove inline “Content coming soon” strings from every route.【F:apps/web/app/(main)/services/[serviceSlug]/page.tsx†L146-L153】【F:apps/web/app/(main)/locations/[locationSlug]/page.tsx†L148-L160】【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L191-L200】
7. **Rebuild sitemap with dataset awareness**
   - Use `getDefineLiveForRequest()` to scope queries to the incoming dataset and limit entries to active service/location/service-location documents.
   - Remove `page`/`post` queries until those content types are part of the approved roadmap.【F:apps/web/app/sitemap.ts†L1-L78】【F:apps/web/sanity/lib/live.ts†L1-L34】
8. **Restore CI guardrails**
   - Set Lighthouse SEO minimum back to 1.0, tighten bundle budget to 250KB, and ensure performance thresholds align with roadmap expectations.【F:lighthouserc.js†L21-L37】
9. **Document & automate**
   - Update project documentation to reference the shared schema package, registry usage, and dataset header contract so future phases inherit the correct patterns.
   - Add lint/test checks that fail when blocks without `variant` fields or legacy renderers are introduced.

Execute these steps in order; completing steps 1–7 removes every blocker called out in this audit and positions the platform for a true 100/100 Phase 1 sign-off.

# Phase 1 Audit Findings & 100-Point Recovery Plan

## Scope & Scoring Context

- Phase 1 requires a production-grade single-tenant launch that can scale to multi-tenant without refactoring.
- SEO scope for these businesses is limited to a single **LocalBusiness** schema sourced from Sanity site settings; FAQ and other schemas are handled inside page components and are not Phase 1 blockers.
- Score target: 100/100 = every roadmap deliverable met, no hardcoded fallbacks, and multi-tenant readiness complete.

## Status by Roadmap Deliverable

- **Monorepo structure (`apps/web`, `apps/studio`, `packages/ui`, `packages/schemas`) → PARTIAL.** Skeleton exists but `packages/schemas` is still a placeholder export, so shared schemas/types are not centralized.【F:packages/schemas/index.ts†L1-L4】
- **SectionRenderer drives Shadcn blocks with variant registry → PARTIAL.** Renderer exists yet the registry map only wires six `_type` values; many blocks fall back to console warnings instead of rendering.【F:apps/web/components/SectionRenderer.tsx†L56-L151】
- **Block schemas expose `variant` control → PARTIAL.** Blocks such as `carousel-1` ship sizing/color fields but no `variant` selector, blocking registry-driven variants.【F:apps/studio/sanity/schemas/blocks/carousel/carousel-1.ts†L1-L64】
- **Service schema matches Phase 1 contract (`sections[]`, lean SEO, no legacy fields) → WRONG.** Document still uses `blocks`, requires slug/category, and stores raw meta fields instead of shared objects.【F:apps/studio/sanity/schemas/documents/service.ts†L20-L111】
- **Location schema matches contract (coverage info, sections[], fallback to site settings) → WRONG.** Schema relies on `blocks`, keeps manual slug, and lacks structured coverage/operating fields mandated in the roadmap.【F:apps/studio/sanity/schemas/documents/location.ts†L20-L93】
- **Service-location schema derives path from references (no slug) with optional sections[] → WRONG.** Schema keeps a required slug and its own `blocks` array, breaking computed routing and fallback behaviour.【F:apps/studio/sanity/schemas/documents/service-location.ts†L20-L120】
- **siteSettings centralizes NAP + default SEO used by all pages → PARTIAL.** NAP fields exist, but there is no `defaultSeo` object; pages improvise meta fallbacks and hardcode LocalBusiness data in places.【F:apps/studio/sanity/schemas/documents/settings.ts†L1-L137】
- **Dynamic routes use per-request dataset client → PARTIAL.** `/services/[slug]`, `/locations/[slug]`, and `/[service]/in/[location]` fetch with the legacy `client` tied to the default dataset, so multi-tenant isolation fails.【F:apps/web/app/(main)/services/[serviceSlug]/page.tsx†L1-L83】【F:apps/web/app/(main)/locations/[locationSlug]/page.tsx†L1-L97】【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L1-L118】
- **LocalBusiness schema generated from siteSettings for every route → PARTIAL.** Service and location routes hydrate from siteSettings, but the service-location route hardcodes NAP data and the dataset mismatch can leak another tenant’s settings.【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L136-L166】
- **sitemap.xml limited to active service/location/service-location docs per dataset → WRONG.** Sitemap uses shared `sanityFetch` (default dataset) and includes `page`/`post` docs outside Phase 1 scope.【F:apps/web/app/sitemap.ts†L1-L78】
- **Content-only fallback (no hardcoded marketing copy) → WRONG.** Routes render “Content coming soon” placeholders instead of Sanity-managed fallback sections.【F:apps/web/app/(main)/services/[serviceSlug]/page.tsx†L146-L153】【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L191-L200】【F:apps/web/app/(main)/locations/[locationSlug]/page.tsx†L148-L160】
- **CI enforcement at roadmap thresholds (SEO 100, JS bundle ≤ 250KB) → PARTIAL.** Lighthouse config relaxes SEO to 0.95 and script bundle to 400KB so regressions pass.【F:lighthouserc.js†L21-L37】
- **Middleware propagates dataset headers consumed by server components → WRONG.** Middleware sets `x-dataset` but server utilities read `x-sanity-dataset`, so dataset overrides never apply.【F:apps/web/lib/domain-middleware.ts†L162-L209】【F:apps/web/sanity/env.ts†L28-L43】
- **Legacy block map removed in favour of SectionRenderer → WRONG.** `apps/web/components/blocks/index.tsx` still duplicates rendering logic and must be deprecated.【F:apps/web/components/blocks/index.tsx†L1-L65】

## Code Errors & Architecture Drift

- **Dataset header mismatch** – Middleware writes `x-dataset` while `getDataset()` looks for `x-sanity-dataset`, forcing every request onto the default dataset and breaking tenant isolation.【F:apps/web/lib/domain-middleware.ts†L162-L209】【F:apps/web/sanity/env.ts†L28-L43】
- **Incomplete registry coverage** – SectionRenderer only maps six `_type` keys; valid blocks like `section-header`, `split-row`, `timeline-row`, and forms never render through the shared pipeline.【F:apps/web/components/SectionRenderer.tsx†L56-L151】
- **Legacy block mapper still active** – `components/blocks/index.tsx` duplicates rendering logic, ensuring future edits drift from the registry approach.【F:apps/web/components/blocks/index.tsx†L1-L65】
- **Hardcoded NAP in service-location route** – LocalBusiness schema uses literal strings for address/phone instead of siteSettings, creating data drift when details change.【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L152-L166】
- **Hardcoded “Content coming soon” copy** – Dynamic routes render inline placeholders when sections are empty, violating the “all marketing content in Sanity” rule.【F:apps/web/app/(main)/services/[serviceSlug]/page.tsx†L146-L153】【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L191-L200】【F:apps/web/app/(main)/locations/[locationSlug]/page.tsx†L148-L160】
- **Sitemap not tenant-safe** – Queries run through shared `sanityFetch`, so tenants risk leaking each other’s URLs and unsupported document types appear in the feed.【F:apps/web/app/sitemap.ts†L1-L78】

## SEO & Routing Observations (LocalBusiness Focus)

- **Canonical duplication** – Service-location content lives at both `/[service]/in/[location]` and `/locations/[location]/services/[service]`, producing duplicate canonicals and splitting authority.【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L63-L205】
- **LocalBusiness consistency gap** – Only the service-location route breaks the single-source-of-truth rule by hardcoding phone/address; service and location routes already hydrate from siteSettings.【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L152-L166】【F:apps/web/app/(main)/services/[serviceSlug]/page.tsx†L102-L125】【F:apps/web/app/(main)/locations/[locationSlug]/page.tsx†L104-L130】
- **Dataset isolation risk** – Because dataset headers are ignored, LocalBusiness schema can read another tenant’s settings during multi-tenant rollout, violating Phase 1 readiness.【F:apps/web/sanity/env.ts†L28-L43】【F:apps/web/lib/domain-middleware.ts†L162-L209】

## Schema & Content Model Gaps

- **Service document drift** – Retains category refs, manual slug, and `blocks` array instead of roadmap `sections[]` with structured intro/seo objects, complicating automation and variant fallback.【F:apps/studio/sanity/schemas/documents/service.ts†L20-L111】
- **Location document drift** – Same `blocks` pattern, no structured coverage/operating fields, and manual slug, limiting regional personalization tooling.【F:apps/studio/sanity/schemas/documents/location.ts†L20-L93】
- **Service-location document drift** – Required slug + `blocks` prevent deterministic URL computation and fallback logic across tenants.【F:apps/studio/sanity/schemas/documents/service-location.ts†L20-L120】
- **Missing block variants** – Carousel and other blocks lack `variant` dropdowns, so the editor can’t select registry presentations, undermining the “Sections[] + variant” contract.【F:apps/studio/sanity/schemas/blocks/carousel/carousel-1.ts†L1-L64】
- **No shared schema package** – With `packages/schemas` empty, there is no single source for document definitions or generated types, blocking CLI automation and reuse.【F:packages/schemas/index.ts†L1-L4】
- **Site settings without `defaultSeo`** – SEO defaults live in ad-hoc fields (`meta_description`) not defined in the schema, so pages add manual fallbacks and risk drift.【F:apps/studio/sanity/schemas/documents/settings.ts†L1-L137】【F:apps/web/app/(main)/services/[serviceSlug]/page.tsx†L47-L68】

## Technical Debt Risks Affecting Future Phases

1. **Dataset routing failure** – Without aligned headers and request-aware clients, Phase 2 multi-tenant rollouts will leak cross-client data. Fix: align header name and require `getClientForRequest()` everywhere.【F:apps/web/lib/domain-middleware.ts†L162-L209】【F:apps/web/sanity/env.ts†L28-L43】【F:apps/web/sanity/lib/client.ts†L1-L61】
2. **Duplicate service-location route** – Two URL patterns will create canonical conflicts and double maintenance. Fix: remove `/locations/[location]/services/[service]` once canonical `/[service]/in/[location]` is stable.【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L1-L205】
3. **Legacy block mapper** – As new blocks ship, developers will touch `SectionRenderer` and `components/blocks/index.tsx`, guaranteeing divergence. Fix: delete the legacy mapper after registry coverage expands.【F:apps/web/components/blocks/index.tsx†L1-L65】
4. **Schema drift** – Automation, AI content generation, and dataset provisioning scripts will fail with the current field shapes. Fix: migrate service/location/service-location documents to the roadmap contract and publish shared types.【F:apps/studio/sanity/schemas/documents/service.ts†L20-L111】【F:apps/studio/sanity/schemas/documents/location.ts†L20-L93】【F:apps/studio/sanity/schemas/documents/service-location.ts†L20-L120】
5. **Relaxed CI thresholds** – With SEO and bundle budgets loosened, regressions slip through, undermining platform guarantees. Fix: restore roadmap thresholds in Lighthouse config.【F:lighthouserc.js†L21-L37】
6. **Hardcoded marketing copy** – Inline placeholders prevent localization/AI updates and require code deploys for messaging changes. Fix: provide CMS-managed fallback sections or reuse service-level sections only.【F:apps/web/app/(main)/services/[serviceSlug]/page.tsx†L146-L153】【F:apps/web/app/(main)/locations/[locationSlug]/page.tsx†L148-L160】

## Step-by-Step Plan to Reach 100/100

1. **Unify dataset plumbing**
   - Rename middleware header to `x-sanity-dataset` (or update `getDataset` to read `x-dataset`) and refactor every server fetch to call `getClientForRequest()` or `getDefineLiveForRequest()` before querying.【F:apps/web/lib/domain-middleware.ts†L162-L209】【F:apps/web/sanity/env.ts†L28-L43】【F:apps/web/sanity/lib/client.ts†L1-L61】
   - Regression test routes to confirm tenant-specific datasets resolve.
2. **Refactor schemas to roadmap contract**
   - Move `service`, `location`, `service-location`, and `settings` schemas into `packages/schemas` with `sections[]` arrays, computed paths, and a shared `defaultSeo` object.
   - Remove manual slug on service-location, ensure service/location slug references drive the path, and generate TypeScript types for frontend consumption.【F:apps/studio/sanity/schemas/documents/service.ts†L20-L111】【F:apps/studio/sanity/schemas/documents/location.ts†L20-L93】【F:apps/studio/sanity/schemas/documents/service-location.ts†L20-L120】【F:packages/schemas/index.ts†L1-L4】
3. **Expand registry & remove legacy mapper**
   - Register every block `_type` + variant in `SectionRenderer` (hero, section-header, split, grid, carousel, timeline, forms, testimonials, etc.).
   - Once coverage is complete, delete `components/blocks/index.tsx` and update any callers to use `SectionRenderer` exclusively.【F:apps/web/components/SectionRenderer.tsx†L56-L151】【F:apps/web/components/blocks/index.tsx†L1-L65】
4. **Add `variant` dropdowns to all blocks**
   - Update block schemas (carousel, section-header, timelines, forms, CTA) to expose a `variant` field aligned with frontend registries.
   - Provide validation/defaults so editors can always select a supported variant.【F:apps/studio/sanity/schemas/blocks/carousel/carousel-1.ts†L1-L64】
5. **Centralize LocalBusiness data**
   - Extend `siteSettings` with a structured `defaultSeo` object and ensure LocalBusiness schema generation pulls address/phone/email exclusively from settings.
   - Update the service-location route to consume `siteSettings` instead of hardcoded strings and remove the duplicate `/locations/.../services/...` route.【F:apps/studio/sanity/schemas/documents/settings.ts†L1-L137】【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L136-L200】
6. **Eliminate hardcoded fallbacks**
   - Provide CMS-managed fallback sections (e.g., default hero + CTA) or reuse service-level sections when page arrays are empty.
   - Remove inline “Content coming soon” strings from every route.【F:apps/web/app/(main)/services/[serviceSlug]/page.tsx†L146-L153】【F:apps/web/app/(main)/locations/[locationSlug]/page.tsx†L148-L160】【F:apps/web/app/(main)/locations/[locationSlug]/services/[serviceSlug]/page.tsx†L191-L200】
7. **Rebuild sitemap with dataset awareness**
   - Use `getDefineLiveForRequest()` to scope queries to the incoming dataset and limit entries to active service/location/service-location documents.
   - Remove `page`/`post` queries until those content types are part of the approved roadmap.【F:apps/web/app/sitemap.ts†L1-L78】【F:apps/web/sanity/lib/live.ts†L1-L34】
8. **Restore CI guardrails**
   - Set Lighthouse SEO minimum back to 1.0, tighten bundle budget to 250KB, and ensure performance thresholds align with roadmap expectations.【F:lighthouserc.js†L21-L37】
9. **Document & automate**
   - Update project documentation to reference the shared schema package, registry usage, and dataset header contract so future phases inherit the correct patterns.
   - Add lint/test checks that fail when blocks without `variant` fields or legacy renderers are introduced.

Execute these steps in order; completing steps 1–7 removes every blocker called out in this audit and positions the platform for a true 100/100 Phase 1 sign-off.

Next Steps After Phase 1
Immediate: Verification & Testing

1. Test Dataset Isolation

# Start dev server

pnpm dev

# Test domain routing works

curl -H "Host: localhost:3000" http://localhost:3000/

# Verify x-sanity-dataset header is set correctly

# Test a service page renders

curl http://localhost:3000/services/drain-cleaning 2. Run Lighthouse CI

# Build production bundle

pnpm build

# Start production server

pnpm start

# Run Lighthouse CI (will fail if SEO < 100 or JS > 250KB)

pnpm lhci autorun 3. Verify Schema Changes

# Regenerate Sanity types

cd apps/web
pnpm typegen

# Typecheck entire codebase

pnpm typecheck 4. Test Sitemap

# With server running

curl http://localhost:3000/sitemap.xml

# Verify only service, location, serviceLocation URLs appear

# Verify no page/post URLs

Phase 2: Multi-Tenant Rollout

1. Create Second Tenant Dataset In Sanity Studio:
   Create new dataset: client2-production
   Clone schema from packages/schemas
   Populate with client2's business data (siteSettings)
   Add services/locations for client2
2. Add Domain Mapping Edit apps/web/lib/domain-middleware.ts:
   export const domainConfigs: Record<string, DomainConfig> = {
   'buddsplumbing.com': {
   domain: 'buddsplumbing.com',
   clientId: 'budds',
   dataset: 'production',
   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
   },
   'client2plumbing.com': {
   domain: 'client2plumbing.com',
   clientId: 'client2',
   dataset: 'client2-production',
   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
   },
   };
3. Test Multi-Tenant Isolation

# Test domain 1

curl -H "Host: buddsplumbing.com" http://localhost:3000/

# Test domain 2

curl -H "Host: client2plumbing.com" http://localhost:3000/

# Verify each sees only their dataset content

4. Deploy Multi-Tenant
   Configure DNS for both domains
   Deploy to Vercel with both domains mapped
   Verify each domain routes to correct dataset
   Phase 3: Production Optimization
1. SEO Enhancements
   Add structured data validation tests
   Implement dynamic sitemaps per domain
   Add robots.txt per tenant
   Set up Google Search Console per domain
1. Performance Monitoring
   Set up Vercel Analytics
   Monitor Core Web Vitals per tenant
   Track bundle size in CI
   Set up Lighthouse CI in GitHub Actions
1. Content Migration
   Migrate legacy blocks → sections[]
   Migrate legacy flat SEO fields → seo object
   Remove hidden legacy fields from schemas
   Clean up old service-location manual slugs
1. Editorial Improvements
   Add visible variant dropdowns to blocks (currently hidden)
   Create variant component registry
   Build preview system for variants
   Add block templates for common layouts
   Phase 4: Scale Infrastructure
1. Automate Tenant Provisioning Create script:

# scripts/provision-tenant.sh

TENANT_ID=$1
TENANT_DATASET="${TENANT_ID}-production"

# 1. Create Sanity dataset

sanity dataset create $TENANT_DATASET

# 2. Import schema

sanity schema extract --output=schema.json
sanity schema import --dataset=$TENANT_DATASET schema.json

# 3. Seed siteSettings

# ...

2. Build Tenant Admin Dashboard
   List all tenants
   View dataset stats
   Manage domain mappings
   Monitor SEO scores per tenant
3. Centralized Monitoring
   Aggregate Lighthouse scores across tenants
   Track bundle size trends
   Monitor dataset query performance
   Set up alerts for SEO regressions
   Recommended Order
   Week 1: Verification
   Fix any TypeScript errors from schema changes
   Test all routes render correctly
   Run Lighthouse CI and fix any failures
   Verify sitemap generates correctly
   Week 2: Deploy Phase 1
   Deploy single-tenant production
   Set up monitoring (Vercel Analytics)
   Configure Lighthouse CI in GitHub Actions
   Document deployment process
   Week 3: Second Tenant
   Create second dataset in Sanity
   Add domain mapping
   Test locally with host headers
   Deploy multi-tenant
   Week 4: Scale
   Add 3rd-5th tenants
   Build provisioning automation
   Set up centralized monitoring
   Document tenant onboarding
   Blockers to Watch
   Potential Issues:
   TypeScript errors from schema changes
   Run pnpm typegen in apps/web
   Fix any type mismatches (blocks → sections)
   Lighthouse CI failures
   Bundle size might exceed 250KB initially
   May need to optimize imports or lazy-load blocks
   SEO might not be 100 if meta tags missing
   Legacy data migration
   Existing service-location docs have manual slugs
   Need migration script to remove legacy slug field
   Fallback to service blocks might not work if blocks[] array is used instead of sections[]
   Missing siteSettings data
   If siteSettings doesn't have all NAP fields populated
   LocalBusiness schema will have empty strings
   Need to populate siteSettings before deploying
   First Action Right Now

# 1. Regenerate types from new schemas

cd /Users/jagpalkooner/budds-plumbing-2/apps/web
pnpm typegen

# 2. Run typecheck

pnpm typecheck

# 3. If passing, start dev server

pnpm dev

# 4. Open browser and test

# - http://localhost:3000/

# - http://localhost:3000/services/drain-cleaning

# - http://localhost:3000/locations/cape-may

# - http://localhost:3000/sitemap.xml

If you see errors, we fix them before proceeding to Phase 2. Would you like me to run the typegen and typecheck now to verify Phase 1 is ready?
