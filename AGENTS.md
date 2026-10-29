# AGENTS.md - working instructions for AI agents in this repo

Playwright test suite for the Quality Engineering technical test - restful-booker
API suite (`tests/api`) + demoqa Book Store UI suite (`tests/ui`), single package,
three projects in `playwright.config.ts`: `auth-setup`, `api`, `ui`.

## Mandates (non-negotiable)

1. **The ponytail skill is ALWAYS active** (vendored at `.agents/skills/ponytail/`):
   write the minimal code that works - no speculative abstractions, no options
   nobody asked for, no features beyond the current task. Fewest lines wins.
2. **Before every commit:** run `biome check --write .` (conform formatting),
   then `slop-scan scan .` and fix or justify every finding in the commit.
3. **Plan or design changes require a grilling-style interview** - structured
   question rounds that settle every branch - before implementation changes.
   Do not silently reinterpret the locked structure.

## Structure conventions

| Path | Contents |
|---|---|
| `support/` | shared services/fixtures - `booking-client.ts`, `fixtures.ts` |
| `pages/` | UI Page Objects |
| `data/{api,ui}/` | JSON test data - imported via `resolveJsonModule` with a typed interface boundary (never `fs.readFileSync`) |
| `tests/api/`, `tests/ui/` | specs, one file per journey or concern |
| `tests/auth.setup.ts` | `auth-setup` project → saves `.auth/state.json` |
| `agents/progress.md` | live state log - update at every milestone gate |

Project names (`auth-setup`, `api`, `ui`) are stable - wire new files into the
existing tree, never rename structure without a mandate-3 interview.

## Verification

- `npm run verify` - biome → tsc → playwright test. The milestone gate.
- `npm run test-api` / `npm run test-ui` - project subsets.
- A milestone closes on: verify green + `agents/progress.md` updated + one
  conventional commit.

## Repo hygiene - non-negotiable

- **Anonymity:** this repo is shared publicly by "the reviewer". NEVER write the
  assessment issuer's name (from the test PDF) into any file, comment, commit
  message, or workflow. Neutral wording only: "the technical test", "the
  assessment". `.local/` holds labeled material and must stay uncommitted.
- Gitignored artifacts (`.auth/`, `playwright-report/`, `test-results/) are
  never committed.