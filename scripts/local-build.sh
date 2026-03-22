#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_DIR="$(mktemp -d /tmp/steadymind-build.XXXXXX)"

cleanup() {
  rm -rf "$TMP_DIR"
}

trap cleanup EXIT

rsync -a \
  --exclude ".git" \
  --exclude ".next" \
  --exclude "node_modules" \
  --exclude "test-results" \
  --exclude "playwright-report" \
  --exclude "coverage" \
  --exclude "dist" \
  --exclude ".env.local" \
  "$ROOT_DIR/" "$TMP_DIR/"

ln -s "$ROOT_DIR/node_modules" "$TMP_DIR/node_modules"

if [[ -f "$ROOT_DIR/.env.local" ]]; then
  ln -s "$ROOT_DIR/.env.local" "$TMP_DIR/.env.local"
fi

cd "$TMP_DIR"
"$ROOT_DIR/node_modules/.bin/next" build
