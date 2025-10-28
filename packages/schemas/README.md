# @budds-plumbing/schemas

## Purpose

Shared schema definitions and TypeScript types for the Budds Plumbing monorepo. Currently a placeholder package for future schema consolidation.

## Status

**Note**: Schemas currently live in `apps/studio/sanity/schemas/` due to Sanity Studio requirements. This package exists for:

1. Future schema sharing between apps
2. Generated TypeScript types distribution
3. Zod validation schemas
4. Maintaining monorepo structure

## Future Migration Plan

When Sanity supports external schema packages:

1. Move all schema definitions here
2. Export from centralized index
3. Import in studio and web apps
4. Share validation logic

## Current Architecture Decision

Keeping schemas in studio app because:

- Sanity Studio requires schemas in its build context
- Hot reload works better with co-located schemas
- Schema versioning tied to studio deployment
- Simpler development workflow

## Usage

Currently exports placeholder:

```typescript
export {};
```

Will eventually export:

```typescript
export * from './documents';
export * from './blocks';
export * from './objects';
export * from './validation';
```

## Dependencies

- `sanity` - For schema definitions (peer dependency)
- `zod` - For runtime validation (future)
