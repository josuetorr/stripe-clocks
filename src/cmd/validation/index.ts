import chalk from "chalk";
import { argv } from "process";

export class InvalidArgError extends Error {
  code: number;

  constructor(code: number, message?: string) {
    super(message);
    this.code = code;
  }
}

export const VALID_FLAGS = {
  email: { description: "\t\tcustomer email" },
  "customer-id": { description: "\t\tcustomer id" },
  "payment-method": { description: "\tstripe payment method" },
  "card-number": { description: "\t\tcredit or debit card number" },
  exp: { description: "\t\t\tcard expiration date (MM-YYYY)" },
  cvc: { description: "\t\t\tcard cvc number" },
  startAt: {
    description: "\t\tstarting date (DD-MM-YYYY) (defaults to today's date)",
  },
  endAt: {
    description:
      "\t\tthe date to which the clock will be advanced to (DD-MM-YYYY) (defaults to one month after today)",
  },
  name: { description: "\t\tname of test" },
  help: { description: "\t\tshow this content" },
  "stripe-api-key": {
    description: "\tapi key provided by stripe (required)",
  },
};

export const validateArgs = () => {
  const args = argv.slice(2);

  for (const arg of args) {
    const flag = arg.split("=")[0].replace("--", "");
    if (!Object.keys(VALID_FLAGS).includes(flag))
      throw new InvalidArgError(1, `Unknown flag: ${chalk.bold(flag)}`);
  }

  const apiKey = args.reduce((key, arg) => {
    let [flag, value] = arg.split("=");
    flag = flag.replace("--", "");

    if (!key && flag === "stripe-api-key") key = value;
    return key;
  }, "");

  if (!apiKey) throw new InvalidArgError(1, "Stripe api key is required");
};

export const parseArgs = () =>
  argv.slice(2).reduce((acc, arg) => {
    let [flag, value] = arg.split("=");
    flag = flag.replace("--", "");
    acc = { ...acc, [flag]: value };
    return acc;
  }, {});
