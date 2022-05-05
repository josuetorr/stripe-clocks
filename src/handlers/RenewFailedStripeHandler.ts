import { StripeHandler } from "./index.js";

export default class RenewFailedStripeHandler extends StripeHandler {
  async handleRequest(): Promise<void> {
    console.log("failure");
  }
}
