# Design decisions - booking API suite

## Why a minimal single-class service layer

Specs talk to Restful-Booker through one thin `BookingClient` (`support/booking-client.ts`) instead of raw `request.post(...)` scattered across tests:

- **One place to name HTTP concerns.** Cookie transport (`Cookie: token=…`), path shapes, and payload types live in seven short methods. Each spec asserts on the raw `APIResponse` - the API's actual contract (status codes, plaintext error bodies) stays visible in test code, not wrapped in envelopes.
- **Types at the happy path.** The exported `Booking` / `Partial<Booking>` give compile-time safety for well-formed payloads. Negative tests bypass the client and post `body: unknown` directly - bad payloads must not fit the happy-path contract.
- **Cheapest refactor path.** Auth header style or base path changing means editing one file; specs don't move.

Not chosen: raw requests per test (duplicates headers/paths in every spec) and a response-envelope abstraction (hides the very status codes under assertion).

In a larger app this boundary would split up: per-domain API modules (bookings, auth, users), JSON-schema contract validation on responses, request builders, and a typed auth provider. None of that pays for itself at one domain and one page.

## Restful-Booker API 

Verified against the live API. The suite asserts these actuals - do not "fix" them to textbook values:

- **DELETE success returns 201 "Created"**, not 204. `DELETE /booking/{id}` with a valid cookie → 201, plaintext `Created`.
- **Error bodies are plaintext** (`Not Found`, `Forbidden`, `Internal Server Error`), not JSON. Failure assertions use `response.text()` containment; the client never parses error bodies.
- **Bogus token behaves exactly like a missing token**: PUT/PATCH/DELETE → 403 `Forbidden`, not 401. The unauth negative probe uses the simplest form - no cookie at all.
- **Wrong-type fields are accepted, not rejected**: `totalprice: "free"` returns 200 with `totalprice` coerced to `null`. That is why the negative matrix has no type-violation row.
- **Missing required fields → 500 "Internal Server Error"**, not 400: absent `totalprice`, absent `bookingdates`, empty `{}` body all return 500.

## Env fallback in the token fixture

`support/fixtures.ts` resolves credentials as `process.env.BOOKING_API_USERNAME ?? 'admin'` (likewise the password). Both are the public demo credentials published in the API docs - not secrets. The fallback is dormant by design: a temp-log run observed `env-source=env`, so dotenvx injection reaches workers; the `??` masks a worker-inheritance flake with zero machinery and changes nothing about credential handling.

## Test data & teardown

Booking data is static JSON under `data/api/`, imported with `with { type: "json" }` - Node's ESM loader (node 24, this Playwright version) rejects bare JSON imports, a verified toolchain requirement. TypeScript checks each file's shape against a `case` interface at compile time: data drift is a build error, not a runtime failure three tests deep.

Created bookings are deliberately **left** in the sandbox - 5 per run (4 create-matrix rows, 1 unauth setup). Deliberate because the sandbox is a public scratch pad of demo data; best-effort cleanup machinery needs catch-guards whose failures would become false test negatives; and deletion is already a tested assertion in the lifecycle spec. The CRUD lifecycle test is the exception that proves the pattern: it deletes what it creates because that is what it tests.

---

## UI suite: plain TS + Page Objects, not BDD

The UI suite is plain TypeScript specs over minimal Page Objects (`login-page`, `book-store-page` - only what the specs call; the detail journey asserts page text directly because its one lookup method would have been a pass-through wrapper). Why:

- **Assertions stay in the specs; page objects only name locators and actions** - the same "specs own the contract" rule as the API suite.
- **No extra toolchain.** BDD adds a runner, step-definition glue, a second reporting surface, and one more layer where flaky locators hide. For six tests and three pages, that machinery verifies nothing on its own.
- **Locators live in exactly one place.** On third-party UIs the locator contract is the real maintenance risk; POM solves that without ceremony.

BDD earns its keep when non-technical stakeholders author and read specs in domain language and those gherkin files become living acceptance criteria. Neither is true here - the reviewers are engineers. Revisit trigger: a real product team writing acceptance tests.

## Locators: probed DOM, user-facing attributes only

- DemoQA auth is **cookie-based** (`token`/`userID`/`userName` cookies), not localStorage - probed, which settled both the storageState flow and the login-success assertion (`Log out` button + `User Name` header).
- The books list is **one plain `<table>`** - an early `.rt-tr-group a` locator matched nothing (the React-table classes don't exist in this build and a union selector masked the bug during recon). All locators are role/placeholder/text anchored: `getByRole("table").getByRole("link")`, `getByPlaceholder`, `getByText`.
- Header button text differs per page (`Logout` on /profile, `Log out` on /books) - one regex locator covers both; assertions stay page-scoped.

## Test IDs (tc-XXX)

Every UI-suite test title carries a stable `tc-XXX` id in suite order (tc-001 auth-setup persist → tc-002…004 search matrix → tc-005 detail → tc-006 login), so runs, reports, and references name a test by id rather than prose. The search-matrix ids live inside the typed JSON boundary. The API suite predates the convention and keeps prose titles.

## Test grouping: describe() used selectively 

`test.describe()` wraps only specs that declare multiple related tests: `booking-create` (4 payload rows), `booking-negative` (5 cases incl. unauth mutations), `search` (3 filter rows). Specs stay bare when the wrapper adds nothing: `booking-crud` is one chained journey, `login` and `book-detail` are single journeys, `health.spec` groups only health probes. Reasoning: the group exists for the HTML report and `--grep` filtering; with one test per file the prefix merely repeats what the test title already says. Steps (`test.step()`) stay the in-test narrative and are unaffected - grouping and steps are complementary, not interchangeable.

## Diagnostics: native Playwright 

`test.step()` names the phases in specs; `test.info().attach()` drops API response bodies into the HTML report where they help debugging - payloads only, never credentials/tokens. The API client logs each operation and response status with plain `console.info` (one small custom addition; no logging library). Traces are captured on first retry and failure screenshots on failure - both bundle into the HTML report, which CI uploads on every run. Rejected: dedicated logging libraries (pino) - dependency and configuration for zero value at this size. Revisit trigger: framework-scale logging needs (correlation ids, structured sinks).

## Linting: Biome only

Linting: Biome only, with the native Playwright domain enabled. ESLint + eslint-plugin-playwright: deferred - Biome's Playwright domain covers the anti-patterns that mattered (hardcoded waits, forced clicks, networkidle, missing awaits, element handles); ESLint's residual edge is only the not-yet-migrated advanced rules (e.g. prefer-web-first-assertions parity, biomejs#8961). 

## Credentials & teardown (UI)

- `DEMOQA_PASSWORD` is a throwaway sandbox credential - same class as the public admin/password123 demo pair, not a secret. It is deterministic on purpose so the login journey can re-authenticate the auth-setup-created user after logging out.
- DemoQA accounts created by auth-setup (~1 per run) are deliberately left in the sandbox - same rationale as the API teardown note: delete-machinery's failure modes would create false negatives, and the public sandbox is a scratch pad.