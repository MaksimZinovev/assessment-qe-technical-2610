# Session Progress Log

## Current State

**Last Updated:** 2026-10-29
**Active Feature:** M3-complete — Quality Engineering Technical Test; CI live on github.com/MaksimZinovev/assessment-qe-technical-2610 (dispatch-only, gitleaks two layers); next: M4 Part B brief at the A4 gate

## Status

### What's Done

- [x] Requirements extracted from assessment PDF (Task 1: Book Store UI, Task 2: Restful-Booker API)
- [x] Design session (grilling skill, 3 interview rounds, 21 questions) — design tree fully settled, 0 open branches
- [x] Project structure agreed and locked (single package, two Playwright projects)
- [x] Time budget agreed: 4–8h, due same day
- [x] M0 — Scaffold
  - Details: package.json (5 devDeps incl. `@biomejs/biome`; real npm pkg `@dotenvx/dotenvx`), playwright.config.ts (auth-setup + api + ui, retries 2 then, workers 3, trace on-first-retry, list + html reporters; retries user-fixed to 1 permanent on 2026-10-29), strict tsconfig + resolveJsonModule, biome.json (v2 schema, TS/JS/JSON scope), scripts/init.sh + verify.sh (exec, strict mode), .env + .env.example (public demo creds only, no BASE_URL), AGENTS.md (ponytail/slop-scan/grilling mandates + anonymization rule), .agents/skills/{ponytail,slop-scan}/SKILL.md verbatim, docs/harness-overview.md (five subsystems), tests/auth.setup.ts placeholder, tests/api/health.spec.ts scaffold self-check
  - Standing rule from user: repo is public — never write the assessment issuer's name in any file/commit; neutral wording only (grep-verified 0 matches).
- [x] M1 — API suite
  - Details: support/booking-client.ts (7 endpoint methods, raw APIResponse returns, `Cookie: token` transport) + support/fixtures.ts (bookingClient + token fixtures); health.spec.ts extended (auth → 200 + non-empty token via fixture); booking-crud.spec.ts chained lifecycle (create/get/PUT/PATCH/delete→201-probed/final-404); booking-create.spec.ts data-driven (4-row matrix, typed boundary); booking-negative.spec.ts (3× schema-violation → 500 + bodyContains, get-missing-id → 404, + unauth PUT/PATCH/DELETE → 403 block); data/api/{booking-create,booking-negative}.json; docs/design-decisions.md
  - Toolchain finding: JSON imports need `with { type: "json" }` attribute under node 24 + playwright 1.64 (Node ESM loader) — planner's .local note updated
  - 12 api tests green; specs deliberately leave created bookings in the sandbox (rationale documented in design-decisions.md)
- [x] M2 — UI suite
  - Details: tests/auth.setup.ts implemented (Account API create-unique-user → GenerateToken 200/Success → UI login → storageState; probed: demoqa auth is cookie-based, not localStorage); pages/{login,book-store}-page.ts minimal POM (book-detail page object dropped on user call — pure pass-through per slop-scan; detail assertions in-spec); tests/ui/{search,book-detail,login}.spec.ts (5 tests: tc-002…004 search data-driven, tc-005 detail vs probed API row, tc-006 full login journey — restored-session proof → logout → form re-login); data/ui/{search-cases,book-detail}.json typed boundaries; support/demoqa-credentials.ts (throwaway sandbox password); docs/design-decisions.md extended (POM-vs-BDD, locator lesson, tc-XXX, lint, teardown)
  - Probe-first payoff: books list is one plain `<table>` (no react-table .rt-* classes) — role-anchored locators only; detail DOM probed live ("Label : value" pairs, route /books?search=<isbn>)
  - Full gate 18 passed (57s): 12 api + tc-001 auth-setup + 5 ui tests

### What's In Progress

- [x] **M3 (CI) — CLOSED** 2026-10-29. Brief A4-approved by user (adjustments: user-triggerable from the Actions tab; report artifact on EVERY run; dispatch-only confirmed; M2b deferred until after M5). Commits 79583fa (workflow + gitleaks layers + hooks) and f1a1acf (fixes from real runs: actions v4→v5 for the Node 20 deprecation; secrets red run 40832283625 was a gitleaks-action differential-scan plumbing failure on fresh history — unresolvable base revision, ZERO leaks — fixed with GITLEAKS_LOG_OPTS=--all, probed locally 0 leaks first). Evidence: local verify 18 passed (1.2m), slop-scan 0, anonymization grep clean; remote ci 40832604685 + 40832895855 green (the latter dispatched by MaksimZinovev himself — the user-trigger proof), secrets 40832512332 green, HTML report artifact uploaded every run. Public repo: github.com/MaksimZinovev/assessment-qe-technical-2610. Peer review (agent-WN5JKC): APPROVED, hooks hook live-tested 0 leaks.

### What's Next

1. M4 Part B (AI-automated POST /booking + GET /booking/{id}, annotated)
2. M5 polish (README, docs, slop-scan, final verify, push)
3. M2b collection add/delete tests — deferred to after M5 (user decision at M3 A4 gate); if run, CI inherits retries: 1 and plain `biome check`

## Blockers / Risks

- [ ] Same-day deadline (Thu 29 Oct): mitigated by locked cut order — (1) M2b collection tests, (2) UI smoke trim, (3) API negative matrix. Part B + CI never cut.
- [ ] Third-party targets (demoqa, restful-booker) are flaky: mitigated by retries: 1 (user-fixed permanent, 2026-10-29) and modest workers.

## Decisions Made

- **Single package, two Playwright projects (api + ui)**: one install, one config, one CI job. Alternative rejected: two packages/repos — boilerplate for zero assessment value.
- **UI auth = auth-setup project**: API-creates unique user → UI login once → storageState reused. Reviewers run with zero secrets. Alternative rejected: fixed .env credentials — forces secret setup on reviewers.
- **JSON data-driven via `resolveJsonModule` typed import (pros/cons)**: pros — zero loader code, compile-time shape check (drift = build error), malformed JSON impossible at runtime, data stays a data format. Cons — bundled at compile time (not hot-reloaded); requires `with { type: "json" }` import attribute in this toolchain (node 24 + playwright 1.64 — Node ESM loader rejects bare JSON imports, verified live; old esbuild-inlining claim corrected); JSON string literals widen to `string`, so literal-union fields aren't compile-checked (a typo'd method still fails loudly on the runtime status assert). Alternatives: fs.readFileSync (boilerplate, untyped, path juggling), TS data modules (not a "data format" showcase).
- **API = minimal service layer** (BookingClient + fixtures + chained flow + granular/negative specs): design patterns without over-engineering. Alternatives: raw specs (no maintainability story), builder/factory stack (overkill for 8 endpoints). Full reasoning + larger-app approach → docs/design-decisions.md at M1.
- **UI = plain TS specs + Page Objects, no BDD**: lean for this scope. When BDD earns its keep (business-readable specs, non-tech stakeholders) → docs/design-decisions.md at M2.
- **Part B = POST /booking + GET /booking/{id}** automated by AI (pi agent), raw outputs + annotations in docs/part-b/.
- **Secrets = dotenvx + committed .env (public demo creds) + .env.example**: honest showcase; real secrets would be gitignored + dotenvx encrypt/vault — noted in README. Gitleaks enforcement (M3), two layers per user architecture: catch early = `.githooks/pre-commit` (`gitleaks protect --staged`, blocks commit; wired by init.sh); enforce centrally = `secrets.yml` CI on push/PR (full-history detect, red check — covers `--no-verify` bypass and forks). `.gitleaks.toml` allowlists `.env` (public demo creds); `.env.keys` gitignored; README documents GitHub push protection as optional native lock; M5 = one-off full-history detect. No real secrets exist in this repo by design.
- **CI = workflow_dispatch only**, inputs: project (all/api/ui) + optional grep; retries: 1 (user-fixed permanent, 2026-10-29); HTML report artifact.
- **Protocol A4 (user instruction, 2026-10-29)**: passing a milestone review does NOT auto-start the next milestone — every milestone start (M2→M5) requires the user's explicit approval of its brief; the user is the human-in-the-loop gate. Applied at M2 start.
- **retries: 1 is permanent for this assessment** (user decision, 2026-10-29; supersedes M0's retries-2 draft).
- **Test titles carry tc-XXX ids (user decision, 2026-10-29)** in the UI suite (tc-001…tc-006, suite order, ids inside the typed data boundary for the search matrix) — reporting/reference by id. API suite predates the convention.
- **AI harness showcase** = AGENTS.md + live progress.md + init.sh/verify.sh + harness-overview.md + vendored workflow skills (ponytail, slop-scan) in .agents/skills/, mandated by AGENTS.md.
- **Repo**: stays `assessment-qe-technical-2610`, public, under MaksimZinovev.

## Files Modified This Session

- Implementation session: package.json, package-lock.json, playwright.config.ts, tsconfig.json, biome.json, scripts/init.sh, scripts/verify.sh, tests/auth.setup.ts, tests/api/health.spec.ts, .env, .env.example, .gitignore, AGENTS.md, docs/harness-overview.md, .agents/skills/{ponytail,slop-scan}/SKILL.md, agents/progress.md; M1: support/booking-client.ts, support/fixtures.ts, tests/api/booking-crud.spec.ts, tests/api/booking-create.spec.ts, tests/api/booking-negative.spec.ts, data/api/booking-create.json, data/api/booking-negative.json, docs/design-decisions.md, agents/progress.md; M2: playwright.config.ts, tests/auth.setup.ts, pages/login-page.ts, pages/book-store-page.ts, tests/ui/search.spec.ts, tests/ui/book-detail.spec.ts, tests/ui/login.spec.ts, data/ui/search-cases.json, data/ui/book-detail.json, support/demoqa-credentials.ts, docs/design-decisions.md, agents/progress.md

## Evidence of Completion

- [x] Design session complete: 3 rounds, 21 questions, all branches settled
- [x] Tests pass (M2 gate): `./scripts/verify.sh` → biome clean → TSC-OK → playwright **18 passed (56.9s)**, exit 0 — 12 api (browserless) + tc-001 auth-setup (real chromium login) + tc-002…006 ui; re-run green post-tc-IDs. Final gate with Biome Playwright domain: 18 passed (39.2s), slop-scan 0. **M2 gate user-approved 2026-10-29** (commits b636b2d, 9748993)
- [x] Type check clean: `tsc --noEmit` → no errors (strict mode; config, 7 specs, 3 pages, support — incl. the tc-XXX id field crossing the JSON boundary)
- [x] Lint clean: `biome check .` → exit 0 (Biome 2.6, preset recommended; TS/JS/JSON scope keeps planner docs untouched)
- [x] slop-scan scan . → **0 findings, repo score 0.00**
- [x] Manual verification: token-fixture env path observed via temp log (`env-source=env`, log removed, byte-count restored); all negative statuses probed live pre-authoring (delete→201, plaintext errors, bogus≡missing→403, wrong-type accepted/coerced, 500-not-400); M2 probed live pre-authoring (demoqa auth = cookies not localStorage; Authorized token-variant rejected 400; books list = one plain `<table>`; detail = "Label : value" text pairs at /books?search=<isbn>; search matrix 4/1/0 rows verified); M0 gate evidence preserved in commit 36f2aff
- Manual repo review: — (M5)

## Notes for Next Session

- Milestone order M0→M1→M2→M3→M4→M5; each gate = verify.sh green + this file updated + commit.
- Structure tree, milestone hour-map, and cut order are locked — see Decisions above; full internal record: `.local/grilling-decisions.md` (not committed).
- ponytail skill governs all implementation; slop-scan before each commit.
- docs/design-decisions.md is authored during M1/M2, not upfront — reasoning gets validated by the code it describes.