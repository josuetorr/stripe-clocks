import { Stripe } from "stripe";
import { InvalidArgError } from "../cmd/index.js";
import { HandlerProps, Card } from "../interfaces/index.js";

export abstract class StripeHandler {
  protected _stripe: Stripe;
  private _paymentMethod?: string;
  private _card?: Card;

  constructor(props: HandlerProps) {
    if (!props.apiKey)
      throw new InvalidArgError(1, "Error: Stripe api key is required");
    this._stripe = new Stripe(props.apiKey, { apiVersion: "2020-08-27" });

    if (props.paymentMethod) {
      this._paymentMethod = props.paymentMethod;
    } else if (props.exp && props.cardNumber && props.cvc) {
      const [month, year] = props.exp.split("-");
      this._card = {
        number: props.cardNumber,
        cvc: props.cvc,
        exp_month: parseInt(month),
        exp_year: parseInt(year),
      };
    }
  }

  abstract handleRequest(): Promise<void>;

  getPaymentMethod(): Promise<Stripe.PaymentMethod> {
    if (this._paymentMethod)
      return this._stripe.paymentMethods.create({
        payment_method: this._paymentMethod,
      });

    return this._stripe.paymentMethods.create({
      type: "card",
      card: this._card,
    });
  }
}

export class RenewSuccessStripeHandler extends StripeHandler {
  async handleRequest(): Promise<void> {
    console.log("successful");
  }
}

export class RenewFailedStripeHandler extends StripeHandler {
  async handleRequest(): Promise<void> {
    console.log("failure");
  }
}
