import { Stripe } from "stripe";
import { InvalidArgError } from "../cmd/index.js";
import { HandlerProps, Card } from "../interfaces/index.js";

export abstract class StripeHandler {
  private _paymentMethod?: string;
  private _card?: Card;
  private _startAt: number;
  private _name: string;
  private _email: string;

  protected _stripe: Stripe;
  protected _endAt: number;

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
    } else {
      this._card = {
        number: "4242424242424242",
        exp_month: 4,
        exp_year: 2023,
        cvc: "314",
      };
    }

    const today = new Date();
    this._startAt = props.startAt
      ? new Date(props.startAt).getTime()
      : today.getTime();
    this._endAt = props.endAt
      ? new Date(props.endAt).getTime()
      : today.setMonth(today.getMonth() + 1);
    this._name = props.name ?? "test";
    this._email = props.email ?? "jim@bob.com";
  }

  private getClock() {
    return this._stripe.testHelpers.testClocks.create({
      frozen_time: this._startAt,
      name: this._name,
    });
  }

  private async getProduct() {
    const products = await this._stripe.products.list();
    console.log(products);
  }

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

  async getCustomer() {
    return this._stripe.customers.create({
      email: this._email,
      test_clock: (await this.getClock()).id,
    });
  }

  async attachPaymentToCustomer(
    customer: Stripe.Customer,
    paymentMethod: Stripe.PaymentMethod,
    makeItDefault = true
  ) {
    this._stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });
    if (makeItDefault)
      this._stripe.customers.update(customer.id, {
        invoice_settings: { default_payment_method: paymentMethod.id },
      });
  }

  getSubscription() {
    this.getProduct();
  }

  abstract handleRequest(): Promise<void>;
}
