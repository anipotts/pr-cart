# Shared Package Agent Prompt

> **Scope**: Build the `packages/shared/` package only.
> **Reference**: Read `.internal/SPEC_MASTER.md` for full context.

---

## Your Mission

Build the shared TypeScript types, constants, and utilities used by both the CLI and Web UI packages. This is the single source of truth for data structures.

**Key principle**: If it's used in two places, it belongs here.

---

## Package Structure

Create this structure inside `packages/shared/`:

```
packages/shared/
├── src/
│   ├── index.ts              # Re-exports everything
│   ├── types/
│   │   ├── index.ts          # Re-exports all types
│   │   ├── pr.ts             # PR and file types
│   │   ├── cart.ts           # Cart state types
│   │   ├── checkout.ts       # Checkout flow types
│   │   ├── history.ts        # Order history types
│   │   ├── config.ts         # User config types
│   │   └── api.ts            # API request/response types
│   ├── constants/
│   │   ├── index.ts
│   │   ├── defaults.ts       # Default values
│   │   └── limits.ts         # Rate limits, max values
│   ├── utils/
│   │   ├── index.ts
│   │   ├── patch.ts          # Patch generation logic
│   │   ├── formatters.ts     # Number/date formatters
│   │   └── validators.ts     # Input validation
│   └── schemas/
│       ├── index.ts
│       └── validation.ts     # Zod schemas (optional)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Tech Stack

```json
{
  "name": "@prcart/shared",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "dependencies": {
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tsup": "^8.0.0"
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm --dts",
    "dev": "tsup src/index.ts --format esm --dts --watch"
  }
}
```

---

## Core Types

### PR Types (`types/pr.ts`)

```typescript
/**
 * File status in a pull request
 */
export type FileStatus = 'added' | 'modified' | 'removed' | 'renamed';

/**
 * A single file changed in a PR
 */
export interface PRFile {
  /** Full path: src/components/App.tsx */
  filename: string;

  /** Change status */
  status: FileStatus;

  /** Lines added */
  additions: number;

  /** Lines removed */
  deletions: number;

  /** Total changes (additions + deletions) */
  changes: number;

  /** Unified diff patch content */
  patch?: string;

  /** Previous filename (for renames) */
  previousFilename?: string;

  /** SHA of the file blob */
  sha: string;

  /** Raw URL to file content */
  rawUrl: string;
}

/**
 * Pull request data
 */
export interface PRData {
  /** Repository owner */
  owner: string;

  /** Repository name */
  repo: string;

  /** PR number */
  number: number;

  /** PR title */
  title: string;

  /** PR description/body */
  body: string;

  /** PR author username */
  author: string;

  /** Base branch (e.g., 'main') */
  baseBranch: string;

  /** Head branch (e.g., 'feature/dark-mode') */
  headBranch: string;

  /** Files changed in this PR */
  files: PRFile[];

  /** Total additions across all files */
  totalAdditions: number;

  /** Total deletions across all files */
  totalDeletions: number;

  /** PR state */
  state: 'open' | 'closed' | 'merged';

  /** Created timestamp */
  createdAt: string;

  /** Updated timestamp */
  updatedAt: string;

  /** URL to PR on GitHub */
  htmlUrl: string;
}

/**
 * Minimal PR info for listing
 */
export interface PRListItem {
  number: number;
  title: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  filesChanged: number;
  additions: number;
  deletions: number;
}
```

### Cart Types (`types/cart.ts`)

```typescript
import type { PRData, PRFile } from './pr';

/**
 * Delivery method options
 */
export type DeliveryMethod = 'patch' | 'branch' | 'commit' | 'pr';

/**
 * Cart session state
 */
export interface CartSession {
  /** Unique session ID */
  id: string;

  /** Loaded PR data */
  pr: PRData | null;

  /** Filenames in cart */
  selectedFiles: string[];

  /** Filenames saved for later */
  savedForLater: string[];

  /** Selected delivery method */
  deliveryMethod: DeliveryMethod;

  /** Target branch for delivery */
  targetBranch: string;

  /** Optional local path (for multi-worktree) */
  targetPath: string | null;

  /** Commit message */
  commitMessage: string;

  /** Session created timestamp */
  createdAt: string;

  /** Last updated timestamp */
  updatedAt: string;
}

/**
 * Cart statistics
 */
export interface CartStats {
  /** Number of files in cart */
  fileCount: number;

  /** Total additions in cart */
  additions: number;

  /** Total deletions in cart */
  deletions: number;

  /** Total changes in cart */
  totalChanges: number;
}

/**
 * Cart item (file with cart context)
 */
export interface CartItem extends PRFile {
  /** Whether item is in cart */
  inCart: boolean;

  /** Whether item is saved for later */
  savedForLater: boolean;
}
```

### Checkout Types (`types/checkout.ts`)

```typescript
import type { DeliveryMethod } from './cart';

/**
 * Checkout request payload
 */
export interface CheckoutRequest {
  /** Delivery method */
  method: DeliveryMethod;

  /** Options per method */
  options: CheckoutOptions;
}

/**
 * Method-specific checkout options
 */
export interface CheckoutOptions {
  /** For 'branch' method: branch name */
  branchName?: string;

  /** For 'commit' method: commit to current branch */
  commitMessage?: string;

  /** For 'pr' method: new PR title */
  prTitle?: string;

  /** For 'pr' method: new PR body */
  prBody?: string;

  /** For 'patch' method: output filename */
  patchFilename?: string;

  /** Target branch (base) */
  targetBranch: string;

  /** Local path for worktree */
  targetPath?: string;
}

/**
 * Checkout result
 */
export interface CheckoutResult {
  /** Whether checkout succeeded */
  success: boolean;

  /** Error message if failed */
  error?: string;

  /** Method used */
  method: DeliveryMethod;

  /** Method-specific output */
  output: CheckoutOutput;
}

/**
 * Method-specific checkout output
 */
export interface CheckoutOutput {
  /** For 'patch': file path */
  patchPath?: string;

  /** For 'branch': branch name created */
  branchName?: string;

  /** For 'commit': commit SHA */
  commitSha?: string;

  /** For 'pr': new PR number */
  prNumber?: number;

  /** For 'pr': new PR URL */
  prUrl?: string;
}
```

### History Types (`types/history.ts`)

```typescript
import type { DeliveryMethod, CheckoutOutput } from './checkout';

/**
 * A checkout record in history
 */
export interface CheckoutRecord {
  /** Unique ID for this checkout */
  id: string;

  /** When checkout occurred */
  timestamp: string;

  /** PR info at time of checkout */
  pr: {
    owner: string;
    repo: string;
    number: number;
    title: string;
  };

  /** Files that were applied */
  filesApplied: string[];

  /** Method used */
  deliveryMethod: DeliveryMethod;

  /** Target branch */
  targetBranch: string;

  /** Output from checkout */
  output: CheckoutOutput;

  /** Whether this can be undone */
  canUndo: boolean;

  /** If undone, when */
  undoneAt?: string;
}

/**
 * Undo result
 */
export interface UndoResult {
  success: boolean;
  error?: string;
  recordId: string;
}
```

### Config Types (`types/config.ts`)

```typescript
/**
 * User configuration stored in ~/.prcart/config.json
 */
export interface UserConfig {
  /** Default target branch */
  defaultBranch: string;

  /** Default delivery method */
  defaultDeliveryMethod: DeliveryMethod;

  /** Theme preference */
  theme: 'dark' | 'light' | 'system';

  /** Local server port */
  port: number;

  /** Whether to auto-open browser */
  autoOpenBrowser: boolean;

  /** Editor command for config */
  editor: string;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: UserConfig = {
  defaultBranch: 'main',
  defaultDeliveryMethod: 'patch',
  theme: 'dark',
  port: 3847,
  autoOpenBrowser: true,
  editor: 'code', // VS Code
};
```

### API Types (`types/api.ts`)

```typescript
import type { PRData, PRListItem } from './pr';
import type { CartSession, CartStats } from './cart';
import type { CheckoutRequest, CheckoutResult } from './checkout';
import type { CheckoutRecord, UndoResult } from './history';

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Health check response
 */
export interface HealthResponse {
  status: 'ok' | 'error';
  version: string;
  uptime: number;
}

/**
 * Session response
 */
export interface SessionResponse {
  session: CartSession;
  stats: CartStats;
}

/**
 * Load PR request
 */
export interface LoadPRRequest {
  owner: string;
  repo: string;
  number: number;
}

/**
 * Add to cart request
 */
export interface AddToCartRequest {
  filename: string;
}

/**
 * Remove from cart request
 */
export interface RemoveFromCartRequest {
  filename: string;
}

/**
 * History response
 */
export interface HistoryResponse {
  records: CheckoutRecord[];
}

/**
 * WebSocket message types
 */
export type WSMessageType =
  | 'init'
  | 'cart-update'
  | 'add-to-cart'
  | 'remove-from-cart'
  | 'checkout-complete'
  | 'error';

/**
 * WebSocket message
 */
export interface WSMessage {
  type: WSMessageType;
  payload: unknown;
}

/**
 * Init message (server → client)
 */
export interface WSInitMessage {
  type: 'init';
  payload: {
    session: CartSession;
    stats: CartStats;
  };
}

/**
 * Cart update message (bidirectional)
 */
export interface WSCartUpdateMessage {
  type: 'cart-update';
  payload: {
    selectedFiles: string[];
    stats: CartStats;
  };
}

/**
 * Add to cart message (client → server)
 */
export interface WSAddToCartMessage {
  type: 'add-to-cart';
  payload: {
    filename: string;
  };
}

/**
 * Remove from cart message (client → server)
 */
export interface WSRemoveFromCartMessage {
  type: 'remove-from-cart';
  payload: {
    filename: string;
  };
}
```

---

## Constants

### Defaults (`constants/defaults.ts`)

```typescript
export const DEFAULT_PORT = 3847;

export const DEFAULT_BRANCH = 'main';

export const PRCART_DIR_NAME = '.prcart';

export const SESSION_FILE_PREFIX = 'session-';

export const HISTORY_FILE_PREFIX = 'checkout-';

export const CONFIG_FILE_NAME = 'config.json';

export const SESSIONS_DIR_NAME = 'sessions';

export const HISTORY_DIR_NAME = 'history';
```

### Limits (`constants/limits.ts`)

```typescript
/** GitHub API rate limit (unauthenticated) */
export const GITHUB_RATE_LIMIT_UNAUTH = 60;

/** GitHub API rate limit (authenticated) */
export const GITHUB_RATE_LIMIT_AUTH = 5000;

/** Max files to display in product grid */
export const MAX_FILES_DISPLAY = 100;

/** Max patch size to show in preview (bytes) */
export const MAX_PATCH_PREVIEW_SIZE = 10000;

/** Max history records to keep */
export const MAX_HISTORY_RECORDS = 100;

/** Session expiry time (24 hours) */
export const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000;
```

---

## Utilities

### Patch Generation (`utils/patch.ts`)

```typescript
import type { PRData, PRFile } from '../types';

/**
 * Generate a unified diff patch from selected files
 */
export function generatePatch(pr: PRData, selectedFiles: string[]): string {
  const selectedFilesSet = new Set(selectedFiles);

  const patches = pr.files
    .filter(file => selectedFilesSet.has(file.filename))
    .filter(file => file.patch) // Only files with patches
    .map(file => formatFilePatch(file));

  return patches.join('\n');
}

/**
 * Format a single file's patch with proper header
 */
function formatFilePatch(file: PRFile): string {
  const header = [
    `diff --git a/${file.filename} b/${file.filename}`,
    file.status === 'added'
      ? 'new file mode 100644'
      : file.status === 'removed'
      ? 'deleted file mode 100644'
      : null,
    `--- ${file.status === 'added' ? '/dev/null' : `a/${file.filename}`}`,
    `+++ ${file.status === 'removed' ? '/dev/null' : `b/${file.filename}`}`,
  ]
    .filter(Boolean)
    .join('\n');

  return `${header}\n${file.patch}`;
}

/**
 * Calculate patch statistics
 */
export function getPatchStats(
  files: PRFile[],
  selectedFiles: string[]
): { additions: number; deletions: number } {
  const selected = new Set(selectedFiles);

  return files
    .filter(f => selected.has(f.filename))
    .reduce(
      (acc, file) => ({
        additions: acc.additions + file.additions,
        deletions: acc.deletions + file.deletions,
      }),
      { additions: 0, deletions: 0 }
    );
}
```

### Formatters (`utils/formatters.ts`)

```typescript
/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${diffWeeks}w ago`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Format line count with +/-
 */
export function formatLineCount(additions: number, deletions: number): string {
  const parts = [];
  if (additions > 0) parts.push(`+${additions}`);
  if (deletions > 0) parts.push(`-${deletions}`);
  return parts.join(' ') || '0';
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()! : '';
}

/**
 * Get file icon based on extension
 */
export function getFileIcon(filename: string): string {
  const ext = getFileExtension(filename).toLowerCase();

  const icons: Record<string, string> = {
    ts: '📘',
    tsx: '⚛️',
    js: '📒',
    jsx: '⚛️',
    css: '🎨',
    scss: '🎨',
    html: '🌐',
    json: '📋',
    md: '📝',
    py: '🐍',
    rs: '🦀',
    go: '🐹',
    java: '☕',
    rb: '💎',
    php: '🐘',
    yml: '⚙️',
    yaml: '⚙️',
    sql: '🗄️',
    sh: '🖥️',
    bash: '🖥️',
    env: '🔐',
    lock: '🔒',
  };

  return icons[ext] || '📄';
}

/**
 * Get language for syntax highlighting
 */
export function getLanguage(filename: string): string {
  const ext = getFileExtension(filename).toLowerCase();

  const languages: Record<string, string> = {
    ts: 'typescript',
    tsx: 'tsx',
    js: 'javascript',
    jsx: 'jsx',
    css: 'css',
    scss: 'scss',
    html: 'html',
    json: 'json',
    md: 'markdown',
    py: 'python',
    rs: 'rust',
    go: 'go',
    java: 'java',
    rb: 'ruby',
    php: 'php',
    yml: 'yaml',
    yaml: 'yaml',
    sql: 'sql',
    sh: 'bash',
    bash: 'bash',
  };

  return languages[ext] || 'text';
}
```

### Validators (`utils/validators.ts`)

```typescript
/**
 * Validate branch name
 */
export function isValidBranchName(name: string): boolean {
  // Git branch name rules
  const invalidPatterns = [
    /^\./, // Can't start with .
    /\.\.$/, // Can't end with ..
    /\/\./, // Can't have /. anywhere
    /\.lock$/, // Can't end with .lock
    /^@$/, // Can't be just @
    /[\x00-\x1f\x7f ~^:?*\[\]\\]/, // Invalid characters
  ];

  return !invalidPatterns.some(pattern => pattern.test(name));
}

/**
 * Sanitize branch name
 */
export function sanitizeBranchName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Validate GitHub PR URL
 */
export function parseGitHubPRUrl(
  url: string
): { owner: string; repo: string; number: number } | null {
  const match = url.match(
    /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/
  );

  if (match) {
    return {
      owner: match[1],
      repo: match[2],
      number: parseInt(match[3], 10),
    };
  }

  return null;
}

/**
 * Check if string is a valid PR number
 */
export function isPRNumber(value: string): boolean {
  return /^\d+$/.test(value) && parseInt(value, 10) > 0;
}
```

---

## Index Exports

### Main Export (`src/index.ts`)

```typescript
// Types
export * from './types';

// Constants
export * from './constants';

// Utilities
export * from './utils';
```

### Types Export (`types/index.ts`)

```typescript
export * from './pr';
export * from './cart';
export * from './checkout';
export * from './history';
export * from './config';
export * from './api';
```

### Constants Export (`constants/index.ts`)

```typescript
export * from './defaults';
export * from './limits';
```

### Utils Export (`utils/index.ts`)

```typescript
export * from './patch';
export * from './formatters';
export * from './validators';
```

---

## Usage Examples

### In CLI Package

```typescript
import {
  type PRData,
  type CartSession,
  generatePatch,
  formatRelativeTime,
  DEFAULT_PORT,
} from '@prcart/shared';

// Use types
const session: CartSession = { ... };

// Use utilities
const patch = generatePatch(pr, selectedFiles);
const timeAgo = formatRelativeTime(pr.createdAt);
```

### In Web Package

```typescript
import {
  type CartItem,
  type CartStats,
  getFileIcon,
  formatLineCount,
} from '@prcart/shared';

// Use in component
function ProductCard({ file }: { file: CartItem }) {
  return (
    <div>
      <span>{getFileIcon(file.filename)}</span>
      <span>{formatLineCount(file.additions, file.deletions)}</span>
    </div>
  );
}
```

---

## DO NOT Build

You are ONLY building the shared types package. Do NOT:

- Build any React components
- Build CLI commands
- Build API routes
- Implement GitHub API calls
- Build any UI

Your job is to define the data contracts that CLI and Web UI will use.

---

## Testing

All functions should be unit testable:

```typescript
// Example test
import { formatRelativeTime, sanitizeBranchName } from '@prcart/shared';

describe('formatRelativeTime', () => {
  it('formats minutes ago', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('5m ago');
  });
});

describe('sanitizeBranchName', () => {
  it('converts spaces to dashes', () => {
    expect(sanitizeBranchName('my branch name')).toBe('my-branch-name');
  });
});
```

---

## Start Here

1. Initialize package with `pnpm init`
2. Set up TypeScript config
3. Define PR types first (foundation)
4. Add cart types
5. Add checkout and history types
6. Implement utility functions
7. Export everything from index

This package is the foundation. Build it first, then other packages import from it.
