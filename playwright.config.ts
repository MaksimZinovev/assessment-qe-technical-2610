import { defineConfig, devices } from "@playwright/test";
import "@dotenvx/dotenvx/config";

// Environment management: URLs + environment name live in .env (dotenvx), so a
// different target is a configuration change, never a code change.
const testEnv = process.env.TEST_ENV ?? "default";
const apiBaseUrl = process.env.API_BASE_URL;
const uiBaseUrl = process.env.UI_BASE_URL;

if (!apiBaseUrl || !uiBaseUrl) {
	throw new Error("Missing API_BASE_URL or UI_BASE_URL in .env");
}

console.log(
	`[setup] test environment: ${testEnv} (api: ${apiBaseUrl}, ui: ${uiBaseUrl})`,
);

/**
 * Single package, three Playwright projects:
 *  - auth-setup  creates the DemoQA storageState once (tests/auth.setup.ts → .auth/state.json)
 *  - api         Restful-Booker suite (tests/api), no browser auth needed
 *  - ui          Book Store suite (tests/ui), reuses the storageState after auth-setup
 *  - ui-firefox  same suite on Firefox — same storageState auth (cookies are engine-agnostic)
 */
export default defineConfig({
	retries: 1, // permanent for this assessment (user decision, 2026-10-29)
	workers: 3, // modest — both targets are shared public third-party sites
	reporter: [["list"], ["html", { open: "never" }]],
	forbidOnly: !!process.env.CI,
	use: {
		trace: "on-first-retry",
		screenshot: "only-on-failure",
	},
	projects: [
		{
			name: "auth-setup",
			testMatch: "**/auth.setup.ts",
			use: { baseURL: uiBaseUrl },
		},
		{
			name: "api",
			testDir: "tests/api",
			fullyParallel: true,
			use: { baseURL: apiBaseUrl },
		},
		{
			name: "ui",
			testDir: "tests/ui",
			dependencies: ["auth-setup"],
			use: {
				baseURL: uiBaseUrl,
				storageState: ".auth/state.json",
			},
		},
		{
			name: "ui-firefox",
			testDir: "tests/ui",
			dependencies: ["auth-setup"],
			use: {
				baseURL: uiBaseUrl,
				storageState: ".auth/state.json",
				...devices["Desktop Firefox"],
			},
		},
	],
});
