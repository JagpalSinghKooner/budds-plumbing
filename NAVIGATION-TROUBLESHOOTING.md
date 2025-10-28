# Navigation Troubleshooting Guide

## Issue: Links Going to Hashtags (#)

If your navigation links are showing as `#` instead of proper URLs, follow this guide.

---

## 🔍 Diagnose the Issue

### Step 1: Check Debug Page

Visit: **http://localhost:3000/debug-nav**

This page shows:
- Raw navigation data from Sanity
- Resolved links for each menu item
- Internal link types and slugs
- Sub-links analysis

**Look for:**
- `"resolvedLink": "#"` - This is the problem
- `"internalLink": null` - Link reference is missing
- `"slug": { "current": null }` - Document has no slug

---

## 🛠️ Common Causes & Fixes

### Cause 1: Internal Link Not Set in Sanity

**Symptom:** Debug page shows `"internalLink": null`

**Solution:**

1. Open Sanity Studio: http://localhost:3333
2. Go to **Navigation**
3. Click on the link that's showing `#`
4. Check if **"Internal Link"** field is empty
5. Click on **"Internal Link"** and select a document:
   - For Services: Select the "services" page
   - For Locations: Select the "locations" page
   - For About: Select the "about" page
6. Click **Publish**
7. Wait 60 seconds for ISR to revalidate
8. Refresh your website

---

### Cause 2: Page Doesn't Exist in Sanity

**Symptom:** Debug page shows `"internalLink._type": "page"` but slug is null or undefined

**Solution:**

The page you're linking to doesn't exist in Sanity yet!

1. Open Sanity Studio: http://localhost:3333
2. Go to **"Page"** section
3. Create pages with these slugs:
   - `services` - For services landing page
   - `locations` - For locations landing page
   - `about` - For about page
   - `contact` - For contact page
4. Add content blocks to each page
5. Click **Publish**
6. Go back to **Navigation**
7. Re-select the internal links
8. Click **Publish**

---

### Cause 3: Service/Location Documents Missing Slug

**Symptom:** Linking to a service/location but shows `#`

**Solution:**

1. Go to **Services** or **Locations** in Sanity Studio
2. Open the document you're trying to link to
3. Check if the **"Slug"** field is filled
4. If empty, click **"Generate"** next to the slug field
5. Click **Publish**
6. Go back to **Navigation** and the link should work now

---

### Cause 4: Wrong Document Type Referenced

**Symptom:** Debug page shows a different `_type` than expected

**Solution:**

1. In Navigation, click on the problematic link
2. Remove the current **Internal Link**
3. Select the correct document type and document
4. For example:
   - Services landing page → Type: `page`, Document: `services`
   - Individual service → Type: `service`, Document: `[service name]`
   - Location landing → Type: `page`, Document: `locations`
   - Individual location → Type: `location`, Document: `[location name]`
5. Click **Publish**

---

## 🎯 Step-by-Step: Fix Services & Locations Links

### Fix Services Link

1. **Create Services Page in Sanity:**
   - Studio → Pages → Create
   - Slug: `services`
   - Title: "Our Services"
   - Add blocks (hero, grid, etc.)
   - Publish

2. **Update Navigation:**
   - Studio → Navigation
   - Find "Services" link
   - Set **Internal Link** → Select Type: `page` → Select `services`
   - Publish

3. **Verify:**
   - Visit http://localhost:3000/debug-nav
   - Check `resolvedLink` should be `/services`
   - Visit http://localhost:3000/services
   - Should show your content

### Fix Locations Link

Same process:
1. Create page with slug `locations`
2. Link it in Navigation
3. Verify

---

## 🔧 Advanced: Check Query Results

### Test Navigation Query in Sanity Vision

1. Open Sanity Studio
2. Click **Vision** tab (at top)
3. Paste this query:

```groq
*[_type == "navigation"]{
  links[]{
    title,
    isExternal,
    href,
    internalLink->{
      _type,
      slug
    },
    "resolvedLink": select(
      isExternal == true => href,
      internalLink._ref != null && defined(internalLink->slug.current) && internalLink->_type == "page" => select(
        internalLink->slug.current == "index" => "/",
        "/" + internalLink->slug.current
      ),
      "#"
    )
  }
}
```

4. Click **Run**
5. Check the results - you should see proper `resolvedLink` values

---

## 📋 Checklist: Proper Navigation Setup

For each navigation link, verify:

- [ ] **Page exists in Sanity** with correct slug
- [ ] **Internal Link is set** in Navigation document
- [ ] **Correct document type** selected (page/service/location)
- [ ] **Document is published** (not draft)
- [ ] **Slug field is filled** in the referenced document
- [ ] **Navigation is published** after changes
- [ ] **Waited 60 seconds** for ISR revalidation

---

## 🆘 Still Not Working?

### Check Your Navigation Structure

Your navigation links should look like this in Sanity:

```
Navigation
└── Links
    ├── Link: Home
    │   ├── isExternal: false
    │   ├── internalLink: → page (index)
    │   └── title: "Home"
    │
    ├── Link: Services
    │   ├── isExternal: false
    │   ├── internalLink: → page (services)  ← MUST BE SET!
    │   └── title: "Services"
    │
    └── Link: Locations
        ├── isExternal: false
        ├── internalLink: → page (locations)  ← MUST BE SET!
        └── title: "Locations"
```

### Restart Dev Server

Sometimes you need to restart:

```bash
# Kill server
lsof -ti:3000 | xargs kill

# Restart
pnpm dev
```

### Clear Cache

```bash
# Clear Next.js cache
rm -rf apps/web/.next

# Restart
pnpm dev
```

---

## 🎯 Quick Fix Script

If you want to test quickly, you can temporarily hardcode links in the navbar:

**File:** `apps/web/components/header/navbar2.tsx`

Find this line (around line 66-77):
```typescript
const menu: MenuItem[] =
  navigation[0]?.links?.map((link) => ({
    title: link.title,
    url: (link as any).resolvedLink || '#',
```

**Temporary fix:** Change to:
```typescript
const menu: MenuItem[] =
  navigation[0]?.links?.map((link) => {
    // Temporary: Override specific links
    let url = (link as any).resolvedLink || '#';
    if (link.title === 'Services' && url === '#') {
      url = '/services';
    }
    if (link.title === 'Locations' && url === '#') {
      url = '/locations';
    }

    return {
      title: link.title,
      url,
```

**Note:** This is a temporary workaround. The proper fix is to set up the links correctly in Sanity.

---

## 📊 Expected Results

After fixing, debug page should show:

```json
{
  "title": "Services",
  "resolvedLink": "/services",
  "internalLink": {
    "_type": "page",
    "slug": {
      "current": "services"
    }
  }
}
```

And your navbar should have clickable links that go to:
- `/services` ✅
- `/locations` ✅
- `/about` ✅
- `/contact` ✅

---

## 🎓 Understanding the Issue

### Why Hashtags?

The navigation query uses a `select()` function with fallback logic:

```groq
"resolvedLink": select(
  isExternal == true => href,
  internalLink._ref != null && defined(internalLink->slug.current) => "/services/...",
  "#"  ← Falls back to this if nothing matches
)
```

If `internalLink` is:
- `null` → Falls back to `#`
- Missing `slug.current` → Falls back to `#`
- Wrong type → Falls back to `#`

### The Fix

Ensure the query can find:
1. `internalLink._ref` exists (reference is set)
2. `internalLink->slug.current` is defined (document has slug)
3. Document type matches one of the conditions

---

## ✅ Verification

After fixing, test:

1. **Visit debug page:** http://localhost:3000/debug-nav
   - All `resolvedLink` values should be proper URLs, not `#`

2. **Test navigation:**
   - Click each link in navbar
   - Should go to correct pages
   - No `#` in URL bar

3. **Check browser console:**
   - No errors about missing routes

4. **Mobile menu:**
   - Test on mobile/responsive view
   - All links should work there too

---

**If you're still stuck after trying all these solutions, share the output from the debug page and I can help diagnose further!**
