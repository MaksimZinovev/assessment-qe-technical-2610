# Design decisions — booking API suite

## Why a minimal single-class service layer

Specs talk to Restful-Booker through one thin `BookingClient` (`support/booking-client.ts`) instead of raw `request.post(...)` scattered across tests:

- **One place to name HTTP concerns.** Cookie transport (`Cookie: token=…`), path shapes, and payload types live in seven short methods. Each spec asserts on the raw `APIResponse` — the API's actual contract (status codes, plaintext error bodies) stays visible in test code, not wrapped in envelopes.
- **Types at the happy path.** The exported `Booking` / `Partial<Booking>` give compile-time safety for well-formed payloads. Negative tests bypass the client and post `body: unknown` directly — bad payloads must not fit the happy-path contract.
- **Cheapest refactor path.** Auth header style or base path changing means editing one file; specs don't move.

Not chosen: raw requests per test (duplicates headers/paths in every spec) and a response-envelope abstraction (hides the very status codes under assertion).

In a larger app this boundary would split up: per-domain API modules (bookings, auth, users), JSON-schema contract validation on responses, request builders, and a typed auth provider. None of that pays for itself at one domain and one page.

## Restful-Booker API quirks (probed)

Verified against the live API. The suite asserts these actuals — do not "fix" them to textbook values:

- **DELETE success returns 201 "Created"**, not 204. `DELETE /booking/{id}` with a valid cookie → 201, plaintext `Created`.
- **Error bodies are plaintext** (`Not Found`, `Forbidden`, `Internal Server Error`), not JSON. Failure assertions use `response.text()` containment; the client never parses error bodies.
- **Bogus token behaves exactly like a missing token**: PUT/PATCH/DELETE → 403 `Forbidden`, not 401. The unauth negative probe uses the simplest form — no cookie at all.
- **Wrong-type fields are accepted, not rejected**: `totalprice: "free"` returns 200 with `totalprice` coerced to `null`. That is why the negative matrix has no type-violation row.
- **Missing required fields → 500 "Internal Server Error"**, not 400: absent `totalprice`, absent `bookingdates`, empty `{}` body all return 500.

## Env fallback in the token fixture

`support/fixtures.ts` resolves credentials as `process.env.BOOKING_API_USERNAME ?? 'admin'` (likewise the password). Both are the public demo credentials published in the API docs — not secrets. The fallback is dormant by design: a temp-log run observed `env-source=env`, so dotenvx injection reaches workers; the `??` masks a worker-inheritance flake with zero machinery and changes nothing about credential handling.

## Test data & teardown

Booking data is static JSON under `data/api/`, imported with `with { type: "json" }` — Node's ESM loader (node 24, this Playwright version) rejects bare JSON imports, a verified toolchain requirement. TypeScript checks each file's shape against a `case` interface at compile time: data drift is a build error, not a runtime failure three tests deep.

Created bookings are deliberately **left** in the sandbox — 5 per run (4 create-matrix rows, 1 unauth setup). Deliberate because the sandbox is a public scratch pad of demo data; best-effort cleanup machinery needs catch-guards whose failures would become false test negatives; and deletion is already a tested assertion in the lifecycle spec. The CRUD lifecycle test is the exception that proves the pattern: it deletes what it creates because that is what it tests.