# pr-cart

prcart.dev: paste a GitHub PR URL, pick files like products, download a patch with only those changes. Web sibling of gh-cart.

## Stack
- Next.js on Cloudflare through OpenNext (`open-next.config.ts`, `wrangler.toml`), Tailwind, Zustand, pnpm.

## Commands
- `pnpm dev`, `pnpm build`, `pnpm lint`
- Cloudflare: `pnpm cf:build`, `pnpm cf:preview`; `pnpm cf:deploy` ships to production and needs Ani's approval.

## Rules
- No accounts and no server-side storage of PR contents.
