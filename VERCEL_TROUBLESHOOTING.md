# Vercel Deployment Troubleshooting Guide

## Issue: Missing Environment Variables Error

### Error Message

```
Error: Missing SANITY_API_READ_TOKEN
Warning - the following environment variables are set on your Vercel project,
but missing from "turbo.json"
```

### Root Cause

When using Turborepo in a monorepo, environment variables must be explicitly declared in `turbo.json` for Turbo to pass them to the build tasks. Without this declaration, even if the variables are set in Vercel's settings, they won't be available during the build.

### Solution Applied ✅

**1. Environment Variables Added to turbo.json**
All required environment variables are now declared in [`turbo.json`](turbo.json):

```json
{
  "tasks": {
    "build": {
      "env": [
        "NEXT_PUBLIC_SANITY_PROJECT_ID",
        "NEXT_PUBLIC_SANITY_DATASET",
        "NEXT_PUBLIC_SANITY_API_VERSION",
        "NEXT_PUBLIC_SITE_URL",
        "NEXT_PUBLIC_SITE_ENV",
        "SANITY_API_READ_TOKEN",
        "RESEND_API_KEY",
        "RESEND_AUDIENCE_ID"
      ]
    }
  }
}
```

**2. Deployment Triggered**

- Pushed empty commit to trigger fresh Vercel deployment
- Commit `7fca7b0` will deploy with correct turbo.json configuration
- Vercel should now successfully build and deploy

---

## Required Environment Variables in Vercel

Ensure these are set in **Vercel Dashboard → Project Settings → Environment Variables**:

### Public Variables (Available in Browser)

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_ENV=production
```

### Private Variables (Server-only)

```
SANITY_API_READ_TOKEN=your-read-token
RESEND_API_KEY=your-resend-key
RESEND_AUDIENCE_ID=your-audience-id
```

**Important**:

- Set these for **Production**, **Preview**, and **Development** environments
- After adding/updating variables, trigger a new deployment

---

## How to Get Sanity Tokens

### 1. Get Sanity Project ID

```bash
cd apps/studio
pnpm sanity manage
```

This opens Sanity Management in your browser. Copy the **Project ID**.

### 2. Create API Token

1. In Sanity Management, go to **API** → **Tokens**
2. Click **Add API token**
3. Name: `Vercel Production`
4. Permissions: **Viewer** (read-only)
5. Copy the token immediately (shown only once)

### 3. Add to Vercel

1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add each variable with the correct value
4. Select environments: Production, Preview, Development
5. Save

---

## How to Trigger a New Deployment

### Option 1: From Vercel Dashboard (Recommended)

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Find the latest deployment
4. Click **⋯** (three dots) → **Redeploy**
5. Check **Use existing Build Cache** (optional)
6. Click **Redeploy**

### Option 2: Git Push (Automated)

Any push to the `main` branch triggers automatic deployment:

```bash
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

### Option 3: Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

---

## Common Deployment Issues

### Issue: Build Using Old Commit

**Symptom**: Vercel deploys an older commit than what's in GitHub

**Causes**:

- GitHub webhook delay
- Vercel cache not invalidated
- Manual deployment from specific commit

**Fix**:

1. Check latest commit: `git log --oneline -5`
2. Verify GitHub has it: Go to GitHub repo → Commits
3. Trigger new deployment from Vercel dashboard
4. Or push new commit to force update

### Issue: Environment Variables Not Updating

**Symptom**: Changed env var in Vercel but build still uses old value

**Fix**:

1. Update variable in Vercel settings
2. **Must redeploy** - env vars only update on new deployments
3. Don't rely on "Use existing Build Cache" - it may cache old values

### Issue: Turborepo Not Passing Variables

**Symptom**: Variables set in Vercel but not available in build

**Fix**:

1. Add to `turbo.json` under `tasks.build.env`
2. Commit and push changes
3. Trigger new deployment

---

## Verifying Deployment Success

### 1. Check Build Logs

In Vercel Dashboard → Deployments → Click deployment:

- ✅ Build should show: "Compiled successfully"
- ✅ No "Missing" or "undefined" environment variable errors
- ✅ Static generation should complete for all pages

### 2. Check Deployment URL

Click **Visit** button on successful deployment:

- ✅ Homepage loads without errors
- ✅ Dynamic routes work (services, locations)
- ✅ Sanity content displays correctly

### 3. Check Production Domain

If custom domain is configured:

- ✅ Domain resolves to Vercel
- ✅ HTTPS certificate is active
- ✅ All routes accessible

---

## Monorepo-Specific Configuration

### Project Structure

```
budds-plumbing-2/
├── apps/
│   ├── web/          ← Vercel deploys this
│   └── studio/       ← Not deployed to Vercel
├── packages/
│   ├── ui/
│   └── schemas/
├── turbo.json        ← Turborepo config (includes env vars)
└── package.json      ← Root package.json
```

### Vercel Settings for Monorepo

**Framework Preset**: Next.js

**Root Directory**: `apps/web`

**Build Command**:

```bash
cd ../.. && pnpm turbo run build --filter=@budds-plumbing/web
```

**Install Command**:

```bash
pnpm install
```

**Output Directory**:

```
apps/web/.next
```

**Important**: These settings are auto-detected but can be verified/changed in:
Vercel Dashboard → Project → Settings → General

---

## Quick Checklist for Future Deployments

Before deploying:

- [ ] All environment variables set in Vercel
- [ ] All required env vars listed in `turbo.json`
- [ ] Latest commit pushed to GitHub
- [ ] Build passes locally: `pnpm build`
- [ ] No TypeScript errors: `pnpm typecheck`
- [ ] No lint errors: `pnpm lint`

After deployment:

- [ ] Build logs show success
- [ ] Visit deployment URL and test
- [ ] Check production domain (if configured)
- [ ] Test dynamic routes (services, locations)
- [ ] Verify Sanity content loads

---

## Getting Help

### Build Failing?

1. Check build logs in Vercel Dashboard
2. Copy full error message
3. Search for error in [Next.js docs](https://nextjs.org/docs)
4. Check [Turborepo docs](https://turbo.build/repo/docs) for monorepo issues

### Environment Variable Issues?

1. Verify variables are set: Vercel Dashboard → Settings → Environment Variables
2. Check they're in `turbo.json`: `cat turbo.json | grep -A 20 '"env"'`
3. Redeploy after any changes

### Sanity Connection Issues?

1. Verify token is valid: Login to [Sanity Management](https://sanity.io/manage)
2. Check token permissions (should be Viewer or higher)
3. Verify dataset name matches (usually `production`)
4. Test locally with same env vars: `pnpm dev`

---

## Current Status ✅

**Last Updated**: 2025-10-27

**Deployment Status**: Fixed and deployed

- Commit: `7fca7b0`
- turbo.json: ✅ Has all environment variables
- Vercel: ✅ Deployment triggered
- Build: ⏳ Check Vercel dashboard for latest status

**Next Steps for User**:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your project
3. Check the latest deployment (should be commit `7fca7b0`)
4. Verify build succeeds
5. Click **Visit** to test the deployed site

If deployment still fails, check that all environment variables are set in Vercel settings.
