## Development Conventions

A few conventions keep the framework consistent and make it easier to extend.

| Area | Convention |
| --- | --- |
| **File organization** | `tests/` contains scenarios, `pages/` UI interactions, `support/` API clients and fixtures, and `data/` test inputs. |
| **Naming** | Test files use `*.spec.ts`; setup files use `*.setup.ts`. Test titles describe expected behaviour. |
| **Test structure** | Group related scenarios with `test.describe()`. Use `test.step()` for meaningful stages, not every action. |
| **Separation of concerns** | Keep tests focused on behaviour and assertions. Put reusable UI interactions in Page Objects and HTTP operations in service objects. |
| **Locators** | Prefer Playwright's role, label, and text locators. Avoid hardcoded waits and fragile selectors where possible. |
| **Test data** | Store reusable scenarios in typed JSON files. Keep test data separate from test logic. |
| **Fixtures** | Use Playwright fixtures for shared dependencies and setup. Avoid unnecessary abstraction layers. |
| **Code quality** | Biome handles formatting and linting, including Playwright rules. TypeScript provides static typechecking. |
| **Verification** | Run `./scripts/verify.sh` before committing. The same checks run in CI. |

Pull Requests

- Keep PRs small and focused on a single change or related set of changes.
- Use clear commit messages that explain what changed.
- Run `./scripts/verify.sh` before submitting a PR. Ensure linting, typechecking, and tests pass.
- Never commit secrets, API keys, or credentials. Gitleaks checks for exposed secrets locally and in CI.
- Update tests and documentation when changing existing behaviour or adding functionality.
- Include a short PR description explaining what changed, why, and how it was verified.

These conventions are intentionally small. Additional rules should be introduced when they solve a recurring problem.
