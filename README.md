<div align="center">
  <h1>🛒 PRCart</h1>
  <p><strong>Shop your pull requests. Keep what you need.</strong></p>

  <p>
    <a href="https://prcart.dev">
      <img src="https://img.shields.io/badge/Try-prcart.dev-blue" alt="Try prcart.dev" />
    </a>
    <a href="https://github.com/anipotts/pr-cart/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" />
    </a>
  </p>
</div>

---

## What is this?

AI tools generate massive PRs. You want some of it, not all of it.

**PRCart** lets you browse PR files like products, add them to a cart, and download only what you want.

## How to use

1. Go to [prcart.dev](https://prcart.dev)
2. Paste a GitHub PR URL
3. Browse files like products
4. Add to cart
5. Download your patch

**No install. No signup. Just paste and shop.**

## Features

- 🛍️ Browse files as product cards
- 🛒 Add/remove from cart
- 👁️ Preview diffs before selecting
- 📦 Download patch with selected changes
- 🎉 Confetti on checkout (because why not)

## Prefer the terminal?

Check out [gh cart](https://github.com/anipotts/gh-cart) — a gh extension with the same functionality.

```bash
gh extension install anipotts/gh-cart
gh cart 142
```

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Framer Motion
- GitHub API (client-side)

## License

MIT © [Ani Potts](https://github.com/anipotts)
