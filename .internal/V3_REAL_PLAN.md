# PRCart V3: The Actual Plan

> Stop planning. Ship the gh extension.

---

## What We're Building

A **gh extension** called `gh-cart` that lets you cherry-pick files from a PR using a terminal UI.

```bash
gh extension install anipotts/gh-cart
gh cart 142
```

That's it. No monorepo. No WebSocket. No confetti.

---

## The Core Experience (Terminal-First)

```
$ gh cart 142

PR #142: feat: add dark mode support
12 files changed (+456 -123)

  ✓ src/components/Theme.tsx       +45  -12  modified
  ✓ src/styles/dark.css            +120 -0   added
  ✓ src/App.tsx                    +8   -3   modified
    src/tests/theme.test.ts        +89  -23  modified
    src/utils/colors.ts            +34  -5   modified
    README.md                      +12  -2   modified
    ...6 more

[space] toggle  [a] all  [n] none  [d] diff  [enter] apply  [q] quit
```

**Keyboard controls:**
- `j/k` or `↑/↓` - navigate
- `space` - toggle file
- `a` - select all
- `n` - select none
- `d` - show diff for current file
- `enter` - apply selected files
- `q` - quit

**After pressing enter:**

```
Apply 3 files to current branch?
  > Cherry-pick to current branch
    Create new branch
    Download patch
    Cancel
```

One selection. Done.

---

## Architecture

**One package. One binary.**

```
gh-cart/
├── src/
│   ├── index.ts          # Entry point
│   ├── ui.tsx            # Ink TUI components
│   ├── github.ts         # GitHub API (via gh)
│   ├── git.ts            # Local git operations
│   └── types.ts          # Types
├── package.json
├── tsconfig.json
└── README.md
```

**Tech stack:**
- TypeScript
- Ink (React for terminals)
- gh CLI (auth + API)
- Simple-git (local operations)

**Build:**
```bash
bun build src/index.ts --compile --outfile gh-cart
# or
npm run build  # outputs to dist/
```

---

## gh Extension Setup

A gh extension is just a repo with an executable named `gh-cart` (or `gh-cart.exe` on Windows).

**package.json:**
```json
{
  "name": "gh-cart",
  "version": "0.1.0",
  "bin": "dist/gh-cart",
  "scripts": {
    "build": "tsup src/index.ts --format esm --minify",
    "dev": "tsx src/index.ts"
  }
}
```

**Installation:**
```bash
gh extension install anipotts/gh-cart
```

**Usage:**
```bash
gh cart 142              # interactive file selection
gh cart 142 --apply      # apply all files (no TUI)
gh cart 142 --patch      # download as patch
gh cart 142 --list       # just list files
```

---

## GitHub API (Zero Auth Code)

The `gh` CLI handles all auth. We just shell out:

```typescript
import { execSync } from 'child_process';

function ghApi(endpoint: string): any {
  const result = execSync(`gh api ${endpoint}`, { encoding: 'utf-8' });
  return JSON.parse(result);
}

// Get PR files
const files = ghApi(`repos/owner/repo/pulls/142/files`);
```

No Octokit. No token management. No OAuth flow. Just `gh api`.

---

## Local Git Operations

```typescript
import simpleGit from 'simple-git';

const git = simpleGit();

// Cherry-pick specific files from PR branch
async function applyFiles(prBranch: string, files: string[]) {
  // Fetch the PR branch
  await git.fetch('origin', `pull/142/head:pr-142`);

  // Checkout specific files from that branch
  for (const file of files) {
    await git.checkout([`pr-142`, '--', file]);
  }

  // Stage and commit
  await git.add(files);
  await git.commit(`Apply ${files.length} files from PR #142`);
}
```

---

## The TUI (Ink)

```tsx
import React, { useState } from 'react';
import { render, Box, Text, useInput } from 'ink';

function App({ files, prNumber, prTitle }) {
  const [selected, setSelected] = useState(new Set());
  const [cursor, setCursor] = useState(0);

  useInput((input, key) => {
    if (key.upArrow || input === 'k') {
      setCursor(c => Math.max(0, c - 1));
    }
    if (key.downArrow || input === 'j') {
      setCursor(c => Math.min(files.length - 1, c + 1));
    }
    if (input === ' ') {
      setSelected(s => {
        const next = new Set(s);
        if (next.has(files[cursor].filename)) {
          next.delete(files[cursor].filename);
        } else {
          next.add(files[cursor].filename);
        }
        return next;
      });
    }
    if (input === 'a') {
      setSelected(new Set(files.map(f => f.filename)));
    }
    if (input === 'n') {
      setSelected(new Set());
    }
    // ... etc
  });

  return (
    <Box flexDirection="column">
      <Text bold>PR #{prNumber}: {prTitle}</Text>
      <Text dimColor>{files.length} files changed</Text>
      <Text> </Text>
      {files.map((file, i) => (
        <Box key={file.filename}>
          <Text color={cursor === i ? 'cyan' : undefined}>
            {cursor === i ? '❯' : ' '}
          </Text>
          <Text color={selected.has(file.filename) ? 'green' : 'gray'}>
            {selected.has(file.filename) ? '✓' : ' '}
          </Text>
          <Text> {file.filename}</Text>
          <Text dimColor> +{file.additions} -{file.deletions}</Text>
        </Box>
      ))}
      <Text> </Text>
      <Text dimColor>[space] toggle  [a] all  [n] none  [enter] apply  [q] quit</Text>
    </Box>
  );
}
```

---

## Config (Optional)

```yaml
# ~/.config/gh-cart/config.yml
default_action: cherry-pick  # or: patch, branch
auto_commit: true
commit_template: "Apply {count} files from PR #{number}"
```

Read with:
```typescript
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';

const configPath = join(process.env.HOME, '.config/gh-cart/config.yml');
const config = existsSync(configPath)
  ? parse(readFileSync(configPath, 'utf-8'))
  : {};
```

---

## What About the Web UI?

**Later. Maybe never.**

If we build it, it's a separate thing:
- `prcart.dev/github/owner/repo/pull/123`
- Client-side only (GitHub OAuth app)
- No backend
- "Try before install" funnel

But that's v2. Or v-never. Ship the gh extension first.

---

## What About the Landing Page?

A separate repo: `anipotts/prcart.dev`

Simple Next.js or Astro site:
- Hero with `gh extension install` command
- Demo GIF
- Link to GitHub repo

Can literally be one page. Ship it after the extension works.

---

## Timeline

| Day | Task |
|-----|------|
| 1 | Scaffold gh extension, get `gh api` working |
| 2 | Build TUI with Ink (file list, selection) |
| 3 | Implement apply/patch/branch operations |
| 4 | Polish, test on real PRs, write README |
| 5 | Publish to GitHub, submit to gh extension registry |

**5 days. Not 5 months.**

---

## What to Delete

From the current repo:
- `packages/` directory (monorepo structure)
- `apps/` directory
- `pnpm-workspace.yaml`
- `turbo.json`
- All the v1 React web app code in `src/`
- Most of the `.internal/` docs

Keep:
- `README.md` (rewrite for gh extension)
- `LICENSE`
- `.gitignore`
- This plan

---

## The Honest Assessment

The shopping metaphor is a **marketing hook**, not a UX principle.

For the landing page: "Shop your PRs" → great tagline.
For the actual tool: terminal file picker → what devs actually want.

The confetti was fun to spec. It would be annoying to use daily.

---

## Next Step

Delete everything. Start fresh:

```bash
# Nuke the monorepo
rm -rf packages/ apps/ src/ node_modules/
rm pnpm-workspace.yaml turbo.json

# Start the gh extension
mkdir src
touch src/index.ts src/ui.tsx src/github.ts src/git.ts
```

Then build the TUI.
