# Quick Start Guide - Client Provisioning

## 1. Prerequisites Check

Ensure you have these environment variables set in your `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
SANITY_API_READ_TOKEN=your-write-token
NEXT_PUBLIC_SANITY_API_VERSION=2024-10-18
```

## 2. Create a New Client (Interactive)

Run this command from the project root:

```bash
pnpm run provision:create
```

Follow the prompts:
1. Enter client name (e.g., "ACME Plumbing")
2. Enter slug (e.g., "acme") - lowercase, hyphens only
3. Enter email (e.g., "contact@acme.com")
4. Enter phone (optional)
5. Enter website (optional)
6. Choose template preset (1-4)
7. Confirm and proceed

## 3. Validate the Client

After provisioning, validate the setup:

```bash
pnpm run provision:validate client-acme
```

Replace `client-acme` with your actual dataset name.

## 4. Quick CLI Provisioning

For scripting or faster provisioning:

```bash
cd scripts/provisioning
pnpm install
pnpm run create-client "ACME Plumbing" "acme" "contact@acme.com" plumbing
```

## 5. Update Environment Variables

After successful provisioning, update your `.env.local`:

```bash
NEXT_PUBLIC_SANITY_DATASET=client-acme
```

## 6. Access Sanity Studio

1. Navigate to `http://localhost:3000/studio`
2. Select the new dataset from the dropdown
3. Start customizing content

## Template Presets

- **general**: Generic professional services (default)
- **plumbing**: Plumbing and emergency services
- **hvac**: Heating, cooling, HVAC services
- **electrical**: Electrical and lighting services

## What Gets Created

### Documents
- ✓ Settings (site name, copyright)
- ✓ Navigation (main menu)
- ✓ Home page (with hero and CTA)
- ✓ Sample service page
- ✓ Sample location page

### Next Steps
1. Update logo in Settings
2. Customize hero content
3. Add real services and locations
4. Update navigation links
5. Configure SEO metadata

## Common Issues

### "Dataset already exists"
- Choose a different slug
- Or delete existing dataset: `sanity dataset delete client-acme`

### "Token must have write permissions"
- Generate a new token in Sanity dashboard
- Ensure it has "Write" access level

### "Validation failed"
- Check error messages
- Verify all documents were created
- Re-run validation: `pnpm run provision:validate <dataset-name>`

## Commands Reference

```bash
# Interactive provisioning
pnpm run provision:create

# CLI provisioning
cd scripts/provisioning && pnpm run create-client <name> <slug> <email> [preset]

# Validate dataset
pnpm run provision:validate <dataset-name>

# Install dependencies only
cd scripts/provisioning && pnpm install
```

## Support

For detailed documentation, see [README.md](./README.md)
