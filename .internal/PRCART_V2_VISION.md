# PRCart v2: The Real Vision

**The current implementation is wrong.** Here's what PRCart should actually be.

---

## The Problem with v1

| What We Built | Why It's Wrong |
|---------------|----------------|
| GitHub-looking UI | Looks like every other dev tool |
| Checkboxes for selection | Not shopping - that's a form |
| Diff viewer as main focus | Developers already have diff viewers |
| Dark gray dev aesthetic | Boring, not memorable, not Twitter-worthy |
| Web-only | Doesn't fit developer workflow |

**The metaphor wasn't executed. We just made another dev tool with a shopping cart icon.**

---

## The Correct Vision

### PRCart is a CLI tool that opens a shopping experience

```bash
# In any git repo with open PRs
$ prcart

🛒 PRCart - Opening your cart at prcart.dev/session/abc123

# Or load a specific PR
$ prcart https://github.com/facebook/react/pull/28000

# After shopping, apply changes
$ prcart apply
```

The web UI is **not a dev tool**. It's a **shopping website** where the products happen to be code changes.

---

## What the UI Should Look Like

### NOT This (Current - GitHub Clone):
```
┌─────────────────────────────────────────────┐
│ [x] src/auth/login.ts    +45 -12           │
│ [ ] src/utils/helper.ts  +89 -23           │
│ [x] package.json         +5  -2            │
└─────────────────────────────────────────────┘
```

### YES This (Shopping Experience):
```
┌─────────────────────────────────────────────────────────────────┐
│  🛒 PRCart                              Cart (3) 🛒  [Checkout] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   📦         │  │   📦         │  │   📦         │          │
│  │  [code img]  │  │  [code img]  │  │  [code img]  │          │
│  │              │  │              │  │              │          │
│  │ login.ts     │  │ helper.ts    │  │ package.json │          │
│  │ Auth Module  │  │ Utilities    │  │ Dependencies │          │
│  │              │  │              │  │              │          │
│  │ +45 -12      │  │ +89 -23      │  │ +5 -2        │          │
│  │ ████░░ Med   │  │ █████░ High  │  │ ██░░░ Low    │          │
│  │              │  │              │  │              │          │
│  │ [Add to Cart]│  │ [Add to Cart]│  │ [  Added ✓ ] │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   ...more    │  │   products   │  │   ...       │          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core UI Components (E-commerce Style)

### 1. Product Cards (File Changes)

Each file is a **product card**, not a list item:

```
┌────────────────────────────────┐
│  ┌──────────────────────────┐  │
│  │                          │  │  ← Code preview thumbnail
│  │   function login() {     │  │    (syntax highlighted)
│  │     // Auth logic        │  │
│  │   }                      │  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│  📄 login.ts                   │  ← Product name
│  Authentication Module         │  ← Category/description
│                                │
│  +45 lines  -12 lines          │  ← "Price" (changes)
│                                │
│  Risk: ████░░ Medium           │  ← Rating (risk level)
│  ⭐⭐⭐⭐☆ (4 reviewers liked)     │  ← Social proof (optional)
│                                │
│  ┌────────────────────────┐    │
│  │     Add to Cart  🛒    │    │  ← CTA button
│  └────────────────────────┘    │
│                                │
│  [Quick View]  [Details]       │  ← Secondary actions
└────────────────────────────────┘
```

### 2. Cart Drawer (Slides from Right)

When you click the cart icon, a drawer slides in:

```
                              ┌─────────────────────┐
                              │  Your Cart (3)    ✕ │
                              ├─────────────────────┤
                              │                     │
                              │ ┌─────────────────┐ │
                              │ │ 📄 login.ts     │ │
                              │ │ +45 -12         │ │
                              │ │          [Remove]│ │
                              │ └─────────────────┘ │
                              │                     │
                              │ ┌─────────────────┐ │
                              │ │ 📄 helper.ts    │ │
                              │ │ +89 -23         │ │
                              │ │          [Remove]│ │
                              │ └─────────────────┘ │
                              │                     │
                              │ ┌─────────────────┐ │
                              │ │ 📄 package.json │ │
                              │ │ +5 -2           │ │
                              │ │          [Remove]│ │
                              │ └─────────────────┘ │
                              │                     │
                              │ ─────────────────── │
                              │                     │
                              │ Subtotal:           │
                              │ +139 lines added    │
                              │ -37 lines removed   │
                              │ Net: +102 lines     │
                              │                     │
                              │ ┌─────────────────┐ │
                              │ │    Checkout     │ │
                              │ └─────────────────┘ │
                              │                     │
                              │ [Continue Shopping] │
                              └─────────────────────┘
```

### 3. Checkout Flow (Multi-Step)

Like buying something online:

```
Step 1: Review Order          Step 2: Choose Delivery       Step 3: Confirm
─────────────────────────     ─────────────────────────     ─────────────────────

Your items:                   How do you want these         Order Summary:
                              changes?
☑ login.ts (+45 -12)                                        3 items
☑ helper.ts (+89 -23)         ○ Download Patch              +139 / -37 lines
☑ package.json (+5 -2)          Get a .patch file
                                                            Delivery: New Branch
                              ● New Branch                  Branch: feature/cart-
                                Create branch with            selection
                                selected changes
                                                            ┌─────────────────┐
                              ○ New PR                      │  Place Order 🎉 │
                                Split into separate PR      └─────────────────┘

[Back]            [Continue]  [Back]            [Continue]  [Back]    [Confirm]
```

### 4. Add to Cart Animation

When clicking "Add to Cart":
1. Button shows spinner briefly (100ms)
2. Product thumbnail flies to cart icon (bezier curve, 400ms)
3. Cart icon jiggles and badge increments
4. Toast notification: "✓ Added login.ts to cart"
5. Button changes to "✓ Added" (green) for 2 seconds, then "Remove"

### 5. Color Scheme (NOT GitHub Gray)

**Light Mode:**
- Background: White (#FFFFFF)
- Cards: Soft white with subtle shadow
- Primary action: Vibrant blue (#0066FF) or teal (#06B6D4)
- Success: Green (#10B981)
- Danger/Remove: Red (#EF4444)
- Text: Near-black (#1a1a1a)

**Dark Mode:**
- Background: True black (#0a0a0a) or near-black (#111111)
- Cards: Elevated dark (#1a1a1a) with glow on hover
- Primary action: Electric blue (#3B82F6) or cyan (#22D3EE)
- Accents: Neon-ish glows (subtle)

---

## Landing Page (prcart.dev)

### Hero Section

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                            [GitHub] [X] │
│                                                                         │
│                                                                         │
│                           🛒                                            │
│                                                                         │
│              Shop your pull requests.                                   │
│              Keep what you need.                                        │
│                                                                         │
│     AI tools generate massive PRs. You want some changes,              │
│     not all of them. PRCart lets you curate code like                  │
│     you shop online.                                                    │
│                                                                         │
│         ┌─────────────────────────────────────────┐                    │
│         │  $ npm install -g prcart                │  [Copy]            │
│         └─────────────────────────────────────────┘                    │
│                                                                         │
│         [Try Demo]              [View on GitHub]                        │
│                                                                         │
│                                                                         │
│                      ┌─────────────────────────┐                       │
│                      │                         │                       │
│                      │    [Animated Demo]      │                       │
│                      │    of the shopping      │                       │
│                      │    experience           │                       │
│                      │                         │                       │
│                      └─────────────────────────┘                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### How It Works Section

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                        How PRCart Works                                 │
│                                                                         │
│     ┌─────────────┐      ┌─────────────┐      ┌─────────────┐         │
│     │             │      │             │      │             │         │
│     │  1. Browse  │  →   │  2. Add to  │  →   │ 3. Checkout │         │
│     │             │      │     Cart    │      │             │         │
│     │  See all    │      │  Pick what  │      │  Apply only │         │
│     │  changes    │      │  you want   │      │  selected   │         │
│     │             │      │             │      │             │         │
│     └─────────────┘      └─────────────┘      └─────────────┘         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Installation Section

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                          Get Started                                    │
│                                                                         │
│   ┌──────────────────────────────────────────────────────────────────┐ │
│   │                                                                   │ │
│   │  # Install                                                        │ │
│   │  $ npm install -g prcart                                          │ │
│   │                                                                   │ │
│   │  # Open any PR in your cart                                       │ │
│   │  $ prcart https://github.com/owner/repo/pull/123                 │ │
│   │                                                                   │ │
│   │  # Or browse all open PRs in current repo                        │ │
│   │  $ prcart                                                        │ │
│   │                                                                   │ │
│   │  # Apply your selections                                         │ │
│   │  $ prcart apply                                                  │ │
│   │                                                                   │ │
│   └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## CLI Architecture

### Commands

```bash
prcart                          # Open web UI for current repo's PRs
prcart <pr-url>                 # Open specific PR in web UI
prcart --tui                    # Terminal UI (for no-browser workflows)
prcart apply                    # Apply current cart to local repo
prcart apply --patch            # Export as patch file instead
prcart status                   # Show current cart contents
prcart clear                    # Clear cart
prcart config                   # Configure (GitHub token, etc.)
```

### How It Works

1. **CLI starts local server** (like `vite dev`)
2. **Opens browser** to `localhost:3847` or `prcart.dev/session/xyz`
3. **Syncs state** between CLI and web via WebSocket
4. **Cart persists** in `~/.prcart/sessions/`
5. **Apply command** reads cart state and generates patch or creates branch

### Session Flow

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    CLI      │ ──────→ │  Local API  │ ←─────→ │  Web UI     │
│  (command)  │         │  (Express)  │   WS    │  (React)    │
└─────────────┘         └─────────────┘         └─────────────┘
       │                       │
       │                       ▼
       │                ┌─────────────┐
       │                │   GitHub    │
       │                │    API      │
       │                └─────────────┘
       │
       ▼
┌─────────────┐
│  Local Git  │
│   (apply)   │
└─────────────┘
```

---

## Tech Stack (Updated)

| Component | Technology | Why |
|-----------|------------|-----|
| CLI | Node.js + Commander | Cross-platform, npm installable |
| Local Server | Express + WebSocket | Real-time sync with UI |
| Web UI | React + Vite + Tailwind | Fast, modern, customizable |
| Animations | Framer Motion | Smooth e-commerce-like interactions |
| State | Zustand + localStorage | Persist cart across sessions |
| Styling | Tailwind + custom design system | Not GitHub-looking |

---

## What Makes This Twitter-Worthy

1. **The shopping metaphor is VISUAL** - Product cards, cart drawer, checkout flow
2. **The animations are satisfying** - Flying items, jiggling cart, confetti on checkout
3. **It's CLI-first** - Developers love CLI tools that "just work"
4. **It solves a real problem** - AI-generated PRs are huge and need curation
5. **It's beautiful** - Not another gray dev tool

---

## Implementation Priority

### Phase 1: Landing Page + CLI Skeleton (Week 1)
- [ ] Beautiful landing page at prcart.dev
- [ ] `npm install -g prcart` working
- [ ] CLI opens browser to web UI
- [ ] Basic PR loading

### Phase 2: Shopping UI (Week 2)
- [ ] Product card design (not list items)
- [ ] Cart drawer (slides from right)
- [ ] Add to Cart animations
- [ ] Checkout flow (multi-step)

### Phase 3: CLI Apply (Week 3)
- [ ] `prcart apply` generates patch
- [ ] `prcart apply --branch` creates branch
- [ ] WebSocket sync between CLI and UI
- [ ] Session persistence

### Phase 4: Polish + Launch (Week 4)
- [ ] Mobile responsive
- [ ] Dark/light mode toggle
- [ ] Demo video
- [ ] Twitter launch

---

## The Vibe

PRCart should feel like:
- **Unboxing a new product** - Exciting, delightful
- **Shopping on your phone at 2am** - Easy, mindless, satisfying
- **Getting a package delivered** - The "checkout complete" moment

NOT like:
- **Filing taxes** - Tedious, form-heavy
- **Code review** - Serious, judgmental
- **Git commands** - Scary, technical

---

## Final Note

The current implementation needs to be mostly rewritten. The components, state management, and architecture are fine - but the UI design philosophy is completely wrong.

**We built a dev tool. We should have built a shopping experience.**
