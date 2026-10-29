#!/usr/bin/env bash
# Feedback gate: lint → typecheck → tests. Fails fast at the first red step.
set -euo pipefail

echo "==> biome check ."
./node_modules/.bin/biome check .

echo "==> tsc --noEmit"
./node_modules/.bin/tsc --noEmit

echo "==> playwright test"
./node_modules/.bin/playwright test

echo "==> verify: all green"