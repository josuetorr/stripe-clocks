import { InvalidArgError } from "../cmd/index.js";
import Stripe from "stripe";
import {
  Card,
  ExtendedParsedArguments,
  HandlerProps,
} from "../interfaces/index.js";
import StripeHandler from "./index.js";
import RenewFailedStripeHandler from "./RenewFailedStripeHandler.js";
import RenewSuccessStripeHandler from "./RenewSuccessStripeHandler.js";

const getCustomer = async (
  stripe: Stripe,
  clockId: string,
  email: string = "jim@bob.com",
  customerId?: string
) => {
  if (!customerId)
    return stripe.customers.create({
      email,
      test_clock: clockId,
    });

  const customer = await stripe.customers.retrieve(customerId);

  if (customer.deleted)
    throw new InvalidArgError(
      1,
      `Customer (id: ${customer.id}) has been deleted. Cannot use`
    );

  return customer;
};

const getClock = async (stripe: Stripe, startAt?: string, name?: string) => {
  return stripe.testHelpers.testClocks.create({
    frozen_time: Math.floor(
      (startAt ? new Date(startAt).getTime() : Date.now()) / 1000
    ),
    name: name ?? "test",
  });
};

const getCard = (number?: string, exp?: string, cvc?: string): Card => {
  if (number && exp && cvc) {
    const [month, year] = exp.split("-");
    return {
      number,
      cvc,
      exp_month: parseInt(month),
      exp_year: parseInt(year),
    };
  }

  return {
    number: "4242424242424242",
    exp_month: 4,
    exp_year: new Date().getFullYear() + 3,
    cvc: "314",
  };
};

const getPaymentMethod = async (
  stripe: Stripe,
  paymentMethod?: string,
  card?: Card
) => {
  if (paymentMethod)
    return stripe.paymentMethods.create({
      payment_method: paymentMethod,
    });

  return stripe.paymentMethods.create({
    type: "card",
    card: card,
  });
};

export default class StripeHandlerFactory {
  async makeStripeHandler({
    type,
    apiKey,
    customerId,
    email,
    startAt,
    name,
    paymentMethod,
    cardNumber,
    exp,
    cvc,
    endAt,
  }: ExtendedParsedArguments): Promise<StripeHandler> {
    if (!apiKey)
      throw new InvalidArgError(1, "Error: Stripe api key is required");

    const stripe = new Stripe(apiKey, { apiVersion: "2020-08-27" });
    const clock = await getClock(stripe, startAt, name);
    const customer = await getCustomer(stripe, clock.id, customerId, email);
    const pm = await getPaymentMethod(
      stripe,
      paymentMethod,
      getCard(cardNumber, exp, cvc)
    );

    const handlerProps: HandlerProps = {
      stripe,
      clock,
      customer,
      paymentMethod: pm,
      endAt,
    };

    if (type === "fail") {
      return new RenewFailedStripeHandler(handlerProps);
    }

    return new RenewSuccessStripeHandler(handlerProps);
  }
}
