# PRCart Master Technical Specification

> This is the source of truth for PRCart. All agent prompts reference this document.

---

## Product Vision

PRCart is a **CLI-first tool** that lets developers curate pull request changes using a **shopping cart metaphor**. The experience should feel like online shopping, not code review.

**Core principle**: Zero friction. If something takes more than 2 seconds, it's wrong.

---

## Confirmed Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary interface | CLI that opens web UI | Fits developer workflow |
| PR selection | Current repo default, `--all` flag for all repos | Simple default, power when needed |
| UI location | Local server (localhost:3847) default | Works offline, no account needed |
| Cloud option | `--cloud` flag opens prcart.dev session | For sharing, cross-device |
| Auth method | Reuse `gh` CLI token | No new login if gh is configured |
| Multi-PR cart | No - one PR per session | Simpler mental model |
| Delivery methods | All: patch, branch, commit, PR | Full flexibility |
| Order history | Yes with undo/reapply | Power users want this |
| Shipping address | Target branch + optional local path | Full control |

---

## CLI Specification

### Installation

```bash
npm install -g prcart
# or
brew install prcart
```

### Commands

```bash
prcart                    # List open PRs in current repo, pick one, open cart
prcart <pr-number>        # Open specific PR (e.g., `prcart 123`)
prcart <pr-url>           # Also accepts full URL for convenience
prcart --all              # Show all PRs assigned to/created by me
prcart --cloud            # Open in prcart.dev instead of localhost

prcart apply              # Apply current cart (interactive - asks how)
prcart apply --patch      # Export as patch file
prcart apply --branch <n> # Create new branch with changes
prcart apply --commit     # Commit to current branch
prcart apply --pr         # Create new PR with selected changes

prcart status             # Show current cart contents
prcart history            # Show past checkout history
prcart undo <id>          # Undo a past checkout
prcart clear              # Clear current cart

prcart auth               # Check/configure GitHub auth
prcart config             # Open config (default branch, etc.)
```

### Behavior

1. **Not in a git repo**: Show error "Not a git repository. Run this from inside a repo."
2. **No gh CLI token**: Show "Sign in with GitHub" prompt, or guide to `gh auth login`
3. **No open PRs**: Show "No open PRs found. Create one with `gh pr create`"
4. **Multiple PRs**: Show interactive picker (like `gh pr checkout`)

### PR Picker Interface (Terminal)

```
? Select a PR to shop: (Use arrow keys)
❯ #142 feat: add dark mode support (2 hours ago)
  #139 fix: login redirect bug (1 day ago)
  #134 refactor: extract auth module (3 days ago)
  #128 docs: update README (1 week ago)

  [↑↓ to move, enter to select, q to quit]
```

### Opening Web UI

After selecting PR:
```
🛒 PRCart v1.0.0

Loading PR #142: feat: add dark mode support...
Found 12 files changed (+456 -123)

Starting local server...
Opening http://localhost:3847

Press Ctrl+C to stop
```

---

## Shopping Metaphor Mapping

| E-commerce Concept | PRCart Equivalent |
|--------------------|-------------------|
| Product | File change (with diff preview as "product image") |
| Product category | File type or directory |
| Price | Lines changed (+/-) |
| Add to Cart | Select file for inclusion |
| Remove from Cart | Deselect file |
| Cart | Selected files to apply |
| Wishlist / Save for Later | Files to review later |
| Shipping Address | Target branch + local path |
| Delivery Method | How to apply (patch, branch, commit, PR) |
| Payment | GitHub auth (already done via gh CLI) |
| Order Confirmation | Apply success message |
| Order History | Past checkouts with undo capability |
| Returns | Undo/revert a checkout |

---

## Web UI Architecture

### Pages/Views

1. **`/`** - Landing page (only on prcart.dev, not localhost)
2. **`/shop`** - Main shopping interface (product grid + cart)
3. **`/cart`** - Full cart view
4. **`/checkout`** - Multi-step checkout flow
5. **`/history`** - Order history
6. **`/settings`** - Config (default branch, theme, etc.)

### Component Hierarchy

```
App
├── Header
│   ├── Logo
│   ├── PRInfo (current PR title/number)
│   ├── CartIcon (with badge count)
│   └── UserMenu (if authed)
├── ProductGrid
│   ├── FilterBar (by file type, risk, etc.)
│   ├── SortDropdown (by name, changes, risk)
│   └── ProductCard[] (one per file)
│       ├── CodeThumbnail (syntax highlighted preview)
│       ├── FileName
│       ├── ChangeStats (+/- lines)
│       ├── RiskBadge
│       └── AddToCartButton
├── CartDrawer (slides from right)
│   ├── CartHeader
│   ├── CartItemList
│   │   └── CartItem[]
│   ├── CartSummary (totals)
│   └── CheckoutButton
├── QuickViewModal (full diff preview)
└── CheckoutFlow
    ├── Step1_ReviewOrder
    ├── Step2_DeliveryMethod
    ├── Step3_ShippingAddress
    └── Step4_Confirmation
```

### Design System

**Colors (Dark Mode - Default)**
```css
--bg-primary: #0a0a0a;
--bg-secondary: #141414;
--bg-card: #1a1a1a;
--bg-card-hover: #222222;
--text-primary: #fafafa;
--text-secondary: #a1a1a1;
--accent-primary: #3b82f6;    /* Blue - primary actions */
--accent-success: #22c55e;    /* Green - success, additions */
--accent-danger: #ef4444;     /* Red - danger, deletions */
--accent-warning: #f59e0b;    /* Orange - warnings */
--border: #2a2a2a;
```

**Colors (Light Mode)**
```css
--bg-primary: #ffffff;
--bg-secondary: #f5f5f5;
--bg-card: #ffffff;
--bg-card-hover: #fafafa;
--text-primary: #0a0a0a;
--text-secondary: #6b7280;
/* Accents same as dark mode */
```

**Spacing**
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
```

**Typography**
```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 30px;
```

**Border Radius**
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;
```

**Shadows**
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
--shadow-md: 0 4px 6px rgba(0,0,0,0.3);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.3);
--shadow-glow: 0 0 20px rgba(59,130,246,0.3);
```

---

## State Management

### Cart State (Zustand)

```typescript
interface CartStore {
  // Session
  sessionId: string;

  // PR Data
  pr: {
    owner: string;
    repo: string;
    number: number;
    title: string;
    files: PRFile[];
  } | null;

  // Cart
  selectedFiles: Set<string>;
  savedForLater: Set<string>;

  // Checkout config
  deliveryMethod: 'patch' | 'branch' | 'commit' | 'pr';
  targetBranch: string;
  targetPath: string | null;
  commitMessage: string;

  // UI State
  cartDrawerOpen: boolean;
  quickViewFile: string | null;

  // Actions
  loadPR: (owner: string, repo: string, number: number) => Promise<void>;
  addToCart: (filename: string) => void;
  removeFromCart: (filename: string) => void;
  saveForLater: (filename: string) => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setTargetBranch: (branch: string) => void;
  checkout: () => Promise<CheckoutResult>;
}
```

### Persistence

```
~/.prcart/
├── config.json           # User preferences
├── auth.json             # Cached auth (or use gh CLI)
├── sessions/
│   ├── abc123.json       # Active session
│   └── def456.json
└── history/
    ├── 2024-01-30-142.json  # Past checkouts
    └── 2024-01-29-139.json
```

---

## API Endpoints (Local Server)

```
GET  /api/health              # Health check
GET  /api/session             # Current session state
POST /api/session/load        # Load a PR into session
POST /api/cart/add            # Add file to cart
POST /api/cart/remove         # Remove file from cart
POST /api/checkout            # Execute checkout
GET  /api/history             # Get checkout history
POST /api/undo/:id            # Undo a checkout

WebSocket /ws                 # Real-time sync between CLI and UI
```

---

## GitHub Integration

### Using gh CLI Token

```typescript
// Check for gh CLI auth
async function getGitHubToken(): Promise<string | null> {
  try {
    const { stdout } = await exec('gh auth token');
    return stdout.trim();
  } catch {
    return null;
  }
}

// If no token, guide user
if (!token) {
  console.log('GitHub auth required. Run: gh auth login');
  process.exit(1);
}
```

### Required Scopes
- `repo` - Access to private repos
- `read:user` - Get user info

### API Calls Needed
- `GET /repos/{owner}/{repo}/pulls` - List PRs
- `GET /repos/{owner}/{repo}/pulls/{number}` - Get PR details
- `GET /repos/{owner}/{repo}/pulls/{number}/files` - Get changed files
- `POST /repos/{owner}/{repo}/git/refs` - Create branch
- `POST /repos/{owner}/{repo}/pulls` - Create PR

---

## Checkout Flow Details

### Step 1: Review Order
- Show all items in cart
- Allow last-minute removes
- Show totals (files, lines added/removed)

### Step 2: Delivery Method
- **Download Patch**: Get .patch file to apply manually
- **Create Branch**: New branch with only selected changes
- **Commit to Current**: Add changes to current branch
- **Create PR**: New PR with selected changes only

### Step 3: Shipping Address
- **Target Branch**: Which branch to base off / merge into
- **Local Path**: For multi-worktree setups (optional)
- **Commit Message**: Pre-filled, editable

### Step 4: Confirmation
- Summary of what will happen
- "Place Order" button
- Success animation (confetti)
- "View Receipt" (what was applied)

---

## Order History

Each checkout creates a history entry:

```typescript
interface CheckoutRecord {
  id: string;
  timestamp: Date;
  pr: {
    owner: string;
    repo: string;
    number: number;
    title: string;
  };
  filesApplied: string[];
  deliveryMethod: DeliveryMethod;
  targetBranch: string;
  commitSha?: string;
  branchName?: string;
  patchPath?: string;
  canUndo: boolean;
}
```

### Undo Mechanism
- For branch: Delete the branch
- For commit: `git revert` the commit
- For patch: Show instructions (can't auto-undo)
- For PR: Close the PR

---

## Landing Page (prcart.dev only)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                    [GitHub ★]   │
│                                                                 │
│                          🛒 PRCart                              │
│                                                                 │
│              Shop your pull requests.                           │
│              Keep what you need.                                │
│                                                                 │
│      ┌─────────────────────────────────────────────────┐       │
│      │  $ npm install -g prcart                    [⎘] │       │
│      └─────────────────────────────────────────────────┘       │
│                                                                 │
│              [Try Demo]        [Documentation]                  │
│                                                                 │
│         ┌─────────────────────────────────────────┐            │
│         │                                         │            │
│         │         [Animated Demo Video]           │            │
│         │                                         │            │
│         └─────────────────────────────────────────┘            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Why PRCart?                                                   │
│                                                                 │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐                │
│   │ AI PRs   │    │ Browse   │    │ Keep     │                │
│   │ are huge │ →  │ changes  │ →  │ what you │                │
│   │          │    │ visually │    │ want     │                │
│   └──────────┘    └──────────┘    └──────────┘                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   How it works                                                  │
│                                                                 │
│   1. Run `prcart` in any repo                                  │
│   2. Pick a PR from the list                                   │
│   3. Add files to your cart                                    │
│   4. Checkout with your preferred method                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ $ prcart                                                │  │
│   │                                                         │  │
│   │ ? Select a PR to shop:                                  │  │
│   │ ❯ #142 feat: add dark mode (2 hours ago)               │  │
│   │   #139 fix: login bug (1 day ago)                      │  │
│   │                                                         │  │
│   │ 🛒 Opening cart at localhost:3847...                   │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Structure (Target)

```
prcart/
├── packages/
│   ├── cli/                    # CLI package (npm: prcart)
│   │   ├── src/
│   │   │   ├── index.ts        # Entry point
│   │   │   ├── commands/       # Command handlers
│   │   │   ├── server/         # Local Express server
│   │   │   ├── github/         # GitHub API client
│   │   │   └── utils/
│   │   └── package.json
│   │
│   ├── web/                    # Web UI (served by CLI or prcart.dev)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ProductCard/
│   │   │   │   ├── CartDrawer/
│   │   │   │   ├── CheckoutFlow/
│   │   │   │   └── ...
│   │   │   ├── stores/
│   │   │   ├── pages/
│   │   │   └── styles/
│   │   └── package.json
│   │
│   └── shared/                 # Shared types and utils
│       ├── src/
│       │   ├── types.ts
│       │   └── constants.ts
│       └── package.json
│
├── apps/
│   └── landing/                # Landing page (prcart.dev)
│       ├── src/
│       └── package.json
│
├── .internal/                  # Internal docs (gitignored)
├── docs/                       # Public documentation
├── README.md
├── LICENSE
├── CLAUDE.md
└── package.json                # Monorepo root
```

---

## Tech Stack (Final)

| Component | Technology |
|-----------|------------|
| Monorepo | pnpm workspaces + Turborepo |
| CLI | Node.js + Commander + Inquirer |
| Local Server | Express + ws (WebSocket) |
| Web UI | React 18 + Vite |
| Styling | Tailwind CSS + Framer Motion |
| State | Zustand |
| GitHub API | Octokit |
| Landing Page | Next.js (for prcart.dev) or same Vite app |

---

## Development Phases

### Phase 1: Foundation
- Monorepo setup
- CLI skeleton (commands, no functionality)
- Web UI scaffold (layout, design system)
- Landing page

### Phase 2: Core Shopping
- Product cards with thumbnails
- Cart drawer with animations
- Add/remove interactions
- Local state management

### Phase 3: CLI Integration
- PR loading via gh CLI token
- PR picker (interactive terminal)
- Local server that serves web UI
- WebSocket sync

### Phase 4: Checkout Flow
- Multi-step checkout UI
- Patch generation
- Branch creation
- Commit creation
- PR creation

### Phase 5: History & Polish
- Order history
- Undo functionality
- Animations and micro-interactions
- Mobile responsive
- Light/dark mode

### Phase 6: Cloud (Optional)
- prcart.dev hosting
- Shareable session links
- User accounts

---

## Success Criteria

1. **Zero friction**: `prcart` → pick PR → shop → checkout in under 60 seconds
2. **No URL pasting**: Never need to copy a GitHub URL
3. **Feels like shopping**: Non-developers could understand the UI
4. **Twitter-worthy**: Screenshots and recordings look impressive
5. **Works offline**: Local mode needs no internet after initial PR load
