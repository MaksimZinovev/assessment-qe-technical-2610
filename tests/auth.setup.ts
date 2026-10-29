import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/login-page";
import { DEMOQA_PASSWORD } from "../support/demoqa-credentials";

test("tc-001 demoqa session: create user, log in through the UI, persist state", async ({
	request,
	page,
	context,
}) => {
	test.setTimeout(90_000); // slow third-party UI; one long setup test

	const userName = `qetest-${Date.now()}`;
	await test.step("create unique user via the Account API", async () => {
		const createUser = await request.post("/Account/v1/User", {
			data: { userName, password: DEMOQA_PASSWORD },
		});
		expect(createUser.status(), `unique user ${userName} created`).toBe(201);
	});

	// probe: token-body variant of Authorized is unsupported; GenerateToken's
	// "Success" status is the documented authorization signal
	await test.step("generate an authorized token", async () => {
		const token = await request.post("/Account/v1/GenerateToken", {
			data: { userName, password: DEMOQA_PASSWORD },
		});
		const tokenBody = (await token.json()) as { status: string };
		expect(token.status(), "GenerateToken responds 200").toBe(200);
		expect(tokenBody.status, "GenerateToken reports Success").toBe("Success");
	});

	// probed: demoqa writes auth (token/userID/userName) into COOKIES, so the
	// storageState below captures a real logged-in session
	await test.step("log in through the UI", async () => {
		const loginPage = new LoginPage(page);
		await loginPage.open();
		await loginPage.submit(userName, DEMOQA_PASSWORD);
		await loginPage.expectLoggedInAs(userName);
	});

	await test.step("persist the session cookie jar as storageState", async () => {
		await context.storageState({ path: ".auth/state.json" });
	});
});
