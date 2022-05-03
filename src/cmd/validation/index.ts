import chalk from "chalk";
import { argv } from "process";

export class InvalidArgError extends Error {
  code: number;

  constructor(code: number, message?: string) {
    super(message);
    this.code = code;
  }
}

const VALID_FLAGS = {
  "--email": { description: "" },
  "--customer-id": { description: "" },
  "--payment-method": { description: "" },
  "--card-number": { description: "" },
  "--exp": { description: "" },
  "--cvc": { description: "" },
  "--frozen-time": { description: "" },
  "--advance-by": { description: "" },
  "--name": { description: "" },
  "--help": { description: "" },
};

export const validateArgs = () => {
  const args = argv.slice(2);

  for (const arg of args) {
    const flag = arg.split("=")[0];
    if (!Object.keys(VALID_FLAGS).includes(flag))
      throw new InvalidArgError(1, `Unknown flag: ${chalk.bold(flag)}`);
  }
};

export const parseArgs = () => {
  const args = argv.slice(2);

  const parsedArgs = args.reduce((acc, arg) => {
    let [flag, value] = arg.split("=");
    flag = flag.replace("--", "");
    acc = { ...acc, [flag]: value };
    return acc;
  }, {});

  return parsedArgs;
};
