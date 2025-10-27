# Deployment Guide

## Prerequisites

- GitHub account with repository access
- Vercel account (sign up at https://vercel.com)
- Sanity project ID and dataset (already configured)

## Vercel Deployment Steps

### 1. Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `budds-plumbing-2`
4. Vercel will auto-detect the Next.js framework

### 2. Configure Project Settings

**Root Directory**: Leave as default (Vercel will detect monorepo)

**Framework Preset**: Next.js

**Build & Development Settings**:

- **Build Command**: `pnpm turbo run build --filter=@budds-plumbing/web`
- **Output Directory**: `apps/web/.next`
- **Install Command**: `pnpm install`
- **Development Command**: `cd apps/web && pnpm dev`

### 3. Configure Environment Variables

Add the following environment variables in Vercel Project Settings → Environment Variables:

#### Required Variables

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_ENV=production

# Sanity CMS
NEXT_PUBLIC_SANITY_API_VERSION=2024-10-18
NEXT_PUBLIC_SANITY_PROJECT_ID=2x758fv1
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_sanity_read_token_here

# Email (Optional - if using Resend)
RESEND_API_KEY=your_resend_key_here
RESEND_AUDIENCE_ID=your_audience_id_here
```

**Important**:

- Set these for **Production**, **Preview**, and **Development** environments
- Use the actual Sanity read token from your `.env.local` file
- Update `NEXT_PUBLIC_SITE_URL` to your actual Vercel domain after first deployment

### 4. Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (2-5 minutes)
3. Vercel will provide a deployment URL

### 5. Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed by Vercel
4. Update `NEXT_PUBLIC_SITE_URL` environment variable with your custom domain

### 6. Update GitHub Secrets for CI/CD

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=2x758fv1
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
SANITY_API_READ_TOKEN=your_sanity_read_token_here
```

This ensures GitHub Actions CI checks can build successfully.

## Sanity Studio Deployment

The Sanity Studio is embedded in the Next.js app at `/studio` route and deploys automatically with the main app.

To access Sanity Studio in production:

- URL: `https://your-domain.vercel.app/studio`
- Login with your Sanity account credentials

## Continuous Deployment

Once connected to GitHub, Vercel will automatically:

- Deploy on every push to `main` branch
- Create preview deployments for pull requests
- Run GitHub Actions quality checks before deployment

## Troubleshooting

### Build Fails with "Module not found"

**Solution**: Ensure `pnpm-lock.yaml` is committed to the repository

### Environment Variables Not Working

**Solution**:

1. Verify all required variables are set in Vercel dashboard
2. Redeploy after adding/updating variables
3. Check variable names match exactly (case-sensitive)

### Sanity Content Not Loading

**Solution**:

1. Verify `SANITY_API_READ_TOKEN` is correctly set
2. Check token permissions in Sanity dashboard
3. Ensure Sanity dataset name matches (`production`)

### Build Timeout

**Solution**: Contact Vercel support to increase build timeout if needed

## Monitoring

After deployment, monitor:

- **Vercel Dashboard**: Deployment status, build logs, performance metrics
- **Vercel Analytics**: Page views, performance scores
- **GitHub Actions**: CI check results on every push

## Rollback

To rollback to a previous deployment:

1. Go to Vercel Dashboard → Deployments
2. Find the working deployment
3. Click "..." → "Promote to Production"

---

**Need Help?**

- Vercel Docs: https://vercel.com/docs
- Sanity Docs: https://www.sanity.io/docs
- GitHub Actions Docs: https://docs.github.com/en/actions
