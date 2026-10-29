#!/usr/bin/env bash
# Lifecycle bootstrap for a fresh checkout: env file, deps, browsers. Idempotent.
set -euo pipefail

if [ ! -f .env ]; then
  cp .env.example .env
  echo "==> .env created from .env.example"
fi

echo "==> npm ci"
npm ci

echo "==> npx playwright install --with-deps"
npx playwright install --with-deps

echo "==> git config core.hooksPath .githooks"
git config core.hooksPath .githooks

echo "==> init complete"