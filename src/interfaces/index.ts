import Stripe from "stripe";

export interface Card {
  number: string;
  exp_month: number;
  exp_year: number;
  cvc: string;
}

export type HandlerType = "success" | "fail";

export interface ParsedArguments {
  email?: string;
  customerId?: string;
  paymentMethod?: string;
  cardNumber?: string;
  exp?: string;
  cvc?: string;
  startAt?: string;
  endAt?: string;
  name?: string;
  help?: string;
  apiKey?: string;
}

export interface ExtendedParsedArguments extends ParsedArguments {
  type: HandlerType;
}

export interface HandlerProps {
  stripe: Stripe;
  paymentMethod: Stripe.PaymentMethod;
  customer: Stripe.Customer;
  clock: Stripe.TestHelpers.TestClock;
  endAt?: string;
}
