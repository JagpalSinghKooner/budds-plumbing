# Project Rules & Guidelines Index

This directory contains all project-specific rules, guidelines, and standards that must be followed when working on this codebase.

## 📋 Current Rules & Guidelines

### Core Development Rules

1. **[Shadcnblocks Installation Rules](./SHADCNBLOCKS-INSTALLATION-RULES.md)** ⭐ **CRITICAL**
   - **Purpose:** Mandatory guidelines for installing components from shadcnblocks.com
   - **When to use:** Every time you install a shadcnblocks component
   - **Key points:**
     - Always use official CLI (`npx shadcn@latest add @shadcnblocks/component-name`)
     - Never manually copy/paste code from website
     - Configure API key and registry in components.json
     - Integrate with Next.js components (Link, Image)
     - Add proper z-index for overlays

### Project Planning & Phases

2. **[Phase 1 Complete & Phase 2 Plan](./PHASE1-COMPLETE-PHASE2-PLAN.md)**
   - Summary of completed Phase 1 requirements
   - Roadmap for Phase 2 development

3. **[Claude Audit Phase 1](./CLAUDE-AUDIT-PHASE1.md)**
   - Audit results and findings from Phase 1
   - Technical debt and improvements identified

4. **[Phase 1 Todo List](./phase-1-todo-list.md)**
   - Completed tasks from Phase 1
   - Task tracking and verification

5. **[Structured Roadmap](./structured-roadmap.md)**
   - Overall project structure and milestones
   - Long-term development goals

6. **[Roadmap V3](./roadmap-v3.md)**
   - Latest version of project roadmap
   - Updated timelines and priorities

## 🚨 Critical Rules to Always Follow

### Installation & Dependencies
- ✅ Always use official shadcnblocks CLI (see [SHADCNBLOCKS-INSTALLATION-RULES.md](./SHADCNBLOCKS-INSTALLATION-RULES.md))
- ✅ Verify `components.json` is valid JSON before installing
- ✅ Set `SHADCNBLOCKS_API_KEY` in `.env.local`
- ✅ Run `pnpm install` after adding new dependencies
- ✅ Use `pnpm` (not npm or yarn) for package management

### Code Quality
- ✅ No `eslint-disable` comments
- ✅ No `@ts-ignore` or `@ts-nocheck`
- ✅ TypeScript strict mode enabled
- ✅ All components must be type-safe
- ✅ Run `pnpm typecheck` before committing

### Next.js Best Practices
- ✅ Use `<Link>` instead of `<a>` tags
- ✅ Use `<Image>` instead of `<img>` tags
- ✅ Use server components by default
- ✅ Add `'use client'` only when needed
- ✅ Properly handle async/await in server components

### Sanity CMS Integration
- ✅ All navigation and settings from Sanity
- ✅ Use GROQ queries for data fetching
- ✅ Type-safe with generated Sanity types
- ✅ Never hardcode business information

### Styling & UI
- ✅ Use Tailwind CSS utility classes
- ✅ Follow shadcn/ui component patterns
- ✅ Add proper z-index for overlays (header: z-[100], dropdowns: z-[200], modals: z-[300])
- ✅ Ensure responsive design (mobile + desktop)
- ✅ Test dark mode compatibility

## 📝 How to Add New Rules

When adding new project rules:

1. Create a new markdown file in this directory: `project-rules/YOUR-RULE-NAME.md`
2. Use clear, actionable language (DO/DON'T format)
3. Include code examples where applicable
4. Add the rule to this INDEX.md file with description
5. Mark as **CRITICAL** if it must never be violated

## 🔍 Rule Priority Levels

- 🔴 **CRITICAL** - Must always follow (e.g., Shadcnblocks installation)
- 🟡 **IMPORTANT** - Should follow unless exceptional circumstances
- 🟢 **RECOMMENDED** - Best practices, follow when possible

## 📚 Related Documentation

- [Main README](../README.md) - Project overview and setup
- [Apps README](../apps/web/README.md) - Web app documentation
- [Packages README](../packages/ui/README.md) - UI package documentation

---

**Last Updated:** 2025-10-28
**Maintained By:** Development Team
