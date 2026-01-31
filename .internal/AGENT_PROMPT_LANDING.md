# Landing Page Agent Prompt

> **Scope**: Build the `apps/landing/` package only.
> **Reference**: Read `.internal/SPEC_MASTER.md` for full context.

---

## Your Mission

Build a stunning landing page for PRCart at **prcart.dev**. This is a marketing page for a CLI tool - think Vercel, Raycast, or Linear landing pages.

**Goal**: Make developers instantly understand what PRCart does and want to install it.

---

## Package Structure

Create this structure inside `apps/landing/`:

```
apps/landing/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Main landing page
│   │   └── globals.css
│   ├── components/
│   │   ├── Hero.tsx              # Above the fold
│   │   ├── InstallCommand.tsx    # Copy-able npm install
│   │   ├── FeatureGrid.tsx       # Why PRCart?
│   │   ├── HowItWorks.tsx        # Step-by-step
│   │   ├── TerminalDemo.tsx      # Animated CLI demo
│   │   ├── ShoppingDemo.tsx      # UI preview/video
│   │   ├── Testimonials.tsx      # Social proof (future)
│   │   ├── Footer.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       └── Container.tsx
│   └── lib/
│       └── utils.ts
├── public/
│   ├── favicon.ico
│   ├── og-image.png              # Social preview
│   └── demo.mp4                  # Demo video
├── next.config.js
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
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^11.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/node": "^20.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0"
  }
}
```

---

## Design System

Same as main app for consistency:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0a0a',
          secondary: '#141414',
        },
        text: {
          primary: '#fafafa',
          secondary: '#a1a1a1',
        },
        accent: {
          primary: '#3b82f6',
          success: '#22c55e',
          danger: '#ef4444',
        },
        border: '#2a2a2a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
};
```

---

## Page Sections

### 1. Hero

The most important 5 seconds. Instant clarity.

```
┌─────────────────────────────────────────────────────────────────┐
│                                              [GitHub ★]  [Docs] │
│                                                                 │
│                          🛒                                     │
│                        PRCart                                   │
│                                                                 │
│           Shop your pull requests.                              │
│           Keep what you need.                                   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  $ npm install -g prcart                            [⎘] │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│           [Try Demo]            [Read Docs]                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Copy to clipboard** on click of the install command box.

### 2. Problem Statement

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   AI-generated PRs are overwhelming.                           │
│                                                                 │
│   ┌────────────┐    ┌────────────┐    ┌────────────┐           │
│   │            │    │            │    │            │           │
│   │  Cursor    │    │  Copilot   │    │  Claude    │           │
│   │            │    │            │    │            │           │
│   │  42 files  │    │  38 files  │    │  67 files  │           │
│   │  changed   │    │  changed   │    │  changed   │           │
│   │            │    │            │    │            │           │
│   └────────────┘    └────────────┘    └────────────┘           │
│                                                                 │
│   You only want half of it.                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Feature Grid

Three key benefits:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Why PRCart?                                                   │
│                                                                 │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│   │  🛒             │  │  👁️              │  │  📦             ││
│   │                 │  │                 │  │                 ││
│   │  Shop, don't   │  │  Visual diff    │  │  Multiple       ││
│   │  review         │  │  previews       │  │  export options ││
│   │                 │  │                 │  │                 ││
│   │  Browse files   │  │  See changes    │  │  Patch, branch, ││
│   │  like products  │  │  before adding  │  │  commit, or PR  ││
│   └─────────────────┘  └─────────────────┘  └─────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4. How It Works

Step-by-step with terminal animation:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   How it works                                                  │
│                                                                 │
│   1. Run prcart in your repo                                    │
│   2. Pick a PR                                                  │
│   3. Add files to your cart                                     │
│   4. Checkout your way                                          │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ ~/project $ prcart                                      │   │
│   │                                                         │   │
│   │ ? Select a PR to shop:                                  │   │
│   │ ❯ #142 feat: add dark mode (2 hours ago)               │   │
│   │   #139 fix: login bug (1 day ago)                      │   │
│   │   #134 refactor: extract auth (3 days ago)             │   │
│   │                                                         │   │
│   │ 🛒 Opening cart at localhost:3847...                   │   │
│   │                                                         │   │
│   │ [cursor blinks]                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Animated**: Terminal types out commands and shows response.

### 5. Shopping Demo

Video or animated preview of the web UI:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   A shopping experience for code                                │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐     │
│   │                                                       │     │
│   │              [Demo Video/Animation]                   │     │
│   │                                                       │     │
│   │    Shows: Product grid → Add to cart → Checkout      │     │
│   │                                                       │     │
│   └───────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6. CTA + Footer

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Ready to shop?                                                │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  $ npm install -g prcart                            [⎘] │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   [Star on GitHub]                                              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   PRCart                     Links                              │
│   Shop your PRs.             GitHub                             │
│                              Documentation                      │
│   MIT License                Twitter                            │
│   Made by @anipotts          Issues                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Components

### InstallCommand

```tsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function InstallCommand() {
  const [copied, setCopied] = useState(false);
  const command = 'npm install -g prcart';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-3 px-6 py-3 bg-bg-secondary border border-border rounded-xl hover:border-accent-primary transition-colors"
    >
      <span className="text-text-secondary">$</span>
      <code className="font-mono text-text-primary">{command}</code>
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="text-accent-success"
          >
            ✓
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            className="text-text-secondary group-hover:text-text-primary"
          >
            ⎘
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
```

### TerminalDemo

Animated terminal that types commands:

```tsx
'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SCRIPT = [
  { type: 'command', text: 'prcart', delay: 500 },
  { type: 'output', text: '\n', delay: 100 },
  { type: 'output', text: '? Select a PR to shop:', delay: 300 },
  { type: 'output', text: '\n❯ #142 feat: add dark mode (2h ago)', delay: 200 },
  { type: 'output', text: '\n  #139 fix: login bug (1d ago)', delay: 100 },
  { type: 'output', text: '\n  #134 refactor: extract auth (3d ago)', delay: 100 },
  { type: 'wait', delay: 1500 },
  { type: 'output', text: '\n\n🛒 Opening cart at localhost:3847...', delay: 500 },
];

export function TerminalDemo() {
  const [lines, setLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= SCRIPT.length) return;

    const item = SCRIPT[currentIndex];
    const timer = setTimeout(() => {
      if (item.type !== 'wait') {
        setLines(prev => [...prev, item.text]);
      }
      setCurrentIndex(i => i + 1);
    }, item.delay);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className="bg-bg-primary rounded-xl border border-border overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-text-secondary">Terminal</span>
      </div>

      {/* Terminal content */}
      <div className="p-4 font-mono text-sm">
        <span className="text-text-secondary">~/project $ </span>
        {lines.map((line, i) => (
          <span key={i} className="text-text-primary whitespace-pre">{line}</span>
        ))}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-text-primary ml-0.5"
        />
      </div>
    </div>
  );
}
```

### FeatureCard

```tsx
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 bg-bg-secondary rounded-xl border border-border"
    >
      <span className="text-4xl">{icon}</span>
      <h3 className="mt-4 text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 text-text-secondary">{description}</p>
    </motion.div>
  );
}
```

---

## SEO & Meta

```tsx
// app/layout.tsx
export const metadata = {
  title: 'PRCart - Shop your pull requests',
  description: 'A CLI tool that lets you curate pull request changes using a shopping cart metaphor. Pick the files you want, leave the rest.',
  keywords: ['github', 'pull request', 'cli', 'developer tools', 'code review'],
  openGraph: {
    title: 'PRCart - Shop your pull requests',
    description: 'Pick the files you want, leave the rest.',
    url: 'https://prcart.dev',
    siteName: 'PRCart',
    images: [
      {
        url: 'https://prcart.dev/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRCart - Shop your pull requests',
    description: 'Pick the files you want, leave the rest.',
    images: ['https://prcart.dev/og-image.png'],
  },
};
```

---

## Animations

Use Framer Motion for:

1. **Scroll reveals**: Sections fade in as you scroll
2. **Hover effects**: Cards lift slightly
3. **Terminal typing**: Text appears character by character
4. **Stagger children**: Grid items appear one by one

```tsx
// Scroll reveal wrapper
import { motion } from 'framer-motion';

export function FadeIn({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

// Stagger container
export function StaggerContainer({ children }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
```

---

## Mobile Responsive

- Stack sections vertically on mobile
- Reduce padding
- Make terminal demo scrollable horizontally if needed
- Full-width CTA buttons

```tsx
// Example responsive classes
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Feature cards */}
</div>

<h1 className="text-3xl md:text-5xl font-bold">
  Shop your pull requests.
</h1>
```

---

## DO NOT Build

You are ONLY building the landing page. Do NOT:

- Build the shopping UI (that's packages/web)
- Build the CLI
- Build any backend
- Add user authentication
- Add analytics (yet)

---

## Visual Quality Standards

1. **Instant clarity**: Visitor understands in 5 seconds
2. **Developer aesthetic**: Dark, minimal, professional
3. **Smooth animations**: Polished micro-interactions
4. **Mobile-first**: Works beautifully on phones
5. **Fast load**: Optimize images, minimal JS

---

## Deployment

Deploy to Vercel at prcart.dev:

```bash
# Already deployed - just push to main
git push origin main

# Vercel auto-deploys from GitHub
```

---

## Start Here

1. Set up Next.js 14 with app router
2. Configure Tailwind with design system
3. Build Hero section first
4. Add InstallCommand with copy
5. Build TerminalDemo animation
6. Add FeatureGrid
7. Add HowItWorks
8. Create OG image for social sharing

Focus on making visitors want to install immediately. Refer to `SPEC_MASTER.md` for any questions.
