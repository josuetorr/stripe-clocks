#!/usr/bin/env node
import {
  InvalidArgError,
  displayHelp,
  validateArgs,
  parseArgs,
  StripeHandler,
} from "./cmd/index.js";

try {
  validateArgs();
  const parsedArgs = parseArgs();

  if (Object.keys(parsedArgs).includes("help")) {
    displayHelp();
    process.exit(0);
  }

  new StripeHandler({});
} catch (error) {
  if (error instanceof InvalidArgError) {
    console.error(error.message);
    process.exit(error.code);
  }
}
