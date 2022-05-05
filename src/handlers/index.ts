import { Stripe } from "stripe";
import { InvalidArgError } from "../cmd/index.js";
import { HandlerProps, Card } from "../interfaces/index.js";

const getRandom = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export abstract class StripeHandler {
  private _paymentMethod?: string;
  private _card?: Card;
  private _startAt: number;
  private _name: string;
  private _email: string;
  private _customerId: string;

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
    this._startAt = Math.floor(
      (props.startAt ? new Date(props.startAt).getTime() : today.getTime()) /
        1000
    );
    this._endAt = Math.floor(
      (props.endAt
        ? new Date(props.endAt).getTime()
        : today.setMonth(today.getMonth() + 1)) / 1000
    );
    this._name = props.name ?? "test";
    this._email = props.email ?? "jim@bob.com";
    this._customerId = props.customerId ?? "";
  }

  private async getCustomer(): Promise<Stripe.Customer> {
    if (!this._customerId)
      return this._stripe.customers.create({
        email: this._email,
        test_clock: (await this.getClock()).id,
      });

    const customer = await this._stripe.customers.retrieve(this._customerId);

    if (customer.deleted)
      throw new InvalidArgError(
        1,
        `Customer (id: ${customer.id}) has been deleted. Cannot use`
      );

    return customer;
  }

  private async attachPaymentToCustomer(
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

  private getClock(): Promise<Stripe.TestHelpers.TestClock> {
    return this._stripe.testHelpers.testClocks.create({
      frozen_time: this._startAt,
      name: this._name,
    });
  }

  private createPrice(productId: string): Promise<Stripe.Price> {
    return this._stripe.prices.create({
      unit_amount: 999,
      currency: "CAD",
      recurring: { interval: "month", interval_count: 1 },
      product: productId,
    });
  }

  private createProduct(): Promise<Stripe.Product> {
    return this._stripe.products.create({
      name: "Jimbob's test product",
      active: true,
    });
  }

  private async getProduct(): Promise<Stripe.Product> {
    const products = await this._stripe.products.list({ active: true });
    if (products.data.length) return <Stripe.Product>getRandom(products.data);

    return this.createProduct();
  }

  private async getPrice(productId: string): Promise<Stripe.Price> {
    const prices = await this._stripe.prices.list({ product: productId });
    if (prices.data.length) return <Stripe.Price>getRandom(prices.data);

    const product = await this.getProduct();

    return this.createPrice(product.id);
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

  async createSub(metadata: any): Promise<Stripe.Subscription> {
    const customer = await this.getCustomer();
    const paymentMethod = await this.getPaymentMethod();
    await this.attachPaymentToCustomer(customer, paymentMethod);

    const product = await this.getProduct();
    const price = await this.getPrice(product.id);

    return this._stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price.id }],
      metadata,
    });
  }

  abstract handleRequest(): Promise<void>;
}
