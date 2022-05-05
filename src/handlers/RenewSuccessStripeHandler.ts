import { StripeHandler } from "./index.js";

export default class RenewSuccessStripeHandler extends StripeHandler {
  async handleRequest(): Promise<void> {
    const sub = await this.createSub({
      name: "Jimbob's product",
      test: "something",
    });
    // console.log(sub);
  }
}
