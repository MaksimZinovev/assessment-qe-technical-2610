import { expect, test } from "@playwright/test";

test("health — /ping responds 201", async ({ request }) => {
	const response = await request.get("/ping");
	expect(
		response.status(),
		"restful-booker /ping should answer 201 when up",
	).toBe(201);
});
