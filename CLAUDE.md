# CLAUDE.md

This file provides context for AI assistants (Claude, Cursor, Copilot, etc.) working on PRCart.

## Project Overview

PRCart is a web app that lets developers curate pull request changes using a shopping cart metaphor. Users paste a GitHub PR URL, see files as "items," add/remove them from their cart, and export only selected changes as a patch.

**Core philosophy**: Fast, familiar, no AI complexity. Just a clean interface for PR curation.

## Tech Stack

- **React 18** + TypeScript
- **Vite** for builds
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Octokit** for GitHub API

## Project Structure

```
src/
├── components/     # React components
├── stores/         # Zustand stores
├── services/       # API clients (GitHub, patch generation)
├── hooks/          # Custom React hooks
├── types/          # TypeScript types
└── utils/          # Helper functions
```

## Key Files

| File | Purpose |
|------|---------|
| `src/stores/useCartStore.ts` | Central state - PR data, selected files, actions |
| `src/services/github.ts` | GitHub API calls via Octokit |
| `src/services/patch.ts` | Patch generation from selected files |
| `src/components/FileCard.tsx` | Individual file item in the list |
| `src/components/CartSummary.tsx` | Right sidebar with cart totals |

## Development Commands

```bash
npm install     # Install dependencies
npm run dev     # Start dev server (http://localhost:5173)
npm run build   # Production build
npm run preview # Preview production build
npm run lint    # Run ESLint
```

## Architecture Decisions

1. **File-level selection only** - No hunk or line-level granularity (too complex for MVP)
2. **No authentication required** - Works with public repos; OAuth is optional enhancement
3. **Patch export as primary action** - Simpler than creating branches via API
4. **Dark mode by default** - Matches GitHub's aesthetic

## Code Style

- Use TypeScript strictly (no `any`)
- Prefer named exports
- Components are functional with hooks
- Use Tailwind classes, avoid inline styles
- Keep components under 200 lines

## State Management

All app state lives in `useCartStore`:

```typescript
interface CartState {
  pr: PRData | null;           // Loaded PR
  selectedFiles: Set<string>;  // Files in cart (by filename)
  isLoading: boolean;
  error: string | null;
  previewFile: string | null;  // Currently viewed diff
}
```

## Common Tasks

### Adding a new component

1. Create file in `src/components/`
2. Use Tailwind for styling
3. Import types from `@/types`
4. Export as named export

### Modifying cart behavior

1. Edit `src/stores/useCartStore.ts`
2. Add action to the store
3. Use `set()` for state updates
4. Create selector hook if needed

### Adding GitHub API calls

1. Add function to `src/services/github.ts`
2. Use Octokit client
3. Map response to our types
4. Handle errors appropriately

## Testing

Currently no test suite. When adding:
- Use Vitest for unit tests
- Use Playwright for E2E
- Focus on store logic and patch generation

## Known Limitations

- Only works with GitHub (no GitLab/Bitbucket)
- File-level only (no hunk selection)
- No persistence (refresh = lost state)
- Rate limited by GitHub API (60/hr unauthenticated)

## What NOT to Build

These are explicitly out of scope:
- AI-powered analysis or suggestions
- Real-time collaboration
- Dependency graphs between files
- Risk scoring or complexity metrics
- Desktop or mobile apps

## Helpful Context

- The shopping cart metaphor maps: files = items, add/remove = checkbox, checkout = export patch
- GitHub API returns patches as unified diff strings
- Tailwind colors prefixed with `gh-` match GitHub's dark theme
