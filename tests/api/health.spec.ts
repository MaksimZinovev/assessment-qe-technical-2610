import { expect, test } from "../../support/fixtures";

test("health — /ping responds 201", async ({ request }) => {
	const response = await request.get("/ping");
	expect(
		response.status(),
		"restful-booker /ping should answer 201 when up",
	).toBe(201);
});

test("health — auth returns a non-empty token", async ({ token }) => {
	expect(token, "auth fixture should yield a non-empty token").toBeTruthy();
});
