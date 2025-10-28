# Client Provisioning System - Implementation Summary

## Overview

A comprehensive automation system for provisioning new clients in the Budds Plumbing multi-tenant Sanity CMS setup. The system handles dataset creation, content seeding, validation, and rollback with enterprise-grade error handling.

## Directory Structure

```
scripts/provisioning/
├── README.md                    # Comprehensive documentation
├── QUICK-START.md              # Quick reference guide
├── IMPLEMENTATION-SUMMARY.md   # This file
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── .gitignore                  # Git ignore rules
├── example-config.json         # Example configuration
├── types.ts                    # TypeScript interfaces (220 lines)
├── utils.ts                    # Utility functions (284 lines)
├── seed-templates.ts           # Content templates (406 lines)
├── create-client.ts            # Main provisioning script (558 lines)
└── validate-client.ts          # Validation script (322 lines)
```

**Total Lines of Code**: ~1,790 TypeScript lines + ~460 documentation lines

## Scripts Created

### 1. create-client.ts (Main Provisioning Script)

**Purpose**: Automates the complete client provisioning process.

**Features**:
- Interactive CLI mode with user prompts
- Non-interactive CLI mode for scripting
- Creates isolated Sanity datasets
- Seeds initial content
- Automatic validation
- Rollback on failure
- Template presets for different business types

**Usage**:
```bash
# Interactive mode
pnpm run provision:create

# CLI mode
cd scripts/provisioning
pnpm run create-client "Client Name" "slug" "email@example.com" [preset]
```

**Key Functions**:
- `provisionClient()`: Main orchestration function
- `createDataset()`: Creates new Sanity dataset
- `seedInitialData()`: Populates dataset with templates
- `performRollback()`: Handles cleanup on failure
- `validateClientConfig()`: Validates input data
- `interactiveProvisioning()`: Handles user interaction
- `cliProvisioning()`: Handles command-line provisioning

**Error Handling**:
- Configuration validation with detailed error messages
- Environment variable verification
- Dataset existence checking
- Transaction-based document creation
- Automatic rollback on failure
- Comprehensive error logging

### 2. seed-templates.ts (Content Templates)

**Purpose**: Provides default content templates for new clients.

**Features**:
- Modular template generation
- Template presets (general, plumbing, hvac, electrical)
- Customizable content blocks
- Type-safe template structure

**Key Functions**:
- `generateKey()`: Creates unique block keys
- `createDefaultHeroBlock()`: Hero section template
- `createDefaultCTABlock()`: Call-to-action template
- `createDefaultSettings()`: Settings document
- `createDefaultNavigation()`: Navigation structure
- `createDefaultHomePage()`: Home page with blocks
- `createSampleService()`: Service page template
- `createSampleLocation()`: Location page template
- `generateSeedData()`: Complete seed data generator
- `generatePresetSeedData()`: Preset-based generator

**Content Templates**:
1. **Settings Document**
   - Site name
   - Copyright text
   - Logo placeholders

2. **Navigation Document**
   - Main menu structure
   - 5 default links (Home, Services, Locations, About, Contact)

3. **Home Page**
   - Hero block with welcome message
   - CTA block for contact
   - SEO metadata

4. **Sample Service Page**
   - Service-specific hero
   - CTA block
   - SEO optimization

5. **Sample Location Page**
   - Location-specific hero
   - CTA block
   - SEO optimization

**Template Presets**:
- **General**: Generic professional services (default)
- **Plumbing**: Emergency plumbing services
- **HVAC**: Heating, cooling, and ventilation
- **Electrical**: Licensed electrical services

### 3. validate-client.ts (Validation Script)

**Purpose**: Validates that client datasets are properly configured.

**Features**:
- Dataset existence verification
- Required document checks
- Schema validation
- Document counting
- Detailed error and warning reporting
- Color-coded terminal output

**Usage**:
```bash
pnpm run provision:validate <dataset-name>
```

**Key Functions**:
- `validateClient()`: Main validation orchestration
- `checkDatasetExists()`: Verifies dataset presence
- `checkRequiredDocuments()`: Checks critical documents
- `validateSchema()`: Validates schema structure
- `validateEnvironment()`: Checks environment setup

**Validation Checks**:
1. Dataset exists in project
2. Settings document present (required)
3. Navigation document present (optional, warning)
4. Page documents present (warning if none)
5. Schema structure valid
6. Document count (warning if empty)

**Exit Codes**:
- `0`: Validation passed
- `1`: Validation failed

### 4. types.ts (Type Definitions)

**Purpose**: Provides comprehensive TypeScript interfaces for type safety.

**Key Types**:
- `ClientConfig`: Client configuration structure
- `ProvisioningResult`: Operation result with errors/warnings
- `ValidationResult`: Validation outcome with detailed checks
- `SeedData`: Complete seed data structure
- `ProvisioningOptions`: Configuration options
- `ProvisioningContext`: Runtime context
- `RollbackAction`: Rollback operation definition
- `BlockTemplate`: Content block base structure
- `HeroBlock`: Hero block structure
- `CTABlock`: CTA block structure

### 5. utils.ts (Utility Functions)

**Purpose**: Reusable utility functions for all scripts.

**Features**:
- Terminal color formatting
- Logging helpers (success, error, warning, info)
- Duration formatting
- Slug sanitization
- Email/slug validation
- Retry with exponential backoff
- Progress indicators
- Confirmation prompts
- Environment variable helpers
- JSON parsing with error handling

## How to Run the Provisioning Process

### Method 1: Interactive Mode (Recommended)

```bash
# From project root
pnpm run provision:create
```

You'll be prompted for:
1. Client name (e.g., "ACME Plumbing")
2. Client slug (e.g., "acme")
3. Client email (e.g., "contact@acme.com")
4. Phone number (optional)
5. Website URL (optional)
6. Template preset (1-4)

### Method 2: CLI Mode (For Automation)

```bash
# From scripts/provisioning directory
cd scripts/provisioning
pnpm install
pnpm run create-client "ACME Corp" "acme" "contact@acme.com" plumbing
```

### Method 3: Programmatic Usage

```typescript
import { provisionClient } from './create-client';
import type { ClientConfig, ProvisioningOptions } from './types';

const config: ClientConfig = {
  name: 'ACME Plumbing',
  slug: 'acme',
  email: 'contact@acme.com',
};

const options: ProvisioningOptions = {
  seedContent: true,
  validate: true,
  rollback: true,
};

const result = await provisionClient(config, options, 'plumbing');
```

## Data That Gets Seeded

### Default Configuration

When a client is provisioned, the following data is automatically created:

#### 1. Settings Document (ID: `settings`)
```typescript
{
  _type: 'settings',
  _id: 'settings',
  siteName: 'Client Name',
  copyright: 'Copyright text with year'
}
```

#### 2. Navigation Document (ID: `main-navigation`)
```typescript
{
  _type: 'navigation',
  _id: 'main-navigation',
  title: 'Main Navigation',
  links: [
    { text: 'Home', url: '/', openInNewTab: false },
    { text: 'Services', url: '/services', openInNewTab: false },
    { text: 'Locations', url: '/locations', openInNewTab: false },
    { text: 'About', url: '/about', openInNewTab: false },
    { text: 'Contact', url: '/contact', openInNewTab: false }
  ]
}
```

#### 3. Home Page (ID: `home-page`)
- Hero block with welcome message
- CTA block for contact
- SEO metadata (title, description)
- Slug: `/home`

#### 4. Sample Service Page (ID: `service-{slug}`)
- Service-specific hero block
- CTA block
- SEO metadata
- Slug: `/services/{service-name}`

#### 5. Sample Location Page (ID: `location-{slug}`)
- Location-specific hero block
- CTA block
- SEO metadata
- Slug: `/locations/{location-name}`

### Preset-Specific Content

Each template preset customizes the content:

**Plumbing Preset**:
- Service: "Emergency Plumbing"
- Location: "Downtown"
- Hero tagline: "Professional Plumbing Services"
- CTA: "Need a Plumber?"

**HVAC Preset**:
- Service: "HVAC Repair & Installation"
- Location: "Metro Area"
- Hero tagline: "Heating & Cooling Experts"
- CTA: "Get HVAC Service"

**Electrical Preset**:
- Service: "Electrical Services"
- Location: "City Center"
- Hero tagline: "Licensed Electricians"
- CTA: "Contact Our Electricians"

**General Preset** (Default):
- Service: "General Services"
- Location: "Main Location"
- Hero tagline: "Professional Services"
- CTA: "Get Started Today"

## Error Handling Strategy

### 1. Multi-Layered Validation

**Configuration Level**:
- Validates required fields (name, slug, email)
- Checks slug format (lowercase, alphanumeric, hyphens)
- Validates email format
- Errors prevent provisioning from starting

**Environment Level**:
- Verifies required environment variables
- Checks token permissions
- Validates API version
- Errors thrown before any operations

**Runtime Level**:
- Checks dataset existence
- Validates document creation
- Monitors transaction success
- Real-time error detection

### 2. Transaction-Based Operations

All document creation uses Sanity transactions for atomicity:
```typescript
const transaction = client.transaction();
documents.forEach(doc => transaction.createOrReplace(doc));
await transaction.commit();
```

Benefits:
- All-or-nothing semantics
- Prevents partial states
- Automatic rollback on transaction failure

### 3. Automatic Rollback

When errors occur after dataset creation:

```typescript
if (rollback && rollbackActions.length > 0) {
  await performRollback(rollbackActions);
}
```

**Rollback Actions**:
1. Delete created dataset
2. Clean up any created documents
3. Log rollback operations
4. Report final state

**Rollback Prevention**:
- Dry-run mode (no actual changes)
- Explicit confirmation in interactive mode
- Dataset existence check before creation

### 4. Comprehensive Error Logging

**Color-Coded Output**:
- Red: Errors (blocking issues)
- Yellow: Warnings (non-blocking issues)
- Green: Success messages
- Blue: Information messages
- Cyan: Headers and sections

**Error Details**:
- Error type and message
- Stack trace (in development)
- Affected resources
- Recovery suggestions

**Warning Categories**:
- Missing optional content
- Empty datasets
- Configuration suggestions
- Performance notes

### 5. Exit Codes

Scripts use standard exit codes:
- `0`: Success
- `1`: Failure

Enables scripting and CI/CD integration:
```bash
if pnpm run provision:create "Client" "slug" "email@test.com"; then
  echo "Provisioning succeeded"
else
  echo "Provisioning failed"
  exit 1
fi
```

### 6. Error Recovery Patterns

**Retry with Backoff** (in utils.ts):
```typescript
await retryWithBackoff(
  async () => await client.fetch(query),
  maxRetries = 3,
  initialDelay = 1000
);
```

**Graceful Degradation**:
- Continue with warnings when possible
- Report non-critical failures
- Complete partial operations

**State Preservation**:
- Log all operations
- Track rollback actions
- Enable manual recovery

## Advanced Features

### 1. Dry Run Mode

Test provisioning without making changes:
```typescript
const result = await provisionClient(config, { dryRun: true });
```

### 2. Custom Templates

Override default templates:
```typescript
const customTemplates: Partial<SeedData> = {
  settings: {
    // Custom settings
  },
};

const result = await provisionClient(config, {
  templates: customTemplates,
});
```

### 3. Skip Validation

For faster provisioning (not recommended):
```typescript
const result = await provisionClient(config, { validate: false });
```

### 4. Disable Rollback

For debugging (not recommended):
```typescript
const result = await provisionClient(config, { rollback: false });
```

## Integration Points

### 1. NPM Scripts

Added to root `package.json`:
```json
{
  "scripts": {
    "provision:create": "cd scripts/provisioning && pnpm install && pnpm run create-client",
    "provision:validate": "cd scripts/provisioning && pnpm install && pnpm run validate-client"
  }
}
```

### 2. Environment Variables

Required variables:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Sanity project ID
- `SANITY_API_READ_TOKEN`: Token with write permissions
- `NEXT_PUBLIC_SANITY_API_VERSION`: API version (defaults to 2024-10-18)

### 3. CI/CD Integration

Example GitHub Actions workflow:
```yaml
- name: Provision Client
  run: |
    pnpm run provision:create "Client" "slug" "email@example.com" plumbing
  env:
    NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.SANITY_PROJECT_ID }}
    SANITY_API_READ_TOKEN: ${{ secrets.SANITY_TOKEN }}
```

## Performance Considerations

### 1. Parallel Operations

Scripts use parallel execution where possible:
```typescript
const [settings, navigation, pages] = await Promise.all([
  client.fetch('*[_type == "settings"][0]'),
  client.fetch('*[_type == "navigation"][0]'),
  client.fetch('count(*[_type == "page"])'),
]);
```

### 2. Transaction Batching

All document creation in a single transaction:
```typescript
const transaction = client.transaction();
documents.forEach(doc => transaction.createOrReplace(doc));
await transaction.commit();
```

### 3. Minimal API Calls

Efficient query design to minimize round trips.

## Security

### 1. Token Management
- Tokens stored in environment variables
- Never committed to version control
- Write permissions required (validated at runtime)

### 2. Dataset Isolation
- Each client gets private dataset
- ACL mode set to 'private'
- Cross-dataset queries prevented

### 3. Input Validation
- Slug sanitization prevents injection
- Email validation
- URL validation
- Type safety with TypeScript

## Testing

### Manual Testing

```bash
# Test interactive mode
pnpm run provision:create

# Test CLI mode
cd scripts/provisioning
pnpm run create-client "Test Client" "test" "test@example.com"

# Test validation
pnpm run provision:validate client-test

# Test with preset
pnpm run create-client "Test Plumbing" "test-plumb" "test@test.com" plumbing
```

### Validation Testing

```bash
# Validate existing dataset
pnpm run provision:validate production

# Should fail for non-existent dataset
pnpm run provision:validate non-existent-dataset
```

## Future Enhancements

### Potential Improvements
1. Multi-dataset migration tool
2. Content import from external sources
3. Automated backup before provisioning
4. Dataset cloning functionality
5. Bulk client provisioning
6. Template marketplace
7. Advanced SEO configuration
8. Image asset provisioning
9. Custom domain configuration
10. Email notification on completion

### Extensibility
- Plugin system for custom templates
- Webhook integration
- REST API wrapper
- GraphQL mutation support
- Custom validation rules

## Troubleshooting

See [README.md](./README.md) for comprehensive troubleshooting guide.

## Dependencies

- `@sanity/client`: ^7.11.2 - Sanity API client
- `tsx`: ^4.7.1 - TypeScript execution
- `typescript`: ^5.9.2 - TypeScript compiler

## License

Private - Part of Budds Plumbing monorepo

## Maintainers

Development team - Budds Plumbing

## Version

1.0.0 - Initial release (2025-01-28)
