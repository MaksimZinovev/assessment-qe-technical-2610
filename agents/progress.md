# Session Progress Log

## Current State

**Last Updated:** 2026-10-29
**Active Feature:** planning-complete — Quality Engineering Technical Test, both tasks

## Status

### What's Done

- [x] Requirements extracted from assessment PDF (Task 1: Book Store UI, Task 2: Restful-Booker API)
- [x] Design session (grilling skill, 3 interview rounds, 21 questions) — design tree fully settled, 0 open branches
- [x] Project structure agreed and locked (single package, two Playwright projects)
- [x] Time budget agreed: 4–8h, due same day

### What's In Progress

- [ ] M0 — Scaffold
  - Details: package.json, playwright.config.ts (auth-setup + api + ui projects), tsconfig (resolveJsonModule), biome, AGENTS.md, scripts/init.sh + verify.sh, .env + .env.example, vendored skills
  - Blockers: none

### What's Next

1. M0 scaffold → gate: verify.sh green, commit
2. M1 API suite (all 8 Restful-Booker endpoints, JSON data-driven, chained flow, negatives)
3. M2 UI suite (auth.setup storageState, POM, search + book detail + login)
4. M3 CI (workflow_dispatch: project + grep inputs)
5. M4 Part B (AI-automated POST /booking + GET /booking/{id}, annotated)
6. M5 polish (README, docs, slop-scan, final verify, push)

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
- **Secrets = dotenvx + committed .env (public demo creds) + .env.example**: honest showcase; real secrets would be gitignored + dotenvx encrypt/vault — noted in README.
- **CI = workflow_dispatch only**, inputs: project (all/api/ui) + optional grep; retries: 2; HTML report artifact.
- **AI harness showcase** = AGENTS.md + live progress.md + init.sh/verify.sh + harness-overview.md + vendored workflow skills (ponytail, slop-scan) in .agents/skills/, mandated by AGENTS.md.
- **Repo**: stays `assessment-qe-technical-2610`, public, under MaksimZinovev.

## Files Modified This Session

- `agents/progress.md` - populated from template with locked plan
- `INTENT.md` - user-added references (ponytail, slop-scan, grill-me, Biome, TS, Playwright)
- (internal, gitignored) `.local/grilling-decisions.md` - full decision record
- (internal, gitignored) `.local/resolve-json-module-example.md` - JSON loading explainer

## Evidence of Completion

- [x] Design session complete: 3 rounds, 21 questions, all branches settled
- [ ] Tests pass: — (no code yet; M0 starts next)
- [ ] Type check clean: — (M0)
- [ ] Manual verification: — (M5)

## Notes for Next Session

- Milestone order M0→M1→M2→M3→M4→M5; each gate = verify.sh green + this file updated + commit.
- Structure tree, milestone hour-map, and cut order are locked — see Decisions above; full internal record: `.local/grilling-decisions.md` (not committed).
- ponytail skill governs all implementation; slop-scan before each commit.
- docs/design-decisions.md is authored during M1/M2, not upfront — reasoning gets validated by the code it describes.