# PRCart: Critical Analysis & Implementation Strategy

## Executive Summary

**The shopping cart metaphor for PR curation is genuinely novel.** My research found no existing implementation of this concept. The closest tools are:
- **Graphite** - stacked PR management with splitting capabilities (CLI + web)
- **SPR** - each commit becomes a PR (CLI only)
- **Pulldash** - faster PR review UI (no curation)
- **git-interactive-rebase-tool** - terminal UI for rebase operations

None use the e-commerce UX metaphor. This is a real opportunity.

However, **the spec is 12+ months of work** and over-engineered for a viral MVP. Let me break down what's real vs aspirational.

---

## Part 1: Research Findings

### What Exists

| Tool | Approach | Gap PRCart Fills |
|------|----------|------------------|
| **Graphite** | CLI/web for stacked PRs, `gt branch split --by-hunk` | No visual "cart" curation |
| **SPR** | Each commit = separate PR | No selective cherry-picking |
| **git-stack** | Branch stacking with undo support | CLI only, no web UI |
| **Pulldash** | Keyboard-driven PR review (j/k navigation) | Review only, no curation |
| **CodeRabbit** | AI-powered PR review | Suggests changes, doesn't curate |
| **git add -p** | Hunk-level staging | Terrible UX, no visual interface |

### What Doesn't Exist (Your Opportunity)

1. **Visual shopping cart UI for PR changes** - nobody has done this
2. **Web UI for selective cherry-picking** - all existing tools are CLI
3. **Curation interface for AI-generated PRs** - huge unmet need
4. **"Add to cart / remove from cart" interaction model** - novel

### Twitter/Reddit Research

No discussions found about shopping cart metaphors for PRs. This is either:
- A completely novel idea (likely)
- So obvious nobody thought to build it (also possible)

The AI-generated code curation angle is timely. CodeRabbit's research shows AI code creates 1.7x more issues than human code - there's a real need for human curation of AI output.

---

## Part 2: Brutal Honest Technical Problems

### Problem 1: The Metaphor Breaks Down for Complex Git Concepts

| Git Concept | Shopping Cart Equivalent | Problem |
|-------------|-------------------------|---------|
| Merge conflict | "Items can't be purchased together" | Awkward - users expect to resolve, not choose |
| Dependent changes | "Buying X requires buying Y" | Unclear what "requires" means technically |
| Hunk splitting | "Split item into two" | No e-commerce equivalent |
| Rebase conflicts | ??? | No mapping exists |
| Force push | ??? | No mapping exists |

**My recommendation**: Don't force the metaphor where it doesn't fit. Use shopping cart for the happy path (adding/removing files), but use developer language for complex operations.

### Problem 2: Hunk-Level Granularity is Extremely Hard

Your spec mentions line-level and hunk-level operations. This is where `git add -p` lives, and here's why it's hard:

```
// Original file
function add(a, b) {
  return a + b;
}

// PR changes (single hunk)
function add(a, b) {
  console.log('Adding:', a, b);  // Line 1 of hunk
  const result = a + b;           // Line 2 of hunk
  console.log('Result:', result); // Line 3 of hunk
  return result;                  // Line 4 of hunk
}
```

If user removes lines 1 and 3 but keeps 2 and 4, the resulting code is:
```javascript
function add(a, b) {
  const result = a + b;
  return result;
}
```

This works! But what if:

```javascript
// If user removes lines 2-4 but keeps line 1
function add(a, b) {
  console.log('Adding:', a, b);
  return a + b;  // Original line - but where does it come from?
}
```

**The problem**: You need the original file context to know what to keep when removing hunk lines. This requires:
- Full file content (not just diff)
- Understanding of which lines are additions vs modifications
- Proper 3-way merge logic

**My recommendation**: MVP should only support FILE-level granularity. Hunk-level is Phase 2.

### Problem 3: Dependency Analysis is a Research Problem

Your spec describes building dependency graphs across languages. Reality check:

| Language | Static Analysis Feasibility |
|----------|---------------------------|
| TypeScript | Good - type system helps |
| Python | Poor - dynamic typing, runtime imports |
| JavaScript | Poor - dynamic requires, bundler magic |
| Go | Good - explicit imports |
| Ruby | Very poor - metaprogramming |

Even TypeScript has:
- Dynamic imports: `import(modulePath)`
- Barrel exports: `export * from './utils'`
- Type-only imports that don't affect runtime

**My recommendation**: MVP should show warnings ("this file imports from X which you removed") but NOT block actions. Let users make mistakes and learn.

### Problem 4: Multiple Checkout Strategies = Complexity Explosion

Your spec lists:
1. Amend existing commit
2. New commit on same branch
3. New branch + new PR
4. Patch export
5. Split into multiple PRs (mentioned but not detailed)

Each strategy has edge cases:
- Amend requires force push (scary)
- New commit might conflict with head
- New branch naming conventions
- PR creation requires GitHub auth

**My recommendation**: MVP supports ONE strategy: "Create new branch with selected changes and open PR." Add others later.

### Problem 5: Real-Time Collaboration is a Separate Product

Your spec mentions real-time collaboration. This requires:
- WebSockets or Server-Sent Events
- Operational Transformation or CRDTs
- Presence indicators
- Conflict resolution (meta: you need conflict resolution for your conflict resolution tool)

This is 3-6 months of work on its own.

**My recommendation**: Cut entirely from MVP. V2 feature at earliest.

### Problem 6: GitHub API Rate Limits

GitHub's API has limits:
- Unauthenticated: 60 requests/hour
- Authenticated: 5,000 requests/hour
- Large PRs might need multiple requests (paginated file lists)

Your spec doesn't address:
- Caching strategy
- Incremental updates
- Offline support
- Rate limit handling

**My recommendation**: Add aggressive caching. Cache PR data for 5 minutes. Show "last updated X ago" in UI.

### Problem 7: Browser Extension Injection is Fragile

GitHub changes their DOM structure frequently. Extensions that inject buttons/checkboxes break constantly. See: the graveyard of "Octotree" alternatives.

**My recommendation**: Browser extension should ONLY add a single button that opens PRCart web app. Don't inject anything else.

### Problem 8: VS Code WebView Limitations

VS Code WebViews are sandboxed and have quirks:
- No access to native file system
- Communication via message passing only
- React apps can be slow
- Complex state management is tricky

**My recommendation**: VS Code extension should be a thin wrapper that opens the web app, OR just show a file tree. Don't replicate the full UI.

### Problem 9: The CLI Can't Look Like a Shopping Cart

You correctly noted that TUI won't look like a "real shopping UI." Options:
1. CLI opens browser with web app (recommended)
2. CLI uses Ink (React for terminal) - still won't look like shopping
3. CLI is purely command-based (no TUI)

**My recommendation**: `prcart` command opens browser. `prcart --json` outputs for scripting. No TUI.

### Problem 10: AI Analysis is Slow and Expensive

Real-time AI analysis of changes would:
- Add 2-5 seconds latency per file
- Cost $0.01-0.10 per analysis (Claude API)
- Require async loading UX

**My recommendation**: AI analysis is optional and loaded async. Show placeholder "Analyzing..." then update. Cache aggressively.

---

## Part 3: Where I'd Push Back on the Spec

### 1. Risk Scoring (0-100) is False Precision

The spec shows "Risk: ██░░░ Medium" and complex risk metrics. In reality:
- What makes a change "risky"? Subjective.
- A 1-line change to authentication can be higher risk than 500 lines of tests.
- Users will argue with the score instead of trusting it.

**Better approach**: Simple categories - "Touches auth", "Modifies API", "Changes config", "Adds tests". Let users filter by category, not chase numbers.

### 2. The Data Model is Over-Normalized

Your spec has:
- `PRCart` containing `CartItem[]`
- `CartItem` containing `Hunk[]`
- `Hunk` containing `DiffLine[]`
- Each with `inCart: boolean`

This creates complexity:
- What if Hunk 1 is in cart but Line 3 of Hunk 1 is not?
- Syncing state across levels is error-prone
- UI needs to handle mixed states

**Better approach**: Flat list of selectable units. Either files (MVP) or hunks (V2). Not both simultaneously.

### 3. "Saved for Later" is Cute but Unnecessary

The spec has a "removed items" section like Amazon's "Save for Later." But:
- In e-commerce, you might want to buy it next week
- In PRs, removed items are just... not in the PR
- Adding complexity without clear value

**Better approach**: Items are either "in" or "out." No third state.

### 4. Agent Metadata Parsing is Niche

The spec describes parsing `AgenticPRMetadata` from PR descriptions:
```
```prcart-metadata
{
  "agent": { "name": "claude-code" },
  "changes": [...]
}
```
```

This requires:
- AI tools to adopt your format (unlikely initially)
- Standardization efforts
- Backwards compatibility

**Better approach**: Don't require special metadata. Infer what you can from git history (author, commit messages). Add metadata support later if adopted.

---

## Part 4: Recommended MVP Scope (2-4 weeks)

### Core Features Only

1. **Load PR from GitHub URL**
   - Paste URL, authenticate with GitHub OAuth
   - Fetch diff via GitHub API
   - Display files as "items"

2. **File-Level Cart Operations**
   - Checkbox to include/exclude each file
   - Visual feedback (green border = included)
   - Running count of "items in cart"

3. **Simple Metrics**
   - Lines added/removed per file
   - Total lines added/removed for cart
   - File type breakdown (not AI-powered risk scores)

4. **Single Checkout Action**
   - "Create new branch with selected changes"
   - Opens GitHub PR creation page with selected files
   - OR exports as patch file (simpler)

5. **Web App Only**
   - React + Tailwind
   - No CLI, no VS Code extension, no browser extension
   - Deploy to Vercel

### Cut from MVP

- Hunk-level granularity
- Line-level granularity
- AI analysis
- Dependency graphs
- Multiple checkout strategies
- Real-time collaboration
- Offline support
- GitLab/Bitbucket support
- Desktop app

### Tech Stack for MVP

```
Frontend: React 18 + Vite + Tailwind CSS
State: Zustand (simpler than Redux)
API: GitHub REST API via Octokit
Auth: GitHub OAuth (via Supabase or NextAuth)
Hosting: Vercel
Diff Parsing: diff-match-patch or jsdiff
```

---

## Part 5: Technical Architecture (Simplified)

```
┌─────────────────────────────────────────────────┐
│                   Web App                        │
├─────────────────────────────────────────────────┤
│  React Components                               │
│  ├── PRLoader (URL input, OAuth)               │
│  ├── FileList (browsable items)                │
│  ├── CartSummary (items in cart, metrics)      │
│  ├── DiffViewer (read-only preview)            │
│  └── CheckoutModal (branch name, action)       │
├─────────────────────────────────────────────────┤
│  State (Zustand)                                │
│  ├── pr: { owner, repo, number, files[] }      │
│  ├── cart: Set<filePath>                       │
│  └── ui: { selectedFile, loading, error }      │
├─────────────────────────────────────────────────┤
│  Services                                       │
│  ├── github.ts (Octokit wrapper)               │
│  ├── diff.ts (parse/generate patches)          │
│  └── auth.ts (OAuth flow)                      │
└─────────────────────────────────────────────────┘
```

### Key Files for MVP

```
prcart/
├── src/
│   ├── components/
│   │   ├── PRLoader.tsx       # URL input + auth
│   │   ├── FileCard.tsx       # Single file item
│   │   ├── FileList.tsx       # Scrollable list
│   │   ├── CartSummary.tsx    # Right sidebar
│   │   ├── DiffViewer.tsx     # Syntax highlighted diff
│   │   └── CheckoutModal.tsx  # Action confirmation
│   ├── stores/
│   │   └── cart.ts            # Zustand store
│   ├── services/
│   │   ├── github.ts          # API calls
│   │   └── diff.ts            # Patch generation
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## Part 6: Parallel Claude Development Strategy

You mentioned wanting to orchestrate multiple Claude agents in parallel. Here's how I'd structure it:

### Phase 1: Foundation (Sequential - 1 orchestrator)

```
Main Agent (Terminal/IDE):
├── Initialize repo structure
├── Set up Vite + React + Tailwind
├── Configure ESLint, Prettier, TypeScript
├── Create GitHub OAuth app (manual step for you)
└── Commit: "chore: initial project setup"
```

This MUST be sequential because all other work depends on it.

### Phase 2: Parallel Component Development (3-4 agents)

```
Agent A (worktree: feature/file-list):
├── FileCard component
├── FileList component
├── Mock data for testing
└── Storybook stories (optional)

Agent B (worktree: feature/cart-state):
├── Zustand store setup
├── Cart operations (add/remove/toggle)
├── Persistence to localStorage
└── Unit tests

Agent C (worktree: feature/github-api):
├── GitHub OAuth flow
├── Octokit service wrapper
├── PR fetching logic
├── Error handling

Agent D (worktree: feature/diff-viewer):
├── DiffViewer component
├── Syntax highlighting (Prism or Shiki)
├── Unified/split diff toggle
└── Performance optimization for large diffs
```

### Phase 3: Integration (Sequential - 1 orchestrator)

```
Main Agent:
├── Merge all feature branches
├── Resolve any conflicts
├── Wire components together
├── End-to-end testing
└── Fix integration bugs
```

### Phase 4: Polish (Parallel - 2-3 agents)

```
Agent E (worktree: feature/checkout-flow):
├── CheckoutModal component
├── Patch generation
├── GitHub branch creation
└── PR redirect

Agent F (worktree: feature/ui-polish):
├── Animations
├── Loading states
├── Error states
├── Dark mode

Agent G (worktree: feature/readme-demo):
├── README with badges
├── Remotion demo video script
├── Documentation
└── License, contributing guide
```

### Orchestration Rules

1. **Never have two agents edit the same file**
   - Each agent owns specific files
   - Use index files to export from modules

2. **Use feature flags for incomplete features**
   ```typescript
   const FEATURES = {
     HUNK_SELECTION: false,
     AI_ANALYSIS: false,
   };
   ```

3. **Merge frequently**
   - Merge to main at least daily
   - Orchestrator handles all merges
   - Agents rebase on main before starting new work

4. **Clear interfaces between modules**
   ```typescript
   // types/index.ts - shared types
   export interface PRFile {
     path: string;
     status: 'added' | 'modified' | 'removed';
     additions: number;
     deletions: number;
     patch?: string;
   }
   ```

---

## Part 7: Open Source Polish (OpenClaw Style)

### README Structure

```markdown
<div align="center">
  <img src="logo.svg" width="120" />
  <h1>PRCart</h1>
  <p>Shop your pull requests. Keep what you need.</p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
  [![npm version](https://badge.fury.io/js/prcart.svg)](https://npmjs.com/prcart)
  [![GitHub stars](https://img.shields.io/github/stars/anipotts/prcart)](https://github.com/anipotts/prcart)

  [Demo](https://prcart.dev) · [Docs](https://docs.prcart.dev) · [Discord](https://discord.gg/xxx)
</div>

## The Problem

AI coding tools create massive PRs. You want to keep some changes, reject others.
Git's `git add -p` works but has terrible UX.

## The Solution

PRCart lets you curate PR changes like shopping online. Add files to your cart,
remove what you don't want, checkout with one click.

## Quick Start

```bash
# Visit a PR, click "Open in PRCart", done.
https://prcart.dev/github/owner/repo/pull/123
```

## Demo

[<video preview>](link-to-remotion-video)

## Features

- 🛒 Add/remove files with one click
- 📊 See lines added/removed at a glance
- 🔀 Create new branch with selected changes
- 🤖 Perfect for curating AI-generated code

## Roadmap

- [ ] Hunk-level selection
- [ ] VS Code extension
- [ ] GitLab support
- [ ] AI-powered suggestions
```

### Badges to Include

- License (MIT)
- npm version (when published)
- GitHub stars
- Build status (GitHub Actions)
- Code coverage (optional)
- Discord/community link

### Remotion Demo Video

Script outline:
1. Show a large PR on GitHub (100+ files)
2. "This PR has 127 files. You want to keep 12."
3. Open PRCart
4. Click through adding files to cart
5. Show summary metrics
6. Click checkout
7. New PR opens with only selected files
8. "PRCart. Shop your PRs."

Duration: 30-60 seconds. No audio narration needed - text overlays work great on Twitter.

---

## Part 8: Recommended Next Steps

### This Week

1. **Decide on MVP scope** - agree on features to cut
2. **Set up repo structure** - basic Vite + React project
3. **Create GitHub OAuth app** - needed for API access
4. **Build FileCard component** - start with UI

### Week 2

1. **GitHub API integration** - fetch real PR data
2. **Cart state management** - Zustand store
3. **Wire up components** - make it work end-to-end

### Week 3

1. **Checkout flow** - patch export first
2. **UI polish** - animations, loading states
3. **README + documentation**

### Week 4

1. **Remotion demo video**
2. **Deploy to Vercel**
3. **Soft launch on Twitter**
4. **Iterate based on feedback**

---

## Conclusion

PRCart is a genuinely good idea with a real market gap. The spec is impressive but over-scoped. Cut ruthlessly to ship fast.

Key decisions:
- File-level only (no hunks) for MVP
- Web-only (no CLI/extension) for MVP
- Single checkout strategy (new branch) for MVP
- No AI analysis for MVP
- No real-time collab ever (different product)

The shopping cart metaphor works for the 80% case. Don't force it for edge cases.

Ship in 3-4 weeks, get Twitter validation, then decide what to build next based on actual user feedback.
