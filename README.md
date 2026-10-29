# QE Technical Test — Playwright (API + UI)

## What is it

Automated tests for a two-part Quality Engineering exercise:

- **Task 1 — Web UI**: the demoqa [Book Store](https://demoqa.com/books) site — login, table search, book details. Playwright + TypeScript, Page Object pattern.
- **Task 2 — REST API**: the [Restful-Booker](https://restful-booker.herokuapp.com/) API — health, auth, full booking CRUD plus negative paths. Same framework, service-object pattern.

Both suites share one package and run as three Playwright projects: `auth-setup`, `api`, `ui`.

## Quick start

Prerequisites: Node.js LTS (CI runs Node 24).

```bash
git clone https://github.com/MaksimZinovev/assessment-qe-technical-2610
cd assessment-qe-technical-2610
./scripts/init.sh    # .env from .env.example + npm ci + Playwright browsers + git hooks
./scripts/verify.sh  # biome → tsc → all 18 tests
```

## Usage

- `./scripts/verify.sh` — full gate: lint → typecheck → all tests
- `npm run test-api` — Restful-Booker suite only
- `npm run test-ui` — Book Store suite only
- `npx playwright test tests/api/booking-crud.spec.ts` — single spec example
- `npx playwright show-report` — open the HTML report from the last run
- `npx playwright test --list` — all test titles without running (useful map into the tables below)
- `npx biome check --write .` — lint + autofix formatting

### CI (GitHub Actions)

- `ci.yml` — manual trigger: repo → **Actions → ci → Run workflow** → project (all/api/ui) + optional grep filter. Runs the same biome → tsc → Playwright chain (retries: 1 per config) and uploads the HTML report on every run.
- `secrets.yml` — automatic on push/PR: gitleaks full-history scan. The pre-commit hook (wired by `init.sh`) scans staged changes the same way when gitleaks is installed locally.

## Task notes

Requirements are the task's own wording; the comment points at the file and place in the repo that implements it. Full test titles: `npx playwright test --list`.

### Task 1 — Web UI automation (Book Store)

| No | Requirement | Comment |
| --- | --- | --- |
| 1 | Pick an open-source automation framework | `playwright.config.ts` — one config, three projects; framework choice reasoning in docs/design-decisions.md |
| 2 | Develop automated tests for the site | `tests/ui/` — 5 tests, tc-002…tc-006 in specs + `tests/auth.setup.ts` (tc-001) |
| 3 | Registration may be left out | Deliberately out of scope; the journey starts at login: `tests/ui/login.spec.ts` → tc-006 |
| 4 | Design patterns and maintainable code & test data | `pages/` = Page Objects, `support/fixtures.ts` = fixture DI, `data/ui/*.json` = typed JSON test data |
| 5 | Code tied to Continuous Delivery | `.github/workflows/ci.yml` — one dispatch run proves lint + types + tests green and stores the HTML report |
| 6 | AI assistance noted in README | AI assistance section below, detail in `docs/AI-assistance.md` |
| 7 | Show coding style and techniques | `docs/design-decisions.md` records each choice with its reasoning; agent workflow rules in `AGENTS.md` |

### Task 2 — REST API automation (Restful-Booker)

| No | Requirement | Comment |
| --- | --- | --- |
| 1 | Suite using the endpoints from the API docs | `support/booking-client.ts` → covers ping, POST /auth, GET /booking, GET/PUT/PATCH/DELETE /booking/:id, POST /booking; GET /booking (ids list) is implemented as `getAllBookings` but no spec exercises it yet |
| 2 | Data-driven approach, appropriate data format | `data/api/booking-create.json` + `data/api/booking-negative.json` → cases imported as typed JSON (`with { type: "json" }`), one spec file per concern |
| 3 | Positive and negative scenarios | `tests/api/booking-create.spec.ts` (4 positive rows) vs `tests/api/booking-negative.spec.ts` (5 cases: schema violations, missing id, unauth 403) |
| 4 | Values flow between endpoints | `tests/api/booking-crud.spec.ts` → booking lifecycle test: id from POST reused by GET/PUT/PATCH/DELETE; token arrives from POST /auth via the `token` fixture |
| 5 | Patterns for maintainability, robustness, repeatability | `support/fixtures.ts` → dependency-injected `bookingClient` + `token`; `support/booking-client.ts` → typed service object, specs stay thin |
| 6 | Clear, concise assertion descriptions | Every `expect()` carries its message; see `tests/api/booking-crud.spec.ts` (e.g. "delete success should return 201 Created") |
| 7 | AI automates 1 endpoint; output + annotations in repo | `docs/AI-assistance.md` (populated by Maksim) |

Submission (both tasks): the requirement is a public repository with runnable code and instructions — Quick start above plus `scripts/init.sh`.

## Dependencies

| Package | Why |
| --- | --- |
| `@playwright/test` | Test runner, UI browser automation, API request contexts (browsers via `init.sh`) |
| `typescript` | Static typecheck; data files validated at compile time, not just runtime |
| `@biomejs/biome` | One tool for lint + format, with its native Playwright lint domain |
| `@dotenvx/dotenvx` | Loads `.env` ahead of the Playwright config (`import "@dotenvx/dotenvx/config"`) |

No runtime dependencies — the suite never ships anything; everything above is dev-only.

## Project structure

```
tests/            specs + auth.setup.ts (the only test entry points)
  api/            Restful-Booker specs — one file per concern (health, create, crud, negative)
  ui/             Book Store specs (search, book-detail, login)
support/          BookingClient service + Playwright fixtures + demoqa credential loader
pages/            Page Objects for the Book Store UI
data/api/         API test data (JSON, typed on import)
data/ui/          UI test data (search matrix, detail expectations)
docs/             AI-assistance.md, design-decisions.md, harness-overview.md
scripts/          init.sh (bootstrap) + verify.sh (quality gate)
.github/workflows ci.yml + secrets.yml; .githooks/ pre-commit (gitleaks)
```

How the repo steers AI agents on this build: `docs/harness-overview.md`.

## Test coverage

**18 tests · 8 files · 3 Playwright projects**

- **Authentication Setup** (1)
  - API user creation → UI login → session persistence.
- **API** (12)
  - **Health & Auth** (2) — Ping endpoint, authentication token.
  - **Booking Creation** (4) — Standard, long names, zero price, future dates.
  - **CRUD Lifecycle** (1) — POST → GET → PUT → PATCH → DELETE.
  - **Negative Tests** (5)
    - Invalid payloads: missing price, missing dates, empty body.
    - Non-existent booking ID.
    - Unauthorized mutations (403).
- **UI** (5)
  - **Search** (3) — JavaScript, Git Pocket, no-match query.
  - **Book Details** (1) — Verify fields after opening a book.
  - **Authentication** (1) — Session restore, logout, re-login.

## AI assistance

How AI tooling was used and validated: [docs/AI-assistance.md](docs/AI-assistance.md).

## Design decisions

Short list of the choices a reviewer will notice first; full reasoning in `docs/design-decisions.md`:

- Data-driven tests via typed JSON imports — shape drift is a compile error, no loader code.
- API suites stay thin: a typed service object (`BookingClient`) plus a small fixture layer.
- No BDD, no wrapper layers beyond Page Objects, native Playwright diagnostics, `test.describe` grouping only for multi-test specs.
- Credentials are public demo values (published in Restful-Booker's docs); the env-file pattern is demonstrated as it would be used for real secrets.

## Logging

- API client lines: `[booking] POST /booking (Crud Journey) → 200` from `console.info` in `support/booking-client.ts` — plain terminal runs stay debuggable.
- In-test steps: `test.step()` names the phases in every spec; the CRUD journey reads as get → PUT → PATCH → delete + verify gone.
- Report attachments: create-echo payloads attached as JSON in `booking-create` and `booking-crud` (payloads only — no credentials or tokens).
- Traces are captured on first retry, screenshots on failure, and both ride inside the HTML report that CI stores as an artifact.

The reasoning (why no logging library, what was rejected): docs/design-decisions.md → "Diagnostics: native Playwright".