## Framework Design: Maintainability & CI/CD

The framework is designed around three goals: **maintainable code, repeatable tests, and CI/CD integration**.

Rather than introducing every possible abstraction, I used Playwright's native capabilities and a small set of established design patterns. The table below shows what's implemented, what's partially covered, and what I'd consider for a larger project.

**Legend:** ✅ Implemented · ◐ Partial · - Intentionally out of scope

| Building block / pattern             | Status | Implementation and reasoning                                                                                                                                                                                                            |
| ------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework & language**             | ✅      | Playwright + TypeScript. One package, shared configuration, four projects (`auth-setup`, `api`, `ui`, `ui-firefox`).                                                                                                                                 |
| **Test organization**                | ✅      | Tests separated by feature and responsibility across the API/UI projects; `test.describe()` groups related scenarios; `test.step()` describes execution stages.                                                                         |
| **Page Object Model (POM)**          | ✅      | `pages/` - UI locators and interactions are separated from test scenarios. Changes to the UI can be handled in one place.                                                                                                               |
| **API service layer**                | ✅      | Typed `BookingClient` centralizes endpoint interactions (API operations). Tests remain independent of request construction details.                                                                                                     |
| **Dependency Injection / Fixtures**  | ✅      | `support/fixtures.ts` - reusable API clients and authentication tokens supplied through Playwright fixtures.                                                                                                                            |
| **Data-driven testing**              | ✅      | Typed JSON datasets for positive, negative, and search scenarios. New cases can be added without duplicating test logic.                                                                                                                |
| **Authentication & state reuse**     | ✅      | API-created users, UI login, reusable `storageState`, and API token fixtures reduce repeated setup.                                                                                                                                     |
| **Test independence & cleanup**      | ◐      | Unique test users and a booking lifecycle demonstrate the approach. More comprehensive cleanup and isolation would be needed at scale.                                                                                                  |
| **Configuration management**         | ◐      | Base URLs and the environment name (`TEST_ENV`) live in `.env` via dotenvx; the config validates them, pins each project's `baseURL`, and prints the active environment at startup. Environment-specific profiles (`.env.uat` via `dotenvx run -f`) are shown, not needed yet; production secret hashing stays with dotenvx conventions. |
| **Assertions & diagnostics**         | ✅      | Descriptive assertions, API logging, test steps,  traces on retry, and screenshots on failure.                                                                                                                                          |
| **Reporting**                        | ✅      | Playwright HTML reports generated locally and preserved as CI artifacts. More comprehensive reporting like Allure could be used for a larger project                                                                                    |
| **Code quality**                     | ✅      | Biome linting/formatting, native Playwright lint rules, TypeScript typechecking, and a shared verification script. Biome over ESLint - simplicity, provides both linter and formatter, fewer dependencies, and sufficient rule coverage. |
| **CI/CD integration**                | ◐      | GitHub Actions runs lint, typecheck, and selected test suites. Test execution is manually triggered by design; security scanning runs automatically on push/PR.                                                                         |
| **Security checks**                  | ✅      | Gitleaks pre-commit checks and push/PR scanning. dotenvx demonstrates configuration handling; production secret management is outside scope - could be stored using GitHub Actions secrets and variables                                |
| **Parallel execution & retries**     | ◐      | Native Playwright workers and retry configuration. Distributed execution and sharding are unnecessary for this suite.                                                                                                                   |
| **Test tagging & selection**         | ◐      | Selection by project, file, or `--grep`; four representative scenarios carry `@smoke` (`npm run test-smoke`). A fuller tagging taxonomy would be useful for larger suites.                                                              |
| **Cross-browser testing**            | ◐      | The UI suite runs on Chromium and Firefox (`ui-firefox` project, same suite, same cookie auth). WebKit/device matrices stay scoped out until product requirements ask for them.                                                          |
| **Mocking / service virtualization** | -      | Real public APIs are tested. Mocking would be considered for unreliable dependencies or scenarios difficult to reproduce.                                                                                                               |
| **BDD / Gherkin**                    | -      | Plain TypeScript tests are sufficient. BDD would be considered when collaboration with non-technical stakeholders justifies it.                                                                                                         |
| **Visual & accessibility testing**   | -      | Out of scope for this assessment. Could be added using Playwright visual comparisons and accessibility checks.                                                                                                                          |
| **Test management integration**      | -      | Out of scope for this assessment. No external test management system. Integration could be added where traceability and centralized reporting are required.                                                                             |

### Design approach

The main decisions behind this framework:

- **Separate responsibilities.** Tests express expected behaviour; Page Objects handle UI interactions; service objects handle API calls; fixtures manage dependencies.
- **Keep test data separate.** Typed JSON datasets make scenarios easier to review, extend, and maintain.
- **Prefer native Playwright features.** Fixtures, assertions, reporters, tracing, and test steps reduce dependencies and custom infrastructure.
- **Minimal dependencies.** For example, rather than introducing more capable but heavyweight Allure reporting, native Playwright reporting is used instead.
- **Make execution reproducible.** The same lint, typecheck, and test commands run locally and in GitHub Actions.
- **Design for current requirements.** Additional abstraction layers, reporting tools, and integrations should solve demonstrated problems rather than anticipated ones.

### Continuous Delivery considerations

The repository demonstrates how automated tests can be integrated into a delivery pipeline:

- **Local quality gate:** `scripts/verify.sh` runs Biome → TypeScript → Playwright.
- **CI execution:** GitHub Actions runs the same checks, with project and test selection.
- **Test evidence:** HTML reports and diagnostic artifacts are retained for investigation.
- **Security:** Gitleaks checks staged changes locally and scans pushes and pull requests.

**Future extension:** each could be added without restructuring the test suites.
- PR and scheduled runs,
- environment-specific profiles (`.env.uat`, CI variables),
- deployment gates


See `docs/design-decisions.md` for detailed trade-offs and rejected alternatives.