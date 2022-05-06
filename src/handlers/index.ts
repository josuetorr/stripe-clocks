import Stripe from "stripe";
import { HandlerProps } from "../interfaces/index.js";
import { getRandom } from "../utils/array.js";

export default abstract class StripeHandler {
  private _stripe: Stripe;
  private _paymentMethod: Stripe.PaymentMethod;
  private _customer: Stripe.Customer;
  private _clock: Stripe.TestHelpers.TestClock;
  protected endAt: number;

  constructor(props: HandlerProps) {
    this._stripe = props.stripe;
    this._paymentMethod = props.paymentMethod;
    this._customer = props.customer;
    this._clock = props.clock;

    const today = new Date();
    this.endAt =
      Math.floor(
        props.endAt
          ? new Date(props.endAt).getTime()
          : today.setMonth(today.getMonth() + 1)
      ) / 1000;
  }

  private async getProduct(): Promise<Stripe.Product> {
    const products = await this._stripe.products.list({ active: true });
    if (products.data.length) return <Stripe.Product>getRandom(products.data);

    return this._stripe.products.create({
      name: "Jimbob's test product",
      active: true,
    });
  }

  private async getPrice(productId: string): Promise<Stripe.Price> {
    const prices = await this._stripe.prices.list({ product: productId });
    if (prices.data.length) return <Stripe.Price>getRandom(prices.data);

    return this._stripe.prices.create({
      unit_amount: 999,
      currency: "CAD",
      recurring: { interval: "month", interval_count: 1 },
      product: productId,
    });
  }

  protected async attachPaymentToCustomer(
    customer: Stripe.Customer,
    paymentMethod: Stripe.PaymentMethod,
    makeItDefault = true
  ) {
    await this._stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });
    if (makeItDefault)
      await this._stripe.customers.update(customer.id, {
        invoice_settings: { default_payment_method: paymentMethod.id },
      });
  }

  protected advanceClock(endAt?: string): void {
    this._stripe.testHelpers.testClocks.advance(this._clock.id, {
      frozen_time: endAt ? new Date(endAt).getTime() / 1000 : this.endAt,
    });
  }

  protected async createSub(metadata: any): Promise<Stripe.Subscription> {
    await this.attachPaymentToCustomer(this._customer, this._paymentMethod);

    const product = await this.getProduct();
    const price = await this.getPrice(product.id);

    return this._stripe.subscriptions.create({
      customer: this._customer.id,
      items: [{ price: price.id }],
      metadata,
    });
  }

  abstract handleRequest(): Promise<void>;
}
