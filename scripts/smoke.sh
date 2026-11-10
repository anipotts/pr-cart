#!/usr/bin/env bash
# Boots the built Cloudflare worker locally and checks that the home page and a
# pull request route render. Run after `pnpm exec opennextjs-cloudflare build`.
set -euo pipefail

PORT="${PORT:-8799}"
LOG="$(mktemp)"
BODY="$(mktemp)"
export WRANGLER_SEND_METRICS=false

pnpm exec wrangler dev --port "$PORT" --ip 127.0.0.1 >"$LOG" 2>&1 &
SERVER=$!
trap 'kill "$SERVER" 2>/dev/null || true; rm -f "$BODY" "$LOG"' EXIT

fail() {
  echo "$1"
  tail -n 40 "$LOG"
  exit 1
}

for _ in $(seq 1 60); do
  STATUS=$(curl -s --connect-timeout 1 --max-time 5 -o "$BODY" -w '%{http_code}' "http://127.0.0.1:$PORT/" || true)
  # Once the runtime answers, report a broken response immediately rather than
  # retrying the same manifest/startup failure for a minute.
  [[ "$STATUS" != "000" ]] && break
  if ! kill -0 "$SERVER" 2>/dev/null; then fail "worker exited before listening"; fi
  sleep 1
done

[[ "$STATUS" == "200" ]] || fail "home page returned $STATUS"
grep -q '<title>PRCart' "$BODY" || fail "home page did not render"
ASSET=$(node -e 'const html = require("fs").readFileSync(process.argv[1], "utf8"); const match = html.match(/src="([^"\s]+\.js(?:\?[^"\s]*)?)"/); if (!match || !match[1].startsWith("/_next/static/")) process.exit(1); process.stdout.write(match[1].replaceAll("&amp;", "&"));' "$BODY") || fail "home page has no JavaScript asset"
curl -sf --max-time 10 -o /dev/null "http://127.0.0.1:$PORT$ASSET" || fail "JavaScript asset failed"
curl -sf --max-time 10 "http://127.0.0.1:$PORT/github/vercel/next.js/pull/1" -o "$BODY" || fail "pull request route failed"
grep -q '<title>PRCart' "$BODY" || fail "pull request route did not render HTML"
STATUS=$(curl -s --max-time 10 -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/not-a-prcart-route")
[[ "$STATUS" == "404" ]] || fail "unknown route returned $STATUS instead of 404"
echo "smoke: built Worker renders home/PR routes, serves JavaScript, and returns 404 for unknown routes"
