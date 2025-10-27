# Budds Plumbing Design System

## Overview

This document provides a high-level overview of the design system implementation for the Budds Plumbing project.

## Structure

The design system is distributed across the monorepo as follows:

```
budds-plumbing-2/
├── tailwind.config.ts              # Root Tailwind configuration
├── app/
│   └── globals.css                 # CSS variables and base styles
├── packages/
│   └── ui/
│       ├── tailwind.preset.ts      # Shared Tailwind preset
│       ├── README.md               # Comprehensive documentation
│       └── DESIGN_TOKENS.md        # Quick reference guide
└── components/                     # UI components using design tokens
```

## Key Features

### 1. CSS Variables Approach

All design tokens use CSS variables (`--token-name`) for:

- Easy runtime theming
- Seamless dark mode switching
- Simple customization per app

### 2. OKLCH Color Space

Colors use the modern OKLCH format for:

- Perceptually uniform colors
- Better hue manipulation
- More vibrant color options
- Consistent lightness perception

### 3. Dark Mode Support

Complete dark mode implementation:

- Class-based switching via `ThemeProvider`
- All colors have light and dark variants
- Automatic theme detection (system preference)
- Manual theme toggle support

### 4. Comprehensive Token System

#### Colors

- **Semantic**: primary, secondary, destructive, success, warning, info
- **UI Components**: muted, accent, card, popover, sidebar
- **Borders**: border, input, ring
- **Charts**: 5 distinct chart colors

#### Typography

- **Font Families**: sans-serif (Geist Sans), monospace (Geist Mono)
- **Font Sizes**: xs (12px) through 9xl (128px)
- **Font Weights**: 100 (thin) through 900 (black)
- **Line Heights**: none, tight, snug, normal, relaxed, loose
- **Letter Spacing**: tighter through widest

#### Spacing

- Harmonious scale: 0 through 96 (0px to 384px)
- Consistent increments for predictable layouts
- Works with padding, margin, gap utilities

#### Animations

- Accordion animations (Radix UI integration)
- Fade animations (in, out, up)
- Slide animations (in/out from right)
- Custom keyframe definitions

## Configuration Files

### 1. Root Tailwind Config (`/tailwind.config.ts`)

- Main configuration for the root Next.js app
- Includes all design tokens
- Content paths for root-level components
- Plugin configuration (tailwindcss-animate)

### 2. Shared Preset (`/packages/ui/tailwind.preset.ts`)

- Reusable preset for monorepo apps
- Contains identical design tokens
- Can be imported by any app in the workspace
- Enables consistency across multiple frontends

### 3. Global Styles (`/app/globals.css`)

- CSS variable definitions for light/dark modes
- Keyframe animations
- Base layer styles (typography, container)
- Tailwind directives

## Usage

### In Root App

The root Next.js app already uses the design tokens via `tailwind.config.ts`.

### In Future Monorepo Apps

When moving code to `apps/web`, use the shared preset:

```typescript
// apps/web/tailwind.config.ts
import preset from '@budds-plumbing/ui/tailwind.preset';

export default {
  presets: [preset],
  content: ['./app/**/*.{ts,tsx}', '../../packages/ui/**/*.{ts,tsx}'],
} satisfies Config;
```

### Component Development

Components use design tokens through Tailwind utility classes:

```tsx
// Example button component
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Click me
</button>

// Example card
<div className="bg-card text-card-foreground border rounded-lg shadow-sm p-6">
  Card content
</div>
```

## Accessibility

### Color Contrast

All color combinations meet WCAG AA standards:

- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- Interactive elements aim for AAA (7:1) where possible

### Focus States

All interactive elements include visible focus indicators using the `ring` color token.

### Semantic HTML

Components use semantic HTML elements and ARIA labels appropriately.

## Best Practices

### 1. Use Semantic Tokens

```tsx
// Good
<div className="bg-primary text-primary-foreground">

// Avoid
<div className="bg-[#333] text-[#fff]">
```

### 2. Maintain Spacing Consistency

```tsx
// Good - uses scale
<div className="space-y-4 p-6">

// Avoid - arbitrary values
<div className="space-y-[17px] p-[23px]">
```

### 3. Responsive Typography

```tsx
<h1 className="text-3xl md:text-5xl lg:text-6xl">Responsive Heading</h1>
```

### 4. Proper Color Layering

- `background` → Base layer
- `card` → Elevated surfaces
- `popover` → Floating elements
- `primary/secondary` → Interactive elements

## Documentation

### Comprehensive Guide

See `/packages/ui/README.md` for:

- Complete token reference
- Usage examples
- Component patterns
- Accessibility guidelines
- Dark mode implementation
- Best practices

### Quick Reference

See `/packages/ui/DESIGN_TOKENS.md` for:

- Quick token lookup
- Common patterns
- Code snippets

## Validation

### Component Integration

The design system has been validated against existing components:

- 20+ components using text colors
- 3+ components using background colors
- All components use spacing tokens
- Button variants use semantic colors correctly
- Badge component uses proper color tokens

### Type Safety

All configuration files:

- Use TypeScript for type safety
- Import Config type from Tailwind
- Properly typed theme extensions
- Satisfies Config constraint

## Future Enhancements

Potential improvements for the design system:

1. **Custom Brand Colors**: Update primary/secondary colors to match Budds Plumbing brand
2. **Additional Animations**: Add more specialized animations as needed
3. **Component Library**: Move UI components to `packages/ui` for sharing
4. **Storybook**: Add Storybook for component documentation and testing
5. **Design Tokens Package**: Extract tokens to separate package for non-web usage
6. **Theme Builder**: Create tool for generating custom themes

## Contributing

When adding new design tokens:

1. Add CSS variable to `:root` and `.dark` in `globals.css`
2. Add corresponding Tailwind class to both configs
3. Document in README.md and DESIGN_TOKENS.md
4. Ensure WCAG contrast requirements are met
5. Add usage examples
6. Update this overview if necessary

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [OKLCH Color Picker](https://oklch.com/)
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Radix UI Components](https://www.radix-ui.com/)

---

**Status**: Phase 1 - Task 3 Complete ✅

**Next Steps**:

- Task 4: Component Library Setup
- Consider updating brand colors to match Budds Plumbing identity
- Test design system across different viewports and devices
