# @budds-plumbing/studio

## Purpose

Sanity Studio v3 for content management. Provides a user-friendly interface for non-technical editors to manage website content without code changes.

## Architecture

- **CMS**: Sanity Studio v3
- **Language**: TypeScript
- **Schema Design**: Lean contract with content delivered via blocks array
- **Real-time**: Live preview and collaboration

## Content Models

### Documents

- **service** - Service pages (name, slug, seo, blocks)
- **location** - Location pages (name, slug, seo, blocks)
- **service-location** - Combined pages (service ref, location ref, seo, blocks)
- **settings** - Site settings singleton (NAP, business info, brand)
- **faq** - Frequently asked questions
- **testimonial** - Customer testimonials
- **post** - Blog posts
- **author** - Blog authors
- **category** - Blog categories

### Blocks (Sections)

All content is delivered through reusable blocks with variants:

- Hero (hero-1, hero-2)
- CTA (cta-1, cta-2, cta-3)
- FAQ (faq-1, faq-2, faq-3)
- Testimonials (testimonial-1, testimonial-2, testimonial-3)
- Pricing (pricing-1, pricing-2, pricing-3)
- And more...

## Editor Workflow

1. Create or edit documents
2. Add/reorder blocks using visual interface
3. Change block variants for different layouts
4. Publish changes
5. See updates live on website (via ISR)

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Type checking
pnpm typecheck

# Build for production
pnpm build

# Start production server
pnpm start
```

## Environment Variables

Required in `.env` or `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
```

## Key Features

- Orderable document lists for navigation
- Visual block selection with preview
- Computed fields (e.g., service + location titles)
- SEO controls with noindex support
- Singleton settings for site-wide config
- Type-safe schemas with Zod validation

## Testing

- All schemas must have TypeScript types
- Variant fields must use dropdowns (no free text)
- Content changes must not require code deployment
- Editors can reorder, edit, and publish without developer help
