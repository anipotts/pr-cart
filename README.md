<div align="center">
  <h1>🛒 PRCart</h1>
  <p><strong>Shop your pull requests. Keep what you need.</strong></p>

  <p>
    <a href="https://github.com/anipotts/prcart/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" />
    </a>
    <a href="https://github.com/anipotts/prcart/stargazers">
      <img src="https://img.shields.io/github/stars/anipotts/prcart" alt="GitHub stars" />
    </a>
    <a href="https://github.com/anipotts/prcart/issues">
      <img src="https://img.shields.io/github/issues/anipotts/prcart" alt="GitHub issues" />
    </a>
  </p>

  <p>
    <a href="https://prcart.vercel.app">Live Demo</a>
    ·
    <a href="https://github.com/anipotts/prcart/issues">Report Bug</a>
    ·
    <a href="https://github.com/anipotts/prcart/issues">Request Feature</a>
  </p>
</div>

---

## The Problem

AI coding tools (Claude Code, Cursor, Copilot) generate massive PRs with dozens of changes. You want to keep some, reject others.

Git's `git add -p` works but has terrible UX. GitHub's PR interface is for reviewing, not curating.

## The Solution

PRCart lets you curate PR changes like shopping online:

- ✅ See all files as items in a list
- ✅ Add/remove files with one click
- ✅ Preview diffs before deciding
- ✅ Export only what you want as a patch

No AI. No complexity. Just a fast, familiar interface.

## Quick Start

```bash
# Paste any GitHub PR URL
https://prcart.vercel.app

# Or run locally
git clone https://github.com/anipotts/prcart
cd prcart
npm install
npm run dev
```

## Demo

<!-- TODO: Add screen recording gif -->
[Demo video coming soon]

## Features

| Feature | Status |
|---------|--------|
| Load any public GitHub PR | ✅ |
| File-level selection | ✅ |
| Diff preview | ✅ |
| Download as patch | ✅ |
| Dark mode | ✅ |
| Keyboard shortcuts | 🚧 |
| GitHub OAuth for private repos | 🚧 |
| Hunk-level selection | 📋 Planned |
| VS Code extension | 📋 Planned |

## How It Works

1. **Paste a PR URL** - Works with any public GitHub PR
2. **Browse the files** - See additions/deletions at a glance
3. **Add to cart** - Check the files you want to keep
4. **Preview diffs** - Make sure you're keeping the right changes
5. **Checkout** - Download a patch with only your selected files

## Tech Stack

- **React 18** + **TypeScript** - Type-safe UI
- **Vite** - Fast dev server and builds
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Simple state management
- **Octokit** - GitHub API client

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] GitHub OAuth for private repos
- [ ] Keyboard shortcuts (j/k navigation, space to toggle)
- [ ] Hunk-level selection (select parts of files)
- [ ] VS Code extension
- [ ] CLI tool
- [ ] GitLab support
- [ ] Browser extension

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Inspired by every developer who's had to manually cherry-pick from a massive AI-generated PR
- Built with [React](https://react.dev), [Tailwind](https://tailwindcss.com), [Vite](https://vitejs.dev)

---

<div align="center">
  <p>Made with ☕ by <a href="https://github.com/anipotts">Ani Potts</a></p>
  <p>If this tool saves you time, consider giving it a ⭐</p>
</div>
