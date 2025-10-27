# SectionRenderer Component

## Overview

`SectionRenderer.tsx` is a central component that dynamically renders sections based on their `_type` and `variant` fields from Sanity CMS. It provides a unified interface for rendering all block types in the Budds Plumbing project.

## Location

- **Main Component**: `/components/SectionRenderer.tsx`
- **Demo Component**: `/components/SectionRendererDemo.tsx`

## Architecture

### Registry Mapping

The SectionRenderer maps Sanity schema `_type` to the appropriate component registry:

```typescript
const registryMap = {
  'hero-1': heroRegistry, // Hero blocks (variants: hero-1, hero-2, hero-3)
  'hero-2': heroRegistry, // Hero blocks (variants: hero-1, hero-2, hero-3)
  'carousel-2': testimonialRegistry, // Testimonial blocks (variants: testimonial-1, 2, 3)
  faqs: faqRegistry, // FAQ blocks (variants: faq-1, faq-2, faq-3)
  'cta-1': ctaRegistry, // CTA blocks (variants: cta-1, cta-2, cta-3)
  'grid-row': pricingRegistry, // Pricing blocks (variants: pricing-1, pricing-2, pricing-3)
};
```

### Variant Selection

Each section can specify a `variant` field. If no variant is specified, the component uses a sensible default:

```typescript
const defaultVariants = {
  'hero-1': 'hero-1',
  'hero-2': 'hero-2',
  'carousel-2': 'testimonial-1',
  faqs: 'faq-1',
  'cta-1': 'cta-1',
  'grid-row': 'pricing-1',
};
```

## Usage

### Basic Usage

```tsx
import SectionRenderer from '@/components/SectionRenderer';

// In your page component
export default function Page({ sections }) {
  return <SectionRenderer sections={sections} />;
}
```

### With Sanity Data

```tsx
import { client } from '@/sanity/lib/client';
import SectionRenderer from '@/components/SectionRenderer';

async function getPageData() {
  return await client.fetch(
    `
    *[_type == "page" && slug.current == $slug][0] {
      sections[] {
        _type,
        _key,
        variant,
        ...
      }
    }
  `,
    { slug: 'home' }
  );
}

export default async function HomePage() {
  const data = await getPageData();
  return <SectionRenderer sections={data.sections} />;
}
```

## Error Handling

The SectionRenderer includes comprehensive error handling:

### 1. Unknown Section Type

```typescript
// Console warning:
// "SectionRenderer: No registry found for type: unknown-type.
//  Available types: hero-1, hero-2, carousel-2, faqs, cta-1, grid-row"
```

### 2. Unknown Variant

```typescript
// Console warning:
// "SectionRenderer: No component found for type: hero-1, variant: invalid-variant.
//  Available variants: hero-1, hero-2, hero-3"
```

### 3. Missing \_key

The component automatically generates a fallback key:

```typescript
const key = section._key || `section-${section._type}-${index}`;
```

### 4. Null/Undefined Sections

The component filters out invalid sections and logs a warning:

```typescript
// Console warning: "SectionRenderer: No valid sections to render"
```

### 5. Component Rendering Error

Any errors during component rendering are caught and logged:

```typescript
// Console error:
// "SectionRenderer: Error rendering component for type: hero-1, variant: hero-1"
```

## Edge Cases

### Missing Variant

If a section doesn't specify a variant, the default variant is used:

```typescript
const section = {
  _type: 'hero-1',
  _key: 'hero-1',
  // No variant specified - will use "hero-1" as default
};
```

### Empty Sections Array

```typescript
<SectionRenderer sections={[]} />
// Returns null with console warning
```

### Invalid Data

```typescript
<SectionRenderer sections={null} />
<SectionRenderer sections={undefined} />
// Both return null with console warning
```

## Type Safety

The component uses TypeScript types from `apps/studio/sanity.types.ts`:

```typescript
export type SectionType = Hero1 | Hero2 | Carousel2 | Faqs | Cta1 | GridRow;
```

All section props are properly typed, ensuring type safety throughout the rendering pipeline.

## Testing

See `SectionRendererDemo.tsx` for comprehensive test cases:

1. **Multiple Block Types**: Tests hero, testimonial, FAQ, CTA, and pricing blocks
2. **Different Variants**: Tests multiple variants per block type
3. **Edge Cases**: Tests missing variants, missing keys, invalid types
4. **Error Handling**: Validates console warnings for unknown types/variants

### Running the Demo

To test the SectionRenderer, import and use the demo component:

```tsx
import SectionRendererDemo from '@/components/SectionRendererDemo';

// In your page
export default function TestPage() {
  return <SectionRendererDemo />;
}
```

## Validation Results

### Test 1: Multiple Block Types

- Hero (2 variants) ✓
- Testimonial (1 variant) ✓
- FAQ (2 variants) ✓
- CTA (1 variant) ✓
- Pricing (1 variant) ✓

### Test 2: Edge Cases

- Section without variant (uses default) ✓
- Section without \_key (generates fallback) ✓

### Test 3: Error Handling

- Unknown \_type (logs warning, returns null) ✓
- Invalid variant (logs warning, returns null) ✓
- Empty sections array (logs warning, returns null) ✓
- Null/undefined sections (logs warning, returns null) ✓

## Integration with Task 5

This component builds on the variant registries created in Task 5:

- `/components/blocks/hero/heroRegistry.tsx`
- `/components/blocks/testimonial/testimonialRegistry.tsx`
- `/components/blocks/faq/faqRegistry.tsx`
- `/components/blocks/cta/ctaRegistry.tsx`
- `/components/blocks/pricing/pricingRegistry.tsx`

Each registry maps variant strings to React components, and the SectionRenderer uses these registries to dynamically select and render the appropriate component.

## Future Enhancements

1. **Error Boundary**: Wrap rendering in a React Error Boundary component
2. **Loading States**: Add support for loading states during data fetching
3. **Lazy Loading**: Implement code splitting for better performance
4. **Analytics**: Track which sections are rendered for analytics
5. **A/B Testing**: Support variant testing for different section designs

## Notes

- The component uses `console.warn` for non-critical errors (unknown types/variants)
- The component uses `console.error` for critical errors (component rendering failures)
- All errors are non-breaking - the component continues rendering valid sections
- The component is fully type-safe with TypeScript
- The component supports all 5 block types: Hero, Testimonial, FAQ, CTA, and Pricing
