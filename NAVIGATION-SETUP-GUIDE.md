# Navigation Setup Guide

## Pages Created ✅

The following pages have been created and are ready to use:

### Main Pages
- **Home** - `/` (already exists as `index`)
- **About** - `/about`
- **Contact** - `/contact`
- **Services** - `/services` (landing page)
- **Locations** - `/locations` (landing page)

### Legal Pages
- **Privacy Policy** - `/privacy-policy`
- **Terms of Service** - `/terms-of-service`

### Dynamic Routes (Already Exist)
- **Individual Service** - `/services/[serviceSlug]`
- **Individual Location** - `/locations/[locationSlug]`
- **Service in Location** - `/[serviceSlug]/in/[locationSlug]`

---

## How Navigation Works

Navigation is managed through **Sanity Studio**, not in code. This allows non-technical users to update the menu without deployments.

### Navigation Structure

Your navigation uses the `link` object which supports:
- ✅ Internal links (references to pages in Sanity)
- ✅ External links (URLs to other websites)
- ✅ Dropdown menus (sub-links)
- ✅ Button styling
- ✅ "Open in new tab" option

---

## Setting Up Navigation in Sanity Studio

### Step 1: Open Sanity Studio

Visit: **http://localhost:3333** (or your production Studio URL)

### Step 2: Find Navigation Document

1. Look for **"Navigation"** in the sidebar
2. Click on it (there should be only one Navigation document)
3. If it doesn't exist, create one

### Step 3: Create Pages in Sanity First

Before you can link to pages in navigation, you need to create them in Sanity:

1. Go to **"Page"** in Sanity Studio
2. Click **"Create"**
3. For each page you want to create:

#### Home Page (Already Exists)
- **Slug:** `index`
- **Add blocks** as needed

#### About Page
- **Slug:** `about`
- **Meta Title:** "About Us | Your Business Name"
- **Meta Description:** Brief description of your about page
- **Add blocks:**
  - Hero block with company story
  - Section with team info
  - CTA block

#### Contact Page
- **Slug:** `contact`
- **Meta Title:** "Contact Us | Your Business Name"
- **Meta Description:** "Get in touch with us"
- **Add blocks:**
  - Hero with contact headline
  - Form (newsletter form can be adapted)
  - Section with contact details from settings

#### Services Landing Page
- **Slug:** `services`
- **Meta Title:** "Our Services | Your Business Name"
- **Meta Description:** "Browse all our professional services"
- **Add blocks:**
  - Hero
  - Grid with service cards (you can manually add or query services)

#### Locations Landing Page
- **Slug:** `locations`
- **Meta Title:** "Service Areas | Your Business Name"
- **Meta Description:** "Areas we serve"
- **Add blocks:**
  - Hero
  - Grid with location cards

#### Privacy Policy
- **Slug:** `privacy-policy`
- **Meta Title:** "Privacy Policy | Your Business Name"
- **Add blocks:**
  - Section Header with title "Privacy Policy"
  - Multiple section blocks with your policy content

#### Terms of Service
- **Slug:** `terms-of-service`
- **Meta Title:** "Terms of Service | Your Business Name"
- **Add blocks:**
  - Section Header with title "Terms of Service"
  - Multiple section blocks with your terms

### Step 4: Configure Navigation Links

Now go back to **Navigation** and add links:

#### Example Navigation Structure

```
Navigation
├── Links (array)
    ├── Link 1: Home
    │   ├── Is External: false
    │   ├── Internal Link: → page (index)
    │   └── Title: Home
    │
    ├── Link 2: About
    │   ├── Is External: false
    │   ├── Internal Link: → page (about)
    │   └── Title: About
    │
    ├── Link 3: Services (with dropdown)
    │   ├── Is External: false
    │   ├── Internal Link: → page (services)
    │   ├── Title: Services
    │   └── Sub Links
    │       ├── Service 1 (reference to specific service)
    │       ├── Service 2
    │       └── View All Services
    │
    ├── Link 4: Locations (with dropdown)
    │   ├── Is External: false
    │   ├── Internal Link: → page (locations)
    │   ├── Title: Locations
    │   └── Sub Links
    │       ├── Location 1 (reference to specific location)
    │       ├── Location 2
    │       └── View All Locations
    │
    └── Link 5: Contact
        ├── Is External: false
        ├── Internal Link: → page (contact)
        ├── Title: Contact
        └── Button Variant: primary (optional, makes it a button)
```

### Step 5: Add a Navigation Link (Detailed)

1. In Navigation document, click **"Add item"** under Links
2. For each link, configure:

#### For Internal Links (Pages in Your Site):
- **Is External:** Toggle OFF (unchecked)
- **Internal Link:** Click and select the page (e.g., "About")
- **Title:** Text to display (e.g., "About Us")
- **Button Variant:** (optional) Choose a style if you want it as a button
- **Sub Links:** (optional) Click "Add item" to create dropdown menu

#### For External Links (Other Websites):
- **Is External:** Toggle ON (checked)
- **href:** Enter full URL (e.g., `https://example.com`)
- **Title:** Text to display
- **Open in new tab:** Toggle ON if you want target="_blank"
- **Button Variant:** (optional)

#### For Dropdown Menus:
- Create the main link as above
- Under **Sub Links**, click "Add item"
- Configure each sub-link with same options
- Sub-links will appear in a dropdown menu

### Step 6: Reorder Links

You can drag and drop links to reorder them in the navigation bar.

### Step 7: Save and Publish

1. Click **"Publish"** at the bottom
2. Wait 60 seconds for ISR to revalidate
3. Refresh your website to see changes

---

## Navigation Examples

### Example 1: Simple Navigation

```
Home | About | Services | Contact
```

**Configuration:**
- 4 links, all internal
- No dropdowns
- Contact link styled as button

### Example 2: Navigation with Dropdowns

```
Home | About | Services ▼ | Locations ▼ | Contact
                |              |
                ├─ Plumbing    ├─ Calgary
                ├─ HVAC        ├─ Edmonton
                └─ View All    └─ View All
```

**Configuration:**
- Services link has sub-links
- Locations link has sub-links
- Each sub-link can reference actual Service/Location documents

### Example 3: Mixed Navigation

```
Home | About | Services | Contact (button) | Blog (external) ↗
```

**Configuration:**
- Most links are internal
- Contact styled as button with `button-variant: primary`
- Blog is external link with "open in new tab" enabled

---

## Advanced: Reference Actual Services/Locations

Instead of creating "Services" as a generic page, you can reference actual Service or Location documents:

### For Services Dropdown:

1. Main link: Services page (slug: `services`)
2. Sub-links:
   - **Internal Link:** → Select "Service" document (e.g., "Emergency Plumbing")
   - **Title:** Leave blank (will use service name) or override
   - Repeat for each service

### For Locations Dropdown:

1. Main link: Locations page (slug: `locations`)
2. Sub-links:
   - **Internal Link:** → Select "Location" document (e.g., "Calgary")
   - **Title:** Leave blank or override
   - Repeat for each location

The system will automatically generate the correct URLs:
- Services: `/services/emergency-plumbing`
- Locations: `/locations/calgary`

---

## Footer Navigation

If you want footer links (Privacy Policy, Terms), you can:

### Option 1: Separate Footer Navigation

Create a second Navigation document called "Footer Navigation" and update your footer component to query it.

### Option 2: Add to Main Navigation

Add Privacy Policy and Terms of Service to the main navigation as sub-links under a "Legal" dropdown, or in the footer section of your layout component.

### Option 3: Hardcode Footer Links

Since legal pages rarely change, you can hardcode them in your footer:

```tsx
<footer>
  <Link href="/privacy-policy">Privacy Policy</Link>
  <Link href="/terms-of-service">Terms of Service</Link>
</footer>
```

---

## Testing Your Navigation

### 1. Test in Development

1. Start dev server: `pnpm dev`
2. Visit: `http://localhost:3000`
3. Check that all nav links work
4. Test dropdowns
5. Test mobile menu

### 2. Test Each Page Individually

Visit each URL directly:
- http://localhost:3000/
- http://localhost:3000/about
- http://localhost:3000/contact
- http://localhost:3000/services
- http://localhost:3000/locations
- http://localhost:3000/privacy-policy
- http://localhost:3000/terms-of-service

### 3. Check Missing Pages

If you see "This page is missing from Sanity", it means:
- The page exists in code (route is correct)
- But there's no matching page document in Sanity with that slug

**Solution:** Create the page in Sanity Studio with the correct slug.

---

## Current Navigation Query

Your navigation is queried in the header component. It fetches:

```typescript
const navigation = await client.fetch(NAVIGATION_QUERY);
```

This query returns all navigation links with resolved URLs, so the navbar component can render them correctly.

---

## Troubleshooting

### Navigation doesn't update
- **Solution:** Wait 60 seconds (ISR revalidation) or restart dev server

### Link goes to wrong page
- **Solution:** Check the slug in Sanity matches the route folder name

### Dropdown doesn't work
- **Solution:** Ensure sub-links array has items and is not empty

### "Missing from Sanity" message appears
- **Solution:** Create a page document in Sanity with the matching slug

### External link doesn't open in new tab
- **Solution:** Toggle "Open in new tab" ON in the link configuration

---

## Quick Reference: Page Slugs

| Page | Slug | URL |
|------|------|-----|
| Home | `index` | `/` |
| About | `about` | `/about` |
| Contact | `contact` | `/contact` |
| Services (landing) | `services` | `/services` |
| Locations (landing) | `locations` | `/locations` |
| Privacy Policy | `privacy-policy` | `/privacy-policy` |
| Terms of Service | `terms-of-service` | `/terms-of-service` |

**Dynamic Routes** (no page documents needed):
- `/services/[slug]` - Individual services
- `/locations/[slug]` - Individual locations
- `/[serviceSlug]/in/[locationSlug]` - Service+Location combo

---

## Next Steps

1. ✅ Pages are created (code level)
2. ⏳ Create page documents in Sanity Studio
3. ⏳ Configure navigation in Sanity Studio
4. ⏳ Add content blocks to each page
5. ⏳ Test all links
6. ⏳ Update footer with legal links

---

**Need help?** Check the Sanity Studio interface or review the documentation at `/apps/web/ROUTING-STRATEGY.md`
