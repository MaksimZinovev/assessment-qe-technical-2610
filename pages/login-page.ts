import { expect, type Locator, type Page } from "@playwright/test";

// demoqa re-renders slowly; UI assertions get a wider window than the 5s default
const EXPECT_SLOW = 15_000;

export class LoginPage {
	readonly page: Page;
	readonly userNameInput: Locator;
	readonly passwordInput: Locator;
	readonly loginButton: Locator;
	readonly logOutButton: Locator;

	constructor(page: Page) {
		this.page = page;
		this.userNameInput = page.getByPlaceholder("UserName");
		this.passwordInput = page.getByPlaceholder("Password");
		this.loginButton = page.getByRole("button", { name: "Login" });
		// header button text differs per page: "Logout" on /profile, "Log out" on /books
		this.logOutButton = page.getByRole("button", { name: /log\s*out/i });
	}

	async open() {
		await this.page.goto("/login", { waitUntil: "domcontentloaded" });
	}

	async submit(userName: string, password: string) {
		await this.userNameInput.fill(userName);
		await this.passwordInput.fill(password);
		await this.loginButton.click();
	}

	async expectLoggedInAs(userName: string) {
		await expect(
			this.logOutButton,
			"logged-in header shows logout",
		).toBeVisible({
			timeout: EXPECT_SLOW,
		});
		await expect(
			this.page.getByText(userName, { exact: true }),
			`logged-in header shows ${userName}`,
		).toBeVisible({ timeout: EXPECT_SLOW });
	}
}
