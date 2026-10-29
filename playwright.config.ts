import { defineConfig } from "@playwright/test";
import "@dotenvx/dotenvx/config";

/**
 * Single package, three Playwright projects:
 *  - auth-setup  creates the DemoQA storageState once (tests/auth.setup.ts → .auth/state.json)
 *  - api         Restful-Booker suite (tests/api), no browser auth needed
 *  - ui          Book Store suite (tests/ui), reuses the storageState after auth-setup
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
		},
		{
			name: "api",
			testDir: "tests/api",
			fullyParallel: true,
			use: { baseURL: "https://restful-booker.herokuapp.com" },
		},
		{
			name: "ui",
			testDir: "tests/ui",
			dependencies: ["auth-setup"],
			use: {
				baseURL: "https://demoqa.com",
				storageState: ".auth/state.json",
			},
		},
	],
});
