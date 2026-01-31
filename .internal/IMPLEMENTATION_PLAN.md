# PRCart: 1-2 Week Implementation Plan

## Core Philosophy
**Fast as fuck. Familiar interface. No AI bullshit.**

PRCart is a speed tool, not a smart tool. It's the shopping cart UX applied to PR curation - nothing more, nothing less.

---

## Week 1: Core Functionality

### Day 1-2: Foundation
```
□ Initialize Vite + React + TypeScript + Tailwind
□ Set up project structure
□ Configure ESLint/Prettier
□ Create GitHub OAuth app (manual)
□ Deploy empty shell to Vercel
□ Set up GitHub repo with basic README
```

**Deliverable**: Empty app deployed at prcart.vercel.app

### Day 3-4: GitHub Integration
```
□ GitHub OAuth flow (login with GitHub button)
□ PR URL parser (extract owner/repo/number from URL)
□ Fetch PR files via GitHub API
□ Fetch file diffs/patches
□ Error handling (invalid URL, private repo, rate limits)
□ Loading states
```

**Deliverable**: Can paste PR URL and see list of files

### Day 5-6: Cart UI
```
□ FileCard component (checkbox, filename, +/- lines, status badge)
□ FileList component (scrollable, grouped by status)
□ CartSummary component (items in cart, total lines)
□ Add/remove animations
□ Select all / deselect all
□ Search/filter files
```

**Deliverable**: Can check/uncheck files, see cart update

### Day 7: Diff Viewer
```
□ DiffViewer component (syntax highlighted)
□ Click file to preview diff
□ Unified diff view (split view is V2)
□ Collapse/expand hunks
□ Copy file path
```

**Deliverable**: Can preview diffs for any file

---

## Week 2: Checkout & Polish

### Day 8-9: Checkout Flow
```
□ CheckoutModal component
□ Option 1: Download as .patch file
□ Option 2: Create new branch on GitHub
□ Branch name input with validation
□ Generate patch from selected files only
□ GitHub API: create branch, commit, open PR page
□ Success/error states
```

**Deliverable**: Both checkout options working

### Day 10-11: UI Polish
```
□ Empty states (no files selected, PR has no changes)
□ Dark mode (respect system preference)
□ Keyboard shortcuts (a = add, r = remove, space = toggle)
□ Responsive design (mobile-friendly)
□ Performance optimization (virtualized list for 100+ files)
□ Favicon, OpenGraph meta tags
```

**Deliverable**: Polished, production-ready UI

### Day 12-13: Launch Prep
```
□ README with badges, screenshots, quick start
□ CONTRIBUTING.md
□ LICENSE (MIT)
□ Screen recording demo (30-60 seconds)
□ Convert to GIF for Twitter embed
□ Write launch tweet thread
```

**Deliverable**: Ready to ship

### Day 14: Launch
```
□ Final testing
□ Deploy production build
□ Tweet it
□ Post to Reddit (r/programming, r/webdev)
□ Submit to Hacker News
□ Monitor for bugs
```

---

## Technical Decisions (Locked In)

### Stack
| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React 18 + Vite | Fast, familiar, good DX |
| Styling | Tailwind CSS | Rapid iteration |
| State | Zustand | Simpler than Redux, no boilerplate |
| API | Octokit (GitHub SDK) | Official, well-typed |
| Auth | GitHub OAuth (direct) | No need for NextAuth complexity |
| Diff Parsing | diff-match-patch | Battle-tested, small |
| Syntax Highlighting | Shiki | GitHub-style highlighting |
| Hosting | Vercel | Free, fast, easy |

### What We're NOT Building
- ❌ AI analysis / suggestions
- ❌ Hunk-level selection (file-level only)
- ❌ Line-level selection
- ❌ VS Code extension
- ❌ CLI tool
- ❌ Browser extension
- ❌ GitLab / Bitbucket support
- ❌ Real-time collaboration
- ❌ Dependency analysis
- ❌ Risk scoring
- ❌ "Saved for later" feature
- ❌ User accounts / persistence

---

## File Structure

```
prcart/
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Logo, GitHub login
│   │   ├── PRLoader.tsx         # URL input, paste handler
│   │   ├── FileCard.tsx         # Single file with checkbox
│   │   ├── FileList.tsx         # Scrollable file list
│   │   ├── CartSummary.tsx      # Right sidebar with totals
│   │   ├── DiffViewer.tsx       # Syntax highlighted diff
│   │   ├── CheckoutModal.tsx    # Download/branch options
│   │   └── ui/                  # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Checkbox.tsx
│   │       ├── Input.tsx
│   │       └── Modal.tsx
│   ├── stores/
│   │   └── useCartStore.ts      # Zustand store
│   ├── services/
│   │   ├── github.ts            # Octokit wrapper
│   │   ├── auth.ts              # OAuth flow
│   │   └── patch.ts             # Patch generation
│   ├── hooks/
│   │   ├── useAuth.ts           # Auth state
│   │   └── usePR.ts             # PR fetching
│   ├── types/
│   │   └── index.ts             # Shared types
│   ├── utils/
│   │   └── url.ts               # PR URL parsing
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                # Tailwind imports
├── public/
│   ├── favicon.svg
│   └── og-image.png
├── .env.example                 # GitHub OAuth credentials
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## Data Flow

```
1. User pastes GitHub PR URL
   └─> Parse URL -> { owner, repo, prNumber }

2. Fetch PR data from GitHub API
   └─> GET /repos/{owner}/{repo}/pulls/{prNumber}/files
   └─> Returns: [{ filename, status, additions, deletions, patch }]

3. Display files in UI
   └─> All files start UNCHECKED (empty cart)
   └─> User checks files to add to cart

4. Cart state (Zustand)
   └─> selectedFiles: Set<string>  // filenames
   └─> Toggle: add/remove from Set

5. Checkout - Option A (Patch)
   └─> Filter files by selectedFiles
   └─> Concatenate patches
   └─> Download as .patch file

6. Checkout - Option B (GitHub Branch)
   └─> Create new branch from PR head
   └─> Create commit with only selected file changes
   └─> Open github.com/owner/repo/compare/... for PR creation
```

---

## Zustand Store

```typescript
interface CartStore {
  // PR Data
  pr: {
    owner: string;
    repo: string;
    number: number;
    title: string;
    files: PRFile[];
  } | null;

  // Cart State
  selectedFiles: Set<string>;

  // Actions
  loadPR: (url: string) => Promise<void>;
  toggleFile: (filename: string) => void;
  selectAll: () => void;
  deselectAll: () => void;

  // Computed
  getSelectedCount: () => number;
  getTotalAdditions: () => number;
  getTotalDeletions: () => number;
}
```

---

## Parallel Claude Agent Strategy

Given the 1-2 week timeline, here's how to parallelize:

### Phase 1: Setup (Day 1) - Single Agent
```
Main Agent:
├── Create repo structure
├── Install dependencies
├── Configure tooling
└── Push to GitHub
```

### Phase 2: Parallel Development (Days 2-7) - 3 Agents

```
Agent A (worktree: feature/ui-components):
├── All components in src/components/
├── Tailwind styling
├── Storybook-style isolation testing
Files owned: src/components/*, src/index.css

Agent B (worktree: feature/github-integration):
├── OAuth flow
├── Octokit service
├── PR fetching
├── Patch generation
Files owned: src/services/*, src/hooks/*, .env.example

Agent C (worktree: feature/state-and-app):
├── Zustand store
├── App.tsx wiring
├── Types
├── URL parsing
Files owned: src/stores/*, src/types/*, src/utils/*, src/App.tsx
```

### Phase 3: Integration (Day 8) - Single Agent
```
Main Agent:
├── Merge all branches
├── Resolve conflicts
├── Wire everything together
├── Test end-to-end
```

### Phase 4: Polish (Days 9-13) - 2 Agents
```
Agent D (feature/checkout-flow):
├── CheckoutModal
├── Patch download
├── GitHub branch creation

Agent E (feature/polish):
├── Dark mode
├── Keyboard shortcuts
├── Responsive design
├── README
```

---

## Shopping Cart UX Mapping

| E-commerce | PRCart | Implementation |
|------------|--------|----------------|
| Product | File | FileCard component |
| Add to cart | Check file | Checkbox toggle |
| Remove from cart | Uncheck file | Checkbox toggle |
| Cart sidebar | Cart summary | CartSummary component |
| Item count | Files selected | `selectedFiles.size` |
| Total price | Lines changed | Sum of additions/deletions |
| Checkout | Create branch/patch | CheckoutModal |
| Order confirmation | PR created | Redirect to GitHub |

---

## Edge Cases to Handle

1. **PR with 0 files** - Show "This PR has no file changes"
2. **PR with 500+ files** - Virtualized scrolling, performance warning
3. **Private repo without auth** - Prompt to login
4. **Invalid PR URL** - Clear error message
5. **Rate limited** - Show "Too many requests, try again in X minutes"
6. **Network error** - Retry button
7. **Empty cart checkout** - Disable checkout button
8. **Branch name conflict** - Auto-append timestamp or prompt for new name
9. **PR already merged** - Warning but still allow viewing

---

## Success Metrics (Post-Launch)

- GitHub stars (target: 100 in first week)
- Twitter impressions (target: 10k)
- Unique visitors (target: 1k in first week)
- PRs processed (log anonymously)
- User feedback (issues, tweets, DMs)

---

## Launch Tweet Template

```
🛒 Introducing PRCart

AI tools create huge PRs. You want to keep some changes, reject others.

PRCart lets you shop your pull requests:
✓ See all files as items
✓ Add/remove with one click
✓ Export only what you want

Open source. No AI. Just fast.

[link] [screen recording gif]
```

---

## What's Next (Post-MVP)

If the MVP gets traction, prioritize based on user requests:

1. **Hunk-level selection** - Most requested, hardest to build
2. **VS Code extension** - Opens web app in sidebar
3. **CLI tool** - `prcart open <url>` opens browser
4. **GitLab support** - Similar API, straightforward
5. **Browser extension** - Button on GitHub PR pages
6. **Keyboard-driven mode** - j/k navigation, vim-style

Do NOT build until users ask for it.
