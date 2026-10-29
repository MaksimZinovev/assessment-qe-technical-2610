import type { Locator, Page } from "@playwright/test";

// demoqa re-renders slowly; UI assertions get a wider window than the 5s default
const EXPECT_SLOW = 30_000;

export class BookStorePage {
	readonly page: Page;
	readonly searchInput: Locator;
	readonly logOutButton: Locator;
	readonly rowLinks: Locator;

	constructor(page: Page) {
		this.page = page;
		this.searchInput = page.getByPlaceholder("Type to search");
		this.logOutButton = page.getByRole("button", { name: /log\s*out/i });
		// probed DOM: books list is one plain <table> per page (no .rt-* classes —
		// an earlier .rt-tr-group locator matched nothing); role-anchored titles
		this.rowLinks = page.getByRole("table").getByRole("link");
	}

	async open() {
		await this.page.goto("/books", { waitUntil: "domcontentloaded" });
		// probed: the react-table can mount with no row body even after the data
		// API responds — first row link visible is the load signal, and config
		// retries re-run the whole test with a fresh goto
		await this.rowLinks
			.first()
			.waitFor({ state: "visible", timeout: EXPECT_SLOW });
	}

	async search(term: string) {
		await this.searchInput.fill(term);
	}

	async openBook(title: string) {
		await this.page.getByRole("link", { name: title }).click();
	}

	userNameLabel(userName: string): Locator {
		return this.page.getByText(userName, { exact: true });
	}

	async logOut() {
		await this.logOutButton.click();
	}
}
