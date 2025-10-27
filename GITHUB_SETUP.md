# GitHub Repository Setup

## Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com/new

2. **Repository Settings**:
   - **Repository name**: `budds-plumbing-2` (or your preferred name)
   - **Description**: `Budds Plumbing website - Next.js 15 + Sanity CMS monorepo`
   - **Visibility**: Private (recommended for client projects)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)

3. **Click**: "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/budds-plumbing-2.git

# Or if using SSH:
git remote add origin git@github.com:YOUR_USERNAME/budds-plumbing-2.git

# Push code to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 3: Configure GitHub Secrets (for CI/CD)

Once the repository is created and code is pushed:

1. Go to: `https://github.com/YOUR_USERNAME/budds-plumbing-2/settings/secrets/actions`

2. Click: **"New repository secret"**

3. Add these secrets one by one:

| Secret Name                     | Value                   | Where to Find                  |
| ------------------------------- | ----------------------- | ------------------------------ |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `2x758fv1`              | Already configured             |
| `NEXT_PUBLIC_SANITY_DATASET`    | `production`            | Already configured             |
| `NEXT_PUBLIC_SITE_URL`          | `http://localhost:3000` | Update after Vercel deployment |
| `SANITY_API_READ_TOKEN`         | (from .env.local)       | See below                      |

### Get Sanity API Read Token:

```bash
# View your current token
cat apps/web/.env.local | grep SANITY_API_READ_TOKEN
```

Copy the token value after `SANITY_API_READ_TOKEN=`

## Step 4: Verify GitHub Actions

After pushing code:

1. Go to: `https://github.com/YOUR_USERNAME/budds-plumbing-2/actions`
2. You should see the CI workflow running
3. Wait for it to complete (green checkmark = success)

## Step 5: Update Deployment Documentation

After creating the repo, update these files:

1. **Update DEPLOYMENT.md** - Replace placeholder URLs with actual repo URL
2. **Update README.md** (if needed) - Add repository link

## Quick Commands Reference

```bash
# Check current remotes
git remote -v

# Add GitHub remote (HTTPS)
git remote add origin https://github.com/YOUR_USERNAME/budds-plumbing-2.git

# Add GitHub remote (SSH)
git remote add origin git@github.com:YOUR_USERNAME/budds-plumbing-2.git

# Push to GitHub
git push -u origin main

# Verify push
git log --oneline -5
```

## Troubleshooting

### "remote origin already exists"

```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin YOUR_GITHUB_URL
```

### Authentication Issues (HTTPS)

- GitHub requires personal access token (PAT) instead of password
- Create PAT: https://github.com/settings/tokens
- Use PAT as password when prompted

### SSH Key Issues

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Add public key to GitHub
cat ~/.ssh/id_ed25519.pub
# Copy output and add at: https://github.com/settings/keys
```

## After GitHub Setup

Once the repository is on GitHub:

1. ✅ GitHub Actions CI will run automatically
2. ✅ Ready to connect to Vercel
3. ✅ Ready for team collaboration
4. ✅ Pull request workflows enabled

Then proceed to: [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel deployment.
