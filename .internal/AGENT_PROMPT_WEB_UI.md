# Web UI Agent Prompt

> **Scope**: Build the `packages/web/` package only.
> **Reference**: Read `.internal/SPEC_MASTER.md` for full context.

---

## Your Mission

Build a **shopping experience** for pull request files. This is NOT a code review tool - it's an e-commerce interface. Users should feel like they're browsing products on a modern shopping site.

**Key principle**: If someone's grandma couldn't understand the interface, you're doing it wrong.

---

## Package Structure

Create this structure inside `packages/web/`:

```
packages/web/
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Router setup
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Top nav with logo, PR info, cart icon
│   │   │   ├── Footer.tsx
│   │   │   └── PageContainer.tsx
│   │   ├── shop/
│   │   │   ├── ProductGrid.tsx     # Grid of file cards
│   │   │   ├── ProductCard.tsx     # Single file as product
│   │   │   ├── CodeThumbnail.tsx   # Syntax-highlighted preview
│   │   │   ├── FilterBar.tsx       # Filter by type, size, etc.
│   │   │   ├── SortDropdown.tsx    # Sort by name, changes, etc.
│   │   │   └── QuickViewModal.tsx  # Full diff preview
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx      # Slides from right
│   │   │   ├── CartItem.tsx        # Single item in cart
│   │   │   ├── CartSummary.tsx     # Totals section
│   │   │   └── CartIcon.tsx        # Header icon with badge
│   │   ├── checkout/
│   │   │   ├── CheckoutFlow.tsx    # Multi-step wrapper
│   │   │   ├── Step1_Review.tsx    # Review order
│   │   │   ├── Step2_Delivery.tsx  # Choose method
│   │   │   ├── Step3_Shipping.tsx  # Target branch
│   │   │   ├── Step4_Confirm.tsx   # Confirmation
│   │   │   └── OrderSuccess.tsx    # Success with confetti
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       ├── Modal.tsx
│   │       ├── Spinner.tsx
│   │       └── Tooltip.tsx
│   ├── pages/
│   │   ├── ShopPage.tsx            # Main shopping interface
│   │   ├── CartPage.tsx            # Full cart view
│   │   ├── CheckoutPage.tsx        # Checkout flow
│   │   ├── HistoryPage.tsx         # Order history
│   │   └── SettingsPage.tsx        # Config
│   ├── stores/
│   │   ├── useCartStore.ts         # Zustand store
│   │   └── useUIStore.ts           # UI state (modals, drawers)
│   ├── hooks/
│   │   ├── useWebSocket.ts         # WebSocket connection
│   │   ├── useApi.ts               # API client
│   │   └── useCart.ts              # Cart helpers
│   ├── styles/
│   │   ├── globals.css             # Base styles
│   │   └── tailwind.css            # Tailwind imports
│   ├── utils/
│   │   ├── formatters.ts           # Number formatters
│   │   └── syntax.ts               # Code highlighting
│   └── types/
│       └── index.ts
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## Tech Stack

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "zustand": "^4.5.0",
    "framer-motion": "^11.0.0",
    "prism-react-renderer": "^2.3.0",
    "canvas-confetti": "^1.9.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "vite": "^5.1.0"
  }
}
```

---

## Design System

### Colors

```css
/* tailwind.config.js extend */
colors: {
  bg: {
    primary: '#0a0a0a',
    secondary: '#141414',
    card: '#1a1a1a',
    'card-hover': '#222222',
  },
  text: {
    primary: '#fafafa',
    secondary: '#a1a1a1',
    muted: '#6b7280',
  },
  accent: {
    primary: '#3b82f6',    /* Blue - buttons, links */
    success: '#22c55e',    /* Green - additions, success */
    danger: '#ef4444',     /* Red - deletions, errors */
    warning: '#f59e0b',    /* Orange - warnings */
  },
  border: '#2a2a2a',
}
```

### Typography

```css
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
}
```

### Animations

Use Framer Motion for all animations. Key animations:

1. **Add to Cart**: Item "flies" to cart icon
2. **Cart Drawer**: Slides in from right
3. **Product Hover**: Subtle lift with shadow
4. **Checkout Steps**: Slide transitions
5. **Success**: Confetti explosion

---

## Core Components

### 1. ProductCard

The most important component. Each file is a "product".

```tsx
interface ProductCardProps {
  file: {
    filename: string;
    additions: number;
    deletions: number;
    patch?: string;
    status: 'added' | 'modified' | 'removed' | 'renamed';
  };
  isInCart: boolean;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  onQuickView: () => void;
}

// Visual structure:
// ┌─────────────────────────────┐
// │  ┌─────────────────────┐    │
// │  │                     │    │
// │  │   Code Thumbnail    │    │  ← Syntax highlighted preview
// │  │   (diff preview)    │    │
// │  │                     │    │
// │  └─────────────────────┘    │
// │                             │
// │  📄 src/components/App.tsx  │  ← Filename with icon
// │  Modified                   │  ← Status badge
// │                             │
// │  +45  -12                   │  ← "Price" (lines changed)
// │                             │
// │  ┌─────────────────────┐    │
// │  │    Add to Cart      │    │  ← Big, clickable button
// │  └─────────────────────┘    │
// └─────────────────────────────┘
```

**Interactions**:
- Hover: Card lifts, shadow increases
- Click thumbnail: Opens QuickView modal
- Click "Add to Cart":
  - Button changes to "✓ In Cart" (different color)
  - Flying animation toward cart icon
  - Cart icon badge increments with bounce

### 2. CartDrawer

Slides in from the right like a shopping cart sidebar.

```tsx
// Visual structure:
// ┌───────────────────────────────┐
// │  Your Cart (3 items)    [×]  │  ← Header with close
// ├───────────────────────────────┤
// │                               │
// │  ┌─────────────────────────┐  │
// │  │ 📄 App.tsx        [×]   │  │  ← Cart item with remove
// │  │    +45 -12              │  │
// │  └─────────────────────────┘  │
// │                               │
// │  ┌─────────────────────────┐  │
// │  │ 📄 styles.css     [×]   │  │
// │  │    +120 -0              │  │
// │  └─────────────────────────┘  │
// │                               │
// │  ┌─────────────────────────┐  │
// │  │ 📄 index.ts       [×]   │  │
// │  │    +8 -3                │  │
// │  └─────────────────────────┘  │
// │                               │
// ├───────────────────────────────┤
// │  Subtotal                     │
// │  3 files, +173 -15 lines     │
// │                               │
// │  ┌─────────────────────────┐  │
// │  │      Checkout →         │  │  ← Big green button
// │  └─────────────────────────┘  │
// └───────────────────────────────┘
```

**Animation**:
- Slide in from right (300ms ease-out)
- Background overlay fades in
- Items stagger in

### 3. CheckoutFlow

Multi-step checkout like e-commerce.

**Step 1: Review Order**
- List all items with ability to remove
- Show totals
- "Continue to Delivery →"

**Step 2: Delivery Method**
```
How would you like your changes?

○ Download Patch File
  Get a .patch file to apply manually

○ Create New Branch
  Create a branch with only selected changes

○ Commit to Current Branch
  Add changes to your current branch

○ Create Pull Request
  Open a new PR with selected changes only
```

**Step 3: Shipping Address**
```
Where should we deliver?

Target Branch: [main          ▼]
              The branch to base off / merge into

Local Path (optional): [/path/to/worktree    ]
                      For multi-worktree setups

Commit Message:
┌─────────────────────────────────────────┐
│ Apply selected changes from PR #142     │
│                                         │
│ Files: App.tsx, styles.css, index.ts    │
└─────────────────────────────────────────┘
```

**Step 4: Confirmation**
- Summary of everything
- "Place Order" button
- On success: Confetti + success message

### 4. CodeThumbnail

Shows syntax-highlighted preview of the diff.

```tsx
import { Highlight, themes } from 'prism-react-renderer';

function CodeThumbnail({ patch, language }: Props) {
  // Take first ~10 lines of diff
  const preview = patch?.split('\n').slice(0, 10).join('\n') || '';

  return (
    <div className="h-32 overflow-hidden rounded-lg bg-bg-primary">
      <Highlight theme={themes.nightOwl} code={preview} language={language}>
        {/* ... */}
      </Highlight>
    </div>
  );
}
```

### 5. CartIcon

Header cart icon with animated badge.

```tsx
function CartIcon({ count, onClick }: Props) {
  return (
    <button onClick={onClick} className="relative">
      <ShoppingCartIcon className="w-6 h-6" />
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-accent-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
        >
          {count}
        </motion.span>
      )}
    </button>
  );
}
```

---

## State Management

### Cart Store (Zustand)

```typescript
import { create } from 'zustand';

interface CartStore {
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

  // Actions
  addToCart: (filename: string) => void;
  removeFromCart: (filename: string) => void;
  clearCart: () => void;
  saveForLater: (filename: string) => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setTargetBranch: (branch: string) => void;
  setCommitMessage: (message: string) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  pr: null,
  selectedFiles: new Set(),
  savedForLater: new Set(),
  deliveryMethod: 'patch',
  targetBranch: 'main',
  targetPath: null,
  commitMessage: '',

  addToCart: (filename) => set((state) => ({
    selectedFiles: new Set([...state.selectedFiles, filename])
  })),

  removeFromCart: (filename) => set((state) => {
    const next = new Set(state.selectedFiles);
    next.delete(filename);
    return { selectedFiles: next };
  }),

  // ... rest of actions
}));

// Derived selectors
export const useCartCount = () => useCartStore((s) => s.selectedFiles.size);
export const useCartItems = () => useCartStore((s) =>
  s.pr?.files.filter(f => s.selectedFiles.has(f.filename)) ?? []
);
export const useCartStats = () => useCartStore((s) => {
  const items = s.pr?.files.filter(f => s.selectedFiles.has(f.filename)) ?? [];
  return {
    files: items.length,
    additions: items.reduce((sum, f) => sum + f.additions, 0),
    deletions: items.reduce((sum, f) => sum + f.deletions, 0),
  };
});
```

### UI Store

```typescript
interface UIStore {
  cartDrawerOpen: boolean;
  quickViewFile: string | null;
  checkoutStep: number;

  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  setQuickViewFile: (filename: string | null) => void;
  setCheckoutStep: (step: number) => void;
}
```

---

## WebSocket Integration

```typescript
// hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';
import { useCartStore } from '../stores/useCartStore';

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const { addToCart, removeFromCart, setPR } = useCartStore();

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.host}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case 'init':
          // Initial state from server
          setPR(msg.session.pr);
          msg.session.selectedFiles.forEach(addToCart);
          break;

        case 'cart-update':
          // Sync cart from server (CLI added/removed)
          // This handles cases where user uses CLI while web is open
          break;
      }
    };

    return () => ws.close();
  }, []);

  const send = (msg: object) => {
    wsRef.current?.send(JSON.stringify(msg));
  };

  return { send };
}
```

---

## API Client

```typescript
// hooks/useApi.ts
const API_BASE = '/api';

export const api = {
  async getSession() {
    const res = await fetch(`${API_BASE}/session`);
    return res.json();
  },

  async addToCart(filename: string) {
    await fetch(`${API_BASE}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename }),
    });
  },

  async removeFromCart(filename: string) {
    await fetch(`${API_BASE}/cart/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename }),
    });
  },

  async checkout(method: string, options: object) {
    const res = await fetch(`${API_BASE}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method, options }),
    });
    return res.json();
  },

  async getHistory() {
    const res = await fetch(`${API_BASE}/history`);
    return res.json();
  },
};
```

---

## Animations

### Flying Add to Cart

```tsx
import { motion, useAnimation } from 'framer-motion';

function ProductCard({ onAddToCart }: Props) {
  const controls = useAnimation();
  const [flyingItem, setFlyingItem] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cartIcon = document.getElementById('cart-icon');
    const cartRect = cartIcon?.getBoundingClientRect();

    if (cartRect) {
      setFlyingItem(true);
      await controls.start({
        x: cartRect.x - rect.x,
        y: cartRect.y - rect.y,
        scale: 0.1,
        opacity: 0,
        transition: { duration: 0.5, ease: 'easeInOut' }
      });
      setFlyingItem(false);
    }

    onAddToCart();
  };

  return (
    <>
      {flyingItem && (
        <motion.div
          animate={controls}
          className="fixed z-50 w-16 h-16 bg-accent-primary rounded-lg"
          style={{ left: rect.x, top: rect.y }}
        />
      )}
      {/* ... rest of card */}
    </>
  );
}
```

### Confetti on Success

```tsx
import confetti from 'canvas-confetti';

function OrderSuccess() {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-6xl mb-4"
      >
        🎉
      </motion.div>
      <h2 className="text-2xl font-bold">Order Complete!</h2>
      <p className="text-text-secondary mt-2">
        Your changes have been applied successfully.
      </p>
    </div>
  );
}
```

---

## Routes

```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## DO NOT Build

You are ONLY building the Web UI. Do NOT:

- Build CLI commands
- Build the Express server
- Build GitHub API integration
- Build the landing page (separate package)
- Add any AI features
- Implement actual git operations

Your job is to make a beautiful, animated shopping experience. The CLI/server provides the data via API.

---

## Visual Quality Standards

1. **Feels like shopping**: Not a dev tool. Shopping.
2. **Smooth animations**: Every interaction animated
3. **Touch-friendly**: Big tap targets
4. **Responsive**: Works on mobile
5. **Dark by default**: Match dev aesthetic
6. **Twitter-worthy**: Screenshots should look impressive

---

## Testing Checklist

- [ ] Product grid loads files correctly
- [ ] Add to cart animates
- [ ] Cart drawer slides smoothly
- [ ] Remove from cart works
- [ ] Checkout flow completes
- [ ] WebSocket syncs state
- [ ] Mobile layout works
- [ ] Dark/light mode works

---

## Start Here

1. Set up Vite + React + TypeScript
2. Configure Tailwind with design system colors
3. Build ProductCard component first
4. Add CartDrawer
5. Wire up Zustand store
6. Add WebSocket hook
7. Build checkout flow
8. Add animations

Focus on making it FEEL like shopping. Refer to `SPEC_MASTER.md` for any questions.
