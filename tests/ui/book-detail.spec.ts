import { expect, test } from "@playwright/test";
import expected from "../../data/ui/book-detail.json" with { type: "json" };
import { BookStorePage } from "../../pages/book-store-page";

interface BookDetail {
	isbn: string;
	title: string;
	subtitle: string;
	author: string;
	publisher: string;
	pages: number;
}
const want: BookDetail = expected;

test.setTimeout(90_000); // slow third-party UI

test("tc-005 book detail — opened row shows the book's fields", async ({
	page,
}) => {
	const store = new BookStorePage(page);

	await test.step("open Speaking JavaScript from the books table", async () => {
		await store.open();
		await store.openBook(want.title);
		await expect(page, "detail route carries the book's isbn").toHaveURL(
			new RegExp(`search=${want.isbn}$`),
			{ timeout: 15_000 },
		);
	});

	await test.step("probed fields match the live API row", async () => {
		for (const value of [
			want.isbn,
			want.title,
			want.subtitle,
			want.author,
			want.publisher,
			String(want.pages),
		]) {
			await expect(page.getByText(value), `detail shows ${value}`).toBeVisible({
				timeout: 15_000,
			});
		}
		await expect(
			page.getByText("JavaScript is everywhere"),
			"description opens the book's summary",
		).toBeVisible({ timeout: 15_000 });
	});
});
