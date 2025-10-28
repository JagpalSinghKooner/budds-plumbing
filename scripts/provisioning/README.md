# Client Provisioning Automation System

Automated system for provisioning new clients in the Budds Plumbing multi-tenant Sanity CMS setup.

## Overview

This provisioning system automates the creation of new client datasets, including:

- Creating isolated Sanity datasets for each client
- Seeding initial content (settings, navigation, pages)
- Validating dataset setup
- Error handling and rollback capabilities

## Prerequisites

1. **Environment Variables**: Ensure these are set in your `.env.local`:

   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-10-18
   SANITY_API_READ_TOKEN=your-write-token
   ```

   **Important**: The `SANITY_API_READ_TOKEN` must have **write permissions** for dataset creation.

2. **Sanity Project Setup**: Ensure you have admin access to the Sanity project.

3. **Dependencies**: All dependencies will be installed automatically when running the scripts.

## Scripts

### 1. Create Client (`create-client.ts`)

Main provisioning script that creates a new client dataset and seeds initial content.

**Features:**

- Creates a new Sanity dataset
- Seeds default settings, navigation, and pages
- Optional sample service and location pages
- Template presets for different business types
- Automatic validation after provisioning
- Rollback on failure

**Usage:**

**Interactive Mode** (Recommended for first-time use):

```bash
pnpm run provision:create
```

This will prompt you for:

- Client name
- Client slug (used in dataset name)
- Client email
- Phone number (optional)
- Website (optional)
- Template preset (general, plumbing, hvac, electrical)

**CLI Mode** (For scripting):

```bash
cd scripts/provisioning
pnpm install
pnpm run create-client "Client Name" "client-slug" "email@example.com" [preset]
```

**Examples:**

```bash
# Interactive mode
pnpm run provision:create

# CLI mode with default preset
pnpm run provision:create "ACME Plumbing" "acme" "contact@acme.com"

# CLI mode with plumbing preset
pnpm run provision:create "ACME Plumbing" "acme" "contact@acme.com" plumbing
```

### 2. Validate Client (`validate-client.ts`)

Validation script that checks if a client dataset is properly configured.

**Features:**

- Checks dataset existence
- Validates required documents (settings, navigation)
- Validates schema structure
- Reports warnings for missing optional content

**Usage:**

```bash
pnpm run provision:validate <dataset-name>
```

**Examples:**

```bash
# Validate a specific dataset
pnpm run provision:validate client-acme

# From the provisioning directory
cd scripts/provisioning
pnpm install
pnpm run validate-client client-acme
```

**Exit Codes:**

- `0`: Validation passed
- `1`: Validation failed

### 3. Seed Templates (`seed-templates.ts`)

Module containing content templates and preset configurations.

**Template Presets:**

1. **General** (default)
   - Generic professional services
   - Suitable for any business type

2. **Plumbing**
   - Plumbing-specific content
   - Emergency services focus

3. **HVAC**
   - Heating and cooling services
   - HVAC installation and repair

4. **Electrical**
   - Electrical services
   - Licensed electrician focus

## Seeded Content

When a client is provisioned, the following content is automatically created:

### Settings Document

- Site name
- Copyright information
- Logo placeholders (can be updated later)

### Navigation Document

- Main navigation with default links:
  - Home
  - Services
  - Locations
  - About
  - Contact

### Home Page

- Hero block with welcome message
- CTA block for contact
- SEO metadata

### Sample Service Page (optional)

- Hero block specific to the service
- CTA block
- SEO metadata
- Customizable based on template preset

### Sample Location Page (optional)

- Hero block for the location
- CTA block
- SEO metadata
- Customizable based on template preset

## Dataset Naming Convention

Datasets are created with the naming pattern: `client-{slug}`

Example: Client slug "acme" creates dataset "client-acme"

You can override this by providing a custom `datasetName` in the configuration.

## Error Handling & Rollback

The provisioning system includes comprehensive error handling:

### Automatic Rollback

If provisioning fails after dataset creation, the system will automatically:

1. Delete the partially created dataset
2. Clean up any created documents
3. Report detailed error messages

### Manual Rollback

To manually delete a failed dataset:

```bash
# Use Sanity CLI
sanity dataset delete <dataset-name>
```

### Common Errors

**"Dataset already exists"**

- A dataset with this slug already exists
- Choose a different slug or delete the existing dataset

**"Token must have write permissions"**

- Your SANITY_API_READ_TOKEN lacks write permissions
- Generate a new token with appropriate permissions in Sanity dashboard

**"Configuration validation failed"**

- Invalid client configuration
- Check slug format (lowercase, alphanumeric, hyphens only)
- Verify email format

## Validation Checks

The validation script performs these checks:

1. **Dataset Existence**: Verifies the dataset exists in the project
2. **Settings Document**: Ensures settings singleton exists
3. **Navigation Document**: Checks for navigation document (warning if missing)
4. **Schema Validation**: Validates critical document types
5. **Document Count**: Reports total documents and warns if empty

## Development

### File Structure

```
scripts/provisioning/
├── README.md                 # This file
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── types.ts                 # TypeScript interfaces
├── create-client.ts         # Main provisioning script
├── validate-client.ts       # Validation script
└── seed-templates.ts        # Content templates
```

### Adding New Templates

To add a new template preset:

1. Add the preset to `TEMPLATE_PRESETS` in `seed-templates.ts`:

```typescript
export const TEMPLATE_PRESETS = {
  // ... existing presets
  yourPreset: {
    serviceName: 'Your Service Name',
    locationName: 'Your Location',
    heroTagline: 'Your Tagline',
    ctaTitle: 'Your CTA',
  },
} as const;
```

2. Update the `TemplatePreset` type to include your new preset

3. Update the interactive menu in `create-client.ts`

### Extending Seed Data

To add additional content to seed data:

1. Update the `SeedData` interface in `types.ts`
2. Create a generator function in `seed-templates.ts`
3. Update `generateSeedData()` to include your new content
4. Update the seeding logic in `create-client.ts`

## Security Considerations

1. **Token Permissions**: Store tokens securely and never commit to version control
2. **Environment Variables**: Use `.env.local` and ensure it's in `.gitignore`
3. **Dataset Isolation**: Each client dataset is private by default
4. **Validation**: Always validate inputs before provisioning

## Troubleshooting

### Script Won't Run

```bash
# Ensure dependencies are installed
cd scripts/provisioning
pnpm install

# Check Node.js version (requires >= 18.0.0)
node --version

# Check if tsx is available
pnpm list tsx
```

### Permission Errors

```bash
# Make scripts executable
chmod +x scripts/provisioning/create-client.ts
chmod +x scripts/provisioning/validate-client.ts
```

### Dataset Creation Fails

- Verify SANITY_API_READ_TOKEN has write permissions
- Check if dataset name already exists
- Ensure you have admin access to the project

### Validation Fails After Provisioning

- Check error messages for specific issues
- Verify all documents were created
- Run validation manually: `pnpm run provision:validate <dataset-name>`

## Next Steps After Provisioning

1. **Update Environment Variables**

   ```env
   NEXT_PUBLIC_SANITY_DATASET=client-yourslug
   ```

2. **Access Sanity Studio**
   - Navigate to `/studio` in your application
   - Select the new dataset from the dropdown
   - Customize default content

3. **Customize Content**
   - Update logo in Settings
   - Add actual services and locations
   - Configure navigation
   - Update SEO metadata

4. **Configure Deployment**
   - Set up domain for client
   - Configure environment variables
   - Deploy application

5. **Test the Setup**
   - Verify all pages render correctly
   - Test navigation
   - Check SEO metadata
   - Validate forms and functionality

## Support

For issues or questions:

1. Check this README for common solutions
2. Review error messages and logs
3. Validate configuration and environment variables
4. Contact the development team

## Version History

- **v1.0.0** (2025-01-28)
  - Initial release
  - Support for basic client provisioning
  - Template presets (general, plumbing, hvac, electrical)
  - Validation system
  - Rollback capabilities
