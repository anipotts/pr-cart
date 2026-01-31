# Agent Orchestration Guide

This guide explains how to run multiple Claude Code agents in parallel to build PRCart.

## Overview

PRCart is split into 4 independent packages that can be built simultaneously:

| Package | Agent Prompt | Purpose |
|---------|--------------|---------|
| `packages/shared` | `AGENT_PROMPT_SHARED.md` | Types and utilities |
| `packages/cli` | `AGENT_PROMPT_CLI.md` | CLI tool |
| `packages/web` | `AGENT_PROMPT_WEB_UI.md` | Shopping UI |
| `apps/landing` | `AGENT_PROMPT_LANDING.md` | prcart.dev |

## Setup: Git Worktrees

Create separate worktrees for each agent to avoid conflicts:

```bash
# In your main prcart directory
git worktree add ../prcart-shared packages/shared
git worktree add ../prcart-cli packages/cli
git worktree add ../prcart-web packages/web
git worktree add ../prcart-landing apps/landing
```

Alternatively, create feature branches:

```bash
git checkout -b feature/shared-types
git checkout -b feature/cli
git checkout -b feature/web-ui
git checkout -b feature/landing
```

## Running Agents

### Option A: Claude Code CLI (Recommended)

Open 4 terminal windows/tabs:

```bash
# Terminal 1: Shared Types
cd ../prcart-shared
claude "Read .internal/SPEC_MASTER.md and .internal/AGENT_PROMPT_SHARED.md, then build the shared package."

# Terminal 2: CLI
cd ../prcart-cli
claude "Read .internal/SPEC_MASTER.md and .internal/AGENT_PROMPT_CLI.md, then build the CLI package."

# Terminal 3: Web UI
cd ../prcart-web
claude "Read .internal/SPEC_MASTER.md and .internal/AGENT_PROMPT_WEB_UI.md, then build the web UI package."

# Terminal 4: Landing
cd ../prcart-landing
claude "Read .internal/SPEC_MASTER.md and .internal/AGENT_PROMPT_LANDING.md, then build the landing page."
```

### Option B: Cowork Mode

Open 4 Cowork sessions, each pointing to a different worktree directory.

## Build Order

While all packages can be worked on in parallel, there are some dependencies:

1. **Shared** should be completed first (defines types)
2. **CLI** and **Web UI** can run in parallel (both import from shared)
3. **Landing** is fully independent

### Dependency Graph

```
shared
  ├── cli (imports from shared)
  └── web (imports from shared)

landing (independent)
```

## Merging Work

After each agent completes:

```bash
# From main branch
git checkout main

# Merge each feature branch
git merge feature/shared-types --no-edit
git merge feature/cli --no-edit
git merge feature/web-ui --no-edit
git merge feature/landing --no-edit
```

Or if using worktrees:

```bash
# Remove worktrees
git worktree remove ../prcart-shared
git worktree remove ../prcart-cli
git worktree remove ../prcart-web
git worktree remove ../prcart-landing
```

## Testing Integration

After merging, test everything works together:

```bash
# Install all dependencies
pnpm install

# Build shared first (dependency)
pnpm build:shared

# Build everything
pnpm build

# Run dev servers
pnpm dev
```

## Conflict Resolution

If agents touch the same files, you'll need to merge manually. The prompts are designed to minimize conflicts:

- Each agent works in its own `packages/` or `apps/` directory
- Only `shared` is imported by other packages
- Root files (README, package.json) may need manual merge

## Quick Reference

| File | Purpose |
|------|---------|
| `SPEC_MASTER.md` | Source of truth for all decisions |
| `AGENT_PROMPT_SHARED.md` | Shared types package prompt |
| `AGENT_PROMPT_CLI.md` | CLI package prompt |
| `AGENT_PROMPT_WEB_UI.md` | Web UI package prompt |
| `AGENT_PROMPT_LANDING.md` | Landing page prompt |

## Tips

1. **Start with Shared**: It defines the types everything else uses
2. **Landing is independent**: Can be built anytime
3. **Test incrementally**: Build and test each package before merging
4. **Keep SPEC_MASTER.md updated**: It's the single source of truth
