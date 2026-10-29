import type { Booking } from "../../support/booking-client";
import { expect, test } from "../../support/fixtures";

const BASE: Booking = {
	firstname: "Crud",
	lastname: "Journey",
	totalprice: 250,
	depositpaid: true,
	bookingdates: { checkin: "2026-06-01", checkout: "2026-06-08" },
	additionalneeds: "Late checkout",
};

test("booking lifecycle — create, get, PUT, PATCH, delete", async ({
	bookingClient,
	token,
}) => {
	const created = await bookingClient.createBooking(BASE);
	expect(created.status(), "create booking should return 200").toBe(200);
	const { bookingid: id, booking: echoed } = (await created.json()) as {
		bookingid: number;
		booking: Booking;
	};
	expect(typeof id, "create response should include a numeric bookingid").toBe(
		"number",
	);
	expect(echoed, "created booking should echo the payload").toEqual(BASE);
	test.info().attach("create-echo.json", {
		body: JSON.stringify(echoed, null, 2),
		contentType: "application/json",
	});

	await test.step("get created booking by id", async () => {
		const fetched = await bookingClient.getBooking(id);
		expect(fetched.status(), "get booking by id should return 200").toBe(200);
		expect(
			await fetched.json(),
			"fetched booking should match the created payload",
		).toEqual(BASE);
	});

	const updated: Booking = {
		...BASE,
		firstname: "CrudUpdated",
		totalprice: 500,
	};
	await test.step("replace fields with a full PUT update", async () => {
		const put = await bookingClient.updateBooking(id, updated, token);
		expect(put.status(), "PUT update should return 200").toBe(200);
		expect(
			await put.json(),
			"PUT response should reflect the new payload",
		).toEqual(updated);
	});

	const merged: Booking = {
		...updated,
		lastname: "Patched",
		depositpaid: false,
	};
	await test.step("merge a partial update with PATCH", async () => {
		const patch = await bookingClient.patchBooking(
			id,
			{ lastname: "Patched", depositpaid: false },
			token,
		);
		expect(patch.status(), "PATCH update should return 200").toBe(200);
		expect(
			await patch.json(),
			"PATCH response should merge the partial update",
		).toEqual(merged);
	});

	await test.step("delete the booking and confirm it is gone", async () => {
		const deleted = await bookingClient.deleteBooking(id, token);
		expect(
			deleted.status(),
			"delete success should return 201 Created (probed actual, not 204)",
		).toBe(201);

		const gone = await bookingClient.getBooking(id);
		expect(gone.status(), "get after delete should return 404").toBe(404);
	});
});
