import { BasePage } from "./BasePage.js";

export class HomePage extends BasePage {
  constructor(page) {
    super(page);

    this.page = page;

    this.bookingSection = page.locator("#booking");

    this.checkInInput = this.bookingSection.locator("input.form-control").first();
   
    this.checkOutInput = this.bookingSection.locator("input.form-control").nth(1);

    this.checkAvailabilityButton = this.bookingSection.getByRole("button", {
      name: /check availability/i,
    });

    this.availabilityHeading = page.getByRole("heading", {
      name: /check availability/i,
    });

    this.bookNowLinks = page.getByRole("link", { name: /book now/i });
  }

  async open() {
    await this.goto("/");
  }

  async setDates(checkIn, checkOut) {
    await this.checkInInput.fill(checkIn);
    await this.checkOutInput.fill(checkOut);
  }

  async searchAvailability(checkIn, checkOut) {
    await this.setDates(checkIn, checkOut);
    await this.checkAvailabilityButton.click();
  }
}