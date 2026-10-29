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