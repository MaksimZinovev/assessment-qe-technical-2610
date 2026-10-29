# QE Technical Test — Playwright (API + UI)

## Quick start

Prerequisites: Node.js LTS.

```bash
./scripts/init.sh   # npm ci + playwright install + .env from .env.example
```

## Usage

- `./scripts/verify.sh` — full repo gate: biome lint → tsc → all tests
- `npx playwright test --project=api` — Restful-Booker API suite only
- `npx playwright test tests/api/booking-crud.spec.ts` — single spec example
- `npx playwright show-report` — open the HTML report from the last run
- `npx biome check --write .` — lint + format

## CI (GitHub Actions)

- `ci.yml` — manual trigger: repo → **Actions → ci → Run workflow** → pick project (all/api/ui) + optional grep. Runs biome (Playwright domain) → tsc → Playwright (retries: 1 per config); uploads the HTML report on every run.
- `secrets.yml` — automatic on push/PR: gitleaks full-history scan. The pre-commit hook (wired by `init.sh`) does the same for staged changes when gitleaks is installed locally.

## AI assistance

How AI tooling was used and validated: [docs/AI-assistance.md](docs/AI-assistance.md).