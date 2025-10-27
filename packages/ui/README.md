# @budds-plumbing/ui - Design System

A comprehensive design system for Budds Plumbing built on Tailwind CSS, featuring accessible components, consistent design tokens, and full dark mode support.

## Overview

This package contains shared UI components and design tokens used across the Budds Plumbing monorepo. The design system is built on modern web standards with accessibility and maintainability as core principles.

## Features

- **CSS Variables Approach**: All colors use CSS variables for easy theming and runtime customization
- **Dark Mode Support**: Complete dark mode implementation using class-based switching
- **OKLCH Color Space**: Modern color format providing perceptually uniform colors and better hue manipulation
- **Accessible Design**: All color combinations meet WCAG contrast ratio requirements
- **Responsive Typography**: Fluid typography scale that adapts to viewport sizes
- **Consistent Spacing**: Harmonious spacing scale for predictable layouts
- **Animation System**: Pre-built animations and transitions for smooth interactions

## Installation & Usage

### For Apps in the Monorepo

In your app's `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';
import preset from '@budds-plumbing/ui/tailwind.preset';

const config: Config = {
  presets: [preset],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/**/*.{ts,tsx}', // Include UI package components
  ],
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
```

### Import Global Styles

Your app should import or replicate the CSS variables defined in `/app/globals.css`.

## Design Tokens

### Color System

Our color system uses OKLCH color space for perceptually uniform colors. All colors are defined as CSS variables and can be accessed through Tailwind utility classes.

#### Base Colors

```css
/* Light Mode */
--background: oklch(1 0 0); /* Pure white */
--foreground: oklch(
  0.13 0.028 261.692
); /* Almost black with slight blue tint */

/* Dark Mode */
--background: oklch(0.13 0.028 261.692); /* Dark background */
--foreground: oklch(0.985 0.002 247.839); /* Light text */
```

**Usage:**

```tsx
<div className="bg-background text-foreground">
  Content with automatic light/dark mode support
</div>
```

#### Primary Brand Colors

```css
/* Light Mode */
--primary: oklch(0.21 0.034 264.665); /* Dark navy/slate */
--primary-foreground: oklch(0.985 0.002 247.839); /* Off-white */

/* Dark Mode */
--primary: oklch(0.928 0.006 264.531); /* Light accent */
--primary-foreground: oklch(0.21 0.034 264.665); /* Dark text */
```

**Usage:**

```tsx
<button className="bg-primary text-primary-foreground">Primary Button</button>
```

#### Semantic Colors

##### Success (Green)

```css
/* Light Mode */
--success: oklch(0.6 0.15 145);
--success-foreground: oklch(0.985 0.002 247.839);
```

**Usage:**

```tsx
<div className="bg-success text-success-foreground">
  Operation completed successfully!
</div>
```

##### Warning (Yellow/Orange)

```css
/* Light Mode */
--warning: oklch(0.75 0.15 85);
--warning-foreground: oklch(0.2 0.02 264);
```

**Usage:**

```tsx
<div className="bg-warning text-warning-foreground">
  Please review this action
</div>
```

##### Error/Destructive (Red)

```css
/* Light Mode */
--destructive: oklch(0.577 0.245 27.325);
--destructive-foreground: oklch(0.985 0.002 247.839);
```

**Usage:**

```tsx
<button className="bg-destructive text-destructive-foreground">
  Delete Item
</button>
```

##### Info (Blue)

```css
/* Light Mode */
--info: oklch(0.6 0.15 240);
--info-foreground: oklch(0.985 0.002 247.839);
```

**Usage:**

```tsx
<div className="bg-info text-info-foreground">
  Here's some helpful information
</div>
```

#### UI Component Colors

**Secondary:** Used for secondary actions and alternative UI elements

```tsx
<button className="bg-secondary text-secondary-foreground">
  Secondary Action
</button>
```

**Muted:** For subtle backgrounds and less prominent content

```tsx
<div className="bg-muted text-muted-foreground">Less important content</div>
```

**Accent:** For highlighting and drawing attention

```tsx
<div className="bg-accent text-accent-foreground">Highlighted content</div>
```

**Card:** For card components and elevated surfaces

```tsx
<div className="bg-card text-card-foreground border rounded-lg p-4">
  Card content
</div>
```

**Popover:** For popovers, dropdowns, and overlays

```tsx
<div className="bg-popover text-popover-foreground">Popover content</div>
```

#### Border & Input Colors

```tsx
<input className="border-border ring-ring focus:ring-2" />
<input className="border-input" />
```

### Color Palette Reference

#### Light Mode Colors

| Token         | OKLCH Value           | Description     |
| ------------- | --------------------- | --------------- |
| `background`  | `1 0 0`               | Pure white      |
| `foreground`  | `0.13 0.028 261.692`  | Almost black    |
| `primary`     | `0.21 0.034 264.665`  | Dark navy/slate |
| `secondary`   | `0.967 0.003 264.542` | Very light gray |
| `muted`       | `0.967 0.003 264.542` | Light gray      |
| `accent`      | `0.967 0.003 264.542` | Light accent    |
| `destructive` | `0.577 0.245 27.325`  | Red             |
| `success`     | `0.6 0.15 145`        | Green           |
| `warning`     | `0.75 0.15 85`        | Yellow/Orange   |
| `info`        | `0.6 0.15 240`        | Blue            |

#### Dark Mode Colors

| Token         | OKLCH Value           | Description     |
| ------------- | --------------------- | --------------- |
| `background`  | `0.13 0.028 261.692`  | Dark background |
| `foreground`  | `0.985 0.002 247.839` | Light text      |
| `primary`     | `0.928 0.006 264.531` | Light accent    |
| `secondary`   | `0.278 0.033 256.848` | Dark gray       |
| `muted`       | `0.278 0.033 256.848` | Muted gray      |
| `accent`      | `0.278 0.033 256.848` | Dark accent     |
| `destructive` | `0.704 0.191 22.216`  | Lighter red     |
| `success`     | `0.65 0.15 145`       | Lighter green   |
| `warning`     | `0.7 0.15 85`         | Adjusted yellow |
| `info`        | `0.65 0.15 240`       | Lighter blue    |

### Typography Scale

Our typography system provides a consistent scale with responsive sizing.

#### Font Families

```typescript
fontFamily: {
  sans: ["var(--font-sans)", "system-ui", "sans-serif"],
  mono: ["var(--font-mono)", "monospace"],
}
```

**Usage:**

```tsx
<p className="font-sans">Body text uses sans-serif</p>
<code className="font-mono">Code uses monospace</code>
```

#### Font Sizes

| Class       | Size  | Line Height | Use Case               |
| ----------- | ----- | ----------- | ---------------------- |
| `text-xs`   | 12px  | 16px        | Small labels, captions |
| `text-sm`   | 14px  | 20px        | Secondary text         |
| `text-base` | 16px  | 24px        | Body text              |
| `text-lg`   | 18px  | 28px        | Large body text        |
| `text-xl`   | 20px  | 28px        | Small headings         |
| `text-2xl`  | 24px  | 32px        | Section headings       |
| `text-3xl`  | 30px  | 36px        | Subsection headings    |
| `text-4xl`  | 36px  | 40px        | Page headings          |
| `text-5xl`  | 48px  | 1.2         | Hero headings          |
| `text-6xl`  | 60px  | 1.2         | Large hero text        |
| `text-7xl`  | 72px  | 1.2         | Extra large display    |
| `text-8xl`  | 96px  | 1.2         | Massive display        |
| `text-9xl`  | 128px | 1.2         | Extreme display        |

**Example:**

```tsx
<h1 className="text-5xl font-bold">Hero Heading</h1>
<h2 className="text-3xl font-semibold">Section Heading</h2>
<p className="text-base">Regular body text</p>
<span className="text-sm text-muted-foreground">Caption text</span>
```

#### Font Weights

```tsx
<p className="font-thin">100 - Thin</p>
<p className="font-extralight">200 - Extra Light</p>
<p className="font-light">300 - Light</p>
<p className="font-normal">400 - Normal</p>
<p className="font-medium">500 - Medium</p>
<p className="font-semibold">600 - Semi Bold</p>
<p className="font-bold">700 - Bold</p>
<p className="font-extrabold">800 - Extra Bold</p>
<p className="font-black">900 - Black</p>
```

#### Letter Spacing

```tsx
<p className="tracking-tighter">Tighter (-0.05em)</p>
<p className="tracking-tight">Tight (-0.025em)</p>
<p className="tracking-normal">Normal (0em)</p>
<p className="tracking-wide">Wide (0.025em)</p>
<p className="tracking-wider">Wider (0.05em)</p>
<p className="tracking-widest">Widest (0.1em)</p>
```

#### Line Height

```tsx
<p className="leading-none">1.0</p>
<p className="leading-tight">1.25</p>
<p className="leading-snug">1.375</p>
<p className="leading-normal">1.5</p>
<p className="leading-relaxed">1.625</p>
<p className="leading-loose">2.0</p>
```

### Spacing Scale

Consistent spacing creates visual hierarchy and improves readability.

| Class | Value    | Pixels |
| ----- | -------- | ------ |
| `0`   | 0        | 0px    |
| `0.5` | 0.125rem | 2px    |
| `1`   | 0.25rem  | 4px    |
| `1.5` | 0.375rem | 6px    |
| `2`   | 0.5rem   | 8px    |
| `2.5` | 0.625rem | 10px   |
| `3`   | 0.75rem  | 12px   |
| `4`   | 1rem     | 16px   |
| `5`   | 1.25rem  | 20px   |
| `6`   | 1.5rem   | 24px   |
| `8`   | 2rem     | 32px   |
| `10`  | 2.5rem   | 40px   |
| `12`  | 3rem     | 48px   |
| `16`  | 4rem     | 64px   |
| `20`  | 5rem     | 80px   |
| `24`  | 6rem     | 96px   |
| `32`  | 8rem     | 128px  |
| `40`  | 10rem    | 160px  |
| `48`  | 12rem    | 192px  |
| `56`  | 14rem    | 224px  |
| `64`  | 16rem    | 256px  |
| `80`  | 20rem    | 320px  |
| `96`  | 24rem    | 384px  |

**Usage Examples:**

```tsx
{/* Padding */}
<div className="p-4">Padding on all sides (16px)</div>
<div className="px-6 py-3">Horizontal 24px, Vertical 12px</div>

{/* Margin */}
<div className="mt-8">Margin top 32px</div>
<div className="mb-6">Margin bottom 24px</div>

{/* Gap (Flexbox/Grid) */}
<div className="flex gap-4">Items with 16px gap</div>
<div className="grid grid-cols-3 gap-6">Grid with 24px gap</div>
```

### Border Radius

```typescript
borderRadius: {
  sm: "var(--radius-sm)",  // calc(var(--radius) - 4px)
  md: "var(--radius-md)",  // calc(var(--radius) - 2px)
  lg: "var(--radius-lg)",  // var(--radius) = 0.625rem = 10px
  xl: "var(--radius-xl)",  // calc(var(--radius) + 4px)
}
```

**Usage:**

```tsx
<div className="rounded-sm">Slightly rounded (6px)</div>
<div className="rounded-md">Medium rounded (8px)</div>
<div className="rounded-lg">Large rounded (10px)</div>
<div className="rounded-xl">Extra large rounded (14px)</div>
```

### Shadows

```tsx
<div className="shadow-xs">Extra small shadow</div>
<div className="shadow-sm">Small shadow</div>
<div className="shadow">Default shadow</div>
<div className="shadow-md">Medium shadow</div>
<div className="shadow-lg">Large shadow</div>
<div className="shadow-xl">Extra large shadow</div>
<div className="shadow-2xl">2X large shadow</div>
<div className="shadow-inner">Inner shadow</div>
```

### Animations

Pre-built animations for common UI interactions.

#### Available Animations

```tsx
{/* Accordion animations (used with Radix UI) */}
<div className="animate-accordion-down">Accordion opening</div>
<div className="animate-accordion-up">Accordion closing</div>

{/* Fade animations */}
<div className="animate-fade-in">Fade in</div>
<div className="animate-fade-out">Fade out</div>
<div className="animate-fade-up">Fade up from below</div>

{/* Slide animations */}
<div className="animate-slide-in-right">Slide in from right</div>
<div className="animate-slide-out-right">Slide out to right</div>
```

#### Custom Animations

All animations are defined in `/app/globals.css` and can be extended:

```css
@keyframes custom-animation {
  0% {
    /* start state */
  }
  100% {
    /* end state */
  }
}
```

Then add to Tailwind config:

```typescript
animation: {
  'custom': 'custom-animation 0.3s ease-out',
}
```

### Transitions

```tsx
{/* Duration */}
<div className="transition duration-75">75ms transition</div>
<div className="transition duration-300">300ms transition (common)</div>
<div className="transition duration-500">500ms transition</div>

{/* Timing functions */}
<div className="transition ease-linear">Linear timing</div>
<div className="transition ease-in">Ease in</div>
<div className="transition ease-out">Ease out</div>
<div className="transition ease-in-out">Ease in-out</div>
```

## Component Patterns

### Button Variants

```tsx
import { Button } from "@budds-plumbing/ui";

// Primary button
<Button variant="default">Primary Action</Button>

// Secondary button
<Button variant="secondary">Secondary Action</Button>

// Destructive button
<Button variant="destructive">Delete</Button>

// Outline button
<Button variant="outline">Outline</Button>

// Ghost button
<Button variant="ghost">Ghost</Button>

// Link button
<Button variant="link">Link</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">
  <Icon />
</Button>
```

### Card Pattern

```tsx
<div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
  <h3 className="text-2xl font-semibold mb-2">Card Title</h3>
  <p className="text-muted-foreground">Card description text</p>
</div>
```

### Form Input Pattern

```tsx
<div className="space-y-2">
  <label className="text-sm font-medium">Label</label>
  <input
    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    placeholder="Enter text..."
  />
  <p className="text-sm text-muted-foreground">Helper text</p>
</div>
```

## Accessibility

### Color Contrast

All color combinations in this design system meet WCAG AA standards for normal text (4.5:1) and large text (3:1). Critical interactive elements meet AAA standards (7:1).

### Focus States

All interactive elements include visible focus indicators:

```tsx
<button className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
  Accessible Button
</button>
```

### Screen Reader Support

Use semantic HTML and ARIA labels appropriately:

```tsx
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>
```

## Dark Mode

### Enabling Dark Mode

Dark mode is handled via the `class` strategy. The `ThemeProvider` component manages the theme state:

```tsx
import { ThemeProvider } from '@/components/theme-provider';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  );
}
```

### Custom Dark Mode Variants

```tsx
{
  /* Light mode only */
}
<div className="dark:hidden">Visible in light mode only</div>;

{
  /* Dark mode only */
}
<div className="hidden dark:block">Visible in dark mode only</div>;

{
  /* Different colors per mode */
}
<div className="bg-white dark:bg-slate-900">Adaptive background</div>;
```

## Best Practices

### 1. Use Semantic Tokens

Always prefer semantic tokens over arbitrary values:

```tsx
// Good
<div className="bg-primary text-primary-foreground">

// Avoid
<div className="bg-[#333] text-[#fff]">
```

### 2. Maintain Consistency

Use the spacing scale consistently throughout your layouts:

```tsx
// Good - uses scale
<div className="space-y-4">
  <div className="p-4">...</div>
  <div className="p-4">...</div>
</div>

// Avoid - arbitrary values
<div className="space-y-[17px]">
  <div className="p-[15px]">...</div>
</div>
```

### 3. Layer Components Properly

Use the color system's layering hierarchy:

- `background` → Base layer
- `card` → Elevated surfaces
- `popover` → Floating elements
- `primary/secondary/etc` → Interactive elements

### 4. Responsive Design

Utilize Tailwind's responsive prefixes:

```tsx
<h1 className="text-3xl md:text-5xl lg:text-6xl">
  Responsive Heading
</h1>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  Responsive grid
</div>
```

### 5. Animation Performance

Use animations sparingly and prefer `transform` and `opacity` for best performance:

```tsx
// Good - GPU accelerated
<div className="transition-transform hover:scale-105">

// Less optimal
<div className="transition-[width] hover:w-96">
```

## Contributing

When adding new design tokens:

1. Add the CSS variable to both `:root` and `.dark` in `globals.css`
2. Add the corresponding Tailwind class to `tailwind.config.ts` and `tailwind.preset.ts`
3. Document the new token in this README
4. Ensure WCAG contrast requirements are met
5. Add usage examples

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [OKLCH Color Picker](https://oklch.com/)
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Radix UI Components](https://www.radix-ui.com/)

## License

Private - Budds Plumbing © 2025
