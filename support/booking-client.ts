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

	/** Minimal request/status logging — keeps plain runs debuggable without a logging library. */
	private log(op: string, response: APIResponse): APIResponse {
		console.info(`[booking] ${op} → ${response.status()}`);
		return response;
	}

	async authToken(username: string, password: string): Promise<APIResponse> {
		return this.log(
			"POST /auth",
			await this.api.post("/auth", { data: { username, password } }),
		);
	}

	async ping(): Promise<APIResponse> {
		return this.log("GET /ping", await this.api.get("/ping"));
	}

	async createBooking(booking: Booking): Promise<APIResponse> {
		return this.log(
			`POST /booking (${booking.firstname} ${booking.lastname})`,
			await this.api.post("/booking", { data: booking }),
		);
	}

	async getAllBookings(): Promise<APIResponse> {
		return this.log("GET /booking", await this.api.get("/booking"));
	}

	async getBooking(id: number): Promise<APIResponse> {
		return this.log(`GET /booking/${id}`, await this.api.get(`/booking/${id}`));
	}

	async updateBooking(
		id: number,
		booking: Booking,
		token: string,
	): Promise<APIResponse> {
		return this.log(
			`PUT /booking/${id}`,
			await this.api.put(`/booking/${id}`, {
				data: booking,
				headers: { Cookie: `token=${token}` },
			}),
		);
	}

	async patchBooking(
		id: number,
		partial: Partial<Booking>,
		token: string,
	): Promise<APIResponse> {
		return this.log(
			`PATCH /booking/${id}`,
			await this.api.patch(`/booking/${id}`, {
				data: partial,
				headers: { Cookie: `token=${token}` },
			}),
		);
	}

	async deleteBooking(id: number, token: string): Promise<APIResponse> {
		return this.log(
			`DELETE /booking/${id}`,
			await this.api.delete(`/booking/${id}`, {
				headers: { Cookie: `token=${token}` },
			}),
		);
	}
}
