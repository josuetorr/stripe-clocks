import { Stripe } from "stripe";

interface Props {
  email?: string;
  customerId?: string;
  paymentMethod?: string;
  cardNumber?: string;
  exp?: string;
  cvc?: number;
  startAt?: string;
  endAt?: string;
  name?: string;
  apiKey: string;
}

export default class StripeHandler {
  private email: string;
  private customerId: string;
  private paymentMethod: string;
  private cardNumber: string;
  private exp: string;
  private cvc: number;
  private startAt: Date;
  private endAt: Date;
  private name: string;
  private stripe: Stripe;

  constructor(props: Props) {
    const today = new Date();

    this.email = props.email ?? "";
    this.customerId = props.customerId ?? "";
    this.paymentMethod = props.paymentMethod ?? "";
    this.cardNumber = props.cardNumber ?? "";
    this.exp = props.exp ?? "";
    this.cvc = props.cvc ?? 314;
    this.startAt = props.startAt ? new Date(props.startAt) : new Date(today);
    this.endAt = props.endAt
      ? new Date(props.endAt)
      : new Date(today.setMonth(today.getMonth() + 1));
    this.name = props.name ?? "test";

    this.stripe = new Stripe(props.apiKey, { apiVersion: "2020-08-27" });
  }
}
