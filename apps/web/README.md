# @budds-plumbing/web

## Purpose

Next.js 15 frontend application for Budds Plumbing website. Delivers dynamic, SEO-optimized pages with content managed through Sanity CMS.

## Architecture

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with design tokens from `@budds-plumbing/ui`
- **CMS**: Sanity.io integration with live preview
- **Deployment**: Vercel with ISR (Incremental Static Regeneration)

## Key Features

- Dynamic routing for services and locations
- SEO optimization with JSON-LD schemas
- Component-based section rendering
- Real-time content updates via ISR
- Performance optimized (Lighthouse SEO 100)

## Routes

- `/services/[serviceSlug]` - Service pages
- `/locations/[locationSlug]` - Location pages
- `/[serviceSlug]/in/[locationSlug]` - Service-location pages with fallback

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Build for production
pnpm build

# Start production server
pnpm start
```

## Environment Variables

Required variables in `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=
NEXT_PUBLIC_SITE_URL=
SANITY_API_READ_TOKEN=
RESEND_API_KEY=
RESEND_AUDIENCE_ID=
```

## Testing

- Lighthouse SEO must score 100
- Bundle size must be < 250KB first load JS
- All TypeScript strict mode checks must pass
- No eslint-disable or ts-ignore allowed

## Dependencies

- `@budds-plumbing/ui` - Shared UI components and design tokens
- `@budds-plumbing/schemas` - Shared TypeScript types (placeholder)
