# CLI Agent Prompt

> **Scope**: Build the `packages/cli/` package only.
> **Reference**: Read `.internal/SPEC_MASTER.md` for full context.

---

## Your Mission

Build a CLI tool (`prcart`) that lets developers shop pull request changes. The CLI should:

1. Detect current repo and list open PRs
2. Let user pick a PR with an interactive terminal UI
3. Start a local Express server
4. Open the web UI in the browser
5. Sync cart state between CLI and web UI via WebSocket

---

## Package Structure

Create this structure inside `packages/cli/`:

```
packages/cli/
├── src/
│   ├── index.ts              # Entry point (Commander setup)
│   ├── commands/
│   │   ├── index.ts          # Export all commands
│   │   ├── shop.ts           # Default command (list PRs, pick, open)
│   │   ├── apply.ts          # Apply cart (patch, branch, commit, pr)
│   │   ├── status.ts         # Show current cart
│   │   ├── history.ts        # Show past checkouts
│   │   ├── undo.ts           # Undo a checkout
│   │   ├── clear.ts          # Clear cart
│   │   ├── auth.ts           # Check/configure auth
│   │   └── config.ts         # Open config
│   ├── server/
│   │   ├── index.ts          # Express server setup
│   │   ├── routes.ts         # API route handlers
│   │   └── websocket.ts      # WebSocket handler
│   ├── github/
│   │   ├── index.ts          # GitHub client
│   │   ├── auth.ts           # Auth (reuse gh CLI token)
│   │   ├── prs.ts            # PR operations
│   │   └── types.ts          # GitHub types
│   ├── state/
│   │   ├── session.ts        # Session management
│   │   ├── history.ts        # Checkout history
│   │   └── config.ts         # User config
│   └── utils/
│       ├── git.ts            # Git operations
│       ├── paths.ts          # Path helpers
│       └── logger.ts         # Styled console output
├── package.json
├── tsconfig.json
└── README.md
```

---

## Tech Stack

```json
{
  "dependencies": {
    "commander": "^12.0.0",
    "@inquirer/prompts": "^5.0.0",
    "express": "^4.18.0",
    "ws": "^8.16.0",
    "open": "^10.0.0",
    "@octokit/rest": "^20.0.0",
    "chalk": "^5.3.0",
    "ora": "^8.0.0",
    "conf": "^12.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.0",
    "@types/ws": "^8.5.0",
    "tsup": "^8.0.0"
  }
}
```

---

## Commands to Implement

### 1. Default Command (`prcart`)

```typescript
// When user runs `prcart` with no args
program
  .argument('[pr]', 'PR number or URL')
  .option('--all', 'Show all PRs assigned to/created by me')
  .option('--cloud', 'Open in prcart.dev instead of localhost')
  .action(async (pr, options) => {
    // 1. Check we're in a git repo
    // 2. Get GitHub auth (from gh CLI)
    // 3. If pr specified, load that PR
    // 4. Else, list open PRs and let user pick
    // 5. Start local server
    // 6. Open browser
  });
```

**PR Picker UI** (use @inquirer/prompts):

```
? Select a PR to shop: (Use arrow keys)
❯ #142 feat: add dark mode support (2 hours ago)
  #139 fix: login redirect bug (1 day ago)
  #134 refactor: extract auth module (3 days ago)
  #128 docs: update README (1 week ago)

  [↑↓ to move, enter to select, q to quit]
```

**Output after selection**:

```
🛒 PRCart v1.0.0

Loading PR #142: feat: add dark mode support...
Found 12 files changed (+456 -123)

Starting local server...
Opening http://localhost:3847

Press Ctrl+C to stop
```

### 2. Apply Command (`prcart apply`)

```typescript
program
  .command('apply')
  .description('Apply current cart')
  .option('--patch', 'Export as patch file')
  .option('--branch <name>', 'Create new branch with changes')
  .option('--commit', 'Commit to current branch')
  .option('--pr', 'Create new PR with selected changes')
  .action(async (options) => {
    // If no option specified, ask interactively
    // Execute the appropriate action
  });
```

### 3. Status Command (`prcart status`)

```
📦 Current Cart

PR #142: feat: add dark mode support
Repository: owner/repo

Files in cart (3):
  ✓ src/components/Theme.tsx (+45 -12)
  ✓ src/styles/dark.css (+120 -0)
  ✓ src/App.tsx (+8 -3)

Total: +173 -15 lines

Run `prcart apply` to checkout, or open http://localhost:3847
```

### 4. History Command (`prcart history`)

```
📋 Checkout History

┌─────────────────────────────────────────────────────────────────┐
│ ID       │ Date        │ PR    │ Files │ Method │ Undo?        │
├─────────────────────────────────────────────────────────────────┤
│ abc123   │ 2024-01-30  │ #142  │ 3     │ branch │ ✓ (prcart... │
│ def456   │ 2024-01-29  │ #139  │ 1     │ patch  │ ✗            │
│ ghi789   │ 2024-01-28  │ #134  │ 5     │ commit │ ✓ (prcart... │
└─────────────────────────────────────────────────────────────────┘
```

### 5. Undo Command (`prcart undo <id>`)

- For branch: Delete the branch
- For commit: `git revert` the commit
- For patch: Show message "Patch files cannot be auto-undone"
- For PR: Close the PR

### 6. Clear Command (`prcart clear`)

Clear current cart and session.

### 7. Auth Command (`prcart auth`)

```
🔐 GitHub Authentication

Status: ✓ Authenticated via gh CLI
User: anipotts
Scopes: repo, read:user

Token source: gh auth token
```

### 8. Config Command (`prcart config`)

Open `~/.prcart/config.json` in default editor.

---

## GitHub Auth Integration

**Critical**: Reuse the `gh` CLI token. Do NOT implement your own OAuth flow.

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function getGitHubToken(): Promise<string | null> {
  try {
    const { stdout } = await execAsync('gh auth token');
    return stdout.trim();
  } catch {
    return null;
  }
}

// If no token found:
console.log(chalk.yellow('GitHub auth required.'));
console.log('Run: gh auth login');
process.exit(1);
```

---

## Local Server API

The CLI starts an Express server at `http://localhost:3847`.

### Routes

```typescript
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// Get current session
app.get('/api/session', (req, res) => {
  res.json(getCurrentSession());
});

// Load a PR
app.post('/api/session/load', async (req, res) => {
  const { owner, repo, number } = req.body;
  const pr = await loadPR(owner, repo, number);
  res.json(pr);
});

// Add to cart
app.post('/api/cart/add', (req, res) => {
  const { filename } = req.body;
  addToCart(filename);
  broadcast({ type: 'cart-update', cart: getCart() });
  res.json({ success: true });
});

// Remove from cart
app.post('/api/cart/remove', (req, res) => {
  const { filename } = req.body;
  removeFromCart(filename);
  broadcast({ type: 'cart-update', cart: getCart() });
  res.json({ success: true });
});

// Checkout
app.post('/api/checkout', async (req, res) => {
  const { method, options } = req.body;
  const result = await checkout(method, options);
  res.json(result);
});

// History
app.get('/api/history', (req, res) => {
  res.json(getHistory());
});

// Undo
app.post('/api/undo/:id', async (req, res) => {
  const result = await undoCheckout(req.params.id);
  res.json(result);
});
```

### WebSocket

```typescript
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  // Send current state on connect
  ws.send(JSON.stringify({
    type: 'init',
    session: getCurrentSession()
  }));

  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());

    switch (msg.type) {
      case 'add-to-cart':
        addToCart(msg.filename);
        broadcast({ type: 'cart-update', cart: getCart() });
        break;
      case 'remove-from-cart':
        removeFromCart(msg.filename);
        broadcast({ type: 'cart-update', cart: getCart() });
        break;
      // ... other handlers
    }
  });
});

function broadcast(msg: object) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(msg));
    }
  });
}
```

---

## Session Persistence

Store data in `~/.prcart/`:

```typescript
import Conf from 'conf';
import { homedir } from 'os';
import { join } from 'path';

const PRCART_DIR = join(homedir(), '.prcart');

// User config
const config = new Conf({
  projectName: 'prcart',
  cwd: PRCART_DIR,
  configName: 'config',
  defaults: {
    defaultBranch: 'main',
    theme: 'dark',
    port: 3847
  }
});

// Sessions stored as JSON files
const sessionsDir = join(PRCART_DIR, 'sessions');
const historyDir = join(PRCART_DIR, 'history');
```

---

## Git Operations

```typescript
import { execSync } from 'child_process';

export function isGitRepo(): boolean {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export function getRepoInfo(): { owner: string; repo: string } | null {
  try {
    const remote = execSync('git remote get-url origin', { encoding: 'utf-8' });
    // Parse owner/repo from remote URL
    const match = remote.match(/github\.com[:/](.+?)\/(.+?)(?:\.git)?$/);
    if (match) {
      return { owner: match[1], repo: match[2].replace(/\n$/, '') };
    }
  } catch {}
  return null;
}

export function getCurrentBranch(): string {
  return execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
}

export function createBranch(name: string): void {
  execSync(`git checkout -b ${name}`);
}

export function applyPatch(patchContent: string): void {
  execSync('git apply -', { input: patchContent });
}
```

---

## Error Handling

Use styled error messages:

```typescript
import chalk from 'chalk';

export function error(message: string): never {
  console.error(chalk.red('✗ Error:'), message);
  process.exit(1);
}

export function warn(message: string): void {
  console.warn(chalk.yellow('⚠ Warning:'), message);
}

export function success(message: string): void {
  console.log(chalk.green('✓'), message);
}
```

---

## DO NOT Build

You are ONLY building the CLI package. Do NOT:

- Build any React components
- Build the web UI
- Build the landing page
- Implement the full checkout flow (that's in web)
- Add any AI features
- Add user authentication beyond gh CLI

Your job is to make the CLI work: detect repo, pick PR, start server, and provide the API that the web UI will consume.

---

## Testing

Test these scenarios manually:

1. `prcart` in a non-git directory → should error
2. `prcart` with no gh auth → should guide to `gh auth login`
3. `prcart` in repo with no open PRs → should show message
4. `prcart` → should show PR picker
5. `prcart 123` → should load PR #123 directly
6. Server starts and opens browser
7. WebSocket connects and syncs state

---

## Build & Publish

```bash
# Build
pnpm build  # uses tsup

# Link locally for testing
pnpm link --global

# Publish (when ready)
npm publish
```

**package.json bin**:

```json
{
  "name": "prcart",
  "version": "0.1.0",
  "bin": {
    "prcart": "./dist/index.js"
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format esm --dts",
    "dev": "tsup src/index.ts --format esm --watch"
  }
}
```

---

## Acceptance Criteria

- [ ] `prcart` shows PR picker when run in a git repo
- [ ] PR picker is responsive and styled
- [ ] Selected PR opens in browser at localhost:3847
- [ ] Server provides working REST API
- [ ] WebSocket syncs cart state in real-time
- [ ] `prcart status` shows current cart
- [ ] `prcart history` shows past checkouts
- [ ] `prcart apply --patch` generates patch file
- [ ] All errors are styled and helpful
- [ ] Works on macOS, Linux, and Windows

---

## Start Here

1. Initialize the package with `pnpm init`
2. Install dependencies
3. Set up TypeScript
4. Implement `isGitRepo()` and `getGitHubToken()`
5. Build the PR picker
6. Set up Express server
7. Add WebSocket support
8. Implement remaining commands

Good luck! Refer to `SPEC_MASTER.md` for any questions about behavior.
