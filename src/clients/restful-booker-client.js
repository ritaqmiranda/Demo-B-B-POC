export class RestfulBookerClient {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async getBookings() {
    return this.getJson("/booking");
  }

  async getBooking(bookingId) {
    return this.getJson(`/booking/${bookingId}`);
  }

  async getJson(path) {
    const response = await globalThis.fetch(`${this.baseUrl}${path}`, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`GET ${path} failed with ${response.status}`);
    }

    return response.json();
  }
}
