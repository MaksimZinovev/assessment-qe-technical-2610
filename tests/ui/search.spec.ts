import { expect, test } from "@playwright/test";
import rawCases from "../../data/ui/search-cases.json" with { type: "json" };
import { BookStorePage } from "../../pages/book-store-page";

interface SearchCase {
	id: string;
	term: string;
	expectedTitles: string[];
}
const cases: SearchCase[] = rawCases;

test.setTimeout(90_000); // slow third-party UI

test.describe("book store search", () => {
	for (const c of cases) {
		test(`search filters the books table — ${c.id} "${c.term}"`, async ({
			page,
		}) => {
			const store = new BookStorePage(page);
			await store.open();
			await test.step(`filter by "${c.term}" and assert row titles`, async () => {
				await store.search(c.term);
				await expect
					.poll(() => store.rowLinks.allTextContents(), {
						timeout: 15_000,
						message: `table filters to ${c.expectedTitles.length} row(s) for "${c.term}"`,
					})
					.toEqual(c.expectedTitles);
			});
		});
	}
});
