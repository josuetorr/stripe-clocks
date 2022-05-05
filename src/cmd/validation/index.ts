import chalk from "chalk";
import { argv } from "process";
import { ExtendedHandlerPros, HandlerType } from "src/interfaces/index.js";

export class InvalidArgError extends Error {
  code: number;

  constructor(code: number, message?: string) {
    super(message);
    this.code = code;
  }
}

export const VALID_FLAGS = {
  email: { description: "\t\tcustomer email" },
  customerId: { description: "\t\tcustomer id" },
  paymentMethod: { description: "\tstripe payment method" },
  cardNumber: { description: "\t\tcredit or debit card number" },
  exp: { description: "\t\t\tcard expiration date (MM-YYYY)" },
  cvc: { description: "\t\t\tcard cvc number" },
  startAt: {
    description: "\t\tstarting date (DD-MM-YYYY). Defaults to today's date",
  },
  endAt: {
    description:
      "\t\tthe date to which the clock will be advanced to (DD-MM-YYYY). Defaults to one month after today",
  },
  name: { description: "\t\tname of test" },
  help: { description: "\t\tshow this content" },
  type: {
    description: "\t\ttype of clock (success or fail). Defaults to 'success'",
  },
  apiKey: {
    description: "\t\tapi key provided by stripe (required)",
  },
};

const validateArgs = (args: any) => {
  for (const flag of Object.keys(args)) {
    if (!Object.keys(VALID_FLAGS).includes(flag))
      throw new InvalidArgError(1, `Unknown flag: ${chalk.bold(flag)}`);
  }

  // make sure either paymentMethod is defined or the information for a card, i.e. number, exp, cvc
  const { paymentMethod, cardNumber, exp, cvc } = Object.entries(args)
    .filter(
      ([flag]) =>
        flag === "paymentMethod" ||
        flag === "cardNumber" ||
        flag === "cvc" ||
        flag === "exp"
    )
    .reduce(
      (acc, [flag, arg]) => {
        return { ...acc, [flag]: arg };
      },
      { paymentMethod: "", cardNumber: "", cvc: "", exp: "" }
    );

  if (!paymentMethod && (!cardNumber || !exp || !cvc))
    throw new InvalidArgError(
      1,
      `Please enter a payment method: ${chalk.bold(
        "[paymentMethod] | [cardNumber cvc exp])"
      )}`
    );

  if (!paymentMethod && !exp.match(/\d\d-\d\d\d\d/))
    throw new InvalidArgError(
      1,
      `Please enter a valid date for exp ${chalk.bold("(MM-YYYY)")}`
    );
};

export const parseArgs = (): ExtendedHandlerPros => {
  const defaultType: HandlerType = "success";

  const args = argv.slice(2).reduce(
    (acc, current) => {
      const [flag, arg] = current.split("=");
      return { ...acc, [flag.replace("--", "")]: arg };
    },
    { type: defaultType }
  );

  validateArgs(args);

  return args;
};
