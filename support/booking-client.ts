import type { APIRequestContext, APIResponse } from "@playwright/test";

export interface Booking {
	firstname: string;
	lastname: string;
	totalprice: number;
	depositpaid: boolean;
	bookingdates: { checkin: string; checkout: string };
	additionalneeds: string;
}

/** Thin typed wrapper over the Restful-Booker API. Returns raw APIResponse —
 *  specs own assertions (and the API's plaintext error bodies stay unparsed). */
export class BookingClient {
	constructor(private readonly api: APIRequestContext) {}

	authToken(username: string, password: string): Promise<APIResponse> {
		return this.api.post("/auth", { data: { username, password } });
	}

	ping(): Promise<APIResponse> {
		return this.api.get("/ping");
	}

	createBooking(booking: Booking): Promise<APIResponse> {
		return this.api.post("/booking", { data: booking });
	}

	getAllBookings(): Promise<APIResponse> {
		return this.api.get("/booking");
	}

	getBooking(id: number): Promise<APIResponse> {
		return this.api.get(`/booking/${id}`);
	}

	updateBooking(
		id: number,
		booking: Booking,
		token: string,
	): Promise<APIResponse> {
		return this.api.put(`/booking/${id}`, {
			data: booking,
			headers: { Cookie: `token=${token}` },
		});
	}

	patchBooking(
		id: number,
		partial: Partial<Booking>,
		token: string,
	): Promise<APIResponse> {
		return this.api.patch(`/booking/${id}`, {
			data: partial,
			headers: { Cookie: `token=${token}` },
		});
	}

	deleteBooking(id: number, token: string): Promise<APIResponse> {
		return this.api.delete(`/booking/${id}`, {
			headers: { Cookie: `token=${token}` },
		});
	}
}
