# Session Progress Log

## Current State

**Last Updated:** 2026-10-29
**Active Feature:** M0-complete — Quality Engineering Technical Test, both tasks

## Status

### What's Done

- [x] Requirements extracted from assessment PDF (Task 1: Book Store UI, Task 2: Restful-Booker API)
- [x] Design session (grilling skill, 3 interview rounds, 21 questions) — design tree fully settled, 0 open branches
- [x] Project structure agreed and locked (single package, two Playwright projects)
- [x] Time budget agreed: 4–8h, due same day
- [x] M0 — Scaffold
  - Details: package.json (5 devDeps incl. `@biomejs/biome`; real npm pkg `@dotenvx/dotenvx`), playwright.config.ts (auth-setup + api + ui, retries 2, workers 3, trace on-first-retry, html reporter), strict tsconfig + resolveJsonModule, biome.json (v2 schema, TS/JS/JSON scope), scripts/init.sh + verify.sh (exec, strict mode), .env + .env.example (public demo creds only, no BASE_URL), AGENTS.md (ponytail/slop-scan/grilling mandates + anonymization rule), .agents/skills/{ponytail,slop-scan}/SKILL.md verbatim, docs/harness-overview.md (five subsystems), tests/auth.setup.ts placeholder, tests/api/health.spec.ts scaffold self-check
  - Standing rule from user: repo is public — never write the assessment issuer's name in any file/commit; neutral wording only (grep-verified 0 matches).

### What's In Progress

- [ ] M1 — API suite
  - Details: extend health.spec.ts with auth-token test; booking-client.ts (all 8 endpoints); fixtures.ts; booking-crud chained flow; booking-create data-driven; booking-negative; data/api JSON fixtures
  - Blockers: none — awaiting user milestone review before starting

### What's Next

1. M1 API suite (all 8 Restful-Booker endpoints, JSON data-driven, chained flow, negatives)
2. M2 UI suite (auth.setup storageState, POM, search + book detail + login)
3. M3 CI (workflow_dispatch: project + grep inputs)
4. M4 Part B (AI-automated POST /booking + GET /booking/{id}, annotated)
5. M5 polish (README, docs, slop-scan, final verify, push)

## Blockers / Risks

- [ ] Same-day deadline (Thu 29 Oct): mitigated by locked cut order — (1) M2b collection tests, (2) UI smoke trim, (3) API negative matrix. Part B + CI never cut.
- [ ] Third-party targets (demoqa, restful-booker) are flaky: mitigated by retries: 2 and modest workers.

## Decisions Made

- **Single package, two Playwright projects (api + ui)**: one install, one config, one CI job. Alternative rejected: two packages/repos — boilerplate for zero assessment value.
- **UI auth = auth-setup project**: API-creates unique user → UI login once → storageState reused. Reviewers run with zero secrets. Alternative rejected: fixed .env credentials — forces secret setup on reviewers.
- **JSON data-driven via `resolveJsonModule` import + typed interface boundary**: zero loader code, compile-time shape check, fails fast. Alternatives: fs.readFileSync (boilerplate, untyped), TS data modules (not a "data format" showcase).
- **API = minimal service layer** (BookingClient + fixtures + chained flow + granular/negative specs): design patterns without over-engineering. Alternatives: raw specs (no maintainability story), builder/factory stack (overkill for 8 endpoints). Full reasoning + larger-app approach → docs/design-decisions.md at M1.
- **UI = plain TS specs + Page Objects, no BDD**: lean for this scope. When BDD earns its keep (business-readable specs, non-tech stakeholders) → docs/design-decisions.md at M2.
- **Part B = POST /booking + GET /booking/{id}** automated by AI (pi agent), raw outputs + annotations in docs/part-b/.
- **Secrets = dotenvx + committed .env (public demo creds) + .env.example**: honest showcase; real secrets would be gitignored + dotenvx encrypt/vault — noted in README. Enforcement layers: LOCK = GitHub push protection (repo setting, README-documented); ALARM = gitleaks CI on push (M3 — detection with minutes-scale rotate+rewrite, not prevention) + M5 one-off full-history detect; commit gates stay biome + slop-scan; AGENTS.md advisory: local gitleaks detect before push if installed. No real secrets exist in this repo by design.
- **CI = workflow_dispatch only**, inputs: project (all/api/ui) + optional grep; retries: 2; HTML report artifact.
- **AI harness showcase** = AGENTS.md + live progress.md + init.sh/verify.sh + harness-overview.md + vendored workflow skills (ponytail, slop-scan) in .agents/skills/, mandated by AGENTS.md.
- **Repo**: stays `assessment-qe-technical-2610`, public, under MaksimZinovev.

## Files Modified This Session

- Implementation session: package.json, package-lock.json, playwright.config.ts, tsconfig.json, biome.json, scripts/init.sh, scripts/verify.sh, tests/auth.setup.ts, tests/api/health.spec.ts, .env, .env.example, .gitignore, AGENTS.md, docs/harness-overview.md, .agents/skills/{ponytail,slop-scan}/SKILL.md, agents/progress.md

## Evidence of Completion

- [x] Design session complete: 3 rounds, 21 questions, all branches settled
- [x] Tests pass: `./scripts/verify.sh` → `[api] health — /ping responds 201` **1 passed (1.7s)**, exit 0; no browser install needed (request-context test) so API tests run in CI browserless
- [x] Type check clean: `tsc --noEmit` → no errors (strict mode, config + spec files)
- [x] Lint clean: `biome check .` → exit 0 (6 files; Biome 2.6, preset recommended; TS/JS/JSON scope keeps planner docs untouched)
- [x] slop-scan scan . → **0 findings, repo score 0.00**
- [x] Manual verification: env keys verified live — `dotenvx run` injected 2 vars from .env
- Manual repo review: — (M5)

## Notes for Next Session

- Milestone order M0→M1→M2→M3→M4→M5; each gate = verify.sh green + this file updated + commit.
- Structure tree, milestone hour-map, and cut order are locked — see Decisions above; full internal record: `.local/grilling-decisions.md` (not committed).
- ponytail skill governs all implementation; slop-scan before each commit.
- docs/design-decisions.md is authored during M1/M2, not upfront — reasoning gets validated by the code it describes.