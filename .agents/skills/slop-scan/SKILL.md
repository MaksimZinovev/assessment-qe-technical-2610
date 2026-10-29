---
name: slop-scan
description: Detect AI-associated slop patterns in JS/TS code. Use when reviewing code for AI-generated quality issues, running pre-commit checks, or comparing PR changes against a baseline. Triggers — "slop", "AI-generated", "code quality scan", "review for slop", "delta check", "pre-commit quality".
---

# slop-scan

Deterministic CLI for finding AI-associated slop patterns in JavaScript and TypeScript repositories.

## Commands

```bash
# Scan current directory
slop-scan scan .

# Scan with lint output format
slop-scan scan . --lint

# JSON output (for programmatic use or delta comparison)
slop-scan scan . --json

# Ignore paths
slop-scan scan . --ignore "dist/**" --ignore "vendor/**"

# Delta: compare changes against a cached baseline
slop-scan delta --base-report .local/slop-baseline.json --head-report <(slop-scan scan . --json)
```

## Delta workflow

1. **Create baseline:** `slop-scan scan . --json > .local/slop-baseline.json`
2. **Check changes:** `slop-scan delta --base-report .local/slop-baseline.json --head-report <(slop-scan scan . --json) --fail-on added,worsened`
3. Use the `slop-delta.sh` script if available in the project for a simpler workflow.

## When to use

- Before committing code — catch slop patterns early
- During PR review — delta check against baseline
- As part of CI — `--fail-on added,worsened` returns non-zero on new issues