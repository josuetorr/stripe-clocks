#!/usr/bin/env node
import { displayHelp, validateArgs, parseArgs } from "./cmd/index.js";
import { InvalidArgError } from "./cmd/index.js";

try {
  validateArgs();
  const parsedArgs = parseArgs();

  if (Object.keys(parsedArgs).includes("help")) {
    displayHelp();
    process.exit(0);
  }
} catch (error) {
  if (error instanceof InvalidArgError) {
    console.error(error.message);
    process.exit(error.code);
  }
}
