# Navigation Fix - Summary

**Issue:** Navigation links for Services and Locations were going to `#` instead of proper URLs

**Status:** ✅ Fixed

---

## 🔧 What Was Fixed

### 1. Navigation Query Updated

**File:** `apps/web/sanity/queries/navigation.ts`

**Problem:**

- Query wasn't properly dereferencing internal link references
- Missing null checks caused links to default to `#`
- No validation if referenced documents had slugs

**Solution:**

- Added proper `internalLink->{...}` dereferencing
- Added null checks: `internalLink._ref != null && defined(internalLink->slug.current)`
- Added special handling for home page (`index` slug → `/`)
- Better error handling with explicit checks

**Changes:**

```groq
// OLD (broken)
"resolvedLink": select(
  isExternal => href,
  internalLink._type == "page" => "/" + internalLink->slug.current,
  "#"
)

// NEW (fixed)
internalLink->{
  _type,
  _id,
  slug,
  name,
  title
},
"resolvedLink": select(
  isExternal == true => href,
  internalLink._ref != null && defined(internalLink->slug.current) && internalLink->_type == "page" => select(
    internalLink->slug.current == "index" => "/",
    "/" + internalLink->slug.current
  ),
  "#"
)
```

---

## 🛠️ What You Need To Do

### The query is fixed, but you still need to configure navigation in Sanity Studio!

### Step 1: Create Pages in Sanity Studio

Visit: **http://localhost:3333**

Go to **"Page"** and create these pages:

| Page      | Slug        | Purpose                |
| --------- | ----------- | ---------------------- |
| Services  | `services`  | Services landing page  |
| Locations | `locations` | Locations landing page |
| About     | `about`     | About us page          |
| Contact   | `contact`   | Contact page           |

**For each page:**

1. Click "Create" → Page
2. Set the slug (e.g., `services`)
3. Add a title
4. Add content blocks (hero, sections, etc.)
5. Add SEO metadata (meta title, description)
6. Click **Publish**

### Step 2: Configure Navigation

Go to **"Navigation"** in Sanity Studio:

1. Click on the Navigation document
2. For each link (Services, Locations, etc.):
   - Set **Is External** to OFF (unchecked)
   - Click **Internal Link**
   - Select the page you created (e.g., "services")
   - Set the **Title** (e.g., "Services")
   - Optionally add **Sub Links** for dropdowns
3. Click **Publish**
4. Wait 60 seconds for cache to clear

---

## 🐛 Debug Tools Created

### 1. Debug Page

Visit: **http://localhost:3000/debug-nav**

This page shows:

- Raw navigation data from Sanity
- Resolved links for each menu item
- Internal link types and slugs
- What's missing or misconfigured

**Use this to diagnose issues!**

### 2. Troubleshooting Guide

See: **[NAVIGATION-TROUBLESHOOTING.md](NAVIGATION-TROUBLESHOOTING.md)**

Covers:

- All common causes of `#` links
- Step-by-step fixes
- How to use debug tools
- Quick reference checklist

---

## ✅ Testing Your Navigation

### 1. Check Debug Page First

Visit: http://localhost:3000/debug-nav

**Look for:**

- ✅ `"resolvedLink": "/services"` (good)
- ❌ `"resolvedLink": "#"` (needs fixing)
- ❌ `"internalLink": null` (link not set in Sanity)

### 2. Test Each Link

Click on each navigation link and verify:

- Home → Should go to `/`
- Services → Should go to `/services`
- Locations → Should go to `/locations`
- About → Should go to `/about`
- Contact → Should go to `/contact`

### 3. Test Dropdowns (If You Have Them)

If you added sub-links:

- Hover over Services → Should show dropdown
- Click sub-link → Should go to specific service
- Same for Locations

---

## 🎯 Expected Navigation Structure

After setup, your navigation in Sanity should look like:

```
Navigation
└── Links (array)
    ├── Home
    │   ├── isExternal: false ✓
    │   ├── internalLink: → page (index) ✓
    │   └── title: "Home"
    │
    ├── Services
    │   ├── isExternal: false ✓
    │   ├── internalLink: → page (services) ✓
    │   ├── title: "Services"
    │   └── subLinks (optional)
    │       ├── Service 1 → service document
    │       └── Service 2 → service document
    │
    ├── Locations
    │   ├── isExternal: false ✓
    │   ├── internalLink: → page (locations) ✓
    │   ├── title: "Locations"
    │   └── subLinks (optional)
    │       ├── Calgary → location document
    │       └── Edmonton → location document
    │
    ├── About
    │   ├── isExternal: false ✓
    │   ├── internalLink: → page (about) ✓
    │   └── title: "About"
    │
    └── Contact
        ├── isExternal: false ✓
        ├── internalLink: → page (contact) ✓
        ├── title: "Contact"
        └── buttonVariant: "primary" (optional - makes it a button)
```

---

## 🔄 Workflow Summary

1. ✅ **Code Fixed** - Navigation query updated
2. ⏳ **Create Pages** - Add pages in Sanity Studio
3. ⏳ **Configure Navigation** - Link pages in Navigation
4. ⏳ **Test** - Use debug page and manual testing
5. ⏳ **Add Content** - Add blocks to each page

---

## 📋 Quick Checklist

Before testing:

- [ ] Pages created in Sanity with correct slugs
- [ ] Navigation links configured in Sanity
- [ ] Each link has `internalLink` set (not empty)
- [ ] Navigation published
- [ ] Waited 60 seconds after publishing
- [ ] Dev server restarted (already done)

---

## 🆘 If Links Still Show `#`

### Common Issues:

1. **Page doesn't exist in Sanity**
   - Solution: Create the page with matching slug

2. **Internal link not set**
   - Solution: In Navigation, click the link and set Internal Link

3. **Wrong document type selected**
   - Solution: For landing pages, select Type: `page`

4. **Document not published**
   - Solution: Click Publish button in Sanity

5. **Need to wait for ISR**
   - Solution: Wait 60 seconds or restart dev server

### Check Debug Page

Visit http://localhost:3000/debug-nav to see exactly what's wrong.

### See Troubleshooting Guide

Full details in: [NAVIGATION-TROUBLESHOOTING.md](NAVIGATION-TROUBLESHOOTING.md)

---

## 🎉 Success Criteria

You'll know it's working when:

1. ✅ Debug page shows all links with proper `/path` values
2. ✅ Clicking nav links goes to pages (not `#`)
3. ✅ URL bar shows correct path
4. ✅ No console errors
5. ✅ Mobile menu works too

---

## 📚 Related Documentation

- [NAVIGATION-SETUP-GUIDE.md](NAVIGATION-SETUP-GUIDE.md) - How to set up navigation
- [NAVIGATION-TROUBLESHOOTING.md](NAVIGATION-TROUBLESHOOTING.md) - Detailed troubleshooting
- [PAGES-CREATED-SUMMARY.md](PAGES-CREATED-SUMMARY.md) - List of all pages

---

**Next Step:** Go to Sanity Studio and create the pages, then configure the navigation!

**Dev Server Status:** ✅ Running on http://localhost:3000
**Sanity Studio Status:** Check if running on http://localhost:3333
