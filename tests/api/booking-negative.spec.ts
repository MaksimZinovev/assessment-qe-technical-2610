import rawRows from "../../data/api/booking-negative.json" with {
	type: "json",
};
import { expect, test } from "../../support/fixtures";

interface NegativeRow {
	case: string;
	method: string; // JSON import widens literals to string; request.fetch accepts any method
	path: string;
	body?: unknown;
	expect: { status: number; bodyContains?: string };
}

// body: unknown on purpose — these payloads intentionally violate the Booking shape.
const rows: NegativeRow[] = rawRows;

for (const row of rows) {
	test(`negative — ${row.case}`, async ({ request }) => {
		const response = await request.fetch(row.path, {
			method: row.method,
			data: row.body,
		});
		expect(
			response.status(),
			`negative "${row.case}" should return the probed actual status`,
		).toBe(row.expect.status);
		if (row.expect.bodyContains) {
			expect(
				await response.text(),
				`negative "${row.case}" body should name the error`,
			).toContain(row.expect.bodyContains);
		}
	});
}

test("negative — mutations without auth are refused with 403", async ({
	request,
	bookingClient,
}) => {
	// Unauth mutations target a live id (unauth PUT/PATCH/DELETE on a missing id is
	// unprobed). Created via the happy-path client; no-cookie = the one probed variant.
	const created = await bookingClient.createBooking({
		firstname: "Unauth",
		lastname: "Probe",
		totalprice: 1,
		depositpaid: false,
		bookingdates: { checkin: "2026-01-01", checkout: "2026-01-02" },
		additionalneeds: "None",
	});
	expect(
		created.status(),
		"setup: create booking before probing unauth mutations",
	).toBe(200);
	const { bookingid: id } = (await created.json()) as { bookingid: number };

	const mutation = {
		firstname: "X",
		lastname: "Y",
		totalprice: 1,
		depositpaid: true,
		bookingdates: { checkin: "2026-01-01", checkout: "2026-01-02" },
	};
	for (const method of ["PUT", "PATCH", "DELETE"] as const) {
		const response = await request.fetch(`/booking/${id}`, {
			method,
			data: mutation,
		});
		expect(
			response.status(),
			`unauthenticated ${method} should be refused (no-cookie probe, bogus≡missing)`,
		).toBe(403);
		expect(
			await response.text(),
			`unauthenticated ${method} body should say Forbidden`,
		).toContain("Forbidden");
	}
});
