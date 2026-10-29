import rawCases from "../../data/api/booking-create.json" with { type: "json" };
import { expect, test } from "../../support/fixtures";

interface BookingCase {
	case: string;
	payload: {
		firstname: string;
		lastname: string;
		totalprice: number;
		depositpaid: boolean;
		bookingdates: { checkin: string; checkout: string };
		additionalneeds: string;
	};
	expect: { status: number };
}

// The typed boundary: if the JSON shape drifts, tsc fails here at compile time.
const cases: BookingCase[] = rawCases;

test.describe("booking create", () => {
	for (const { case: name, payload, expect: expected } of cases) {
		test(`create booking — ${name}`, async ({ bookingClient }) => {
			await test.step("create booking and assert the echoed payload", async () => {
				const response = await bookingClient.createBooking(payload);
				expect(
					response.status(),
					`create booking "${name}" should be accepted`,
				).toBe(expected.status);
				const { booking } = (await response.json()) as {
					booking: typeof payload;
				};
				expect(
					booking,
					`created booking "${name}" should echo the payload fields`,
				).toEqual(payload);
				test.info().attach(`create-echo-${name}.json`, {
					body: JSON.stringify(booking, null, 2),
					contentType: "application/json",
				});
			});
		});
	}
});
