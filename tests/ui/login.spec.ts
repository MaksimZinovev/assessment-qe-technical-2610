import { expect, test } from "@playwright/test";
import { BookStorePage } from "../../pages/book-store-page";
import { LoginPage } from "../../pages/login-page";
import { DEMOQA_PASSWORD } from "../../support/demoqa-credentials";

test.setTimeout(120_000); // longest journey: restore → logout → re-login

test("tc-006 login journey — restored session, logout, re-login", {
	tag: "@smoke",
}, async ({ page, context }) => {
	const userName = (await context.cookies()).find(
		(c) => c.name === "userName",
	)?.value;
	if (!userName)
		throw new Error("restored storageState carries no userName cookie");

	const loginPage = new LoginPage(page);
	const store = new BookStorePage(page);

	await test.step("restored session shows the real logged-in UI", async () => {
		await store.open();
		await loginPage.expectLoggedInAs(userName);
	});

	await test.step("logout clears the session", async () => {
		await store.logOut();
		await expect(
			loginPage.logOutButton,
			"logged out — header button gone",
		).toBeHidden({
			timeout: 15_000,
		});
	});

	await test.step("re-login with the same user works", async () => {
		await loginPage.open();
		await loginPage.submit(userName, DEMOQA_PASSWORD);
		await loginPage.expectLoggedInAs(userName);
	});
});
