# Session Progress Log

## Current State

**Last Updated:** 2026-10-29
**Active Feature:** M1-complete — Quality Engineering Technical Test, both tasks

## Status

### What's Done

- [x] Requirements extracted from assessment PDF (Task 1: Book Store UI, Task 2: Restful-Booker API)
- [x] Design session (grilling skill, 3 interview rounds, 21 questions) — design tree fully settled, 0 open branches
- [x] Project structure agreed and locked (single package, two Playwright projects)
- [x] Time budget agreed: 4–8h, due same day
- [x] M0 — Scaffold
  - Details: package.json (5 devDeps incl. `@biomejs/biome`; real npm pkg `@dotenvx/dotenvx`), playwright.config.ts (auth-setup + api + ui, retries 2, workers 3, trace on-first-retry, html reporter), strict tsconfig + resolveJsonModule, biome.json (v2 schema, TS/JS/JSON scope), scripts/init.sh + verify.sh (exec, strict mode), .env + .env.example (public demo creds only, no BASE_URL), AGENTS.md (ponytail/slop-scan/grilling mandates + anonymization rule), .agents/skills/{ponytail,slop-scan}/SKILL.md verbatim, docs/harness-overview.md (five subsystems), tests/auth.setup.ts placeholder, tests/api/health.spec.ts scaffold self-check
  - Standing rule from user: repo is public — never write the assessment issuer's name in any file/commit; neutral wording only (grep-verified 0 matches).
- [x] M1 — API suite
  - Details: support/booking-client.ts (7 endpoint methods, raw APIResponse returns, `Cookie: token` transport) + support/fixtures.ts (bookingClient + token fixtures); health.spec.ts extended (auth → 200 + non-empty token via fixture); booking-crud.spec.ts chained lifecycle (create/get/PUT/PATCH/delete→201-probed/final-404); booking-create.spec.ts data-driven (4-row matrix, typed boundary); booking-negative.spec.ts (3× schema-violation → 500 + bodyContains, get-missing-id → 404, + unauth PUT/PATCH/DELETE → 403 block); data/api/{booking-create,booking-negative}.json; docs/design-decisions.md
  - Toolchain finding: JSON imports need `with { type: "json" }` attribute under node 24 + playwright 1.64 (Node ESM loader) — planner's .local note updated
  - 12 api tests green; specs deliberately leave created bookings in the sandbox (rationale documented in design-decisions.md)

### What's In Progress

- [ ] M2 — UI suite
  - Details: auth.setup.ts (demoqa Account API — POST /Account/v1/User + GenerateToken → UI login → storageState); POM; search + book detail + login journeys
  - Blockers: awaiting user M1 gate before starting

### What's Next

1. M2 UI suite (auth.setup storageState, POM, search + book detail + login; swagger recon done — Account + BookStore endpoints mapped, spec embedded in /swagger/swagger-ui-init.js)
2. M3 CI (workflow_dispatch: project + grep inputs)
3. M4 Part B (AI-automated POST /booking + GET /booking/{id}, annotated)
4. M5 polish (README, docs, slop-scan, final verify, push)

## Blockers / Risks

- [ ] Same-day deadline (Thu 29 Oct): mitigated by locked cut order — (1) M2b collection tests, (2) UI smoke trim, (3) API negative matrix. Part B + CI never cut.
- [ ] Third-party targets (demoqa, restful-booker) are flaky: mitigated by retries: 2 and modest workers.

## Decisions Made

- **Single package, two Playwright projects (api + ui)**: one install, one config, one CI job. Alternative rejected: two packages/repos — boilerplate for zero assessment value.
- **UI auth = auth-setup project**: API-creates unique user → UI login once → storageState reused. Reviewers run with zero secrets. Alternative rejected: fixed .env credentials — forces secret setup on reviewers.
- **JSON data-driven via `resolveJsonModule` typed import (pros/cons)**: pros — zero loader code, compile-time shape check (drift = build error), malformed JSON impossible at runtime, data stays a data format. Cons — bundled at compile time (not hot-reloaded); requires `with { type: "json" }` import attribute in this toolchain (node 24 + playwright 1.64 — Node ESM loader rejects bare JSON imports, verified live; old esbuild-inlining claim corrected); JSON string literals widen to `string`, so literal-union fields aren't compile-checked (a typo'd method still fails loudly on the runtime status assert). Alternatives: fs.readFileSync (boilerplate, untyped, path juggling), TS data modules (not a "data format" showcase).
- **API = minimal service layer** (BookingClient + fixtures + chained flow + granular/negative specs): design patterns without over-engineering. Alternatives: raw specs (no maintainability story), builder/factory stack (overkill for 8 endpoints). Full reasoning + larger-app approach → docs/design-decisions.md at M1.
- **UI = plain TS specs + Page Objects, no BDD**: lean for this scope. When BDD earns its keep (business-readable specs, non-tech stakeholders) → docs/design-decisions.md at M2.
- **Part B = POST /booking + GET /booking/{id}** automated by AI (pi agent), raw outputs + annotations in docs/part-b/.
- **Secrets = dotenvx + committed .env (public demo creds) + .env.example**: honest showcase; real secrets would be gitignored + dotenvx encrypt/vault — noted in README. Gitleaks enforcement (M3), two layers per user architecture: catch early = `.githooks/pre-commit` (`gitleaks protect --staged`, blocks commit; wired by init.sh); enforce centrally = `secrets.yml` CI on push/PR (full-history detect, red check — covers `--no-verify` bypass and forks). `.gitleaks.toml` allowlists `.env` (public demo creds); `.env.keys` gitignored; README documents GitHub push protection as optional native lock; M5 = one-off full-history detect. No real secrets exist in this repo by design.
- **CI = workflow_dispatch only**, inputs: project (all/api/ui) + optional grep; retries: 2; HTML report artifact.
- **AI harness showcase** = AGENTS.md + live progress.md + init.sh/verify.sh + harness-overview.md + vendored workflow skills (ponytail, slop-scan) in .agents/skills/, mandated by AGENTS.md.
- **Repo**: stays `assessment-qe-technical-2610`, public, under MaksimZinovev.

## Files Modified This Session

- Implementation session: package.json, package-lock.json, playwright.config.ts, tsconfig.json, biome.json, scripts/init.sh, scripts/verify.sh, tests/auth.setup.ts, tests/api/health.spec.ts, .env, .env.example, .gitignore, AGENTS.md, docs/harness-overview.md, .agents/skills/{ponytail,slop-scan}/SKILL.md, agents/progress.md; M1: support/booking-client.ts, support/fixtures.ts, tests/api/booking-crud.spec.ts, tests/api/booking-create.spec.ts, tests/api/booking-negative.spec.ts, data/api/booking-create.json, data/api/booking-negative.json, docs/design-decisions.md, agents/progress.md

## Evidence of Completion

- [x] Design session complete: 3 rounds, 21 questions, all branches settled
- [x] Tests pass (M1 gate): `./scripts/verify.sh` → biome clean → TSC-OK → playwright **12 passed (5.5s)**, exit 0 (api project; browserless — request-context only)
- [x] Type check clean: `tsc --noEmit` → no errors (strict mode; config, 4 specs, support)
- [x] Lint clean: `biome check .` → exit 0 (Biome 2.6, preset recommended; TS/JS/JSON scope keeps planner docs untouched)
- [x] slop-scan scan . → **0 findings, repo score 0.00**
- [x] Manual verification: token-fixture env path observed via temp log (`env-source=env`, log removed, byte-count restored); all negative statuses probed live pre-authoring (delete→201, plaintext errors, bogus≡missing→403, wrong-type accepted/coerced, 500-not-400); M0 gate evidence preserved in commit 36f2aff
- Manual repo review: — (M5)

## Notes for Next Session

- Milestone order M0→M1→M2→M3→M4→M5; each gate = verify.sh green + this file updated + commit.
- Structure tree, milestone hour-map, and cut order are locked — see Decisions above; full internal record: `.local/grilling-decisions.md` (not committed).
- ponytail skill governs all implementation; slop-scan before each commit.
- docs/design-decisions.md is authored during M1/M2, not upfront — reasoning gets validated by the code it describes.