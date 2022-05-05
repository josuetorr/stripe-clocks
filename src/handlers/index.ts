import { Stripe } from "stripe";
import { InvalidArgError } from "../cmd/index.js";
import { HandlerProps, Card } from "../interfaces/index.js";

export abstract class StripeHandler {
  protected _stripe: Stripe;
  private _paymentMethod: string;
  private _card: Card;

  constructor(options: HandlerProps, apiKey?: string) {
    if (!apiKey)
      throw new InvalidArgError(1, "Error: Stripe api key is required");
    this._stripe = new Stripe(apiKey, { apiVersion: "2020-08-27" });

  }

  abstract handleRequest(): Promise<void>;

  async getPaymentMethod() {}
}

export class RenewSuccessHandler extends StripeHandler {
  async handleRequest(): Promise<void> {}
}

export class RenewFailedHandler extends StripeHandler {
  async handleRequest(): Promise<void> {}
}

// export default class StripeHandler {
//   private email: string;
//   private customerId: string;
//   private paymentMethod: string;
//   private cardNumber: string;
//   private exp: string;
//   private cvc: number;
//   private startAt: Date;
//   private endAt: Date;
//   private name: string;
//   private stripe: Stripe;
//
//   constructor(props: Props) {
//     const today = new Date();
//
//     this.email = props.email ?? "";
//     this.customerId = props.customerId ?? "";
//     this.paymentMethod = props.paymentMethod ?? "";
//     this.cardNumber = props.cardNumber ?? "";
//     this.exp = props.exp ?? "";
//     this.cvc = props.cvc ?? 314;
//     this.startAt = props.startAt ? new Date(props.startAt) : new Date(today);
//     this.endAt = props.endAt
//       ? new Date(props.endAt)
//       : new Date(today.setMonth(today.getMonth() + 1));
//     this.name = props.name ?? "test";
//
//     this.stripe = new Stripe(props.apiKey, { apiVersion: "2020-08-27" });
//   }
// }
