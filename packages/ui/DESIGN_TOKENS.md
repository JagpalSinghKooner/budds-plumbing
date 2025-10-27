# Design Tokens Quick Reference

## Color Tokens

### Semantic Colors

- `primary` / `primary-foreground` - Main brand color (dark navy/slate)
- `secondary` / `secondary-foreground` - Secondary actions
- `destructive` / `destructive-foreground` - Error states, delete actions
- `success` / `success-foreground` - Success states, confirmations
- `warning` / `warning-foreground` - Warning states, cautions
- `info` / `info-foreground` - Informational states

### UI Colors

- `background` / `foreground` - Base page colors
- `card` / `card-foreground` - Card surfaces
- `popover` / `popover-foreground` - Floating elements
- `muted` / `muted-foreground` - Subtle backgrounds
- `accent` / `accent-foreground` - Highlights

### Border & Input

- `border` - Default border color
- `input` - Input field borders
- `ring` - Focus ring color

### Chart Colors

- `chart-1` through `chart-5` - Data visualization colors

## Spacing Scale

```
0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12,
14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96
```

## Typography Scale

- `text-xs` (12px) - Captions
- `text-sm` (14px) - Secondary text
- `text-base` (16px) - Body text
- `text-lg` (18px) - Large body
- `text-xl` (20px) - Small headings
- `text-2xl` (24px) - Section headings
- `text-3xl` (30px) - Subsection headings
- `text-4xl` (36px) - Page headings
- `text-5xl` (48px) - Hero headings
- `text-6xl` through `text-9xl` - Display sizes

## Font Weights

- `font-thin` (100) through `font-black` (900)
- Most commonly used: `font-normal` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700)

## Border Radius

- `rounded-sm` - Slightly rounded
- `rounded-md` - Medium rounded
- `rounded-lg` - Large rounded (default)
- `rounded-xl` - Extra large rounded

## Shadows

- `shadow-xs` through `shadow-2xl`
- `shadow-inner` for inset shadows

## Animations

- `animate-accordion-down` / `animate-accordion-up`
- `animate-fade-in` / `animate-fade-out` / `animate-fade-up`
- `animate-slide-in-right` / `animate-slide-out-right`

## Usage Examples

### Buttons

```tsx
// Primary action
className = 'bg-primary text-primary-foreground hover:bg-primary/90';

// Success state
className = 'bg-success text-success-foreground';

// Destructive action
className = 'bg-destructive text-destructive-foreground';
```

### Cards

```tsx
className = 'bg-card text-card-foreground border rounded-lg shadow-sm';
```

### Spacing

```tsx
// Padding
className = 'p-4 px-6 py-3';

// Margin
className = 'mt-8 mb-6';

// Gap
className = 'gap-4 space-y-6';
```

### Typography

```tsx
// Headings
className = 'text-4xl font-bold';
className = 'text-2xl font-semibold';

// Body text
className = 'text-base leading-relaxed';

// Muted text
className = 'text-sm text-muted-foreground';
```
