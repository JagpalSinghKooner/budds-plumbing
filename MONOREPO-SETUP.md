# Budds Plumbing Monorepo Setup

This document describes the monorepo structure and setup for the Budds Plumbing project.

## Structure

```
budds-plumbing-2/
├── apps/
│   ├── web/              # Next.js frontend application
│   └── studio/           # Sanity Studio CMS
├── packages/
│   ├── ui/               # Shared UI components
│   └── schemas/          # Sanity schemas
├── scripts/              # Build and deployment scripts
├── pnpm-workspace.yaml   # pnpm workspace configuration
├── turbo.json            # Turborepo configuration
├── tsconfig.base.json    # Base TypeScript configuration
└── package.json          # Root package.json
```

## Workspaces

### apps/web

- **Name**: `@budds-plumbing/web`
- **Purpose**: Next.js 15 frontend application
- **Dependencies**: React 19, Next.js 15.5.4, Sanity integration
- **Scripts**:
  - `dev`: Start development server
  - `build`: Build production bundle
  - `start`: Start production server
  - `lint`: Run ESLint
  - `typecheck`: Run TypeScript type checking

### apps/studio

- **Name**: `@budds-plumbing/studio`
- **Purpose**: Sanity Studio CMS
- **Dependencies**: Sanity 4.10.0, React 19
- **Scripts**:
  - `dev`: Start Sanity Studio development server
  - `build`: Build Sanity Studio
  - `typegen`: Generate TypeScript types from Sanity schemas

### packages/ui

- **Name**: `@budds-plumbing/ui`
- **Purpose**: Shared UI components library
- **Dependencies**: Radix UI, Lucide React, Tailwind utilities
- **Type**: Component library (no build step required)

### packages/schemas

- **Name**: `@budds-plumbing/schemas`
- **Purpose**: Sanity schema definitions
- **Dependencies**: Sanity schema tools
- **Type**: Schema library (no build step required)

## Package Manager

This project uses **pnpm** (v10.19.0) for package management with workspace support.

### Why pnpm?

- Efficient disk space usage through content-addressable storage
- Fast installation times
- Strict dependency resolution
- Native monorepo support

## Build System

This project uses **Turborepo** (v2.5.8) for build orchestration.

### Benefits:

- Intelligent build caching
- Parallel task execution
- Dependency-aware task scheduling
- Remote caching support (future enhancement)

## Available Scripts

From the root directory:

```bash
# Development
pnpm dev                 # Start all workspaces in development mode

# Building
pnpm build              # Build all workspaces

# Type Checking
pnpm typecheck          # Run TypeScript type checking across all workspaces

# Linting
pnpm lint               # Run linting across all workspaces

# Type Generation
pnpm typegen            # Generate Sanity types

# Cleaning
pnpm clean              # Clean all build artifacts and node_modules
```

## TypeScript Configuration

- **Root**: `tsconfig.base.json` - Base configuration shared by all workspaces
- **apps/web**: Extends base config with Next.js settings
- **apps/studio**: Extends base config with Sanity settings
- **packages/ui**: Extends base config with composite project settings
- **packages/schemas**: Extends base config with composite project settings

## Dependencies

### Workspace Dependencies

Packages can depend on each other using the `workspace:*` protocol:

```json
{
  "dependencies": {
    "@budds-plumbing/ui": "workspace:*",
    "@budds-plumbing/schemas": "workspace:*"
  }
}
```

This ensures:

- Local packages are linked correctly
- Version consistency across the monorepo
- Proper build order is maintained by Turborepo

## Getting Started

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Start development**:

   ```bash
   pnpm dev
   ```

3. **Build for production**:
   ```bash
   pnpm build
   ```

## Next Steps

The monorepo structure is now in place. The following tasks remain:

1. **Move existing code** to the appropriate workspaces:
   - Move Next.js app code to `apps/web/`
   - Move Sanity schemas to `packages/schemas/`
   - Move UI components to `packages/ui/`
   - Configure Sanity Studio in `apps/studio/`

2. **Configure environment variables** for each workspace

3. **Set up CI/CD pipelines** to leverage Turborepo caching

4. **Add shared tooling** (ESLint, Prettier configs)

## Notes

- All workspaces are currently private packages
- Node.js version requirement: >=18.0.0
- pnpm version requirement: >=8.0.0
- Package manager is locked to pnpm@10.19.0
