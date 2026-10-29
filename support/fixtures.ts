import { test as base, expect } from "@playwright/test";
import { BookingClient } from "./booking-client";

interface Fixtures {
	bookingClient: BookingClient;
	token: string;
}

export const test = base.extend<Fixtures>({
	bookingClient: async ({ request }, use) => {
		await use(new BookingClient(request));
	},
	token: async ({ bookingClient }, use) => {
		const response = await bookingClient.authToken(
			process.env.BOOKING_API_USERNAME ?? "admin",
			process.env.BOOKING_API_PASSWORD ?? "password123",
		);
		expect(
			response.status(),
			"auth with public demo creds should return a token",
		).toBe(200);
		const { token } = (await response.json()) as { token: string };
		await use(token);
	},
});
export { expect } from "@playwright/test";
