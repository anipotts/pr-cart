#!/usr/bin/env bash
# Boots the built Cloudflare worker locally and checks that the home page and a
# pull request route render. Run after `pnpm exec opennextjs-cloudflare build`.
set -euo pipefail

PORT="${PORT:-8799}"
LOG="$(mktemp)"
export WRANGLER_SEND_METRICS=false

pnpm exec wrangler dev --port "$PORT" --ip 127.0.0.1 >"$LOG" 2>&1 &
SERVER=$!
trap 'kill "$SERVER" 2>/dev/null || true' EXIT

for _ in $(seq 1 60); do
  curl -sf -o /dev/null "http://127.0.0.1:$PORT/" && break
  if ! kill -0 "$SERVER" 2>/dev/null; then cat "$LOG"; exit 1; fi
  sleep 1
done

curl -sf "http://127.0.0.1:$PORT/" | grep -q "<title>PRCart" || { echo "home page did not render"; cat "$LOG"; exit 1; }
curl -sf -o /dev/null "http://127.0.0.1:$PORT/github/vercel/next.js/pull/1" || { echo "pull request route failed"; cat "$LOG"; exit 1; }
echo "smoke: home page and pull request route render from the built worker"
