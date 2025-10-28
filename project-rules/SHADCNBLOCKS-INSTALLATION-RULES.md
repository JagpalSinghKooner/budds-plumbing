# Shadcnblocks Installation Rules

**ALWAYS FOLLOW THESE RULES WHEN INSTALLING COMPONENTS FROM SHADCNBLOCKS.COM**

## Official Installation Process

### 1. Prerequisites Check

Before installing any shadcnblocks component:

```bash
# Verify components.json exists
cat apps/web/components.json

# Ensure it has valid JSON structure
```

### 2. API Key Configuration

**Location:** `.env.local` or `.env`

```bash
SHADCNBLOCKS_API_KEY=sk_live_your_api_key_here
```

**Verify the key:**
- Must start with `sk_live_`
- Get from: https://www.shadcnblocks.com/dashboard (API Keys section)
- Can set optional expiration date

### 3. Registry Configuration

**File:** `apps/web/components.json`

**Required structure:**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide",
  "registries": {
    "@shadcnblocks": {
      "url": "https://shadcnblocks.com/r/{name}",
      "headers": {
        "Authorization": "Bearer ${SHADCNBLOCKS_API_KEY}"
      }
    }
  }
}
```

**Common Issues:**
- ❌ Missing closing braces
- ❌ Extra commas at end of objects
- ❌ Incorrect nesting of registries object
- ✅ Use proper JSON formatting tools to verify

### 4. Installation Commands

**DO NOT manually copy/paste code from website**

**ALWAYS use the official CLI:**

```bash
# Basic installation
npx shadcn@latest add @shadcnblocks/component-name

# With auto-yes for overwrites (use carefully)
yes | npx shadcn@latest add @shadcnblocks/component-name

# Check what will be installed
npx shadcn@latest add @shadcnblocks/component-name --dry-run
```

**What the CLI does:**
1. Checks registry configuration
2. Authenticates using API key
3. Downloads official component code
4. Installs required dependencies
5. Adds/updates shadcn/ui components (accordion, button, etc.)
6. Places component in correct location

### 5. Post-Installation Integration

After CLI installation, you may need to:

#### A. Add Custom Integrations

Example for Sanity CMS integration:

```tsx
// Original shadcnblocks component uses simple props
interface OriginalProps {
  logo?: { url: string; src: string; alt: string };
  menu?: MenuItem[];
}

// Extend for Sanity CMS
interface CustomProps {
  settings: SETTINGS_QUERYResult;
  navigation: NAVIGATION_QUERYResult;
}

// Transform Sanity data to component format
const menu: MenuItem[] = navigation[0]?.links?.map((link) => ({
  title: link.title,
  url: (link as any).resolvedLink || '#',
  // ... etc
}));
```

#### B. Add Z-Index for Overlays

Always check if dropdowns/modals need high z-index:

```tsx
// Header wrapper
<header className="sticky top-0 z-[100]">

// Dropdown menus
<NavigationMenuContent className="... z-[200]">

// Modal overlays
<DialogContent className="... z-[300]">
```

#### C. Replace HTML with Next.js Components

```tsx
// ❌ Don't keep vanilla HTML
<a href={url}><img src={logo} /></a>

// ✅ Replace with Next.js components
<Link href={url}>
  <Image src={logo} alt={alt} width={32} height={32} />
</Link>
```

### 6. Verification Steps

After installation:

```bash
# 1. Check TypeScript compilation
npx tsc --noEmit

# 2. Check for missing dependencies
pnpm install

# 3. Start dev server
pnpm dev

# 4. Verify in browser
# - Desktop navigation works
# - Mobile navigation works
# - Dropdowns appear above content
# - No console errors
```

### 7. Component Location

**Official components install to:**
```
apps/web/components/{component-name}.tsx
```

**Move to appropriate location if needed:**
```bash
# Example: Move navbar to header folder
mv apps/web/components/navbar2.tsx apps/web/components/header/navbar2.tsx
```

### 8. Common Components from Shadcnblocks

| Component | CLI Command | Required Dependencies |
|-----------|-------------|----------------------|
| navbar2 | `npx shadcn@latest add @shadcnblocks/navbar2` | accordion, button, navigation-menu, sheet |
| hero125 | `npx shadcn@latest add @shadcnblocks/hero125` | button, badge |
| pricing3 | `npx shadcn@latest add @shadcnblocks/pricing3` | card, button, badge |

### 9. Troubleshooting

#### Authentication Failed
```bash
# Check API key exists
cat .env.local | grep SHADCNBLOCKS

# Verify key format
# Should start with: sk_live_
```

#### Component Already Exists
```bash
# CLI will prompt to overwrite
# Type 'y' to overwrite or 'n' to skip

# Auto-accept all overwrites
yes | npx shadcn@latest add @shadcnblocks/component-name
```

#### Missing Dependencies
```bash
# CLI installs most dependencies automatically
# If missing, install manually:
pnpm add @radix-ui/react-navigation-menu lucide-react
```

#### Registry Not Found
```bash
# Check components.json has correct registries section
# Verify no JSON syntax errors
# Ensure registry URL is: https://shadcnblocks.com/r/{name}
```

## DO NOT

- ❌ Copy/paste code from browser DevTools
- ❌ Manually download files from website
- ❌ Skip the CLI installation process
- ❌ Forget to set up API key and registry config
- ❌ Use vanilla `<a>` and `<img>` tags (use Next.js components)
- ❌ Ignore z-index for dropdown/modal components
- ❌ Leave component with default placeholder content

## ALWAYS DO

- ✅ Use official CLI: `npx shadcn@latest add @shadcnblocks/component-name`
- ✅ Verify components.json is properly formatted JSON
- ✅ Set SHADCNBLOCKS_API_KEY in .env.local
- ✅ Add registry configuration to components.json
- ✅ Integrate with existing CMS/data structure
- ✅ Replace vanilla HTML with Next.js components (Link, Image)
- ✅ Add appropriate z-index values for overlays
- ✅ Test desktop AND mobile versions
- ✅ Run TypeScript checks after installation
- ✅ Remove unused backup/temp files after confirming it works

## Summary

**The golden rule:** Always use the official shadcnblocks CLI with proper authentication. Never manually copy component code from the website. The CLI ensures you get the correct, up-to-date component with all dependencies properly installed.

---

**Last Updated:** 2025-10-28
**Applies To:** All shadcnblocks.com Pro components
