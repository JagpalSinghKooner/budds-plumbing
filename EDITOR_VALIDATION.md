# Editor Workflow Validation Checklist

This document provides step-by-step validation for the Sanity Studio editor workflow to ensure all schemas, fallback logic, and content management features work correctly.

## Prerequisites

1. **Start the development server**:

   ```bash
   pnpm dev
   ```

2. **Access Sanity Studio**:
   - Navigate to: http://localhost:3000/studio
   - Login with your Sanity account

## Phase 1: Schema Validation

### ✅ Service Schema

1. **Create a New Service**:
   - Go to "Service" in the studio sidebar
   - Click "Create new Service"
   - Verify all groups are visible with icons:
     - 📄 Content
     - 🔍 SEO
     - 📱 Sections

2. **Test Required Fields**:
   - Leave "Service Name" empty → Should show error: "Service name is required"
   - Leave "Slug" empty → Should show error: "Slug is required for the service URL"
   - Fill in both fields → Errors should clear

3. **Test Field Validation**:
   - **Headline**: Enter 150 characters → Should show warning about 120 character limit
   - **Introduction**: Enter 600 characters → Should show warning about 500 character limit
   - **Meta Title**: Enter 70 characters → Should show warning about 60 character limit
   - **Meta Description**: Enter 180 characters → Should show warning about 160 character limit

4. **Test Search Engine Indexing Field**:
   - Verify it's a **radio button** (not checkbox)
   - Verify two options:
     - ○ Allow indexing
     - ○ Prevent indexing (noindex)
   - Default should be "Allow indexing"

5. **Test Sections**:
   - Click "Page Sections" in Sections group
   - Click "Insert" → Should see organized groups:
     - Hero, Logo Cloud, Section Header, Grid, Split, Carousel, Timeline, CTA, FAQs, Forms
   - Add a "Hero 1" block
   - Verify block appears with all fields

6. **Test Image Hotspot**:
   - Add "Open Graph Image" in SEO group
   - Upload an image
   - Verify hotspot tool appears (crosshair for focal point selection)

7. **Save and Preview**:
   - Fill in minimum required fields
   - Click "Publish"
   - Verify preview shows all data correctly

### ✅ Location Schema

1. **Create a New Location**:
   - Go to "Location" in sidebar
   - Click "Create new Location"
   - Verify all groups with icons:
     - 📄 Content
     - 🔍 SEO
     - 📱 Sections

2. **Test Required Fields**:
   - Verify "Location Name" is required
   - Verify "Slug" is required

3. **Test Coverage Areas**:
   - Click "Coverage Areas" field
   - Type and press Enter to add tags
   - Verify tags layout (not list)
   - Add multiple areas: "Downtown", "Midtown", "Uptown"

4. **Test Phone Validation**:
   - Enter invalid phone: "abc123" → Should show validation error
   - Enter valid phone: "(555) 123-4567" → Should accept

5. **Test Image with Alt Text**:
   - Upload "Location Image"
   - Verify "Alternative Text" field appears
   - Leave empty and try to save → Should show error: "Alt text is required for accessibility"

6. **Test Search Engine Indexing**:
   - Verify radio button layout (not checkbox)
   - Default should be "Allow indexing"

7. **Test Preview**:
   - Fill required fields and coverage areas
   - Verify preview shows: Location name + "Serving: [areas]"

### ✅ Service-Location Schema

1. **Create a Service-Location**:
   - Go to "Service Location" in sidebar
   - Click "Create new Service Location"
   - Verify all groups with icons:
     - 🔗 References
     - 📄 Content Overrides
     - 🔍 SEO
     - 📱 Sections

2. **Test References**:
   - **Service** field: Select the service created earlier
   - **Location** field: Select the location created earlier
   - Both should be required

3. **Test Preview Title**:
   - After selecting both references
   - Preview should show: "[Service Name] in [Location Name]"
   - Before selecting: Should show "Service Location (incomplete)"

4. **Test Content Overrides**:
   - All override fields should be optional
   - **Headline Override**: Enter custom headline
   - **Introduction Override**: Enter custom intro
   - Verify these are marked as "Optional"

5. **Test Search Engine Indexing**:
   - Verify radio button (not checkbox)
   - Default "Allow indexing"

6. **Publish**:
   - Save and publish
   - Verify document appears in list

## Phase 2: Fallback Logic Validation

### Test Service-Location Fallback

1. **Create Service-Location WITHOUT Overrides**:
   - Create new service-location
   - Select Service and Location references
   - Leave all override fields empty
   - Publish

2. **View Frontend**:

   ```bash
   # Open in browser
   http://localhost:3000/locations/[location-slug]/services/[service-slug]
   ```

3. **Verify Fallback Behavior**:
   - Page title should use: Service Name + " in " + Location Name
   - Headline should use: Service headline
   - Intro should use: Service introCopy
   - Sections should use: Service blocks
   - Meta title should combine: Service name + Location name

4. **Create Service-Location WITH Overrides**:
   - Create another service-location
   - Select same Service and Location
   - Fill in ALL override fields:
     - Custom headline
     - Custom intro
     - Custom sections
     - Custom meta title

5. **View Frontend**:
   - Navigate to the overridden service-location page
   - Verify it uses OVERRIDE values, not service defaults

6. **Test Partial Overrides**:
   - Create third service-location
   - Override ONLY headline
   - Leave other fields empty
   - Verify:
     - Uses custom headline ✅
     - Falls back to service intro ✅
     - Falls back to service sections ✅

## Phase 3: NOINDEX Validation

### Test Search Engine Indexing

1. **Service with "Allow indexing"**:
   - Set service noindex to "Allow indexing"
   - Publish
   - Check frontend page source (Ctrl+U)
   - Should NOT see: `<meta name="robots" content="noindex">`

2. **Service with "Prevent indexing"**:
   - Set service noindex to "Prevent indexing (noindex)"
   - Publish
   - Check frontend page source
   - SHOULD see: `<meta name="robots" content="noindex, nofollow">`

3. **Check Sitemap**:
   - Navigate to: http://localhost:3000/sitemap.xml
   - Verify "Prevent indexing" pages are NOT in sitemap
   - Verify "Allow indexing" pages ARE in sitemap

4. **Service-Location Inheritance**:
   - Create service-location with service that has "Prevent indexing"
   - Service-location has "Allow indexing"
   - Verify: Page still shows noindex (inherits from service)

## Phase 4: UI/UX Validation

### Test Group Icons

1. **Verify All Icons Display**:
   - Open Service document
   - Check tabs at top show icons:
     - 📄 Content
     - 🔍 SEO
     - 📱 Sections
   - Repeat for Location and Service-Location

### Test Field Organization

1. **Check Field Order**:
   - Fields should be ordered from most important to least
   - Required fields should be at top of each group

2. **Check Descriptions**:
   - Hover over field labels
   - Verify helpful descriptions appear for:
     - Slug, Coverage Areas, Phone Number, etc.

### Test Validation Messages

1. **Required Field Errors**:
   - Should be specific: "Service name is required"
   - NOT generic: "This field is required"

2. **Warning Messages**:
   - Should use `.warning()` not `.error()` for:
     - Character length suggestions
     - Format recommendations

## Phase 5: Build Validation

### Run Full Build

1. **Run Build Command**:

   ```bash
   pnpm build
   ```

2. **Verify Build Success**:
   - Should show: "✓ Generating static pages (34/34)"
   - Check for service routes:
     - `/services/[serviceSlug]`
     - `/locations/[locationSlug]`
     - `/locations/[locationSlug]/services/[serviceSlug]`

3. **Check Build Output**:
   - All pages should be marked as `●` (SSG - Static Site Generation)
   - No pages should be `ƒ` (Dynamic) for SEO performance

## Troubleshooting

### Studio Won't Load

**Check**:

```bash
# Verify Sanity config
cat apps/studio/sanity.config.ts

# Verify environment variables
cat apps/web/.env.local
```

### Schema Changes Not Appearing

**Solution**:

```bash
# Regenerate types
cd apps/studio
pnpm sanity schema extract
pnpm sanity typegen generate
cp sanity.types.ts ../web/sanity.types.ts
```

### Frontend Not Showing Content

**Solution**:

1. Check Sanity Studio: Verify documents are published (not drafts)
2. Check GROQ queries: Use Studio Vision tool to test queries
3. Rebuild: `pnpm build` to regenerate static pages

## Success Criteria

- [ ] All schemas load without errors
- [ ] All required validation works correctly
- [ ] Search Engine Indexing shows as radio buttons (not checkboxes)
- [ ] All groups display icons
- [ ] Image hotspot tool works
- [ ] Fallback logic displays correct content
- [ ] NOINDEX pages excluded from sitemap
- [ ] Build generates 34+ static pages
- [ ] Preview displays correct data in all cases
- [ ] No TypeScript or lint errors

---

**Status**: Once all checkboxes are complete, Phase 1 is validated and ready for production deployment.
